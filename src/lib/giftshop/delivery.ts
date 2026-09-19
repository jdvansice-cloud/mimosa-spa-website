// How a gift card reaches the recipient. The buyer picks exactly one channel
// in the shop; the server stores only the contact field for that channel so
// the fulfillment's "email whenever an address exists, WhatsApp additive"
// rule yields exactly one delivery.
export type DeliveryMethod = 'email' | 'whatsapp' | 'self'

export interface DeliveryInput {
  deliveryMethod?: unknown
  recipientEmail?: unknown
  recipientPhone?: unknown
}

export interface DeliveryResolved {
  ok: true
  method: DeliveryMethod
  recipientEmail: string | null
  recipientPhone: string | null
  deliveryEmail: boolean
  deliveryWhatsapp: boolean
  allowSchedule: boolean
}

export interface DeliveryRejected {
  ok: false
  error: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function cleanEmail(v: unknown): string {
  return typeof v === 'string' ? v.trim().toLowerCase().slice(0, 160) : ''
}

/** WATI format: digits only, country code first, no plus sign. */
function cleanPhone(v: unknown): string {
  return typeof v === 'string' ? v.replace(/\D/g, '').slice(0, 24) : ''
}

export function resolveDelivery(input: DeliveryInput): DeliveryResolved | DeliveryRejected {
  const email = cleanEmail(input.recipientEmail)
  const phone = cleanPhone(input.recipientPhone)

  // Legacy clients (no deliveryMethod) keep the pre-launch derivation.
  if (input.deliveryMethod === undefined) {
    if (email && !EMAIL_RE.test(email)) return { ok: false, error: 'Correo del destinatario inválido' }
    return {
      ok: true,
      method: email ? 'email' : phone ? 'whatsapp' : 'self',
      recipientEmail: email || null,
      recipientPhone: phone || null,
      deliveryEmail: !!email,
      deliveryWhatsapp: !!phone,
      allowSchedule: !!(email || phone),
    }
  }

  switch (input.deliveryMethod) {
    case 'email':
      if (!email) return { ok: false, error: 'Indica el correo de quien recibe' }
      if (!EMAIL_RE.test(email)) return { ok: false, error: 'Correo del destinatario inválido' }
      return { ok: true, method: 'email', recipientEmail: email, recipientPhone: null, deliveryEmail: true, deliveryWhatsapp: false, allowSchedule: true }
    case 'whatsapp':
      if (phone.length < 8) return { ok: false, error: 'Indica el WhatsApp de quien recibe' }
      return { ok: true, method: 'whatsapp', recipientEmail: null, recipientPhone: phone, deliveryEmail: false, deliveryWhatsapp: true, allowSchedule: true }
    case 'self':
      return { ok: true, method: 'self', recipientEmail: null, recipientPhone: null, deliveryEmail: false, deliveryWhatsapp: false, allowSchedule: false }
    default:
      return { ok: false, error: 'Método de entrega inválido' }
  }
}
