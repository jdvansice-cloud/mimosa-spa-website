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

// Media since 2026-08-05: 2.25 × 1.25 in die-cut labels (the 3×2 clear
// vinyl rolls turned out not to be direct-thermal and were returned).
export const LABEL_WIDTH_IN = 2.25
export const LABEL_HEIGHT_IN = 1.25

/**
 * Per-printer print geometry. The Omezizy/Phomemo D520 is the primary
 * printer: its black-line sensor registers each label, so the page height
 * equals the label height. The Star TSP143III (fallback, second location)
 * has no mark sensor — its page height is the measured 52.5 mm label pitch
 * so each print advances exactly one label, and its head only covers 72 mm.
 */
export interface LabelPrinterProfile {
  /** Substring matched against QZ printer names. */
  hint: string
  /** Drawn canvas width == page width sent to the driver. */
  widthIn: number
  /** Page height: label height (sensor registers) or pitch (blind feed). */
  pageHeightIn: number
  /**
   * Rotate the bitmap 90° CCW and print on a portrait (h > w) page. The
   * D520 driver auto-rotates landscape pages with a blurry resample; a
   * pre-rotated portrait job avoids that entirely (verified 2026-08-04).
   */
  rotateBitmap?: boolean
}

export const D520_PROFILE: LabelPrinterProfile = {
  hint: 'D520',
  widthIn: LABEL_WIDTH_IN,
  pageHeightIn: LABEL_HEIGHT_IN,
  rotateBitmap: true,
}

export const TSP143_PROFILE: LabelPrinterProfile = {
  hint: 'TSP143',
  widthIn: 2.835, // 72 mm printable width
  pageHeightIn: 52.5 / 25.4, // pitch measured 2026-07-10
}

export const PRINTER_PROFILES: LabelPrinterProfile[] = [D520_PROFILE, TSP143_PROFILE]

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
