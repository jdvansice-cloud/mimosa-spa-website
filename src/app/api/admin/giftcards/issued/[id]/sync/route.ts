import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getGiftCardBalance } from '@/lib/booking/mindbody'
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
    .select('id, serial, sold_at')
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

  const update = {
    mindbody_barcode_id: balance.BarcodeId,
    mindbody_remaining_balance_cents: Math.round(balance.RemainingBalance * 100),
    mindbody_synced_at: now,
    sold_at: card.sold_at ?? now,
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
