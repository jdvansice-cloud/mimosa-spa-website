import { longDateLabel } from './thankYou'

// One line on the pay step so the buyer confirms the decision that matters
// most before paying: who receives the card, how, and when.
export interface RecapInput {
  recipientName: string
  deliveryMethod: 'email' | 'whatsapp' | 'self'
  recipientEmail: string
  recipientPhone: string
  /** YYYY-MM-DD from the date input, or '' */
  scheduledDate: string
}

export function recapLine(i: RecapInput, locale: 'es' | 'en'): string {
  const en = locale === 'en'
  const who = en ? `For ${i.recipientName.trim()}` : `Para ${i.recipientName.trim()}`
  if (i.deliveryMethod === 'self') {
    return en ? `${who} · we hand it to you in your receipt` : `${who} · te la entregamos a ti en el comprobante`
  }
  const how =
    i.deliveryMethod === 'email'
      ? en ? `by email to ${i.recipientEmail.trim()}` : `por correo a ${i.recipientEmail.trim()}`
      : en ? `by WhatsApp to +${i.recipientPhone.replace(/\D/g, '')}` : `por WhatsApp al +${i.recipientPhone.replace(/\D/g, '')}`
  const when = i.scheduledDate
    ? en ? `sent on ${longDateLabel(`${i.scheduledDate}T14:00:00.000Z`, 'en')}` : `se envía el ${longDateLabel(`${i.scheduledDate}T14:00:00.000Z`, 'es')}`
    : en ? 'sent when you pay' : 'se envía al pagar'
  return `${who} · ${how} · ${when}`
}
