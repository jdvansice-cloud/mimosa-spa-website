import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getGiftCardBalance } from '@/lib/booking/mindbody'
import { findGiftCardSale } from '@/lib/giftcards/saleLookup'

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
    .select('id, serial, sold_at, mindbody_remaining_balance_cents, redeemed_at, mindbody_barcode_id, sold_payment_method, mindbody_sale_id')
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
  let paymentsFound = 0
  let errors = 0
  // One sales fetch per day per RUN, no matter how many cards flip.
  const salesDayCache = new Map()

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

    const newBalanceCents = balance ? Math.round(balance.RemainingBalance * 100) : 0

    // Mindbody's giftcardbalance ECHOES unknown barcodes as balance 0 instead
    // of erroring (verified 2026-09-01: "ZZ999999" comes back {RemainingBalance:
    // 0}). A zero therefore proves nothing on its own — it once marked every
    // unsold card in the table as sold-and-used. Evidence rules:
    //   sold      = a POSITIVE balance was seen (the echo can't fake that)
    //   redeemed  = balance is 0 on a card we previously saw positive
    //   otherwise = still just issued; only stamp the sync attempt
    if (!balance || (newBalanceCents === 0 && !(card.mindbody_remaining_balance_cents! > 0))) {
      await supabase
        .from('gift_cards')
        .update({ mindbody_synced_at: now })
        .eq('id', card.id)
      continue
    }

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

    // Payment method of the sale that sold the card. The balance endpoint
    // can't tell us; the sales feed links back via GiftCardBarcodeId. Only
    // fresh sales are worth scanning — after a week the sale predates the
    // window and retrying every hour forever would just burn API quota.
    const soldAtMs = Date.parse((card.sold_at ?? update.sold_at ?? now) as string)
    if (!card.sold_payment_method && Date.now() - soldAtMs < 7 * 86400000) {
      try {
        const sale = await findGiftCardSale([card.serial, balance.BarcodeId], 7, salesDayCache)
        if (sale) {
          update.sold_payment_method = sale.paymentMethod
          if (!card.mindbody_sale_id) update.mindbody_sale_id = String(sale.saleId)
          paymentsFound++
        }
      } catch (e) {
        console.error(`sync-giftcards: ${card.serial} sale lookup failed:`, e)
      }
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
    `sync-giftcards: checked=${checked} sold=${sold} balance_updates=${balanceUpdates} redeemed=${redeemed} payments=${paymentsFound} errors=${errors}`
  )

  return NextResponse.json({
    checked,
    sold,
    balance_updates: balanceUpdates,
    redeemed,
    errors,
  })
}
