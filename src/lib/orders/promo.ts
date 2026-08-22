import type { SupabaseClient } from '@supabase/supabase-js'
import type { OrderItemInput, PromoCode, PromoResult } from './types'

/**
 * Promo-code validation + allocation. Source of truth is Supabase
 * (promo_codes / promo_redemptions); the resulting per-line discounts are
 * frozen onto the order and later posted to Mindbody as exact DiscountAmounts
 * — nothing downstream ever recomputes a discount.
 */

function eligibleIndexes(promo: PromoCode, items: OrderItemInput[]): number[] {
  return items
    .map((item, i) => {
      if (promo.scope === 'all') return i
      if (promo.scope === 'services') return item.itemType === 'service' ? i : -1
      if (promo.scope === 'gift_cards') return item.itemType === 'gift_card' ? i : -1
      // scope === 'programs': match the service's Mindbody program id
      return item.itemType === 'service' &&
        item.mindbodySessionTypeId !== undefined &&
        promo.program_ids.length > 0 &&
        promo.program_ids.includes(programIdOf(item))
        ? i
        : -1
    })
    .filter(i => i >= 0)
}

// Program id rides on the item input when scope rules need it; sessionTypeId
// alone can't resolve a program, so callers populate programId for services.
function programIdOf(item: OrderItemInput & { programId?: number }): number {
  return (item as { programId?: number }).programId ?? -1
}

/**
 * Allocate a promo across eligible lines.
 * percent: applied per eligible line. fixed: allocated proportionally across
 * eligible lines (largest-remainder so the cents always sum exactly).
 */
function allocate(promo: PromoCode, items: OrderItemInput[], idxs: number[]): number[] {
  const out = items.map(() => 0)
  const grossOf = (i: number) => items[i].unitPriceCents * items[i].quantity

  if (promo.kind === 'percent') {
    for (const i of idxs) out[i] = Math.round((grossOf(i) * promo.value) / 100)
    return out
  }

  const eligibleGross = idxs.reduce((s, i) => s + grossOf(i), 0)
  const target = Math.min(promo.value, eligibleGross)
  if (eligibleGross === 0) return out

  let allocated = 0
  const remainders: Array<{ i: number; frac: number }> = []
  for (const i of idxs) {
    const exact = (target * grossOf(i)) / eligibleGross
    const floor = Math.floor(exact)
    out[i] = floor
    allocated += floor
    remainders.push({ i, frac: exact - floor })
  }
  remainders.sort((a, b) => b.frac - a.frac)
  for (let k = 0; k < target - allocated; k++) out[remainders[k % remainders.length].i] += 1
  return out
}

export async function validatePromoCode(
  supabase: SupabaseClient,
  input: {
    code: string
    items: OrderItemInput[]
    /** mindbody_client_id when known, else lowercased buyer email. */
    customerKey?: string
  }
): Promise<PromoResult> {
  const code = input.code.trim().toUpperCase()
  if (!code) return { ok: false, rejection: 'not_found' }

  const { data: promo } = await supabase
    .from('promo_codes')
    .select('*')
    .eq('code', code)
    .maybeSingle<PromoCode>()

  if (!promo) return { ok: false, rejection: 'not_found' }
  // Only an explicit false deactivates: a legacy NULL must not silently
  // reject a working code (the column is NOT NULL as of 20260917).
  if (promo.is_active === false) return { ok: false, rejection: 'inactive' }

  const now = Date.now()
  if (promo.starts_at && now < Date.parse(promo.starts_at)) return { ok: false, rejection: 'not_started' }
  if (promo.ends_at && now > Date.parse(promo.ends_at)) return { ok: false, rejection: 'expired' }

  const subtotal = input.items.reduce((s, it) => s + it.unitPriceCents * it.quantity, 0)
  if (subtotal < (promo.min_subtotal_cents ?? 0)) return { ok: false, rejection: 'below_minimum' }

  const idxs = eligibleIndexes(promo, input.items)
  if (idxs.length === 0) return { ok: false, rejection: 'no_eligible_items' }

  if (promo.max_uses !== null || promo.max_uses_per_customer !== null) {
    const { count: totalUses } = await supabase
      .from('promo_redemptions')
      .select('id', { count: 'exact', head: true })
      .eq('promo_code_id', promo.id)
    if (promo.max_uses !== null && (totalUses ?? 0) >= promo.max_uses) {
      return { ok: false, rejection: 'exhausted' }
    }
    if (promo.max_uses_per_customer !== null && input.customerKey) {
      const { count: customerUses } = await supabase
        .from('promo_redemptions')
        .select('id', { count: 'exact', head: true })
        .eq('promo_code_id', promo.id)
        .eq('customer_key', input.customerKey)
      if ((customerUses ?? 0) >= promo.max_uses_per_customer) {
        return { ok: false, rejection: 'customer_limit' }
      }
    }
  }

  const discountByLineCents = allocate(promo, input.items, idxs)
  const discountCents = discountByLineCents.reduce((s, d) => s + d, 0)
  return { ok: true, promo, discountByLineCents, discountCents }
}
