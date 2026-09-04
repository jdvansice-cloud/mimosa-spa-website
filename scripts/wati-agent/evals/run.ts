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

const fakeMb = {
  listServices: async () => [
    { id: 10, name: 'Mimosa Relax - 60 min', minutes: 60, price: 75, category: 'Masajes' },
    { id: 12, name: 'Liberador de Tensión - 60 min', minutes: 60, price: 80, category: 'Masajes' },
  ],
  findClientByPhone: async () => ({ id: 'C1', name: 'Cliente Prueba', email: 'c@x.com', lastVisits: [] }),
  createClient: async () => ({ id: 'C2' }),
  availability: async () => [{ time: '10:00', staffIds: [1, 2] }, { time: '15:00', staffIds: [1] }],
  book: async () => ({ appointmentIds: [1], therapist: 'Por asignar' }),
  upcoming: async () => [],
  cancelAppointment: async () => true,
} as any

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
    const r = await runTurn(conv.phone, false, {
      anthropic, store, wati: fakeWati(), origin: 'https://eval', now: new Date(),
      mediaBytes: async () => ({ bytes: new Uint8Array(), mime: 'image/png', filename: 'x' }),
      mb: fakeMb, styleGuide: STYLE_GUIDE,
    })
    const camila = r.bubbles.join('\n')
    const graderSystem = 'Califica de 1 a 5 qué tanto la respuesta A suena como la recepcionista real B (tono, largo, calidez, formato). Responde ÚNICAMENTE con un objeto JSON en una sola línea: {"score": <1-5>, "why": "<máx 15 palabras>"}'
    const graderUser = `Cliente: ${turn.customer.join(' / ')}\n\nA (Camila):\n${camila || '(handoff)'}\n\nB (humana):\n${turn.staff.join('\n')}`

    async function callGrader(): Promise<number | null> {
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

    let score: number | null = await callGrader()
    let graderError = false
    if (score === null) {
      score = await callGrader()
      if (score === null) graderError = true
    }

    const inventedPrice = /\$\s?\d+|\b\d+\s?(d[oó]lares|usd)\b/i.test(camila) && !store.events.some((e: any) => e.kind === 'tool_result' && e.payload.tool === 'list_services')
    const bookedWithoutConfirm = store.events.some((e: any) => e.kind === 'tool_result' && e.payload.tool === 'book' && e.payload.ok) && !turn.customer.some(t => /s[ií]|claro|dale|perfecto|listo|ok/i.test(t))
    rows.push({ case: c.id, turn: ti, score, graderError, inventedPrice, bookedWithoutConfirm, handedOff: r.handedOff, camila: camila.slice(0, 200) })
    if (r.handedOff) break
  }
}

fs.writeFileSync('scripts/wati-agent/evals/last-run.json', JSON.stringify(rows, null, 2))
const scored = rows.filter(r => typeof r.score === 'number')
const mean = scored.length ? scored.reduce((s, r) => s + r.score, 0) / scored.length : 0
const hard = rows.length ? rows.filter(r => r.inventedPrice || r.bookedWithoutConfirm).length / rows.length : 0
console.table(rows.map(r => ({ case: r.case, turn: r.turn, score: r.score, price: r.inventedPrice, confirm: r.bookedWithoutConfirm, handoff: r.handedOff })))
console.log(`mean tone ${mean.toFixed(2)} (graded ${scored.length}/${rows.length})  hard-fail ${(hard * 100).toFixed(1)}%`)
process.exit(mean < 3.5 || hard > 0.1 ? 1 : 0)
