import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getGiftCardBalance } from '@/lib/booking/mindbody'
import { findGiftCardSale } from '@/lib/giftcards/saleLookup'
import { getGiftCardAdminContext } from '@/lib/giftcards/auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await getGiftCardAdminContext()
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Load the card so we know the serial to look up in Mindbody.
  const { data: card, error: loadError } = await supabase
    .from('gift_cards')
    .select('id, serial, sold_at, redeemed_at, sold_payment_method, mindbody_sale_id, mindbody_remaining_balance_cents')
    .eq('id', id)
    .single()

  if (loadError || !card) {
    return NextResponse.json({ error: loadError?.message || 'Not found' }, { status: 404 })
  }

  let balance
  try {
    balance = await getGiftCardBalance(card.serial)
  } catch (e) {
    console.error('Mindbody balance fetch failed:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Mindbody error' },
      { status: 502 }
    )
  }

  const now = new Date().toISOString()

  // giftcardbalance echoes unknown barcodes as balance 0 (see the cron for the
  // full note), so zero on a never-positive card means "not sold", not "used".
  const echoedZero =
    balance &&
    Math.round(balance.RemainingBalance * 100) === 0 &&
    !((card.mindbody_remaining_balance_cents ?? 0) > 0)
  if (echoedZero) balance = null

  if (!balance) {
    // Card not in Mindbody yet — record the sync attempt so the UI can show
    // "checked, not yet sold" instead of looking like the button did nothing.
    await supabase
      .from('gift_cards')
      .update({ mindbody_synced_at: now })
      .eq('id', id)

    return NextResponse.json({
      status: 'not_found_in_mindbody',
      message: 'No se encontró la Gift Card en Mindbody. Aún no se ha registrado la venta.',
    })
  }

  // Same state transitions as the hourly cron in /api/cron/sync-giftcards, so a
  // card reaches the right status whether staff sync it by hand or the cron does:
  //   sold     — the serial exists in Mindbody
  //   redeemed — its balance has been fully consumed
  const balanceCents = Math.round(balance.RemainingBalance * 100)
  const update: Record<string, unknown> = {
    mindbody_barcode_id: balance.BarcodeId,
    mindbody_remaining_balance_cents: balanceCents,
    mindbody_synced_at: now,
    sold_at: card.sold_at ?? now,
  }
  if (balanceCents === 0 && !card.redeemed_at) {
    update.redeemed_at = now
  }

  // Manual sync also recovers the tender of the selling sale. Wider window
  // than the cron: staff pressing the button on an old card is exactly the
  // case where a deeper scan is worth the API calls.
  if (!card.sold_payment_method) {
    try {
      const sale = await findGiftCardSale([card.serial, balance.BarcodeId], 14)
      if (sale) {
        update.sold_payment_method = sale.paymentMethod
        if (!card.mindbody_sale_id) update.mindbody_sale_id = String(sale.saleId)
      }
    } catch (e) {
      console.error('gift card sale lookup failed:', e)
    }
  }

  const { data: updated, error: updateError } = await supabase
    .from('gift_cards')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (updateError) {
    console.error('gift_cards sync update error:', updateError)
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ status: 'ok', data: updated })
}
