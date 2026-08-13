import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { getActiveCatalog, getShopSettings, giftshopAdminClient, itbmsCentsFor } from '@/lib/giftshop/data'
import { createTilopayPayment, isTilopayConfigured } from '@/lib/payments/tilopay'
import { checkRateLimit, getClientIdentifier, RATE_LIMIT_AUTH } from '@/lib/booking/rate-limit'
import { SITE_URL } from '@/lib/nav'

function orderNumber(): string {
  const d = new Date()
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  const rand = crypto.randomBytes(3).toString('hex').toUpperCase()
  return `GC${ymd}-${rand}`
}

// POST /api/giftcards/checkout — create a pending order + Tilopay hosted URL.
// Returns 503 until Tilopay credentials exist and the shop is enabled.
export async function POST(request: NextRequest) {
  const rl = checkRateLimit(`gcshop:${getClientIdentifier(request)}`, RATE_LIMIT_AUTH)
  if (!rl.success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  const settings = await getShopSettings()
  if (!settings.shop_enabled || !isTilopayConfigured()) {
    return NextResponse.json(
      { error: 'La tienda no está disponible todavía.' },
      { status: 503 }
    )
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  // Honeypot
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true })
  }

  const catalog = await getActiveCatalog()
  const item = catalog.find((i) => i.id === body.itemId)
  if (!item) return NextResponse.json({ error: 'Artículo no disponible' }, { status: 400 })

  const buyerEmail = String(body.buyerEmail || '').trim().toLowerCase()
  const buyerName = String(body.buyerName || '').trim().slice(0, 120)
  const recipientName = String(body.recipientName || '').trim().slice(0, 120)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail)) {
    return NextResponse.json({ error: 'Correo del comprador inválido' }, { status: 400 })
  }
  if (!buyerName || !recipientName) {
    return NextResponse.json({ error: 'Nombre del comprador y destinatario son requeridos' }, { status: 400 })
  }
  const recipientEmail = body.recipientEmail
    ? String(body.recipientEmail).trim().toLowerCase().slice(0, 160)
    : null
  if (recipientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
    return NextResponse.json({ error: 'Correo del destinatario inválido' }, { status: 400 })
  }

  const supabase = giftshopAdminClient()

  // Abuse guard: ≤5 pending orders per buyer in 10 minutes.
  const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()
  const { count } = await supabase
    .from('gc_orders')
    .select('id', { count: 'exact', head: true })
    .eq('buyer_email', buyerEmail)
    .eq('status', 'pending')
    .gte('created_at', tenMinAgo)
  if ((count ?? 0) >= 5) {
    return NextResponse.json({ error: 'Demasiados intentos. Intenta más tarde.' }, { status: 429 })
  }

  const itbms = itbmsCentsFor(item)
  const total = item.amount_cents + itbms
  const locale = body.locale === 'en' ? 'en' : 'es'
  let scheduled: string | null = null
  if (typeof body.scheduledDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.scheduledDate)) {
    // 09:00 America/Panama (UTC-5, no DST) = 14:00 UTC
    const dt = new Date(`${body.scheduledDate}T14:00:00.000Z`)
    if (dt > new Date()) scheduled = dt.toISOString()
  }

  const { data: order, error } = await supabase
    .from('gc_orders')
    .insert({
      order_number: orderNumber(),
      status: 'pending',
      catalog_item_id: item.id,
      item_kind: item.kind,
      item_name: locale === 'en' ? item.name_en : item.name_es,
      base_amount_cents: item.amount_cents,
      itbms_cents: itbms,
      total_cents: total,
      buyer_name: buyerName,
      buyer_email: buyerEmail,
      buyer_phone: body.buyerPhone ? String(body.buyerPhone).slice(0, 24) : null,
      buyer_country: body.buyerCountry ? String(body.buyerCountry).slice(0, 2).toUpperCase() : 'PA',
      recipient_name: recipientName,
      recipient_email: recipientEmail,
      recipient_phone: body.recipientPhone ? String(body.recipientPhone).slice(0, 24) : null,
      gift_message: body.message ? String(body.message).slice(0, 300) : null,
      delivery_email: recipientEmail != null,
      delivery_whatsapp: !!body.recipientPhone,
      scheduled_send_at: scheduled,
      design_slug: typeof body.design === 'string' ? body.design.slice(0, 40) : 'general',
      locale,
    })
    .select('id, order_number')
    .single()

  if (error || !order) {
    console.error('gc_orders insert failed:', error)
    return NextResponse.json({ error: 'Error al crear el pedido' }, { status: 500 })
  }

  try {
    const url = await createTilopayPayment({
      orderNumber: order.order_number,
      amountCents: total,
      redirectUrl: `${SITE_URL}/api/giftcards/checkout/callback`,
      buyerName,
      buyerEmail,
      buyerPhone: body.buyerPhone ? String(body.buyerPhone) : undefined,
      buyerCountry: body.buyerCountry ? String(body.buyerCountry) : 'PA',
      returnData: Buffer.from(order.id).toString('base64url'),
    })
    return NextResponse.json({ url })
  } catch (e) {
    console.error('Tilopay payment creation failed:', e)
    await supabase
      .from('gc_orders')
      .update({ status: 'payment_failed', tilopay_description: 'processPayment failed' })
      .eq('id', order.id)
    return NextResponse.json(
      { error: 'No pudimos iniciar el pago. Intenta de nuevo.' },
      { status: 502 }
    )
  }
}
