import type Anthropic from '@anthropic-ai/sdk'
import { env } from './config/env'
import { isEmptyProfilePatch } from './store'
import type { AgentStore } from './store'
import type { ClientProfile, ConversationOutcome, StoredMessage } from './types'

/** A second close within this window is the same conversation ending twice (book → close_chat). */
const DOUBLE_LOG_MS = 10 * 60_000

const SYSTEM = `Eres la memoria de una recepcionista de spa. Recibes la transcripción de una conversación de WhatsApp y devuelves SOLO un objeto JSON, sin texto alrededor y sin bloques de código.

Formato exacto:
{"resumen": "...", "perfil": {"nombre": "", "correo": "", "sucursal_preferida": "", "tratamientos": [], "preferencias": [], "notas": []}}

Reglas:
- "resumen": máximo 3 líneas en español; qué quería el cliente, qué se hizo y qué quedó pendiente.
- "perfil": SOLO hechos que el cliente dijo explícitamente o que quedaron reservados. Nunca supongas ni infieras.
- Si no hay nada que recordar en un campo, déjalo en cadena vacía o lista vacía.
- "sucursal_preferida" solo puede ser "cde", "sfc" o "".
- "notas": datos duraderos (alergias, embarazo, movilidad, fechas especiales). No repitas lo que ya está en los otros campos.`

function transcript(messages: StoredMessage[]): string {
  return messages
    .filter(m => (m.text || '').trim())
    .map(m => `${m.direction === 'in' ? 'Cliente' : m.author === 'human' ? 'Compañera' : 'Camila'}: ${m.text}`)
    .join('\n')
    .slice(-12000)
}

/** Tolerates the model wrapping the object in prose or a ```json fence. */
export function parseMemory(raw: string): { resumen: string; perfil: Partial<ClientProfile> } | null {
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start === -1 || end <= start) return null
  let parsed: unknown
  try {
    parsed = JSON.parse(raw.slice(start, end + 1))
  } catch {
    return null
  }
  if (!parsed || typeof parsed !== 'object') return null
  const o = parsed as Record<string, unknown>
  const resumen = typeof o.resumen === 'string' ? o.resumen.trim() : ''
  if (!resumen) return null
  const p = (o.perfil && typeof o.perfil === 'object' ? o.perfil : {}) as Record<string, unknown>
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
  const arr = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [])
  const suc = str(p.sucursal_preferida)
  return {
    resumen,
    perfil: {
      nombre: str(p.nombre),
      correo: str(p.correo),
      ...(suc === 'cde' || suc === 'sfc' ? { sucursal_preferida: suc } : {}),
      tratamientos: arr(p.tratamientos),
      preferencias: arr(p.preferencias),
      notas: arr(p.notas),
    },
  }
}

/**
 * Closes the book on a conversation: writes one log entry and folds whatever the
 * customer told us into the permanent profile. Best effort — never throws, because
 * every caller is on a path where the customer has already been served.
 */
export async function closeAndRemember(i: {
  anthropic: Pick<Anthropic, 'messages'>
  store: AgentStore
  phone: string
  outcome: ConversationOutcome
  now: Date
}): Promise<{ logged: boolean }> {
  try {
    const [last] = await i.store.recentConversationLogs(i.phone, 1)
    if (last) {
      const endedAt = Date.parse(last.ended_at ?? last.created_at ?? '')
      if (Number.isFinite(endedAt) && i.now.getTime() - endedAt < DOUBLE_LOG_MS) return { logged: false }
    }

    const messages = await i.store.recentMessages(i.phone, { sinceHours: 48, limit: 60 })
    const text = transcript(messages)
    if (!text) return { logged: false }

    const res = await i.anthropic.messages.create({
      model: env().model,
      max_tokens: 600,
      thinking: { type: 'disabled' },
      system: SYSTEM,
      messages: [{ role: 'user', content: `Conversación:\n${text}\n\nJSON:` }],
    } as Anthropic.MessageCreateParamsNonStreaming)

    const raw = res.content.filter(b => b.type === 'text').map(b => (b as Anthropic.TextBlock).text).join('\n')
    const parsed = parseMemory(raw)
    if (!parsed) {
      await i.store.logEvent(i.phone, 'error', { where: 'closeAndRemember', error: 'respuesta no parseable', raw: raw.slice(0, 300) })
      return { logged: false }
    }

    await i.store.logConversation({
      phone: i.phone,
      started_at: messages[0]?.created_at ?? i.now.toISOString(),
      outcome: i.outcome,
      summary: parsed.resumen,
    })
    if (!isEmptyProfilePatch(parsed.perfil)) await i.store.mergeProfile(i.phone, parsed.perfil)
    return { logged: true }
  } catch (e) {
    await i.store.logEvent(i.phone, 'error', { where: 'closeAndRemember', error: String(e) }).catch(() => {})
    return { logged: false }
  }
}
