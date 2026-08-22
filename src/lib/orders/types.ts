// Unified checkout order types — mirror supabase/migrations/20260910_unified_orders.sql

export type OrderStatus =
  | 'draft'
  | 'totals_verified'
  | 'authorized'
  | 'booked'
  | 'captured'
  | 'posted'
  | 'invoiced'
  | 'fulfilled'
  | 'expired'
  | 'cancelled'
  | 'refunded'

export type OrderFailureCode =
  | 'auth_declined'
  | 'slot_lost_voided'
  | 'capture_failed'
  | 'posting_failed'
  | 'invoice_failed'
  | 'gc_balance_short'

export type OrderItemType = 'service' | 'gift_card'

/** FEP dTasaITBMS catalog — stored per line so the invoice builder reads it verbatim. */
export type TaxRateCode = '00' | '01' | '02' | '03'

export const TAX_RATE_BY_CODE: Record<TaxRateCode, number> = {
  '00': 0,
  '01': 0.07,
  '02': 0.1,
  '03': 0.15,
}

export interface OrderItemInput {
  itemType: OrderItemType
  quantity: number
  nameEs: string
  nameEn?: string
  /** Customer-facing price, TAX-INCLUSIVE (Mindbody convention: $31.03 incl $2.03 ITBMS). */
  unitPriceCents: number
  taxRateCode: TaxRateCode
  // service payload
  mindbodySessionTypeId?: number
  mindbodyPricingOptionId?: number
  staffId?: number
  staffRequested?: boolean
  appointmentStart?: string // ISO, Panama local
  durationMinutes?: number
  isAddon?: boolean
  // gift-card payload
  gcCatalogItemId?: string
  gcRecipientName?: string
  gcRecipientEmail?: string
  gcMessage?: string
  gcDeliveryDate?: string
}

export interface ComputedOrderLine extends OrderItemInput {
  discountCents: number
  /** ITBMS portion INCLUDED in the discounted line total. */
  taxCents: number
  totalCents: number
}

export interface OrderTotals {
  lines: ComputedOrderLine[]
  subtotalCents: number // sum of undiscounted tax-inclusive line prices
  discountCents: number
  taxCents: number
  totalCents: number // what the customer pays
}

export interface PromoCode {
  id: string
  code: string
  kind: 'percent' | 'fixed'
  value: number // percent 1–100 | fixed cents
  scope: 'all' | 'services' | 'gift_cards' | 'programs'
  program_ids: number[]
  min_subtotal_cents: number
  starts_at: string | null
  ends_at: string | null
  max_uses: number | null
  max_uses_per_customer: number | null
  is_active: boolean
}

export type PromoRejection =
  | 'not_found'
  | 'inactive'
  | 'not_started'
  | 'expired'
  | 'exhausted'
  | 'customer_limit'
  | 'below_minimum'
  | 'no_eligible_items'

export interface PromoResult {
  ok: boolean
  rejection?: PromoRejection
  promo?: PromoCode
  /** Discount allocated per eligible line, same order as input lines. */
  discountByLineCents?: number[]
  discountCents?: number
}
