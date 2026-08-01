import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getGiftCardAdminContext } from '@/lib/giftcards/auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// GET: list all configs (any admin, but a location-restricted admin only sees their own).
export async function GET() {
  const ctx = await getGiftCardAdminContext()
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  let query = supabase
    .from('gift_card_serial_config')
    .select('*')
    .order('location_name', { ascending: true })

  if (ctx.locationConfigId) {
    query = query.eq('id', ctx.locationConfigId)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

interface CreatePayload {
  mindbody_location_id: number
  location_name: string
  prefix: string
  serial_length?: number
}

// POST: create a new location config (super admin only).
export async function POST(request: NextRequest) {
  const ctx = await getGiftCardAdminContext()
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (ctx.locationConfigId) {
    return NextResponse.json({ error: 'Forbidden — location admins cannot create configs' }, { status: 403 })
  }

  let body: CreatePayload
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!Number.isInteger(body.mindbody_location_id) || body.mindbody_location_id <= 0) {
    return NextResponse.json({ error: 'mindbody_location_id required (positive int)' }, { status: 400 })
  }
  if (!body.location_name?.trim()) {
    return NextResponse.json({ error: 'location_name required' }, { status: 400 })
  }
  if (!body.prefix || !/^[A-Z0-9]{1,8}$/.test(body.prefix)) {
    return NextResponse.json({ error: 'prefix must be 1–8 uppercase letters/digits' }, { status: 400 })
  }
  const length = body.serial_length ?? 6
  if (!Number.isInteger(length) || length < 4 || length > 12) {
    return NextResponse.json({ error: 'serial_length must be 4–12' }, { status: 400 })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const { data, error } = await supabase
    .from('gift_card_serial_config')
    .insert({
      mindbody_location_id: body.mindbody_location_id,
      location_name: body.location_name.trim(),
      prefix: body.prefix,
      serial_length: length,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
