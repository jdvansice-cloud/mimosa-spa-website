export type Sucursal = 'cde' | 'sfc'
export type ConversationMode = 'agent' | 'human' | 'off'
export type GlobalMode = 'off' | 'shadow' | 'whitelist' | 'live'
export type Author = 'customer' | 'camila' | 'human' | 'bot' | 'template'
/** What Camila remembers about a contact across conversations. */
export interface ClientProfile {
  nombre?: string
  correo?: string
  sucursal_preferida?: Sucursal
  tratamientos?: string[]
  preferencias?: string[]
  notas?: string[]
  ultima_actualizacion?: string
}
export type ConversationOutcome = 'booked' | 'handoff' | 'closed' | 'idle'
export interface ConversationLogEntry {
  id?: number
  phone: string
  started_at: string
  ended_at?: string
  outcome: ConversationOutcome | null
  summary: string
  created_at?: string
}
export interface Conversation {
  phone: string; wati_contact_id: string | null; ticket_id: string | null
  mode: ConversationMode; sucursal: Sucursal | null
  mindbody_client_id: string | null; client_name: string | null
  summary: string | null; handoff_reason: string | null
  human_since: string | null; last_inbound_at: string | null; last_outbound_at: string | null
  audio_count: number
  profile: ClientProfile
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
