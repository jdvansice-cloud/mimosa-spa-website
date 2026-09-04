// scripts/wati-agent/redact-names.ts
// Redacts personal names (customers, companions, gift recipients) that survive
// inside message text after scrub() has already stripped emails/phones/codes
// and the sender's own first name. Run standalone (npm run wati:redact) to
// clean the already-mined evals/cases.json and voice/exemplars.json in place,
// or import redactNames() to call from mine-chats.ts after writing those files.
import fs from 'node:fs'
import Anthropic from '@anthropic-ai/sdk'

const BATCH_SIZE = 60

const SYSTEM_INSTRUCTION =
  'Recibes un JSON array de mensajes de WhatsApp de un spa. Devuelve SOLO un JSON array del mismo largo ' +
  'donde cada nombre propio de persona se reemplaza según su rol: el nombre de la recepcionista/staff que ' +
  'firma o se presenta (ej. "Soy Karen", "Gracias, Adriana!") se reemplaza por Camila, el nombre del ' +
  'personaje/persona de la asistente virtual del spa; los nombres de clientes, acompañantes o destinatarios ' +
  'de regalos se reemplazan por {nombre}. NO reemplaces nombres de marcas, sucursales (Costa del Este, San ' +
  'Francisco), tratamientos, bancos, plazas, ni las palabras Mimosa, Camila, Yappy. Conserva todo lo demás ' +
  'intacto (emojis, saltos de línea, mayúsculas).'

function extractJsonArray(text: string): unknown[] | null {
  const start = text.indexOf('[')
  const end = text.lastIndexOf(']')
  if (start === -1 || end === -1) return null
  try {
    const parsed = JSON.parse(text.slice(start, end + 1))
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

async function redactBatch(batch: string[], client: Anthropic, model: string): Promise<string[] | null> {
  const res = await client.messages.create({
    model,
    max_tokens: 8000,
    system: SYSTEM_INSTRUCTION,
    messages: [{ role: 'user', content: JSON.stringify(batch) }],
  })
  const text = res.content.find(b => b.type === 'text')?.text ?? ''
  const parsed = extractJsonArray(text)
  if (!parsed || parsed.length !== batch.length) return null
  if (!parsed.every(x => typeof x === 'string')) return null
  return parsed as string[]
}

export async function redactNames(strings: string[], client: Anthropic): Promise<string[]> {
  const model = process.env.WATI_AGENT_MODEL || 'claude-sonnet-5'
  const out: string[] = []
  for (let i = 0; i < strings.length; i += BATCH_SIZE) {
    const batch = strings.slice(i, i + BATCH_SIZE)
    let result: string[] | null = null
    try {
      result = await redactBatch(batch, client, model)
      if (!result) {
        console.warn(`redact-names: batch ${i / BATCH_SIZE} — length/parse mismatch, retrying once`)
        result = await redactBatch(batch, client, model)
      }
    } catch (err) {
      console.warn(`redact-names: batch ${i / BATCH_SIZE} failed (${err instanceof Error ? err.message : err}), retrying once`)
      try {
        result = await redactBatch(batch, client, model)
      } catch (err2) {
        console.warn(`redact-names: batch ${i / BATCH_SIZE} failed again (${err2 instanceof Error ? err2.message : err2}), falling back to originals`)
        result = null
      }
    }
    if (!result) {
      console.warn(`redact-names: batch ${i / BATCH_SIZE} — falling back to original strings`)
      result = batch
    }
    out.push(...result)
  }
  return out
}

type Turn = { customer: string[]; staff: string[] }
type Case = { id: string; sucursal: string; turns: Turn[] }
type Exemplar = { intent: string; sucursal: string; customer: string[]; staff: string[] }

function collectFromCases(cases: Case[]): string[] {
  const strings: string[] = []
  for (const c of cases) for (const t of c.turns) { strings.push(...t.customer, ...t.staff) }
  return strings
}

function applyToCases(cases: Case[], redacted: string[]): Case[] {
  let idx = 0
  return cases.map(c => ({
    ...c,
    turns: c.turns.map(t => ({
      customer: t.customer.map(() => redacted[idx++]),
      staff: t.staff.map(() => redacted[idx++]),
    })),
  }))
}

function collectFromExemplars(exemplars: Exemplar[]): string[] {
  const strings: string[] = []
  for (const e of exemplars) { strings.push(...e.customer, ...e.staff) }
  return strings
}

function applyToExemplars(exemplars: Exemplar[], redacted: string[]): Exemplar[] {
  let idx = 0
  return exemplars.map(e => ({
    ...e,
    customer: e.customer.map(() => redacted[idx++]),
    staff: e.staff.map(() => redacted[idx++]),
  }))
}

async function main() {
  const client = new Anthropic()
  const casesPath = 'scripts/wati-agent/evals/cases.json'
  const exemplarsPath = 'src/lib/wati-agent/voice/exemplars.json'

  const cases = JSON.parse(fs.readFileSync(casesPath, 'utf8')) as Case[]
  const exemplars = JSON.parse(fs.readFileSync(exemplarsPath, 'utf8')) as Exemplar[]

  const caseStrings = collectFromCases(cases)
  const exemplarStrings = collectFromExemplars(exemplars)

  const redactedCaseStrings = await redactNames(caseStrings, client)
  const redactedExemplarStrings = await redactNames(exemplarStrings, client)

  const newCases = applyToCases(cases, redactedCaseStrings)
  const newExemplars = applyToExemplars(exemplars, redactedExemplarStrings)

  const casesChanged = caseStrings.filter((s, i) => s !== redactedCaseStrings[i]).length
  const exemplarsChanged = exemplarStrings.filter((s, i) => s !== redactedExemplarStrings[i]).length

  fs.writeFileSync(casesPath, JSON.stringify(newCases, null, 2))
  fs.writeFileSync(exemplarsPath, JSON.stringify(newExemplars, null, 2))

  console.log(`redact-names: cases.json — ${casesChanged}/${caseStrings.length} strings changed`)
  console.log(`redact-names: exemplars.json — ${exemplarsChanged}/${exemplarStrings.length} strings changed`)
}

if (process.argv[1]?.endsWith('redact-names.ts')) {
  main().catch(err => { console.error(err); process.exit(1) })
}
