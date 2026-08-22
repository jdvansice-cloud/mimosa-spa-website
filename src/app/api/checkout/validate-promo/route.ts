import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIdentifier, RATE_LIMIT_AUTH } from '@/lib/booking/rate-limit'
import { ordersAdminClient } from '@/lib/orders/pipeline'
import { validatePromoCode } from '@/lib/orders/promo'
import type { OrderItemInput } from '@/lib/orders/types'

/**
 * POST /api/checkout/validate-promo — live promo preview for the checkout
 * page. Advisory only: POST /api/checkout re-validates against server-side
 * prices before any money moves.
 */
export async function POST(request: NextRequest) {
  const rl = checkRateLimit(`promo:${getClientIdentifier(request)}`, RATE_LIMIT_AUTH)
  if (!rl.success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  let body: {
    code?: string
    customerKey?: string
    items?: Array<{
      itemType: 'service' | 'gift_card'
      unitPriceCents: number
      quantity?: number
      programId?: number
      sessionTypeId?: number
    }>
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }
  const code = String(body.code ?? '').trim()
  if (!code || !Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: 'Código o artículos faltantes' }, { status: 400 })
  }

  const items: Array<OrderItemInput & { programId?: number }> = body.items.slice(0, 20).map(i => ({
    itemType: i.itemType === 'gift_card' ? 'gift_card' : 'service',
    quantity: Math.max(1, Math.min(10, Number(i.quantity) || 1)),
    nameEs: '',
    unitPriceCents: Math.max(0, Math.round(Number(i.unitPriceCents) || 0)),
    taxRateCode: i.itemType === 'gift_card' ? '00' : '01',
    mindbodySessionTypeId: i.sessionTypeId,
    programId: i.programId,
  }))

  const result = await validatePromoCode(ordersAdminClient(), {
    code,
    items,
    customerKey: body.customerKey ? String(body.customerKey).slice(0, 160) : undefined,
  })
  if (!result.ok) {
    return NextResponse.json({ ok: false, rejection: result.rejection })
  }
  return NextResponse.json({
    ok: true,
    code: result.promo!.code,
    discountCents: result.discountCents,
    discountByLineCents: result.discountByLineCents,
  })
}
