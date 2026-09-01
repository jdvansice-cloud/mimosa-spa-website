import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getGiftCardAdminContext } from '@/lib/giftcards/auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await getGiftCardAdminContext()
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { data, error } = await supabase
    .from('gift_cards')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'Not found' }, { status: 404 })
  }

  // Location-restricted admins can only view their own location's cards.
  if (
    ctx.locationConfigId &&
    data.gift_card_serial_config_id &&
    data.gift_card_serial_config_id !== ctx.locationConfigId
  ) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Resolve the two UUIDs the detail view would otherwise show raw: who
  // issued the card and which sede's serial series it belongs to.
  let issuedByEmail: string | null = null
  if (data.issued_by) {
    const { data: prof } = await supabase
      .from('profiles').select('email').eq('id', data.issued_by).maybeSingle()
    issuedByEmail = prof?.email ?? null
  }
  let locationName: string | null = null
  if (data.gift_card_serial_config_id) {
    const { data: cfg } = await supabase
      .from('gift_card_serial_config')
      .select('location_name, prefix')
      .eq('id', data.gift_card_serial_config_id)
      .maybeSingle()
    locationName = cfg ? `${cfg.location_name} (${cfg.prefix})` : null
  }

  return NextResponse.json({ data: { ...data, issued_by_email: issuedByEmail, location_label: locationName } })
}
