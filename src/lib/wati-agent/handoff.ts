import type { AgentStore } from './store'
import type { WatiClient } from './wati-api'
import type { Conversation } from './types'
import type { env as envFn } from './config/env'

export async function performHandoff(i: { store: AgentStore; wati: WatiClient; conv: Conversation; motivo: string; resumen: string; shadow: boolean; env: ReturnType<typeof envFn> }) {
  const { phone, sucursal } = i.conv
  if (i.shadow) { await i.store.logEvent(phone, 'handoff', { motivo: i.motivo, resumen: i.resumen, shadow: true }); return }
  await i.wati.sendText(phone, 'Un momento por favor, le comunico con mi compañera 🌼')
  await i.wati.updateAttributes(phone, { sucursal: sucursal ?? '', ai_modo: 'humano', ai_resumen: i.resumen.slice(0, 300), ai_motivo: i.motivo })
  let viaFlow = false
  if (i.env.handoffChatbotId) viaFlow = (await i.wati.startChatbot(phone, i.env.handoffChatbotId)).ok
  if (!viaFlow) {
    if (!sucursal) await i.wati.sendButtons(phone, '¿Para cuál sucursal desea atención?', ['Costa del Este', 'San Francisco'])
    await i.wati.assignOperator(phone, sucursal === 'cde' ? i.env.citasCdeEmail : i.env.citasSfcEmail)
  }
  await i.store.upsertConversation({ phone, mode: 'human', human_since: new Date().toISOString(), handoff_reason: i.motivo, summary: i.resumen })
  await i.store.logEvent(phone, 'handoff', { motivo: i.motivo, resumen: i.resumen, viaFlow })
}

export async function registerTakeover(store: AgentStore, phone: string, operatorEmail: string) {
  await store.upsertConversation({ phone, mode: 'human', human_since: new Date().toISOString(), handoff_reason: 'takeover' })
  await store.logEvent(phone, 'takeover', { operatorEmail })
}

export async function resumeAgent(store: AgentStore, phone: string) {
  await store.upsertConversation({ phone, mode: 'agent', human_since: null, handoff_reason: null })
  await store.logEvent(phone, 'resume', {})
}
