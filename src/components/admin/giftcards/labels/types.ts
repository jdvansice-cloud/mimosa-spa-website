// Shared types for thermal-label templates.
//
// Physical media: 3" × 2" die-cut labels on an 80 mm roll, separated by a
// black mark on the liner. Printed on a Star Micronics TSP143 (203 dpi) with
// the black-mark sensor enabled and the auto-cutter OFF — the printer feeds
// to the next mark after each label. The TSP143 can only print across the
// middle 72 mm (2.835") of the roll, so the design canvas below is that
// printable area; the driver centers it on the label.
//
// Keep templates as pure functions of `LabelCard` so tweaking copy / layout
// is a single-file edit.

export const LABEL_WIDTH_IN = 2.835 // 72 mm — TSP143 printable width
export const LABEL_HEIGHT_IN = 2 // 50.8 mm — die-cut label height (printed area)
// Label pitch: top of one label to top of the next (label + gap), measured
// on the roll. The TSP143III has NO black-mark sensor, so each print must
// advance exactly one pitch; the print page height uses this, not the
// label height. Staff aligns the roll once when loading.
export const LABEL_PITCH_IN = 52.5 / 25.4 // 52.5 mm measured 2026-07-10

export interface LabelCard {
  serial: string
  buyer_name: string
  recipient_name: string
  amount_cents: number
  currency: string
  /** Optional list of treatments included as a gift. */
  gift_treatment_names: string[] | null
  message: string | null
  print_amount: boolean
  print_message: boolean
  print_recipient: boolean
  print_treatments: boolean
}

export function formatLabelMoney(cents: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100)
}
