import { NextRequest, NextResponse } from 'next/server'
import { giftshopAdminClient } from '@/lib/giftshop/data'
import { verifyTilopayHash } from '@/lib/payments/tilopay'
import { fulfillOrder } from '@/lib/giftshop/fulfillment'
import { SITE_URL } from '@/lib/nav'
import { signOrderNumber as sig } from '@/lib/giftshop/sign'

// GET /api/giftcards/checkout/callback — Tilopay browser redirect.
// Hash-verified, idempotent: refreshes and double-hits are safe.
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams
  const supabase = giftshopAdminClient()

  // Locate the order (returnData carries our order id; `order` carries order_number).
  let orderRow: { id: string; order_number: string; status: string; total_cents: number; buyer_email: string; locale: string } | null = null
  const returnData = q.get('returnData')
  if (returnData) {
    try {
      const id = Buffer.from(returnData, 'base64url').toString('utf8')
      const { data } = await supabase
        .from('gc_orders')
        .select('id, order_number, status, total_cents, buyer_email, locale')
        .eq('id', id)
        .single()
      orderRow = data
    } catch {
      orderRow = null
    }
  }
  if (!orderRow && q.get('order')) {
    const { data } = await supabase
      .from('gc_orders')
      .select('id, order_number, status, total_cents, buyer_email, locale')
      .eq('order_number', q.get('order'))
      .single()
    orderRow = data
  }
  if (!orderRow) {
    return NextResponse.redirect(`${SITE_URL}/es/giftcards/error?reason=notfound`, 303)
  }

  const locale = orderRow.locale === 'en' ? 'en' : 'es'
  const errorUrl = (reason: string) =>
    `${SITE_URL}/${locale}/giftcards/error?o=${orderRow!.order_number}&reason=${reason}`
  const graciasUrl = `${SITE_URL}/${locale}/giftcards/gracias?o=${orderRow.order_number}&k=${sig(orderRow.order_number)}`

  // Already resolved (refresh / duplicate hit) → just show the outcome.
  if (orderRow.status === 'paid' || orderRow.status === 'fulfilled') {
    return NextResponse.redirect(graciasUrl, 303)
  }
  if (orderRow.status === 'refunded') {
    return NextResponse.redirect(errorUrl('refunded'), 303)
  }

  // Validate the OrderHash before trusting anything.
  const valid = verifyTilopayHash({
    code: q.get('code'),
    description: q.get('description'),
    auth: q.get('auth'),
    order: q.get('order'),
    tpt: q.get('tpt'),
    crd: q.get('crd'),
    OrderHash: q.get('OrderHash'),
    orderNumber: orderRow.order_number,
    amountCents: orderRow.total_cents,
    buyerEmail: orderRow.buyer_email,
  })
  if (!valid) {
    console.error('Tilopay callback hash mismatch for', orderRow.order_number)
    return NextResponse.redirect(errorUrl('invalid'), 303)
  }

  const approved = q.get('code') === '1'
  const callbackRaw = Object.fromEntries(q.entries())

  if (approved) {
    // Idempotent claim: only one request flips pending → paid.
    const { data: claimed } = await supabase
      .from('gc_orders')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
        tilopay_tpt: q.get('tpt'),
        tilopay_auth: q.get('auth'),
        tilopay_response_code: q.get('code'),
        tilopay_description: q.get('description'),
        // Structured "<selected_method>|<crd>|<brand-ish>" — parsed by
        // tenderNameFor() to pick the Mindbody tender (Yappy Web / Visa/MC
        // Web / AMEX Web). Raw params are also kept in callback_raw.
        tilopay_method:
          [
            q.get('selected_method') ?? '',
            q.get('crd') ?? '',
            q.get('brand') ?? q.get('card_type') ?? '',
          ]
            .join('|')
            .slice(0, 160) || null,
        callback_raw: callbackRaw,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderRow.id)
      .eq('status', 'pending')
      .select('id')

    if (claimed && claimed.length > 0) {
      // Fulfillment errors never lose the paid state — the cron completes it.
      try {
        await fulfillOrder(orderRow.id)
      } catch (e) {
        console.error('Inline fulfillment failed (cron will retry):', e)
        await supabase
          .from('gc_orders')
          .update({
            fulfillment_error: (e instanceof Error ? e.message : 'unknown').slice(0, 500),
          })
          .eq('id', orderRow.id)
      }
    }
    return NextResponse.redirect(graciasUrl, 303)
  }

  await supabase
    .from('gc_orders')
    .update({
      status: 'payment_failed',
      tilopay_response_code: q.get('code'),
      tilopay_description: q.get('description'),
      callback_raw: callbackRaw,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderRow.id)
    .eq('status', 'pending')

  return NextResponse.redirect(errorUrl('declined'), 303)
}
