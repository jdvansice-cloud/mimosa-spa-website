import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import {
  checkoutShoppingCart,
  getGiftCardBalance,
  getRecentSales,
  type CheckoutPayment,
} from '@/lib/booking/mindbody'
import {
  captureTilopayPayment,
  voidTilopayPayment,
} from '@/lib/payments/tilopay'
import { giftCardChildRow, isImmediateCapture } from './giftCardItems'
import { fulfillOrder, resolvePaymentInfo, tenderNameFor } from '@/lib/giftshop/fulfillment'
import { centsToDollars } from './totals'

/**
 * Paid-order pipeline: authorized → booked → captured → posted → fulfilled.
 *
 * Ordering rules (proposal §5):
 *  - Book BEFORE capture: a lost slot voids the authorization — the customer
 *    is never charged for a booking that doesn't exist.
 *  - Mindbody posting runs AFTER capture and is retryable via cron; a posting
 *    failure is an ops problem, never a customer-facing one.
 *  - checkoutshoppingcart has NO idempotency: posting is single-flight per
 *    order (status-guarded claims) and re-checks /sale/sales before retrying.
 *  - Gift-card ITEMS are handed to the proven gc_orders engine (fulfillOrder)
 *    one row per item — Mindbody registration, email/WATI delivery, bonus
 *    rules and cron retries all come for free.
 */

export function ordersAdminClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export interface OrderRow {
  id: string
  order_number: string
  status: string
  failure_code: string | null
  mindbody_client_id: string | null
  buyer_name: string | null
  buyer_email: string | null
  buyer_phone: string | null
  locale: string
  location_id: number
  subtotal_cents: number
  discount_cents: number
  tax_cents: number
  total_cents: number
  promo_code: string | null
  mindbody_sale_id: number | null
  posting_attempts: number
  booked_at: string | null
  captured_at: string | null
  notes: string | null
}

export interface OrderItemRow {
  id: string
  item_type: 'service' | 'gift_card'
  quantity: number
  name_es: string
  name_en: string | null
  unit_price_cents: number
  discount_cents: number
  tax_rate_code: string
  tax_cents: number
  total_cents: number
  mindbody_session_type_id: number | null
  mindbody_pricing_option_id: number | null
  mindbody_appointment_ids: number[] | null
  staff_id: number | null
  staff_requested: boolean
  appointment_start: string | null
  duration_minutes: number | null
  is_addon: boolean
  gc_catalog_item_id: string | null
  gc_serial: string | null
  gc_recipient_name: string | null
  gc_recipient_email: string | null
  gc_message: string | null
  gc_delivery_date: string | null
  // Added by hand-run migrations: may be absent until applied.
  gc_recipient_phone?: string | null
  gc_delivery_method?: string | null
  gc_design_slug?: string | null
  gc_face_value_cents?: number | null
  sort_order: number
}

export interface OrderPaymentRow {
  id: string
  kind: 'tilopay' | 'gift_card' | 'pay_at_spa'
  amount_cents: number
  status: string
  tilopay_tpt: string | null
  tilopay_method: string | null
  mindbody_tender: string | null
  gc_barcode: string | null
}

export interface LoadedOrder {
  order: OrderRow
  items: OrderItemRow[]
  payments: OrderPaymentRow[]
}

export async function loadOrder(
  supabase: SupabaseClient,
  orderId: string
): Promise<LoadedOrder | null> {
  const { data: order } = await supabase.from('orders').select('*').eq('id', orderId).single()
  if (!order) return null
  const { data: items } = await supabase
    .from('order_items').select('*').eq('order_id', orderId).order('sort_order')
  const { data: payments } = await supabase
    .from('order_payments').select('*').eq('order_id', orderId)
  return { order, items: items ?? [], payments: payments ?? [] }
}

const nowIso = () => new Date().toISOString()

async function setOrder(
  supabase: SupabaseClient,
  orderId: string,
  patch: Record<string, unknown>,
  guardStatus?: string
): Promise<boolean> {
  let q = supabase.from('orders').update({ ...patch, updated_at: nowIso() }).eq('id', orderId)
  if (guardStatus) q = q.eq('status', guardStatus)
  const { data } = await q.select('id')
  return !!data && data.length > 0
}

async function fail(
  supabase: SupabaseClient,
  orderId: string,
  code: string,
  detail: string
) {
  await supabase
    .from('orders')
    .update({ failure_code: code, failure_detail: detail.slice(0, 500), updated_at: nowIso() })
    .eq('id', orderId)
}

const serviceItems = (l: LoadedOrder) => l.items.filter(i => i.item_type === 'service')
const giftCardItems = (l: LoadedOrder) => l.items.filter(i => i.item_type === 'gift_card')
const tilopayPayment = (l: LoadedOrder) => l.payments.find(p => p.kind === 'tilopay')
const giftCardPayments = (l: LoadedOrder) => l.payments.filter(p => p.kind === 'gift_card')

export type PipelineOutcome =
  | { ok: true }
  | { ok: false; reason: 'slot_lost' | 'capture_failed' | 'posting_failed' | 'not_found' }

/**
 * Run everything that follows a successful authorization (or a full-gift-card
 * "payment"). Safe to re-run: every step is status/timestamp-guarded.
 * `origin` is the deployment origin for internal API calls (request.nextUrl.origin).
 */
export async function runPaidOrderPipeline(
  orderId: string,
  origin: string
): Promise<PipelineOutcome> {
  const supabase = ordersAdminClient()
  let loaded = await loadOrder(supabase, orderId)
  if (!loaded) return { ok: false, reason: 'not_found' }

  // ---- STEP 1: book appointments (before any money is captured) ----
  if (serviceItems(loaded).length > 0 && !loaded.order.booked_at) {
    const outcome = await bookOrderServices(supabase, loaded, origin)
    if (!outcome.ok) return outcome
    loaded = (await loadOrder(supabase, orderId))!
  }

  // ---- STEP 2: capture the card hold ----
  const tp = tilopayPayment(loaded)
  // Never capture a gift-card-only order: its charge was created with
  // capture:1 and is already captured. Two independent guards (no services,
  // or the payment row is already captured) so a replay can't double-capture.
  const needsCapture = !isImmediateCapture(loaded.items) && !!tp && tp.status === 'authorized'
  if (tp && needsCapture) {
    const cap = await captureTilopayPayment(loaded.order.order_number, tp.amount_cents)
    if (!cap.ok) {
      await supabase.from('order_payments')
        .update({ status: 'failed', updated_at: nowIso() }).eq('id', tp.id)
      await fail(supabase, orderId, 'capture_failed', JSON.stringify(cap.raw).slice(0, 400))
      // Booking exists but money didn't land — admin queue resolves (retry
      // capture or cancel the appointment). Do NOT auto-cancel a real slot.
      return { ok: false, reason: 'capture_failed' }
    }
    await supabase.from('order_payments')
      .update({ status: 'captured', updated_at: nowIso() }).eq('id', tp.id)
  }
  if (!loaded.order.captured_at) {
    await setOrder(supabase, orderId, { status: 'captured', captured_at: nowIso(), failure_code: null, failure_detail: null })
  }

  // ---- STEP 3: invoice, then post the sale carrying its CUFE ----
  //
  // Order matters. The preflight validates our totals against Mindbody's own
  // computation WITHOUT committing anything, so a mispriced order is caught
  // before a fiscal document exists. Only then do we emit the factura — and
  // the resulting CUFE + invoice number ride along in the Mindbody sale's
  // SalesNotes, so Mindbody ↔ efactura reconcile without leaving Mindbody.
  const preflight = await preflightServiceSale(supabase, orderId)
  let posted = preflight.ok

  if (preflight.ok) {
    // Invoicing never blocks the customer: on failure the order stays paid and
    // booked, and the efactura cron drains the queue (the sale still posts,
    // just without the CUFE in its note).
    try {
      const { emitInvoiceForOrder } = await import('@/lib/efactura/emit')
      const inv = await emitInvoiceForOrder(orderId, { supabase })
      if (!inv.ok) await fail(supabase, orderId, 'invoice_failed', inv.error)
    } catch (e) {
      await fail(supabase, orderId, 'invoice_failed', e instanceof Error ? e.message : 'unknown')
    }
    posted = await commitServiceSale(supabase, orderId)
  }

  // ---- STEP 4: hand gift-card items to the gc_orders engine ----
  const gc = await handoffGiftCardItems(supabase, orderId)

  if (!posted) return { ok: false, reason: 'posting_failed' }

  const final = (await loadOrder(supabase, orderId))!
  // Only claim "fulfilled" once every deliverable landed — a gift card that
  // failed to mint leaves the order outstanding for the cron and the admin queue.
  if (gc.allFulfilled &&
      (!final.order.booked_at || serviceItems(final).length === 0 || final.order.mindbody_sale_id)) {
    await setOrder(supabase, orderId, {
      status: 'fulfilled',
      fulfilled_at: final.order.status === 'fulfilled' ? undefined : nowIso(),
    })
  }
  return { ok: true }
}

async function bookOrderServices(
  supabase: SupabaseClient,
  loaded: LoadedOrder,
  origin: string
): Promise<PipelineOutcome> {
  const { order } = loaded
  const services = serviceItems(loaded)
  const first = services[0]
  const startDateTime = first.appointment_start
  if (!startDateTime || !order.mindbody_client_id) {
    await fail(supabase, order.id, 'posting_failed', 'order missing appointment_start or client id')
    return { ok: false, reason: 'posting_failed' }
  }

  // The book route owns slot races (retry ×3 with alternative therapists),
  // the bookings row, and the WATI confirmation — reuse it wholesale.
  const res = await fetch(`${origin}/api/mindbody/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clientId: Number(order.mindbody_client_id),
      locationId: order.location_id,
      services: services.map(s => ({
        sessionTypeId: s.mindbody_session_type_id,
        duration: s.duration_minutes ?? undefined,
        name: order.locale === 'en' && s.name_en ? s.name_en : s.name_es,
      })),
      staffId: first.staff_requested ? first.staff_id ?? undefined : undefined,
      staffRequested: !!first.staff_requested,
      // Panama local, no offset — same convention as the widget.
      startDateTime: (startDateTime.includes('+') || startDateTime.endsWith('Z'))
        ? new Date(startDateTime).toLocaleString('sv-SE', { timeZone: 'America/Panama' }).replace(' ', 'T')
        : startDateTime,
      notes: `Pagado en línea | Orden ${order.order_number}${order.promo_code ? ` | Código ${order.promo_code}` : ''}`,
      clientName: order.buyer_name,
      clientPhone: order.buyer_phone,
      totalDuration: services.reduce((s, x) => s + (x.duration_minutes ?? 0), 0) || undefined,
      subtotalBeforeTax: centsToDollars(order.total_cents - order.tax_cents),
      taxAmount: centsToDollars(order.tax_cents),
      totalWithTax: centsToDollars(order.total_cents),
    }),
  })
  const json = await res.json().catch(() => ({}))

  if (res.status === 409 && json?.timeUnavailable) {
    // Slot lost after retries → void the hold; nothing was ever charged.
    const tp = tilopayPayment(loaded)
    if (tp && tp.status === 'authorized') {
      const v = await voidTilopayPayment(order.order_number, tp.amount_cents)
      await supabase.from('order_payments')
        .update({ status: v.ok ? 'voided' : 'failed', updated_at: nowIso() }).eq('id', tp.id)
    }
    await setOrder(supabase, order.id, { status: 'cancelled', cancelled_at: nowIso() })
    await fail(supabase, order.id, 'slot_lost_voided', 'Slot no longer available after retries')
    return { ok: false, reason: 'slot_lost' }
  }
  if (!res.ok || !json?.success) {
    await fail(supabase, order.id, 'posting_failed', `book route ${res.status}: ${JSON.stringify(json).slice(0, 300)}`)
    return { ok: false, reason: 'posting_failed' }
  }

  const appointmentIds: number[] = (json.appointments ?? [])
    .map((a: { Id?: number }) => a?.Id)
    .filter((id: unknown): id is number => typeof id === 'number')
  // The book call chains all services consecutively under one visit — store
  // the full id list on the first service line.
  await supabase.from('order_items')
    .update({ mindbody_appointment_ids: appointmentIds })
    .eq('id', serviceItems(loaded)[0].id)
  await setOrder(supabase, order.id, {
    status: 'booked',
    booked_at: nowIso(),
    notes: [loaded.order.notes, `Reserva ${json.confirmationNumber}`].filter(Boolean).join(' | '),
  })
  return { ok: true }
}

interface ServiceCart {
  clientId: string
  locationId: number
  items: Array<{
    type: 'Service'
    metadataId: number
    quantity: number
    appointmentIds?: number[]
    discountAmount?: number
    salesNotes?: string
  }>
  payments: CheckoutPayment[]
  serviceTotalCents: number
}

/**
 * Build the Mindbody cart for an order's service lines. `invoiceNote` is
 * appended to the first line's SalesNotes so the fiscal reference lands on the
 * sale — Mindbody stores it and returns it as `Notes` on the purchased item.
 */
async function buildServiceCart(
  loaded: LoadedOrder,
  invoiceNote?: string
): Promise<ServiceCart | null> {
  const { order } = loaded
  const services = serviceItems(loaded)
  if (services.length === 0 || !order.mindbody_client_id) return null

  const serviceTotalCents = services.reduce((s, i) => s + i.total_cents, 0)
  const gcPays = giftCardPayments(loaded)
  const gcTenderCents = gcPays.reduce((s, p) => s + p.amount_cents, 0)
  const customCents = serviceTotalCents - gcTenderCents
  const tp = tilopayPayment(loaded)

  const appointmentIds = services.flatMap(s => s.mindbody_appointment_ids ?? [])
  const note = [
    `Orden ${order.order_number}`,
    invoiceNote,
    tp?.tilopay_tpt ? `Tilopay ${tp.tilopay_tpt}` : null,
  ].filter(Boolean).join(' | ').slice(0, 500)

  const items = services.map((s, idx) => ({
    type: 'Service' as const,
    metadataId: s.mindbody_pricing_option_id!,
    quantity: s.quantity,
    // All appointments settle on the first line (booked as one chain).
    appointmentIds: idx === 0 ? appointmentIds : undefined,
    discountAmount: s.discount_cents ? centsToDollars(s.discount_cents) : undefined,
    salesNotes: idx === 0 ? note : undefined,
  }))
  if (items.some(i => !i.metadataId)) return null

  const payments: CheckoutPayment[] = []
  for (const p of gcPays) {
    if (p.gc_barcode && p.amount_cents > 0) {
      payments.push({ type: 'GiftCard', cardNumber: p.gc_barcode, amount: centsToDollars(p.amount_cents) })
    }
  }
  if (customCents > 0) {
    const { paymentInfo } = await resolvePaymentInfo(tp?.tilopay_method ?? null, customCents)
    payments.push({
      type: 'Custom',
      customPaymentMethodId: paymentInfo.Metadata!.Id as number,
      amount: centsToDollars(customCents),
    })
  }

  return { clientId: order.mindbody_client_id, locationId: order.location_id, items, payments, serviceTotalCents }
}

/**
 * Validate the cart against Mindbody's own totals WITHOUT committing (Test:true).
 * Runs before invoicing so a price/tax mismatch never produces a fiscal
 * document for a sale we can't post.
 */
async function preflightServiceSale(
  supabase: SupabaseClient,
  orderId: string
): Promise<{ ok: boolean }> {
  const loaded = (await loadOrder(supabase, orderId))!
  const { order } = loaded
  if (serviceItems(loaded).length === 0 || order.mindbody_sale_id) return { ok: true }

  try {
    const cart = await buildServiceCart(loaded)
    if (!cart) {
      await fail(supabase, orderId, 'posting_failed', 'missing pricing option or client id on a service line')
      return { ok: false }
    }
    const preflight = await checkoutShoppingCart({
      clientId: cart.clientId,
      locationId: cart.locationId,
      items: cart.items,
      payments: cart.payments,
      test: true,
    })
    const grandCents = Math.round((preflight.GrandTotal ?? 0) * 100)
    if (grandCents !== cart.serviceTotalCents) {
      await setOrder(supabase, orderId, { mindbody_grand_total_cents: grandCents })
      await fail(supabase, orderId, 'posting_failed',
        `total mismatch: Mindbody ${grandCents}¢ vs order ${cart.serviceTotalCents}¢ — check prices/discounts`)
      return { ok: false }
    }
    await setOrder(supabase, orderId, { mindbody_grand_total_cents: grandCents })
    return { ok: true }
  } catch (e) {
    await fail(supabase, orderId, 'posting_failed', e instanceof Error ? e.message : 'unknown')
    return { ok: false }
  }
}

/** Commit the service sale, carrying the invoice reference in SalesNotes. */
async function commitServiceSale(
  supabase: SupabaseClient,
  orderId: string
): Promise<boolean> {
  const loaded = (await loadOrder(supabase, orderId))!
  const { order } = loaded
  if (serviceItems(loaded).length === 0 || order.mindbody_sale_id) return true

  try {
    // Verify-on-timeout: if a previous attempt died mid-flight, look for a
    // committed sale before trying again (checkout has no dedup).
    if (order.posting_attempts > 0 && order.captured_at) {
      const serviceTotalCents = serviceItems(loaded).reduce((s, i) => s + i.total_cents, 0)
      const sales = await getRecentSales({ startSaleDateTime: order.captured_at.slice(0, 10) })
      const match = sales.find(s =>
        String(s.ClientId ?? '') === String(order.mindbody_client_id ?? '') &&
        Math.round(((s.Payments ?? []).reduce((sum, p) => sum + (p.Amount ?? 0), 0)) * 100) === serviceTotalCents
      )
      if (match) {
        await setOrder(supabase, orderId, {
          status: 'posted', posted_at: nowIso(), mindbody_sale_id: match.Id,
          failure_code: null, failure_detail: null,
        })
        return true
      }
    }

    await supabase.from('orders')
      .update({ posting_attempts: order.posting_attempts + 1, updated_at: nowIso() })
      .eq('id', orderId)

    // Fiscal reference for the accountant: readable back as PurchasedItems[].Notes.
    const { data: inv } = await supabase
      .from('electronic_invoices')
      .select('numero_documento, cufe')
      .eq('order_id', orderId)
      .eq('status', 'authorized')
      .eq('doc_type', '01')
      .maybeSingle()
    const invoiceNote = inv?.cufe
      ? `Factura ${inv.numero_documento ?? ''} | CUFE ${inv.cufe}`.replace(/\s+\|/, ' |')
      : undefined

    const cart = await buildServiceCart(loaded, invoiceNote)
    if (!cart) {
      await fail(supabase, orderId, 'posting_failed', 'missing pricing option or client id on a service line')
      return false
    }

    const result = await checkoutShoppingCart({
      clientId: cart.clientId,
      locationId: cart.locationId,
      items: cart.items,
      payments: cart.payments,
      test: false,
    })
    await setOrder(supabase, orderId, {
      status: 'posted',
      posted_at: nowIso(),
      mindbody_sale_id: result.SaleId ?? null,
      failure_code: null,
      failure_detail: null,
    })
    for (const p of giftCardPayments(loaded)) {
      await supabase.from('order_payments')
        .update({ status: 'redeemed', updated_at: nowIso() }).eq('id', p.id)
    }
    return true
  } catch (e) {
    await fail(supabase, orderId, 'posting_failed', e instanceof Error ? e.message : 'unknown')
    return false
  }
}

/**
 * One gc_orders row per gift-card item, marked paid, then the existing engine
 * fulfills it (serial, Mindbody registration, delivery, bonus). Idempotent via
 * the derived order_number `MO-xxx-G<n>`.
 */
async function handoffGiftCardItems(
  supabase: SupabaseClient,
  orderId: string
): Promise<{ allFulfilled: boolean }> {
  const loaded = (await loadOrder(supabase, orderId))!
  const gcs = giftCardItems(loaded)
  if (gcs.length === 0) return { allFulfilled: true }
  const { order } = loaded
  const tp = tilopayPayment(loaded)
  const hasServices = serviceItems(loaded).length > 0
  let allFulfilled = true

  // Catalogue rows once (kind + treatment names for the child row).
  const catalogIds = [...new Set(gcs.map(g => g.gc_catalog_item_id).filter((x): x is string => !!x))]
  const catalog = new Map<string, { id: string; kind: 'monetary' | 'experience'; treatment_names: string[] | null }>()
  if (catalogIds.length > 0) {
    const { data: rows, error: catErr } = await supabase
      .from('gc_catalog_items').select('id, kind, treatment_names').in('id', catalogIds)
    if (catErr) {
      // Transient error != missing row: minting now would send an experience
      // card as monetary, irreversibly. Leave un-fulfilled; the cron retries.
      await fail(supabase, orderId, 'posting_failed', `gift card catalogue lookup failed: ${catErr.message}`)
      return { allFulfilled: false }
    }
    for (const r of rows ?? []) catalog.set(r.id, r)
  }

  for (let n = 0; n < gcs.length; n++) {
    const item = gcs[n]
    const childNumber = `${order.order_number}-G${n + 1}`
    const { data: existing } = await supabase
      .from('gc_orders').select('id, status').eq('order_number', childNumber).maybeSingle()
    let childId = existing?.id as string | undefined

    if (!childId) {
      const cat = item.gc_catalog_item_id ? catalog.get(item.gc_catalog_item_id) : undefined
      if (!cat) console.error('handoff: catalog row missing', item.gc_catalog_item_id)
      const row = giftCardChildRow({
        orderNumber: order.order_number,
        index: n,
        order: {
          buyer_name: order.buyer_name,
          buyer_email: order.buyer_email ?? '',
          buyer_phone: order.buyer_phone,
          locale: order.locale,
          location_id: order.location_id,
          hasServices,
        },
        item: {
          gc_catalog_item_id: item.gc_catalog_item_id ?? '',
          name_es: item.name_es,
          total_cents: item.total_cents,
          tax_cents: item.tax_cents,
          gc_recipient_name: item.gc_recipient_name,
          gc_recipient_email: item.gc_recipient_email,
          gc_recipient_phone: item.gc_recipient_phone ?? null,
          gc_delivery_method: item.gc_delivery_method ?? null,
          gc_message: item.gc_message,
          gc_delivery_date: item.gc_delivery_date,
          gc_design_slug: item.gc_design_slug ?? null,
          gc_face_value_cents: item.gc_face_value_cents ?? null,
        },
        catalog: cat ? { kind: cat.kind, treatment_names: cat.treatment_names } : undefined,
        payment: { tilopay_tpt: tp?.tilopay_tpt ?? null, tilopay_method: tp?.tilopay_method ?? null },
        nowIso: order.captured_at ?? nowIso(),
      })
      const { data: inserted, error } = await supabase
        .from('gc_orders')
        .insert(row)
        .select('id')
        .single()
      if (error || !inserted) {
        await fail(supabase, orderId, 'posting_failed', `gc child insert failed: ${error?.message}`)
        allFulfilled = false
        continue
      }
      childId = inserted.id
    }

    if (existing?.status !== 'fulfilled') {
      try {
        await fulfillOrder(childId!)
      } catch (e) {
        // Non-fatal for the customer: the giftcard-orders cron retries
        // paid-but-unfulfilled rows. The order stays un-fulfilled so the
        // admin queue still shows it as outstanding.
        allFulfilled = false
        await fail(supabase, orderId, 'posting_failed',
          `gift card ${childNumber}: ${e instanceof Error ? e.message : 'unknown'}`)
        console.error(`gc child ${childNumber} fulfillment failed (cron retries):`, e)
      }
    }
  }
  return { allFulfilled }
}

/** Pre-payment gift-card tender check: live balances, cap at requested amounts. */
export async function verifyGiftCardTenders(
  redemptions: Array<{ barcode: string; amountCents: number }>
): Promise<{ ok: true } | { ok: false; barcode: string; balanceCents: number }> {
  for (const r of redemptions) {
    const bal = await getGiftCardBalance(r.barcode)
    const balanceCents = Math.round((bal?.RemainingBalance ?? 0) * 100)
    if (balanceCents < r.amountCents) {
      return { ok: false, barcode: r.barcode, balanceCents }
    }
  }
  return { ok: true }
}

export { tenderNameFor }
