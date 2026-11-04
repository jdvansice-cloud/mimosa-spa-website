// Pure gift-card helpers for the unified bag (no I/O, no Supabase, no fetch).
//  - buildGiftCardLine: validates a bag gift-card input against a catalog row
//    and prices it (used by POST /api/checkout).
//  - giftCardChildRow: maps a paid order_items gift-card row + its parent
//    order into a gc_orders insert (used by the orders pipeline hand-off).
import { resolveDelivery } from '@/lib/giftshop/delivery'
import { itbmsCentsFor } from '@/lib/giftshop/data'

export interface BagGiftCardInput {
  catalogItemId: string
  recipientName?: string
  recipientEmail?: string
  recipientPhone?: string
  /** undefined = legacy email rule in resolveDelivery */
  deliveryMethod?: 'email' | 'whatsapp' | 'self'
  message?: string
  /** YYYY-MM-DD */
  deliveryDate?: string
  designSlug?: string
}

export interface CatalogItemLite {
  id: string
  kind: 'monetary' | 'experience'
  name_es: string
  name_en: string
  amount_cents: number
  /** Seasonal price charged instead of amount_cents (face value). null/undefined = no sale. */
  sale_amount_cents?: number | null
  treatment_names?: string[] | null
  default_design_slug?: string | null
  is_active: boolean
}

export interface GiftCardLine {
  catalogItemId: string
  kind: 'monetary' | 'experience'
  nameEs: string
  nameEn: string
  /** tax-inclusive */
  unitPriceCents: number
  /** What the card is worth (catalogue amount_cents); differs from the price on a sale. */
  faceValueCents: number
  /** Rounded % off face value, null when not on sale. */
  discountPercent: number | null
  taxRateCode: '00' | '01'
  taxCents: number
  recipientName: string
  recipientEmail: string | null
  recipientPhone: string | null
  deliveryMethod: 'email' | 'whatsapp' | 'self'
  deliveryEmail: boolean
  deliveryWhatsapp: boolean
  message: string | null
  deliveryDate: string | null
  designSlug: string
  treatmentNames: string[] | null
}

export type GiftCardLineResult = { ok: true; line: GiftCardLine } | { ok: false; error: string }

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

/** YYYY-MM-DD that is a real calendar day (rejects 2026-13-45 and 2026-02-31, which would roll over). */
function isCalendarDate(d: string): boolean {
  if (!DATE_RE.test(d)) return false
  const t = new Date(`${d}T00:00:00Z`)
  return !Number.isNaN(t.getTime()) && t.toISOString().slice(0, 10) === d
}

function trimmed(v: unknown): string {
  return typeof v === 'string' ? v.trim() : ''
}

export function buildGiftCardLine(
  input: BagGiftCardInput,
  item: CatalogItemLite | undefined,
  opts: { whatsappEnabled: boolean; todayIso: string /* YYYY-MM-DD, Panama */ }
): GiftCardLineResult {
  if (!item || !item.is_active) return { ok: false, error: 'Gift card no disponible' }

  const recipientName = trimmed(input.recipientName)
  if (recipientName.length < 1 || recipientName.length > 120) {
    return { ok: false, error: 'Indica el nombre de quien recibe' }
  }

  const delivery = resolveDelivery({
    deliveryMethod: input.deliveryMethod,
    recipientEmail: input.recipientEmail,
    recipientPhone: input.recipientPhone,
  })
  if (!delivery.ok) return { ok: false, error: delivery.error }

  if (delivery.method === 'whatsapp' && !opts.whatsappEnabled) {
    return { ok: false, error: 'La entrega por WhatsApp no está disponible todavía.' }
  }

  // Truncate (like legacy /api/checkout) rather than drop: the buyer has paid for this text.
  const message = trimmed(input.message).slice(0, 300)
  const messageOrNull = message || null

  // Date rules apply only when the channel can schedule; otherwise it is dropped silently.
  let deliveryDate: string | null = null
  if (delivery.allowSchedule && input.deliveryDate !== undefined && input.deliveryDate !== null && input.deliveryDate !== '') {
    if (typeof input.deliveryDate !== 'string' || !isCalendarDate(input.deliveryDate)) {
      return { ok: false, error: 'Fecha de envío inválida' }
    }
    if (input.deliveryDate < opts.todayIso) {
      return { ok: false, error: 'La fecha de envío debe ser hoy o después' }
    }
    deliveryDate = input.deliveryDate
  }

  const saleCents = item.sale_amount_cents ?? null
  const priceCents = saleCents ?? item.amount_cents
  const itbmsCents = itbmsCentsFor({ kind: item.kind, amount_cents: priceCents })

  return {
    ok: true,
    line: {
      catalogItemId: item.id,
      kind: item.kind,
      nameEs: item.name_es,
      nameEn: item.name_en,
      unitPriceCents: priceCents + itbmsCents,
      faceValueCents: item.amount_cents,
      discountPercent: saleCents ? Math.round(100 * (1 - saleCents / item.amount_cents)) : null,
      taxRateCode: item.kind === 'experience' ? '01' : '00',
      taxCents: itbmsCents,
      recipientName,
      recipientEmail: delivery.recipientEmail,
      recipientPhone: delivery.recipientPhone,
      deliveryMethod: delivery.method,
      deliveryEmail: delivery.deliveryEmail,
      deliveryWhatsapp: delivery.deliveryWhatsapp,
      message: messageOrNull,
      deliveryDate,
      designSlug: input.designSlug || item.default_design_slug || 'general',
      treatmentNames: item.treatment_names ?? null,
    },
  }
}

/** Optional order_items columns for a gift-card line. Omitted when unset: the columns come from hand-run migrations. */
export function giftCardItemExtras(l: {
  gcDeliveryMethod?: string
  gcRecipientPhone?: string
  gcDesignSlug?: string
  gcFaceValueCents?: number
}): Record<string, unknown> {
  const extras: Record<string, unknown> = {}
  if (l.gcDeliveryMethod) extras.gc_delivery_method = l.gcDeliveryMethod
  if (l.gcRecipientPhone) extras.gc_recipient_phone = l.gcRecipientPhone
  if (l.gcDesignSlug) extras.gc_design_slug = l.gcDesignSlug
  if (typeof l.gcFaceValueCents === 'number') extras.gc_face_value_cents = l.gcFaceValueCents
  return extras
}

/** True when the order holds no service: its Tilopay charge is captured at once (capture:1). Unknown/loading state must be treated as NOT immediate by callers. */
export function isImmediateCapture(items: Array<{ item_type: string }>): boolean {
  return !items.some(i => i.item_type === 'service')
}

/** Row for gc_orders, built from an order_items row + its parent order (used by handoffGiftCardItems). */
export function giftCardChildRow(args: {
  orderNumber: string
  index: number
  order: {
    buyer_name: string | null
    buyer_email: string
    buyer_phone: string | null
    locale: string | null
    location_id: number | null
    hasServices: boolean
  }
  item: {
    gc_catalog_item_id: string
    name_es: string
    total_cents: number
    tax_cents: number
    gc_recipient_name: string | null
    gc_recipient_email: string | null
    gc_recipient_phone: string | null
    gc_delivery_method: string | null
    gc_message: string | null
    gc_delivery_date: string | null
    gc_design_slug: string | null
    gc_face_value_cents?: number | null
  }
  catalog: { kind: 'monetary' | 'experience'; treatment_names?: string[] | null } | undefined
  payment: { tilopay_tpt: string | null; tilopay_method: string | null }
  nowIso: string
}): Record<string, unknown> {
  const { orderNumber, index, order, item, catalog, payment, nowIso } = args
  const method = item.gc_delivery_method ?? (item.gc_recipient_email ? 'email' : 'self')
  const row: Record<string, unknown> = {
    order_number: `${orderNumber}-G${index + 1}`,
    status: 'paid',
    paid_at: nowIso,
    catalog_item_id: item.gc_catalog_item_id,
    item_kind: catalog?.kind ?? 'monetary',
    item_name: item.name_es,
    base_amount_cents: item.total_cents - item.tax_cents,
    itbms_cents: item.tax_cents,
    total_cents: item.total_cents,
    currency: 'USD',
    buyer_name: order.buyer_name,
    buyer_email: order.buyer_email,
    buyer_phone: order.buyer_phone,
    recipient_name: item.gc_recipient_name ?? order.buyer_name ?? order.buyer_email,
    recipient_email: item.gc_recipient_email,
    recipient_phone: item.gc_recipient_phone,
    gift_message: item.gc_message,
    delivery_email: method === 'email',
    delivery_whatsapp: method === 'whatsapp',
    scheduled_send_at: item.gc_delivery_date ? `${item.gc_delivery_date}T14:00:00.000Z` : null,
    design_slug: item.gc_design_slug,
    locale: order.locale ?? 'es',
    mindbody_location_id: order.hasServices ? order.location_id : null,
    tilopay_tpt: payment.tilopay_tpt,
    tilopay_method: payment.tilopay_method,
    gift_treatment_names: catalog?.treatment_names ?? null,
  }
  // Omit when unset: inserting a column that doesn't exist yet (migration pending) would be rejected.
  if (typeof item.gc_face_value_cents === 'number') row.face_value_cents = item.gc_face_value_cents
  return row
}
