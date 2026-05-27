import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

interface IssuePayload {
  gift_card_type_id: string
  buyer_name: string
  buyer_email?: string | null
  buyer_phone?: string | null
  recipient_name: string
  recipient_email?: string | null
  // Required for open-amount types (value_cents null/0). Ignored otherwise.
  amount_cents_override?: number | null
  message?: string | null
  print_amount: boolean
  print_message: boolean
  print_recipient: boolean
  notes?: string | null
}

export async function POST(request: NextRequest) {
  let body: IssuePayload
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.gift_card_type_id) {
    return NextResponse.json({ error: 'gift_card_type_id required' }, { status: 400 })
  }
  if (!body.buyer_name?.trim()) {
    return NextResponse.json({ error: 'buyer_name required' }, { status: 400 })
  }
  if (!body.recipient_name?.trim()) {
    return NextResponse.json({ error: 'recipient_name required' }, { status: 400 })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Load the type so we know category + value (and confirm it's active).
  const { data: type, error: typeError } = await supabase
    .from('gift_card_types')
    .select('id, name, value_cents, category, is_active')
    .eq('id', body.gift_card_type_id)
    .single()

  if (typeError || !type) {
    return NextResponse.json({ error: 'gift card type not found' }, { status: 404 })
  }
  if (!type.is_active) {
    return NextResponse.json({ error: 'gift card type is inactive' }, { status: 400 })
  }

  // Decide the amount.
  // - Fixed-value type: use the type's value_cents.
  // - Open-amount type (value_cents null/0): require amount_cents_override.
  const isOpenAmount = !type.value_cents || type.value_cents === 0
  let amountCents: number
  if (isOpenAmount) {
    if (
      !Number.isInteger(body.amount_cents_override) ||
      !body.amount_cents_override ||
      body.amount_cents_override <= 0
    ) {
      return NextResponse.json(
        { error: 'amount_cents_override required for open-amount type' },
        { status: 400 }
      )
    }
    amountCents = body.amount_cents_override
  } else {
    amountCents = type.value_cents as number
  }

  // Mint the serial via the per-type atomic counter.
  const { data: serial, error: serialError } = await supabase
    .rpc('next_giftcard_type_serial', { p_type_id: body.gift_card_type_id })

  if (serialError || !serial) {
    console.error('next_giftcard_type_serial RPC error:', serialError)
    return NextResponse.json(
      { error: serialError?.message || 'Failed to generate serial' },
      { status: 500 }
    )
  }

  // Gift Card and Certificado are unified as "gift_card" in the issued
  // record so they render with the same label template. Privilege keeps
  // its own format for the membership-style label.
  const storedFormat = type.category === 'privilege' ? 'privilege' : 'gift_card'

  const insert = {
    serial,
    format: storedFormat,
    gift_card_type_id: type.id,
    buyer_name: body.buyer_name.trim(),
    buyer_email: body.buyer_email?.trim() || null,
    buyer_phone: body.buyer_phone?.trim() || null,
    recipient_name: body.recipient_name.trim(),
    recipient_email: body.recipient_email?.trim() || null,
    amount_cents: amountCents,
    treatment_name: type.name, // snapshot of the type name at issuance
    message: body.message?.trim() || null,
    print_amount: body.print_amount,
    print_message: body.print_message,
    print_recipient: body.print_recipient,
    notes: body.notes?.trim() || null,
  }

  const { data, error } = await supabase
    .from('gift_cards')
    .insert(insert)
    .select()
    .single()

  if (error) {
    console.error('gift_cards insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ id: data.id, serial: data.serial, data })
}
