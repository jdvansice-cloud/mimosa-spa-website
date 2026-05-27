import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getGiftCardAdminContext } from '@/lib/giftcards/auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: NextRequest) {
  const ctx = await getGiftCardAdminContext()
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const limit = Math.min(Number(searchParams.get('limit') || 100), 500)
  const filterConfigId = searchParams.get('configId')

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  let query = supabase
    .from('gift_cards')
    .select('id, serial, buyer_name, recipient_name, amount_cents, gift_treatment_names, gift_card_serial_config_id, issued_at, redeemed_at, sold_at, mindbody_remaining_balance_cents, mindbody_synced_at')
    .order('issued_at', { ascending: false })
    .limit(limit)

  // Location-restricted admins only see their own location's cards.
  if (ctx.locationConfigId) {
    query = query.eq('gift_card_serial_config_id', ctx.locationConfigId)
  } else if (filterConfigId) {
    query = query.eq('gift_card_serial_config_id', filterConfigId)
  }

  const { data, error } = await query
  if (error) {
    console.error('gift_cards list error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ data })
}
