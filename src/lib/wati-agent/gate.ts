import type { ConversationMode, GlobalMode } from './types'

export type GateInput = {
  globalMode: GlobalMode; enabledSetting: boolean; whitelist: string[]
  phone: string; conversationMode: ConversationMode; owner: boolean
}
export type GateDecision = { run: false; reason: string } | { run: true; shadow: boolean }

export function gate(i: GateInput): GateDecision {
  if (i.owner) return { run: false, reason: 'owner_message' }
  if (i.globalMode === 'off') return { run: false, reason: 'global_off' }
  if (!i.enabledSetting) return { run: false, reason: 'setting_disabled' }
  if (i.conversationMode !== 'agent') return { run: false, reason: `conversation_${i.conversationMode}` }
  if (i.globalMode === 'whitelist' && !i.whitelist.includes(i.phone)) return { run: false, reason: 'not_whitelisted' }
  return { run: true, shadow: i.globalMode === 'shadow' }
}
