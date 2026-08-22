import { NextRequest, NextResponse } from 'next/server'
import { createTilopayPayment, isTilopayConfigured } from '@/lib/payments/tilopay'
import { checkRateLimit, getClientIdentifier, RATE_LIMIT_AUTH } from '@/lib/booking/rate-limit'
import { getGiftCardBalance, getPricingOptionForSessionType } from '@/lib/booking/mindbody'
import { SITE_URL } from '@/lib/nav'
import { ordersAdminClient, runPaidOrderPipeline } from '@/lib/orders/pipeline'
import { computeOrderTotals } from '@/lib/orders/totals'
import { validatePromoCode } from '@/lib/orders/promo'
import type { OrderItemInput } from '@/lib/orders/types'
import { signOrderNumber } from '@/lib/giftshop/sign'

/**
 * POST /api/checkout — create a unified order (services + gift cards) and
 * start the prepay flow. Never trusts client prices: services are re-priced
 * from Mindbody, gift cards from gc_catalog_items. Returns either
 * { url } (Tilopay hosted checkout for the card portion) or
 * { paid: true, redirect } (gift cards covered everything).
 *
 * "Paga en el spa" bookings never hit this route — they keep using
 * POST /api/mindbody/book directly.
 */

interface SessionInput {
  services: Array<{ sessionTypeId: number; isAddon?: boolean }>
  staffId?: number
  staffRequested?: boolean
  startDateTime: string
}

interface GiftCardInput {
  catalogItemId: string
  recipientName?: string
  recipientEmail?: string
  message?: string
  deliveryDate?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  const rl = checkRateLimit(`checkout:${getClientIdentifier(request)}`, RATE_LIMIT_AUTH)
  if (!rl.success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true }) // honeypot
  }

  const supabase = ordersAdminClient()
  const { data: settings } = await supabase
    .from('checkout_settings').select('*').eq('id', 1).single()
  if (!settings?.checkout_enabled) {
    return NextResponse.json({ error: 'El pago en línea no está disponible todavía.' }, { status: 503 })
  }

  const locale = body.locale === 'en' ? 'en' : 'es'
  const session = (body.session ?? null) as SessionInput | null
  const giftCards = Array.isArray(body.giftCards) ? (body.giftCards as GiftCardInput[]) : []

  // A bag with a service belongs to the spa delivering it. A gift-card-only
  // order has no physical location, so it takes the gift shop's configured
  // sales location — the same one purchaseGiftCard posts to, keeping our
  // order record and the Mindbody sale on the same branch.
  const { data: gcSettings } = await supabase
    .from('gc_shop_settings')
    .select('default_mindbody_location_id')
    .eq('id', 1)
    .maybeSingle()
  const locationId = session
    ? Number(body.locationId) || 1
    : gcSettings?.default_mindbody_location_id ?? 1
  const redemptions = Array.isArray(body.redemptions)
    ? (body.redemptions as Array<{ barcode: string }>).map(r => String(r.barcode).trim()).filter(Boolean).slice(0, 3)
    : []

  const buyerName = String(body.buyerName || '').trim().slice(0, 120)
  const buyerEmail = String(body.buyerEmail || '').trim().toLowerCase().slice(0, 160)
  const buyerPhone = body.buyerPhone ? String(body.buyerPhone).replace(/\D/g, '').slice(0, 20) : null
  if (!buyerName || !EMAIL_RE.test(buyerEmail)) {
    return NextResponse.json({ error: 'Nombre y correo válidos son requeridos' }, { status: 400 })
  }

  const hasServices = !!session && session.services?.length > 0
  if (!hasServices && giftCards.length === 0) {
    return NextResponse.json({ error: 'La bolsa está vacía' }, { status: 400 })
  }

  // Services require a verified Mindbody client (same rule as the widget).
  const clientId = body.clientId ? Number(body.clientId) : null
  if (hasServices && (!clientId || !Number.isInteger(clientId) || clientId <= 0)) {
    return NextResponse.json({ error: 'Se requiere iniciar sesión para reservar servicios' }, { status: 401 })
  }

  // ---- Server-side re-pricing ----
  const items: Array<OrderItemInput & { programId?: number }> = []

  if (hasServices) {
    const svcRes = await fetch(
      `${request.nextUrl.origin}/api/mindbody/services?locationId=${locationId}&type=all`,
      { headers: { 'x-internal-staff-resolution': '1' } }
    )
    const svcJson = await svcRes.json().catch(() => ({}))
    const catalog: Array<{ Id: number; Name: string; Price: number; ProgramId?: number; Duration?: number }> =
      svcJson.services ?? svcJson.Services ?? []
    for (const s of session!.services) {
      const match = catalog.find(c => c.Id === Number(s.sessionTypeId))
      // The widget feed strips included ITBMS for display — the pricing
      // option carries the RAW inclusive price checkout must charge, plus
      // the id the posting job needs to settle the appointment.
      const pricing = await getPricingOptionForSessionType(Number(s.sessionTypeId), locationId)
      if (!match || !pricing) {
        return NextResponse.json(
          { error: 'Un servicio de tu bolsa ya no está disponible. Actualiza la página.' },
          { status: 409 }
        )
      }
      items.push({
        itemType: 'service',
        quantity: 1,
        nameEs: match.Name,
        nameEn: match.Name,
        unitPriceCents: pricing.priceCents, // tax-inclusive, exact
        taxRateCode: '01',
        mindbodySessionTypeId: match.Id,
        mindbodyPricingOptionId: pricing.pricingOptionId,
        staffId: session!.staffId,
        staffRequested: !!session!.staffRequested,
        appointmentStart: session!.startDateTime,
        durationMinutes: match.Duration,
        isAddon: !!s.isAddon,
        programId: match.ProgramId,
      })
    }
  }

  if (giftCards.length > 0) {
    const ids = [...new Set(giftCards.map(g => g.catalogItemId))]
    const { data: rows } = await supabase
      .from('gc_catalog_items').select('*').in('id', ids).eq('is_active', true)
    for (const g of giftCards) {
      const row = rows?.find(r => r.id === g.catalogItemId)
      if (!row) {
        return NextResponse.json({ error: 'Gift card no disponible' }, { status: 409 })
      }
      const recipientEmail = g.recipientEmail?.trim().toLowerCase() || undefined
      if (recipientEmail && !EMAIL_RE.test(recipientEmail)) {
        return NextResponse.json({ error: 'Correo del destinatario inválido' }, { status: 400 })
      }
      const isExperience = row.kind === 'experience'
      const itbms = isExperience ? Math.round(row.amount_cents * 0.07) : 0
      items.push({
        itemType: 'gift_card',
        quantity: 1,
        nameEs: row.name_es,
        nameEn: row.name_en,
        // monetary cards: no ITBMS at sale (liability, FEP '00');
        // experiences: taxed like the underlying service.
        unitPriceCents: row.amount_cents + itbms,
        taxRateCode: isExperience ? '01' : '00',
        gcCatalogItemId: row.id,
        gcRecipientName: g.recipientName?.trim().slice(0, 120),
        gcRecipientEmail: recipientEmail,
        gcMessage: g.message?.trim().slice(0, 300),
        gcDeliveryDate: /^\d{4}-\d{2}-\d{2}$/.test(g.deliveryDate ?? '') ? g.deliveryDate : undefined,
      })
    }
  }

  // ---- Discounts: promo code wins over the site-wide online discount ----
  let discountByLine: number[] | undefined
  let promoId: string | null = null
  let promoCode: string | null = null
  const customerKey = clientId ? String(clientId) : buyerEmail

  if (typeof body.promoCode === 'string' && body.promoCode.trim()) {
    const promo = await validatePromoCode(supabase, { code: body.promoCode, items, customerKey })
    if (!promo.ok) {
      return NextResponse.json({ error: 'Código inválido', promoRejection: promo.rejection }, { status: 422 })
    }
    discountByLine = promo.discountByLineCents
    promoId = promo.promo!.id
    promoCode = promo.promo!.code
  } else if (hasServices) {
    const { data: site } = await supabase
      .from('site_settings').select('online_discount_active, online_discount_percent').limit(1).maybeSingle()
    const pct = site?.online_discount_active ? Number(site.online_discount_percent) || 0 : 0
    if (pct > 0) {
      discountByLine = items.map(it =>
        it.itemType === 'service' ? Math.round((it.unitPriceCents * it.quantity * pct) / 100) : 0
      )
    }
  }

  const totals = computeOrderTotals(items, discountByLine)

  // ---- Gift-card redemptions pay for SERVICES only (never for new cards) ----
  const serviceTotalCents = totals.lines
    .filter(l => l.itemType === 'service')
    .reduce((s, l) => s + l.totalCents, 0)
  const gcPayments: Array<{ barcode: string; amountCents: number; balanceCents: number }> = []
  let remainingForGc = serviceTotalCents
  for (const barcode of redemptions) {
    if (remainingForGc <= 0) break
    const bal = await getGiftCardBalance(barcode)
    const balanceCents = Math.round((bal?.RemainingBalance ?? 0) * 100)
    if (balanceCents <= 0) {
      return NextResponse.json({ error: `La gift card ${barcode} no tiene saldo disponible.` }, { status: 422 })
    }
    const applied = Math.min(balanceCents, remainingForGc)
    gcPayments.push({ barcode, amountCents: applied, balanceCents })
    remainingForGc -= applied
  }
  const gcTenderCents = gcPayments.reduce((s, p) => s + p.amountCents, 0)
  const cardCents = totals.totalCents - gcTenderCents

  if (cardCents > 0 && !isTilopayConfigured()) {
    return NextResponse.json({ error: 'El pago con tarjeta no está disponible todavía.' }, { status: 503 })
  }

  // ---- Persist the order ----
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      status: 'totals_verified',
      totals_verified_at: new Date().toISOString(),
      mindbody_client_id: clientId ? String(clientId) : null,
      buyer_name: buyerName,
      buyer_email: buyerEmail,
      buyer_phone: buyerPhone,
      locale,
      marketing_opt_in: !!body.marketingOptIn,
      location_id: locationId,
      subtotal_cents: totals.subtotalCents,
      discount_cents: totals.discountCents,
      tax_cents: totals.taxCents,
      total_cents: totals.totalCents,
      promo_code_id: promoId,
      promo_code: promoCode,
    })
    .select('id, order_number')
    .single()
  if (orderErr || !order) {
    console.error('orders insert failed:', orderErr)
    return NextResponse.json({ error: 'Error al crear el pedido' }, { status: 500 })
  }

  const itemRows = totals.lines.map((l, i) => ({
    order_id: order.id,
    item_type: l.itemType,
    quantity: l.quantity,
    name_es: l.nameEs,
    name_en: l.nameEn ?? null,
    unit_price_cents: l.unitPriceCents,
    discount_cents: l.discountCents,
    tax_rate_code: l.taxRateCode,
    tax_cents: l.taxCents,
    total_cents: l.totalCents,
    mindbody_session_type_id: l.mindbodySessionTypeId ?? null,
    mindbody_pricing_option_id: l.mindbodyPricingOptionId ?? null,
    staff_id: l.staffId ?? null,
    staff_requested: !!l.staffRequested,
    appointment_start: l.appointmentStart
      ? (/[Z]$|[+-]\d{2}:\d{2}$/.test(l.appointmentStart) ? l.appointmentStart : `${l.appointmentStart}-05:00`)
      : null,
    duration_minutes: l.durationMinutes ?? null,
    is_addon: !!l.isAddon,
    gc_catalog_item_id: l.gcCatalogItemId ?? null,
    gc_recipient_name: l.gcRecipientName ?? null,
    gc_recipient_email: l.gcRecipientEmail ?? null,
    gc_message: l.gcMessage ?? null,
    gc_delivery_date: l.gcDeliveryDate ?? null,
    sort_order: i,
  }))
  const { error: itemsErr } = await supabase.from('order_items').insert(itemRows)
  if (itemsErr) {
    console.error('order_items insert failed:', itemsErr)
    return NextResponse.json({ error: 'Error al crear el pedido' }, { status: 500 })
  }

  const paymentRows: Array<Record<string, unknown>> = gcPayments.map(p => ({
    order_id: order.id,
    kind: 'gift_card',
    amount_cents: p.amountCents,
    status: 'pending',
    gc_barcode: p.barcode,
    gc_balance_before_cents: p.balanceCents,
  }))
  if (cardCents > 0) {
    paymentRows.push({ order_id: order.id, kind: 'tilopay', amount_cents: cardCents, status: 'pending' })
  }
  if (paymentRows.length > 0) {
    const { error: payErr } = await supabase.from('order_payments').insert(paymentRows)
    if (payErr) {
      console.error('order_payments insert failed:', payErr)
      return NextResponse.json({ error: 'Error al crear el pedido' }, { status: 500 })
    }
  }

  const graciasUrl = `${SITE_URL}/${locale}/checkout/gracias?o=${order.order_number}&k=${signOrderNumber(order.order_number)}`

  // ---- Full gift-card cover: no gateway, run the pipeline right now ----
  if (cardCents <= 0) {
    await supabase.from('orders')
      .update({ status: 'authorized', authorized_at: new Date().toISOString() })
      .eq('id', order.id).eq('status', 'totals_verified')
    await supabase.from('order_payments')
      .update({ status: 'authorized' }).eq('order_id', order.id).eq('kind', 'gift_card')
    const outcome = await runPaidOrderPipeline(order.id, request.nextUrl.origin)
    if (!outcome.ok && outcome.reason === 'slot_lost') {
      return NextResponse.json(
        { error: 'Ese horario ya no está disponible. Elige otro horario.', timeUnavailable: true },
        { status: 409 }
      )
    }
    return NextResponse.json({ paid: true, redirect: graciasUrl, orderNumber: order.order_number })
  }

  // ---- Card portion: Tilopay AUTHORIZE ONLY (capture happens post-booking) ----
  try {
    const url = await createTilopayPayment({
      orderNumber: order.order_number,
      amountCents: cardCents,
      capture: 0,
      redirectUrl: `${SITE_URL}/api/checkout/callback`,
      buyerName,
      buyerEmail,
      buyerPhone: buyerPhone ?? undefined,
      returnData: Buffer.from(order.id).toString('base64url'),
    })
    return NextResponse.json({ url, orderNumber: order.order_number })
  } catch (e) {
    console.error('Tilopay authorization creation failed:', e)
    await supabase.from('orders')
      .update({ failure_code: 'auth_declined', failure_detail: 'processPayment failed' })
      .eq('id', order.id)
    return NextResponse.json({ error: 'No pudimos iniciar el pago. Intenta de nuevo.' }, { status: 502 })
  }
}
