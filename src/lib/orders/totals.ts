import {
  TAX_RATE_BY_CODE,
  type ComputedOrderLine,
  type OrderItemInput,
  type OrderTotals,
} from './types'

/**
 * Order money math. Two invariants:
 * 1. Prices are TAX-INCLUSIVE (Mindbody convention, production-verified:
 *    GrandTotal $31.03 = $29.00 base + $2.03 ITBMS). The included tax is
 *    derived per line: tax = total − total / (1 + rate), half-up rounding.
 * 2. Discounts apply to the tax-inclusive price; the included tax is computed
 *    on the discounted amount — matching how Mindbody's DiscountAmount and a
 *    factura's per-line discount both behave.
 */

const includedTaxCents = (totalCents: number, rate: number): number =>
  rate === 0 ? 0 : totalCents - Math.round(totalCents / (1 + rate))

export function computeOrderTotals(
  items: OrderItemInput[],
  discountByLineCents?: number[]
): OrderTotals {
  const lines: ComputedOrderLine[] = items.map((item, i) => {
    const gross = item.unitPriceCents * item.quantity
    const discountCents = Math.min(discountByLineCents?.[i] ?? 0, gross)
    const totalCents = gross - discountCents
    const taxCents = includedTaxCents(totalCents, TAX_RATE_BY_CODE[item.taxRateCode])
    return { ...item, discountCents, taxCents, totalCents }
  })

  const subtotalCents = lines.reduce((s, l) => s + l.unitPriceCents * l.quantity, 0)
  const discountCents = lines.reduce((s, l) => s + l.discountCents, 0)
  const taxCents = lines.reduce((s, l) => s + l.taxCents, 0)
  const totalCents = lines.reduce((s, l) => s + l.totalCents, 0)

  return { lines, subtotalCents, discountCents, taxCents, totalCents }
}

/** Cents → "31.03" for Mindbody/Tilopay payloads (both take dollars). */
export const centsToDollars = (cents: number): number =>
  Math.round(cents) / 100
