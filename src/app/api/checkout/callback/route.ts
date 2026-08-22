import { NextRequest, NextResponse } from 'next/server'
import { verifyTilopayHash } from '@/lib/payments/tilopay'
import { SITE_URL } from '@/lib/nav'
import { signOrderNumber as sig } from '@/lib/giftshop/sign'
import { loadOrder, ordersAdminClient, runPaidOrderPipeline } from '@/lib/orders/pipeline'

/**
 * GET /api/checkout/callback — Tilopay redirect for unified orders.
 * The Tilopay charge is an AUTHORIZATION ONLY (capture:0): this route claims
 * the order, books the appointment, captures on success or voids on slot
 * loss, then posts to Mindbody. Hash-verified and idempotent — refreshes and
 * duplicate hits are safe (status-guarded claim, pipeline steps re-entrant).
 */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams
  const supabase = ordersAdminClient()

  let orderId: string | null = null
  const returnData = q.get('returnData')
  if (returnData) {
    try {
      orderId = Buffer.from(returnData, 'base64url').toString('utf8')
    } catch {
      orderId = null
    }
  }
  let loaded = orderId ? await loadOrder(supabase, orderId) : null
  if (!loaded && q.get('order')) {
    const { data } = await supabase
      .from('orders').select('id').eq('order_number', q.get('order')).single()
    loaded = data ? await loadOrder(supabase, data.id) : null
  }
  if (!loaded) {
    return NextResponse.redirect(`${SITE_URL}/es/checkout/error?reason=notfound`, 303)
  }

  const { order } = loaded
  const locale = order.locale === 'en' ? 'en' : 'es'
  const errorUrl = (reason: string) =>
    `${SITE_URL}/${locale}/checkout/error?o=${order.order_number}&reason=${reason}`
  const graciasUrl =
    `${SITE_URL}/${locale}/checkout/gracias?o=${order.order_number}&k=${sig(order.order_number)}`

  // Already resolved (refresh / duplicate) → show the outcome.
  if (['captured', 'posted', 'invoiced', 'fulfilled', 'booked'].includes(order.status)) {
    return NextResponse.redirect(graciasUrl, 303)
  }
  if (order.status === 'cancelled') {
    return NextResponse.redirect(errorUrl(order.failure_code === 'slot_lost_voided' ? 'slot' : 'declined'), 303)
  }

  const tp = loaded.payments.find(p => p.kind === 'tilopay')
  if (!tp) {
    return NextResponse.redirect(errorUrl('invalid'), 303)
  }

  const valid = verifyTilopayHash({
    code: q.get('code'),
    description: q.get('description'),
    auth: q.get('auth'),
    order: q.get('order'),
    tpt: q.get('tpt'),
    crd: q.get('crd'),
    OrderHash: q.get('OrderHash'),
    orderNumber: order.order_number,
    amountCents: tp.amount_cents,
    buyerEmail: order.buyer_email ?? '',
  })
  if (!valid) {
    console.error('Checkout callback hash mismatch for', order.order_number)
    return NextResponse.redirect(errorUrl('invalid'), 303)
  }

  const approved = q.get('code') === '1'

  if (!approved) {
    await supabase.from('order_payments')
      .update({ status: 'failed', updated_at: new Date().toISOString() })
      .eq('id', tp.id).eq('status', 'pending')
    await supabase.from('orders')
      .update({
        failure_code: 'auth_declined',
        failure_detail: (q.get('description') ?? 'declined').slice(0, 300),
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id).eq('status', 'totals_verified')
    return NextResponse.redirect(errorUrl('declined'), 303)
  }

  // Idempotent claim: only one request flips totals_verified → authorized.
  const { data: claimed } = await supabase
    .from('orders')
    .update({ status: 'authorized', authorized_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', order.id)
    .eq('status', 'totals_verified')
    .select('id')

  if (claimed && claimed.length > 0) {
    await supabase.from('order_payments')
      .update({
        status: 'authorized',
        tilopay_tpt: q.get('tpt'),
        tilopay_method: [
          q.get('selected_method') ?? '',
          q.get('crd') ?? '',
          q.get('brand') ?? q.get('card_type') ?? '',
        ].join('|').slice(0, 160) || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', tp.id)
    await supabase.from('order_payments')
      .update({ status: 'authorized', updated_at: new Date().toISOString() })
      .eq('order_id', order.id).eq('kind', 'gift_card').eq('status', 'pending')

    const outcome = await runPaidOrderPipeline(order.id, request.nextUrl.origin)
    if (!outcome.ok) {
      if (outcome.reason === 'slot_lost') return NextResponse.redirect(errorUrl('slot'), 303)
      if (outcome.reason === 'capture_failed') return NextResponse.redirect(errorUrl('pending'), 303)
      // posting_failed: customer is booked + charged — their side is fine;
      // the cron + admin queue finish the Mindbody posting.
    }
  }

  return NextResponse.redirect(graciasUrl, 303)
}
