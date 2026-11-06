// One sentence for the post-payment page: who receives the card, through
// which channel, and when. Built from the order row, no other input.
export interface ThankYouOrder {
  recipient_name: string
  recipient_email: string | null
  recipient_phone: string | null
  delivery_email: boolean
  delivery_whatsapp: boolean
  scheduled_send_at: string | null
  buyer_email?: string | null
}

// Order statuses that mean the money is in; anything else is "confirming".
const PAID_STATUSES = ['captured', 'posted', 'invoiced', 'fulfilled', 'booked']
export function isPaidStatus(status: string | null | undefined): boolean {
  return !!status && PAID_STATUSES.includes(status)
}

// wa.me link the buyer uses to forward a self-delivered card.
export function giftForwardUrl(giftUrl: string, locale: 'es' | 'en'): string {
  const text = locale === 'en'
    ? `A Mimosa Spa gift for you 🎁 ${giftUrl}`
    : `Un regalo de Mimosa Spa para ti 🎁 ${giftUrl}`
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

/**
 * "You paid" line for a discounted card, or null when the order is not
 * discounted. The percent comes from the pre-tax price (baseAmountCents is
 * the sale price); the amount shown is what was charged, with a tax note
 * when ITBMS is part of it.
 */
export function discountLine(o: {
  faceValueCents: number | null | undefined
  baseAmountCents: number
  totalCents: number
  itbmsCents: number
  locale: string | null | undefined
}): string | null {
  if (!o.faceValueCents || o.faceValueCents <= o.baseAmountCents) return null
  const en = o.locale === 'en'
  const pct = Math.round(100 * (1 - o.baseAmountCents / o.faceValueCents))
  const paid = `$${(o.totalCents / 100).toFixed(o.totalCents % 100 === 0 ? 0 : 2)}`
  const tax = o.itbmsCents > 0 ? ', incl. ITBMS' : ''
  return en ? `You paid ${paid} (${pct}% off${tax})` : `Pagaste ${paid} (${pct}% de descuento${tax})`
}

export function isSelfDelivery(o: ThankYouOrder): boolean {
  return !o.delivery_email && !o.delivery_whatsapp
}

export function longDateLabel(iso: string, locale: 'es' | 'en'): string {
  const d = new Date(iso)
  return locale === 'en'
    ? d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'America/Panama' })
    : d.toLocaleDateString('es-PA', { day: 'numeric', month: 'long', timeZone: 'America/Panama' })
}

export function thankYouSentence(o: ThankYouOrder, locale: 'es' | 'en'): string {
  const en = locale === 'en'
  if (isSelfDelivery(o)) {
    return en
      ? `Here is ${o.recipient_name}'s gift card. Share it whenever you like.`
      : `Aquí tienes la gift card para ${o.recipient_name}. Envíasela cuando quieras.`
  }
  const channel = o.delivery_email
    ? { es: 'por correo', en: 'by email', contact: o.recipient_email ?? '' }
    : { es: 'por WhatsApp', en: 'by WhatsApp', contact: o.recipient_phone ? `+${o.recipient_phone}` : '' }
  const when = o.scheduled_send_at
    ? en ? `on ${longDateLabel(o.scheduled_send_at, 'en')}` : `el ${longDateLabel(o.scheduled_send_at, 'es')}`
    : en ? 'in the next few minutes' : 'en los próximos minutos'
  return en
    ? `${o.recipient_name} will receive the gift card ${channel.en} (${channel.contact}) ${when}.`
    : `${o.recipient_name} recibirá su gift card ${channel.es} (${channel.contact}) ${when}.`
}
