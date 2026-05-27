import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const { data, error } = await supabase
    .from('gift_card_serial_config')
    .select('*')
    .eq('id', 1)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ data })
}

interface UpdatePayload {
  prefix?: string
  serial_length?: number
}

export async function PUT(request: NextRequest) {
  let body: UpdatePayload
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const update: Record<string, unknown> = {}

  if (body.prefix !== undefined) {
    if (!/^[A-Z0-9]{1,8}$/.test(body.prefix)) {
      return NextResponse.json(
        { error: 'prefix must be 1–8 uppercase letters/digits' },
        { status: 400 }
      )
    }
    update.prefix = body.prefix
  }

  if (body.serial_length !== undefined) {
    if (!Number.isInteger(body.serial_length) || body.serial_length < 4 || body.serial_length > 12) {
      return NextResponse.json(
        { error: 'serial_length must be 4–12' },
        { status: 400 }
      )
    }
    update.serial_length = body.serial_length
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'nothing to update' }, { status: 400 })
  }

  update.updated_at = new Date().toISOString()

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const { data, error } = await supabase
    .from('gift_card_serial_config')
    .update(update)
    .eq('id', 1)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ data })
}
