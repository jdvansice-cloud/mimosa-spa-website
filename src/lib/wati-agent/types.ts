export type Sucursal = 'cde' | 'sfc'
export type ConversationMode = 'agent' | 'human' | 'off'
export type GlobalMode = 'off' | 'shadow' | 'whitelist' | 'live'
export type Author = 'customer' | 'camila' | 'human' | 'bot' | 'template'
export interface Conversation {
  phone: string; wati_contact_id: string | null; ticket_id: string | null
  mode: ConversationMode; sucursal: Sucursal | null
  mindbody_client_id: string | null; client_name: string | null
  summary: string | null; handoff_reason: string | null
  human_since: string | null; last_inbound_at: string | null; last_outbound_at: string | null
  audio_count: number
}
export interface StoredMessage {
  id?: number; phone: string; wati_message_id: string | null
  direction: 'in' | 'out'; author: Author; type: string
  text: string | null; media_ref: string | null; shadow: boolean; created_at?: string
}
export interface MediaAsset {
  key: string; description: string; caption: string; storage_path: string
  valid_from: string | null; valid_until: string | null; active: boolean
}
export type EventKind = 'tool_call' | 'tool_result' | 'handoff' | 'takeover' | 'resume' | 'error' | 'llm' | 'shadow_reply'
