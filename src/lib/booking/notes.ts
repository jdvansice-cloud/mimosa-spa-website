// Mindbody appointment note for online bookings. Parts joined by ' | '.
// Camila (the WhatsApp agent) mirrors this format; keep the order stable.
export function buildAppointmentNotes(o: {
  isPromoService: boolean
  promotionName?: string | null
  globalDiscountPercent?: number | null
  customNotes?: string | null
  giftCode?: string | null
}): string {
  const parts: string[] = ['Reservado en línea']
  if (o.isPromoService && o.promotionName) {
    parts.push(`Promo: ${o.promotionName}`)
  } else if (o.globalDiscountPercent && o.globalDiscountPercent > 0) {
    parts.push(`Promo Online ${o.globalDiscountPercent}%`)
  }
  if (o.customNotes) parts.push(o.customNotes)
  if (o.giftCode) parts.push(`Gift card: ${o.giftCode}`)
  return parts.join(' | ')
}
