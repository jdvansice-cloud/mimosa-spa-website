import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getGiftCardBalance } from '@/lib/booking/mindbody'

/**
 * GET /api/cron/sync-giftcards
 * Hourly job. Pulls the current Mindbody balance for every gift card that is
 * either still pending sale or has remaining balance, so the issued list and
 * print views stay current without manual sync.
 *
 * Scope (oldest mindbody_synced_at first):
 *   - sold_at IS NULL                          → detect new sales
 *   - mindbody_remaining_balance_cents > 0     → catch redemptions
 *   - mindbody_remaining_balance_cents IS NULL → first-time sync
 *
 * Cards with a zero balance are skipped (fully redeemed) and stamped with
 * redeemed_at the first time they hit zero.
 *
 * Per-run cap bounds Mindbody API usage; the rest rotate to next hour by
 * virtue of the synced_at ordering.
 */

const MAX_PER_RUN = 100

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: cards, error: queryError } = await supabase
    .from('gift_cards')
    .select('id, serial, sold_at, mindbody_remaining_balance_cents, redeemed_at, mindbody_barcode_id')
    .is('voided_at', null)
    .or('sold_at.is.null,mindbody_remaining_balance_cents.is.null,mindbody_remaining_balance_cents.gt.0')
    .is('redeemed_at', null)
    .order('mindbody_synced_at', { ascending: true, nullsFirst: true })
    .limit(MAX_PER_RUN)

  if (queryError) {
    console.error('sync-giftcards query error:', queryError)
    return NextResponse.json({ error: 'Query failed' }, { status: 500 })
  }

  if (!cards || cards.length === 0) {
    return NextResponse.json({ checked: 0, sold: 0, balance_updates: 0, redeemed: 0, errors: 0 })
  }

  let checked = 0
  let sold = 0
  let balanceUpdates = 0
  let redeemed = 0
  let errors = 0

  for (const card of cards) {
    checked++
    const now = new Date().toISOString()

    let balance
    try {
      balance = await getGiftCardBalance(card.mindbody_barcode_id ?? card.serial)
    } catch (e) {
      errors++
      console.error(`sync-giftcards: ${card.serial} fetch failed:`, e)
      continue
    }

    if (!balance) {
      // Card not in Mindbody yet — record the attempt so it rotates to the
      // back of the queue and we don't keep retrying the same one this hour.
      await supabase
        .from('gift_cards')
        .update({ mindbody_synced_at: now })
        .eq('id', card.id)
      continue
    }

    const newBalanceCents = Math.round(balance.RemainingBalance * 100)
    const wasPending = !card.sold_at
    const wasRedeemed = !!card.redeemed_at

    const update: Record<string, unknown> = {
      mindbody_barcode_id: balance.BarcodeId,
      mindbody_remaining_balance_cents: newBalanceCents,
      mindbody_synced_at: now,
    }

    if (wasPending) {
      update.sold_at = now
      sold++
    }

    if (newBalanceCents === 0 && !wasRedeemed) {
      update.redeemed_at = now
      redeemed++
    }

    if (card.mindbody_remaining_balance_cents !== newBalanceCents) {
      balanceUpdates++
    }

    const { error: updateError } = await supabase
      .from('gift_cards')
      .update(update)
      .eq('id', card.id)

    if (updateError) {
      errors++
      console.error(`sync-giftcards: ${card.serial} update failed:`, updateError)
    }
  }

  console.log(
    `sync-giftcards: checked=${checked} sold=${sold} balance_updates=${balanceUpdates} redeemed=${redeemed} errors=${errors}`
  )

  return NextResponse.json({
    checked,
    sold,
    balance_updates: balanceUpdates,
    redeemed,
    errors,
  })
}
