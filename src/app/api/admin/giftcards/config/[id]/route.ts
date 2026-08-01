import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getGiftCardAdminContext } from '@/lib/giftcards/auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

interface UpdatePayload {
  mindbody_location_id?: number
  location_name?: string
  prefix?: string
  serial_length?: number
  is_active?: boolean
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await getGiftCardAdminContext()
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  // Location-restricted admins can only edit their own row, and only its
  // prefix / length / name — not the active flag or the Mindbody location id.
  if (ctx.locationConfigId && ctx.locationConfigId !== id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: UpdatePayload
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const update: Record<string, unknown> = {}

  if (body.mindbody_location_id !== undefined) {
    if (ctx.locationConfigId) {
      return NextResponse.json({ error: 'Forbidden — cannot change Mindbody location' }, { status: 403 })
    }
    if (!Number.isInteger(body.mindbody_location_id) || body.mindbody_location_id <= 0) {
      return NextResponse.json({ error: 'mindbody_location_id must be a positive int' }, { status: 400 })
    }
    update.mindbody_location_id = body.mindbody_location_id
  }
  if (body.location_name !== undefined) {
    if (!body.location_name.trim()) {
      return NextResponse.json({ error: 'location_name cannot be empty' }, { status: 400 })
    }
    update.location_name = body.location_name.trim()
  }
  if (body.prefix !== undefined) {
    if (!/^[A-Z0-9]{1,8}$/.test(body.prefix)) {
      return NextResponse.json({ error: 'prefix must be 1–8 uppercase letters/digits' }, { status: 400 })
    }
    update.prefix = body.prefix
  }
  if (body.serial_length !== undefined) {
    if (!Number.isInteger(body.serial_length) || body.serial_length < 4 || body.serial_length > 12) {
      return NextResponse.json({ error: 'serial_length must be 4–12' }, { status: 400 })
    }
    update.serial_length = body.serial_length
  }
  if (body.is_active !== undefined) {
    if (ctx.locationConfigId) {
      return NextResponse.json({ error: 'Forbidden — cannot change active flag' }, { status: 403 })
    }
    update.is_active = !!body.is_active
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'nothing to update' }, { status: 400 })
  }

  update.updated_at = new Date().toISOString()

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const { data, error } = await supabase
    .from('gift_card_serial_config')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await getGiftCardAdminContext()
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (ctx.locationConfigId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Block delete if any gift cards reference this config.
  const { count, error: countError } = await supabase
    .from('gift_cards')
    .select('id', { count: 'exact', head: true })
    .eq('gift_card_serial_config_id', id)

  if (countError) return NextResponse.json({ error: countError.message }, { status: 500 })
  if ((count ?? 0) > 0) {
    return NextResponse.json(
      { error: 'Cannot delete: gift cards already issued for this location. Deactivate instead.' },
      { status: 409 }
    )
  }

  const { error } = await supabase
    .from('gift_card_serial_config')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
