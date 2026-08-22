/**
 * Integer-cent money helpers for e-invoicing. Every amount that reaches the
 * PAC is derived from integer cents so per-line values always sum back to the
 * order total exactly — the DGI recomputes totals and rejects any drift.
 */

export const toCents = (amount: number): number => Math.round(amount * 100)

export const fromCents = (cents: number): number => Math.round(cents) / 100

export const roundTo = (value: number, decimals: number): number => {
  const f = 10 ** decimals
  return Math.round(value * f) / f
}

/**
 * Split `total` cents across buckets proportionally to `weights`, using
 * largest-remainder so the parts always sum to exactly `total`.
 * All-zero weights put the whole amount on the last bucket.
 */
export function distributeCents(total: number, weights: number[]): number[] {
  const out = weights.map(() => 0)
  if (weights.length === 0 || total === 0) return out

  const weightSum = weights.reduce((s, w) => s + w, 0)
  if (weightSum <= 0) {
    out[out.length - 1] = total
    return out
  }

  let allocated = 0
  const remainders: Array<{ i: number; frac: number }> = []
  weights.forEach((w, i) => {
    const exact = (total * w) / weightSum
    const floor = Math.floor(exact)
    out[i] = floor
    allocated += floor
    remainders.push({ i, frac: exact - floor })
  })

  remainders.sort((a, b) => b.frac - a.frac)
  let leftover = total - allocated
  let k = 0
  while (leftover > 0 && remainders.length > 0) {
    out[remainders[k % remainders.length].i] += 1
    leftover -= 1
    k += 1
  }
  return out
}

/**
 * Back the included ITBMS out of a tax-inclusive amount.
 * Mimosa/Mindbody prices are tax-inclusive ($31.03 = $29.00 + $2.03 @ 7%),
 * while the DGI wants net + tax stated separately.
 */
export function splitInclusive(
  inclusiveCents: number,
  rate: number
): { netCents: number; taxCents: number } {
  if (rate === 0) return { netCents: inclusiveCents, taxCents: 0 }
  const netCents = Math.round(inclusiveCents / (1 + rate))
  return { netCents, taxCents: inclusiveCents - netCents }
}
