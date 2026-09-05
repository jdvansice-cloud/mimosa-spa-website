import type { AgentStore } from './store'
import type { WatiClient } from './wati-api'
import type { Conversation } from './types'
import type { env as envFn } from './config/env'

/**
 * Handoff reasons that keep a conversation stuck with a human even after
 * `human_idle_resume_hours` of silence — only the ticket being solved or
 * the hard 24h bound brings Camila back for these.
 */
export const STICKY_HANDOFF_REASONS = ['queja', 'manipulacion', 'medico', 'certificado', 'comprobante_o_imagen'] as const

export async function performHandoff(i: { store: AgentStore; wati: WatiClient; conv: Conversation; motivo: string; resumen: string; shadow: boolean; env: ReturnType<typeof envFn> }) {
  const { phone, sucursal } = i.conv
  if (i.shadow) { await i.store.logEvent(phone, 'handoff', { motivo: i.motivo, resumen: i.resumen, shadow: true }); return }
  await i.wati.sendText(phone, 'Un momento por favor, le comunico con mi compañera 🌼')
  if (i.resumen.trim()) await i.wati.sendText(phone, `Resumen para mi compañera: ${i.resumen.trim().slice(0, 300)}`)
  await i.wati.updateAttributes(phone, { sucursal: sucursal ?? '', team: sucursal ?? 'sfc', ai_modo: 'humano', ai_resumen: i.resumen.slice(0, 300), ai_motivo: i.motivo })
  const chatbotConfigured = Boolean(i.env.handoffChatbotId)
  if (!chatbotConfigured) await i.store.logEvent(phone, 'error', { where: 'handoff', error: 'WATI_HANDOFF_CHATBOT_ID no configurado' })
  let viaFlow = false
  if (chatbotConfigured) viaFlow = (await i.wati.startChatbot(phone, i.env.handoffChatbotId)).ok
  if (!viaFlow) {
    if (!sucursal) await i.wati.sendButtons(phone, '¿Para cuál sucursal desea atención?', ['Costa del Este', 'San Francisco'])
    await i.wati.assignOperator(phone, sucursal === 'cde' ? i.env.citasCdeEmail : i.env.citasSfcEmail)
  }
  await i.store.upsertConversation({ phone, mode: 'human', human_since: new Date().toISOString(), handoff_reason: i.motivo, summary: i.resumen })
  await i.store.logEvent(phone, 'handoff', { motivo: i.motivo, resumen: i.resumen, viaFlow, chatbotConfigured })
}

export async function registerTakeover(store: AgentStore, phone: string, operatorEmail: string) {
  await store.upsertConversation({ phone, mode: 'human', human_since: new Date().toISOString(), handoff_reason: 'takeover' })
  await store.logEvent(phone, 'takeover', { operatorEmail })
}

export async function resumeAgent(store: AgentStore, phone: string, eventPayload: unknown = {}) {
  await store.upsertConversation({ phone, mode: 'agent', human_since: null, handoff_reason: null })
  await store.logEvent(phone, 'resume', eventPayload)
}
