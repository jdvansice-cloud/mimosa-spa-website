import { NextRequest, NextResponse } from 'next/server'
import { getGiftCardBalance } from '@/lib/booking/mindbody'
import { checkRateLimit, getClientIdentifier, RATE_LIMIT_AUTH } from '@/lib/booking/rate-limit'

/**
 * POST /api/checkout/gc-balance — live balance for a gift card the customer
 * wants to pay with. Rate-limited (barcode enumeration guard); returns only
 * the remaining balance, never card metadata.
 */
export async function POST(request: NextRequest) {
  const rl = checkRateLimit(`gcbal:${getClientIdentifier(request)}`, RATE_LIMIT_AUTH)
  if (!rl.success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  let body: { barcode?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }
  const barcode = String(body.barcode ?? '').trim().toUpperCase()
  if (!/^[A-Z0-9-]{4,30}$/.test(barcode)) {
    return NextResponse.json({ error: 'Número de tarjeta inválido' }, { status: 400 })
  }

  const bal = await getGiftCardBalance(barcode)
  if (!bal) {
    return NextResponse.json(
      { error: 'No encontramos esa gift card. Verifica el número.' },
      { status: 404 }
    )
  }
  return NextResponse.json({
    barcode: bal.BarcodeId,
    balanceCents: Math.round(bal.RemainingBalance * 100),
  })
}
