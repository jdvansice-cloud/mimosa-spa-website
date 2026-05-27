import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const VALID_CATEGORIES = ['gift_card', 'certificado', 'privilege'] as const
type Category = (typeof VALID_CATEGORIES)[number]

interface UpdatePayload {
  prefix?: string
  serial_length?: number
  category?: Category
  is_active?: boolean
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

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

  if (body.category !== undefined) {
    if (!VALID_CATEGORIES.includes(body.category)) {
      return NextResponse.json({ error: 'invalid category' }, { status: 400 })
    }
    update.category = body.category
  }

  if (body.is_active !== undefined) {
    update.is_active = !!body.is_active
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'nothing to update' }, { status: 400 })
  }

  update.updated_at = new Date().toISOString()

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const { data, error } = await supabase
    .from('gift_card_types')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ data })
}
