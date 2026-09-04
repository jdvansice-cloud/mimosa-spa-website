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
  const phone = cleanPhone(b?.waId)
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

export function shouldDebounceSkip(newestId: number | null, myId: number): boolean {
  return newestId !== null && newestId > myId
}
