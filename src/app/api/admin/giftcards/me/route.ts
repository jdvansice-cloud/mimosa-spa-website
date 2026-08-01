import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getGiftCardAdminContext } from '@/lib/giftcards/auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * Returns the calling admin's gift-card scope so the client can render the
 * right UI (super admin location picker vs locked location).
 */
export async function GET() {
  const ctx = await getGiftCardAdminContext()
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let locationName: string | null = null
  if (ctx.locationConfigId) {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { data } = await supabase
      .from('gift_card_serial_config')
      .select('location_name')
      .eq('id', ctx.locationConfigId)
      .single()
    locationName = data?.location_name ?? null
  }

  return NextResponse.json({
    userId: ctx.userId,
    email: ctx.email,
    locationConfigId: ctx.locationConfigId,
    locationName,
    isSuperAdmin: ctx.locationConfigId === null,
  })
}
