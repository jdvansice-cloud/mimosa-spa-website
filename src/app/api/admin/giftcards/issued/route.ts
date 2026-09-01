import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getGiftCardAdminContext } from '@/lib/giftcards/auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const DEFAULT_PAGE_SIZE = 25
const MAX_PAGE_SIZE = 100

/**
 * Lifecycle buckets, mirroring statusLabel() in the issued list UI:
 *   emitida — serial generated here, not yet seen in Mindbody
 *   vendida — the serial exists in Mindbody with balance remaining
 *   usada   — Mindbody reports the balance fully consumed
 */
type Status = 'emitida' | 'vendida' | 'usada'
const STATUSES: Status[] = ['emitida', 'vendida', 'usada']

/** PostgREST `or` values are comma-separated, so a comma would split the filter. */
function escapeForOr(value: string): string {
  return value.replace(/[,()]/g, ' ')
}

export async function GET(request: NextRequest) {
  const ctx = await getGiftCardAdminContext()
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const pageSize = Math.min(Math.max(Number(searchParams.get('pageSize')) || DEFAULT_PAGE_SIZE, 1), MAX_PAGE_SIZE)
  const page = Math.max(Number(searchParams.get('page')) || 1, 1)
  const filterConfigId = searchParams.get('configId')
  const q = (searchParams.get('q') || '').trim()
  const statusParam = searchParams.get('status')
  const status = STATUSES.includes(statusParam as Status) ? (statusParam as Status) : null

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const applyFilters = <T extends { eq: any; or: any; is: any; not: any }>(query: T): T => {
    let q2 = query
    // Location-restricted admins only see their own location's cards.
    if (ctx.locationConfigId) {
      q2 = q2.eq('gift_card_serial_config_id', ctx.locationConfigId)
    } else if (filterConfigId) {
      q2 = q2.eq('gift_card_serial_config_id', filterConfigId)
    }

    // Staff search by whatever they have in hand: the serial on the card, a
    // name, an email, a phone number, the printed message, a treatment, or a
    // Mindbody id. One box, every text field — nobody should need to know
    // which field the data lived in.
    if (q) {
      const needle = `%${escapeForOr(q)}%`
      q2 = q2.or(
        [
          'serial', 'buyer_name', 'buyer_email', 'buyer_phone',
          'recipient_name', 'recipient_email', 'message', 'treatment_name',
          'notes', 'mindbody_barcode_id', 'mindbody_sale_id',
        ].map(col => `${col}.ilike.${needle}`).join(','),
      )
    }

    if (status === 'emitida') {
      q2 = q2.is('sold_at', null).is('redeemed_at', null)
    } else if (status === 'vendida') {
      q2 = q2.not('sold_at', 'is', null).is('redeemed_at', null)
    } else if (status === 'usada') {
      q2 = q2.not('redeemed_at', 'is', null)
    }
    return q2
  }

  // Count first so the page can be clamped. Asking PostgREST for a range past
  // the end of the result set returns a 416 with no usable body, which is what
  // a stale page number after a filter change would otherwise produce.
  const { count, error: countError } = await applyFilters(
    supabase.from('gift_cards').select('id', { count: 'exact', head: true }),
  )
  if (countError) {
    console.error('gift_cards count error:', countError)
    return NextResponse.json({ error: countError.message }, { status: 500 })
  }

  const total = count ?? 0
  const totalPages = Math.max(Math.ceil(total / pageSize), 1)
  const safePage = Math.min(page, totalPages)

  if (total === 0) {
    return NextResponse.json({ data: [], page: 1, pageSize, total: 0, totalPages: 1 })
  }

  const { data, error } = await applyFilters(
    supabase
      .from('gift_cards')
      .select(
        'id, serial, buyer_name, recipient_name, amount_cents, gift_treatment_names, gift_card_serial_config_id, issued_at, redeemed_at, sold_at, mindbody_remaining_balance_cents, mindbody_synced_at',
      ),
  )
    .order('issued_at', { ascending: false })
    .range((safePage - 1) * pageSize, safePage * pageSize - 1)

  if (error) {
    console.error('gift_cards list error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data, page: safePage, pageSize, total, totalPages })
}
