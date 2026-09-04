// scripts/wati-agent/mine-chats.ts
// Usage: npm run wati:mine -- <dir-with-txt-files>
import fs from 'node:fs'
import path from 'node:path'
import Anthropic from '@anthropic-ai/sdk'
import { parseExport, buildExchanges, type Exchange } from '../../src/lib/wati-agent/voice/parse-export'
import { scrub } from '../../src/lib/wati-agent/voice/scrub'
import { redactNames } from './redact-names'
import { replaceStaffNamesInCases, replaceStaffNamesInExemplars } from './replace-staff-names'

const INTENTS = ['saludo','ubicacion','horario','precios','promo','reservar','cambiar','cancelar','certificado','pago','queja','cierre','otro'] as const
type Intent = typeof INTENTS[number]

function isIntent(x: unknown): x is Intent {
  return typeof x === 'string' && (INTENTS as readonly string[]).includes(x)
}

const dir = process.argv[2]
if (!dir) { console.error('dir required'); process.exit(1) }
const client = new Anthropic()
const MODEL = process.env.WATI_AGENT_MODEL || 'claude-sonnet-5'

function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }

function customerNameFrom(lines: ReturnType<typeof parseExport>): string {
  return lines.find(l => l.kind === 'customer')?.sender ?? ''
}

async function main() {
  // 1. Parse everything
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.txt'))
  const all: Array<{ file: string; exchanges: Exchange[]; lines: ReturnType<typeof parseExport>; name: string }> = []
  for (const f of files) {
    const raw = fs.readFileSync(path.join(dir, f), 'utf8')
    const lines = parseExport(raw, '')
    const name = customerNameFrom(lines)
    const exchanges = buildExchanges(lines)
    if (exchanges.length) all.push({ file: f, exchanges, lines, name })
  }
  console.log(`chats with staff replies: ${all.length}`)

  // 2. Scrub names + PII
  function scrubName(t: string, name: string) {
    if (!name) return scrub(t)
    const first = name.split(/\s+/)[0]
    if (!first) return scrub(t)
    const escaped = first.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return scrub(t.replace(new RegExp(`\\b${escaped}\\b`, 'gi'), '{nombre}'))
  }
  const exchanges = all.flatMap(c => c.exchanges.map(e => ({
    ...e, customer: e.customer.map(t => scrubName(t, c.name)), staff: e.staff.map(t => scrubName(t, c.name)),
  })))

  // 3. Phrase stats (normalised canned lines)
  const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim()
  const counts = new Map<string, number>()
  for (const e of exchanges) for (const s of e.staff) counts.set(norm(s), (counts.get(norm(s)) ?? 0) + 1)
  const canned = [...counts.entries()].filter(([, n]) => n >= 15).sort((a, b) => b[1] - a[1]).slice(0, 80)

  // 4. Sample 1200 exchanges (stratified by sucursal) and tag with Claude in batches of 40
  function sample<T>(arr: T[], n: number) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] } return a.slice(0, n) }
  const pool = [...sample(exchanges.filter(e => e.sucursal === 'cde'), 600), ...sample(exchanges.filter(e => e.sucursal === 'sfc'), 600)]

  type Tagged = Exchange & { intent: Intent; quality: 'good' | 'avoid' }
  const tagged: Tagged[] = []

  async function tagBatch(batch: Exchange[]): Promise<Array<{ i: number; intent: Intent; quality: 'good' | 'avoid' }>> {
    const res = await client.messages.create({
      model: MODEL, max_tokens: 8000,
      system: `Eres un analista. Clasificas intercambios de WhatsApp entre clientes y recepcionistas de un spa en Panamá. Responde SOLO JSON: [{"i":0,"intent":"...","quality":"good|avoid"}]. intent ∈ ${JSON.stringify(INTENTS)}. quality=avoid si la recepcionista comete un error, es cortante, o el intercambio no sirve de ejemplo.`,
      messages: [{ role: 'user', content: JSON.stringify(batch.map((e, i) => ({ i, customer: e.customer, staff: e.staff }))) }],
    })
    const text = res.content.find(b => b.type === 'text')?.text ?? '[]'
    const start = text.indexOf('[')
    const end = text.lastIndexOf(']')
    if (start === -1 || end === -1) return []
    const json = JSON.parse(text.slice(start, end + 1)) as Array<{ i: number; intent: string; quality: 'good' | 'avoid' }>
    return json.map(t => ({ i: t.i, intent: isIntent(t.intent) ? t.intent : 'otro', quality: t.quality }))
  }

  for (let i = 0; i < pool.length; i += 40) {
    const batch = pool.slice(i, i + 40)
    try {
      let json: Array<{ i: number; intent: Intent; quality: 'good' | 'avoid' }>
      try {
        json = await tagBatch(batch)
      } catch (err: any) {
        const status = err?.status
        if (status === 429 || (status >= 500 && status < 600)) {
          console.warn(`batch ${i / 40} failed with status ${status}, retrying once after 5s`)
          await sleep(5000)
          json = await tagBatch(batch)
        } else {
          throw err
        }
      }
      for (const t of json) if (batch[t.i]) tagged.push({ ...batch[t.i], intent: t.intent, quality: t.quality })
    } catch (err) {
      console.error(`batch ${i / 40} failed, skipping:`, err instanceof Error ? err.message : err)
    }
    console.log(`batch ${i / 40 + 1}/${Math.ceil(pool.length / 40)} — tagged ${tagged.length}`)
  }

  // 5. Pick <= 20 good per intent, balanced by sucursal
  const exemplars: Array<Omit<Tagged, 'quality' | 'ts'>> = []
  for (const intent of INTENTS) {
    const good = tagged.filter(t => t.intent === intent && t.quality === 'good')
    const cde = good.filter(g => g.sucursal === 'cde').slice(0, 10), sfc = good.filter(g => g.sucursal === 'sfc').slice(0, 10)
    for (const g of [...cde, ...sfc]) exemplars.push({ intent: g.intent, sucursal: g.sucursal, customer: g.customer, staff: g.staff })
  }

  // 6. Style guide from canned phrases + 150 good exchanges
  const guideRes = await client.messages.create({
    model: MODEL, max_tokens: 6000,
    system: 'Escribes guías de estilo para asistentes de atención al cliente. Español de Panamá.',
    messages: [{ role: 'user', content: `Frases más usadas por las recepcionistas (frase → veces):\n${canned.map(([p, n]) => `${n}× ${p}`).join('\n')}\n\nEjemplos reales:\n${JSON.stringify(sample(tagged.filter(t => t.quality === 'good'), 150).map(t => ({ cliente: t.customer, recepcionista: t.staff })))}\n\nEscribe una guía de estilo en Markdown con secciones: Saludo (por hora del día, con nombre y 🌼), Tratamiento (usted, Sra/Sr + nombre), Ritmo (mensajes cortos, varios seguidos), Emojis usados, Tarjeta de datos (📌 Nombre y Apellido / 📌 Correo), Tarjeta de confirmación ✅ (formato exacto), Bloque de pago Yappy/Banco General, Cierre, Lo que nunca dicen, Errores a evitar. Cita frases textuales. No des instrucciones dirigidas al asistente sobre cómo formatear su respuesta (por ejemplo, no digas "usa viñetas"); esto es documentación de referencia, no un prompt de sistema.` }],
  })
  let guideText = guideRes.content.find(b => b.type === 'text')?.text ?? ''
  const today = new Date().toISOString().slice(0, 10)
  guideText = `<!-- generado por scripts/wati-agent/mine-chats.ts, ${today} -->\n${guideText}`

  // 7. Eval cases: 30 chats with 4-12 exchanges, scrubbed
  const cases = sample(all.filter(c => c.exchanges.length >= 4 && c.exchanges.length <= 12), 30).map((c, i) => ({
    id: `case-${i + 1}`, sucursal: c.exchanges[0].sucursal,
    turns: c.exchanges.map(e => ({ customer: e.customer.map(t => scrubName(t, c.name)), staff: e.staff.map(t => scrubName(t, c.name)) })),
  }))

  // 8. Validate before writing
  const errors: string[] = []
  if (exemplars.length < 120) errors.push(`exemplars count ${exemplars.length} < 120`)
  for (const e of exemplars) {
    if (!isIntent(e.intent)) errors.push(`exemplar has invalid intent: ${JSON.stringify(e.intent)}`)
  }
  const piiRe = /@|\d{8,}/
  function hardScrub(t: string): string {
    return scrub(t)
      .replace(/\d{8,}/g, '{codigo}')
      // stray "@" used as gender-neutral shorthand (e.g. "Estimad@") or leftover punctuation,
      // once real emails have already been replaced with {correo} by scrub() above
      .replace(/@/g, 'o/a')
  }
  function scrubAgain<T extends { customer: string[]; staff: string[] }>(items: T[]): T[] {
    return items.map(item => ({ ...item, customer: item.customer.map(hardScrub), staff: item.staff.map(hardScrub) }))
  }
  let finalExemplars = scrubAgain(exemplars)
  let finalCases = cases.map(c => ({ ...c, turns: scrubAgain(c.turns) }))
  function findMatches(items: Array<{ customer: string[]; staff: string[] }>): string[] {
    const hits: string[] = []
    for (const item of items) for (const t of [...item.customer, ...item.staff]) {
      const m = t.match(/@|\d{8,}/g)
      if (m) hits.push(`${JSON.stringify(m)} in: ${t.slice(0, 120)}`)
    }
    return hits
  }
  if (piiRe.test(JSON.stringify(finalExemplars))) {
    errors.push('exemplars still contain PII-like patterns after re-scrub')
    console.error('exemplar matches:', findMatches(finalExemplars).slice(0, 20))
  }
  if (piiRe.test(JSON.stringify(finalCases.flatMap(c => c.turns)))) {
    errors.push('cases still contain PII-like patterns after re-scrub')
    console.error('case matches:', findMatches(finalCases.flatMap(c => c.turns)).slice(0, 20))
  }

  if (errors.length) {
    console.error('VALIDATION FAILED:')
    for (const e of errors) console.error(` - ${e}`)
    process.exit(1)
  }

  fs.writeFileSync('src/lib/wati-agent/voice/exemplars.json', JSON.stringify(finalExemplars, null, 2))
  fs.writeFileSync('src/lib/wati-agent/voice/style-guide.md', guideText)
  fs.mkdirSync('scripts/wati-agent/evals', { recursive: true })
  fs.writeFileSync('scripts/wati-agent/evals/cases.json', JSON.stringify(finalCases, null, 2))
  fs.writeFileSync(
    'src/lib/wati-agent/voice/style-guide.ts',
    '// GENERATED from style-guide.md — do not edit by hand.\n// Regenerate: npm run wati:mine (or the node -e command in the old header)\nexport const STYLE_GUIDE = ' + JSON.stringify(guideText) + '\n'
  )
  console.log(`exemplars ${finalExemplars.length}, cases ${finalCases.length}`)

  // 9. Redact personal names that survived scrubbing (booking names, gift recipients, ...)
  const exemplarStrings = finalExemplars.flatMap(e => [...e.customer, ...e.staff])
  const caseStrings = finalCases.flatMap(c => c.turns.flatMap(t => [...t.customer, ...t.staff]))
  const [redactedExemplarStrings, redactedCaseStrings] = await Promise.all([
    redactNames(exemplarStrings, client),
    redactNames(caseStrings, client),
  ])
  let ei = 0
  const redactedExemplars = finalExemplars.map(e => ({
    ...e,
    customer: e.customer.map(() => redactedExemplarStrings[ei++]),
    staff: e.staff.map(() => redactedExemplarStrings[ei++]),
  }))
  let ci = 0
  const redactedCases = finalCases.map(c => ({
    ...c,
    turns: c.turns.map(t => ({
      customer: t.customer.map(() => redactedCaseStrings[ci++]),
      staff: t.staff.map(() => redactedCaseStrings[ci++]),
    })),
  }))
  // 10. Deterministic pass: replace real receptionist names with the persona name (Camila)
  const staffNameCounts: Record<string, number> = {}
  const finalExemplars2 = replaceStaffNamesInExemplars(redactedExemplars, staffNameCounts)
  const finalCases2 = replaceStaffNamesInCases(redactedCases, staffNameCounts)

  fs.writeFileSync('src/lib/wati-agent/voice/exemplars.json', JSON.stringify(finalExemplars2, null, 2))
  fs.writeFileSync('scripts/wati-agent/evals/cases.json', JSON.stringify(finalCases2, null, 2))
  console.log('redact-names: applied to exemplars.json and cases.json')
  console.log('replace-staff-names: counts per name:', staffNameCounts)
}

main().catch(err => { console.error(err); process.exit(1) })
