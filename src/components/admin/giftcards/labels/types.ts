// Shared types for thermal-label templates.
//
// Physical label: 2.25" wide × 1.25" tall, adhered to the back of a
// 3.25" × 2.2" gift card. Printed on a Star Micronics TSP143IIIU (203 dpi).
//
// Keep templates as pure functions of `LabelCard` so tweaking copy / layout
// is a single-file edit.

export const LABEL_WIDTH_IN = 2.25
export const LABEL_HEIGHT_IN = 1.25

export interface LabelCard {
  serial: string
  format: 'gift_card' | 'certificado'
  buyer_name: string
  recipient_name: string
  amount_cents: number
  currency: string
  treatment_name: string | null
  message: string | null
  print_amount: boolean
  print_message: boolean
  print_recipient: boolean
}

export function formatLabelMoney(cents: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100)
}
