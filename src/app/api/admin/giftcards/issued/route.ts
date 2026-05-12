import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = Math.min(Number(searchParams.get('limit') || 100), 500)

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { data, error } = await supabase
    .from('gift_cards')
    .select('id, serial, format, buyer_name, recipient_name, amount_cents, treatment_name, issued_at, redeemed_at, sold_at, mindbody_remaining_balance_cents, mindbody_synced_at')
    .order('issued_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('gift_cards list error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
