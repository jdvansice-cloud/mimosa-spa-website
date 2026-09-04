import { cleanPhone } from './phone'

export function authorized(url: string, secret: string): boolean {
  if (!secret) return false
  return new URL(url).searchParams.get('token')?.trim() === secret
}

export interface InboundEvent {
  phone: string
  senderName: string
  messageId: string
  text: string | null
  type: string
  owner: boolean
  ticketId: string | null
  contactId: string | null
  mediaRef: string | null
  timestamp: string | null
}

/** djb2-style hash, stable across runs. */
function simpleHash(s: string): string {
  let h = 5381
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) | 0
  }
  return (h >>> 0).toString(36)
}

/** Deterministic id for inbound events that arrive without a WATI message id, so dedupe still applies. */
export function fallbackMessageId(e: { phone: string; text: string | null; type: string; timestamp?: string | null }): string {
  return `fb:${e.phone}:${e.timestamp ?? ''}:${simpleHash((e.text ?? '') + e.type)}`
}

export function parseInbound(b: any): InboundEvent | null {
  const rawId = b?.waId ?? b?.contact?.waId ?? b?.contact?.phone ?? b?.phone
  const phone = cleanPhone(rawId)
  if (!phone) return null
  const data = b?.data && typeof b.data === 'object' ? b.data : null
  return {
    phone,
    senderName: String(b.senderName ?? ''),
    messageId: String(b.whatsappMessageId ?? b.id ?? ''),
    text: typeof b.text === 'string' ? b.text : null,
    type: String(b.type ?? b.messageType ?? 'text').toLowerCase(),
    owner: Boolean(b.owner),
    ticketId: b.ticketId ?? null,
    contactId: b.contactId ?? b.conversationId ?? null,
    mediaRef: data?.fileName ?? data?.filename ?? (typeof b.data === 'string' ? b.data : null),
    timestamp: b.timestamp ?? null,
  }
}

export interface SentEvent {
  phone: string
  messageId: string
  text: string | null
  operatorEmail: string | null
  operatorName: string | null
  owner: boolean
}

export function parseSent(b: any): SentEvent | null {
  const rawId = b?.waId ?? b?.contact?.waId ?? b?.contact?.phone ?? b?.phone
  const phone = cleanPhone(rawId)
  if (!phone) return null
  return {
    phone,
    messageId: String(b.whatsappMessageId ?? b.id ?? ''),
    text: typeof b.text === 'string' ? b.text : null,
    operatorEmail: b.operatorEmail ? String(b.operatorEmail).toLowerCase() : null,
    operatorName: b.operatorName ?? null,
    owner: Boolean(b.owner),
  }
}

/** apiLabels: operatorEmail values WATI stamps on API-sent messages (learned in the spike; '' = blank). */
export function isHumanOperator(e: SentEvent, agentEmail: string, apiLabels: string[]): boolean {
  if (!e.owner) return false
  const em = e.operatorEmail ?? ''
  if (!em) return false
  if (em === agentEmail.toLowerCase()) return false
  if (apiLabels.map(s => s.toLowerCase()).includes(em)) return false
  return true
}

export function shouldDebounceSkip(newestId: number | null, myId: number | null): boolean {
  if (myId == null) return false
  return newestId !== null && newestId > myId
}
