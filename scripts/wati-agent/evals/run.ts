import fs from 'node:fs'
import Anthropic from '@anthropic-ai/sdk'
import { runTurn } from '../../../src/lib/wati-agent/runner'
import type { StoredMessage, Conversation } from '../../../src/lib/wati-agent/types'
import { STYLE_GUIDE } from '../../../src/lib/wati-agent/voice/style-guide'

type Case = { id: string; sucursal: 'cde' | 'sfc' | null; turns: Array<{ customer: string[]; staff: string[] }> }

const cases = JSON.parse(fs.readFileSync('scripts/wati-agent/evals/cases.json', 'utf8')) as Case[]
const anthropic = new Anthropic()

const args = process.argv.slice(2)
const limitIdx = args.indexOf('--limit')
const limit = limitIdx >= 0 ? Number(args[limitIdx + 1]) : 30
const only = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--limit')

function memStore(conv: Conversation) {
  const messages: StoredMessage[] = []
  const events: Array<{ kind: string; payload: any }> = []
  let nextId = 1
  return {
    events,
    getConversation: async () => conv,
    upsertConversation: async (p: Partial<Conversation> & { phone: string }) => { Object.assign(conv, p); return conv },
    insertMessage: async (m: StoredMessage) => { messages.push({ ...m, id: nextId++, created_at: new Date().toISOString() }); return { inserted: true } },
    recentMessages: async (_phone: string, _opts: { sinceHours: number; limit: number }) => messages.filter(m => m.shadow === false),
    newestInboundId: async (_phone: string) => {
      const m = [...messages].reverse().find(x => x.direction === 'in')
      return m?.id ?? null
    },
    logEvent: async (_phone: string | null, kind: string, payload: any) => { events.push({ kind, payload }) },
    activeMedia: async () => [{ key: 'promo_mes', description: 'Promoción del mes', caption: '', storage_path: 'x', valid_from: null, valid_until: null, active: true }],
    getSetting: async <T,>(_k: string, f: T) => f,
    setSetting: async () => {},
    listConversations: async () => [],
    eventsFor: async () => [],
    stats: async () => ({ handled: 0, booked: 0, handoffs: {}, shadow: 0 }),
  } as any
}

const fakeWati = () => ({
  sendText: async () => ({ ok: true, messageId: 'm' }),
  sendFile: async () => ({ ok: true }),
  sendButtons: async () => ({ ok: true }),
  updateAttributes: async () => ({ ok: true }),
  assignOperator: async () => ({ ok: true }),
  assignTeams: async () => ({ ok: true }),
  startChatbot: async () => ({ ok: true }),
  updateChatStatus: async () => ({ ok: true }),
  getMedia: async () => ({ ok: false }),
}) as any

const ALL_SLOTS = ['09:00', '10:00', '11:30', '13:00', '14:00', '15:00', '16:30', '18:00']

function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

const fakeMb = {
  listServices: async () => [
    { id: 10, name: 'Mimosa Relax - 60 min', minutes: 60, price: 75, category: 'Masajes' },
    { id: 12, name: 'Liberador de Tensión - 60 min', minutes: 60, price: 80, category: 'Masajes' },
  ],
  findClientByPhone: async () => ({ id: 'C1', name: 'Cliente Prueba', email: 'c@x.com', lastVisits: [] }),
  createClient: async () => ({ id: 'C2' }),
  availability: async (date: string, _serviceId: number, people = 1) => {
    const h = hashStr(String(date))
    const count = 3 + (h % 2) // 3-4 slots
    const start = h % ALL_SLOTS.length
    const chosen: number[] = []
    for (let i = 0; chosen.length < count && i < ALL_SLOTS.length; i++) {
      chosen.push((start + i) % ALL_SLOTS.length)
    }
    let indices = chosen
    if (people === 2) indices = chosen.filter(idx => idx % 2 === 0)
    return indices.map(idx => ({ time: ALL_SLOTS[idx], staffIds: [1, 2] }))
  },
  book: async () => ({ appointmentIds: [1], therapist: 'Por asignar' }),
  upcoming: async () => [],
  cancelAppointment: async () => true,
} as any

const NOW = process.env.WATI_EVAL_NOW ? new Date(process.env.WATI_EVAL_NOW) : new Date('2026-09-08T10:30:00-05:00')

const EMOJI_RE = /\p{Extended_Pictographic}/u

function computeStyleFlags(reply: string): string[] {
  const flags: string[] = []
  const bubbles = reply.split('\n').filter(b => b.trim().length > 0)

  const hasList = bubbles.some(line => {
    const trimmed = line.trim()
    if (trimmed.startsWith('✅') || trimmed.startsWith('📌')) return false
    return /^(-\s|•\s|\d+\.\s)/.test(trimmed)
  })
  if (hasList) flags.push('lista')

  const hasLongBubble = bubbles.some(b => b.split(/(?<=[.!?])\s+/).filter(s => s.trim()).length > 3)
  if (hasLongBubble) flags.push('larga')

  const hasTwoQuestions = bubbles.some(b => (b.match(/\?/g) || []).length >= 2)
  if (hasTwoQuestions) flags.push('dos_preguntas')

  if (bubbles.length > 1 && !EMOJI_RE.test(reply)) flags.push('sin_emoji')

  return flags
}

const rows: any[] = []
let picked = cases
if (only) picked = picked.filter(c => c.id === only)
picked = picked.slice(0, limit)

for (const c of picked) {
  const conv: Conversation = {
    phone: '50700000000', wati_contact_id: null, ticket_id: null, mode: 'agent', sucursal: c.sucursal,
    mindbody_client_id: null, client_name: null, summary: null, handoff_reason: null,
    human_since: null, last_inbound_at: null, last_outbound_at: null, audio_count: 0,
  }
  const store = memStore(conv)
  for (const [ti, turn] of c.turns.entries()) {
    for (const t of turn.customer) {
      await store.insertMessage({ phone: conv.phone, wati_message_id: null, direction: 'in', author: 'customer', type: 'text', text: t, media_ref: null, shadow: false })
    }
    const eventsBefore = store.events.length
    const r = await runTurn(conv.phone, false, {
      anthropic, store, wati: fakeWati(), origin: 'https://eval', now: NOW,
      mediaBytes: async () => ({ bytes: new Uint8Array(), mime: 'image/png', filename: 'x' }),
      mb: fakeMb, styleGuide: STYLE_GUIDE,
    })
    const turnEvents = store.events.slice(eventsBefore)
    const camila = r.bubbles.join('\n')

    let score: number | null = null
    let graderError = false
    let graderSkipped: string | null = null

    if (r.handedOff) {
      graderSkipped = 'handoff'
    } else {
      const graderSystem = 'Eres un evaluador de ESTILO y VOZ para las respuestas de Camila, la recepcionista virtual de un spa. Compara SOLO cómo suena A frente a B, nunca qué dice.\n\nEvalúa exclusivamente:\n- Tono cercano pero formal de usted.\n- Largo: burbujas de 1-2 líneas cortas, no párrafos.\n- Formato: sin listas con guiones ni viñetas ni numeración, salvo la tarjeta de confirmación con ✅ o 📌.\n- Calidez y emojis propios del estilo (🌼 ✨ 🍃 📅 ⏰ ✅), sin exagerar.\n- Una sola pregunta por burbuja, nunca varias a la vez.\n- Saludo y cierre como los usaría una recepcionista real.\n\nIgnora por completo si el contenido, la disponibilidad, las fechas o los datos coinciden con B; B es solo referencia de estilo.\n\nEscala: 5 = indistinguible de la recepcionista en estilo; 3 = aceptable pero con detalles de tono/formato/largo que lo delatan; 1 = suena a asistente/robot o usa un formato incorrecto (listas, párrafos largos, varias preguntas).\n\nResponde ÚNICAMENTE con un objeto JSON en una sola línea: {"score": <1-5>, "why": "<máx 15 palabras>"}'
      const graderUser = `Cliente: ${turn.customer.join(' / ')}\n\nA (Camila):\n${camila || '(handoff)'}\n\nB (humana):\n${turn.staff.join('\n')}`

      const callGrader = async (): Promise<number | null> => {
        const g = await anthropic.messages.create({
          model: process.env.WATI_AGENT_MODEL || 'claude-sonnet-5',
          max_tokens: 400,
          thinking: { type: 'disabled' },
          system: graderSystem,
          messages: [{ role: 'user', content: graderUser }],
        })
        const gt = g.content.find(b => b.type === 'text')?.text ?? ''
        try {
          const start = gt.indexOf('{')
          const end = gt.lastIndexOf('}')
          if (start < 0 || end < start) return null
          const parsed = JSON.parse(gt.slice(start, end + 1))
          const n = Math.round(Number(parsed.score))
          return Number.isFinite(n) && n >= 1 && n <= 5 ? n : null
        } catch {
          return null
        }
      }

      score = await callGrader()
      if (score === null) {
        score = await callGrader()
        if (score === null) graderError = true
      }
    }

    const inventedPrice = /\$\s?\d+|\b\d+\s?(d[oó]lares|usd)\b/i.test(camila) && !turnEvents.some((e: any) => e.kind === 'tool_result' && e.payload.tool === 'list_services')
    const bookedWithoutConfirm = turnEvents.some((e: any) => e.kind === 'tool_result' && e.payload.tool === 'book' && e.payload.ok) && !turn.customer.some(t => /s[ií]|claro|dale|perfecto|listo|ok/i.test(t))
    const human = turn.staff.join(' / ').slice(0, 200)
    const styleFlags = r.handedOff ? [] : computeStyleFlags(camila)
    rows.push({ case: c.id, turn: ti, score, graderError, graderSkipped, inventedPrice, bookedWithoutConfirm, handedOff: r.handedOff, camila: camila.slice(0, 200), human, styleFlags })
    if (r.handedOff) break
  }
}

fs.writeFileSync('scripts/wati-agent/evals/last-run.json', JSON.stringify(rows, null, 2))
const scored = rows.filter(r => typeof r.score === 'number')
const mean = scored.length ? scored.reduce((s, r) => s + r.score, 0) / scored.length : 0
const hard = rows.length ? rows.filter(r => r.inventedPrice || r.bookedWithoutConfirm).length / rows.length : 0
console.table(rows.map(r => ({ case: r.case, turn: r.turn, score: r.score, price: r.inventedPrice, confirm: r.bookedWithoutConfirm, handoff: r.handedOff })))
console.log(`mean tone ${mean.toFixed(2)} (graded ${scored.length}/${rows.length})  hard-fail ${(hard * 100).toFixed(1)}%`)

const flagCounts: Record<string, number> = { lista: 0, larga: 0, dos_preguntas: 0, sin_emoji: 0 }
for (const r of rows) {
  for (const f of (r.styleFlags || [])) flagCounts[f] = (flagCounts[f] || 0) + 1
}
console.log(`style flags — lista ${flagCounts.lista}  larga ${flagCounts.larga}  dos_preguntas ${flagCounts.dos_preguntas}  sin_emoji ${flagCounts.sin_emoji}`)

const lowest = [...scored].sort((a, b) => a.score - b.score).slice(0, 5)
if (lowest.length) {
  console.log('\nLowest-scoring rows:')
  for (const r of lowest) {
    console.log(`\n[${r.case} turn ${r.turn}] score=${r.score}`)
    console.log(`  Camila: ${r.camila.slice(0, 160)}`)
    console.log(`  Human:  ${r.human.slice(0, 120)}`)
  }
}

process.exit(mean < 3.5 || hard > 0.1 ? 1 : 0)
