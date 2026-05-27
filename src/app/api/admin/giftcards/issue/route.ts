import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

interface IssuePayload {
  buyer_name: string
  buyer_email?: string | null
  buyer_phone?: string | null
  recipient_name: string
  recipient_email?: string | null
  amount_cents: number
  // Optional treatments-as-a-gift breakdown (customer reference + label).
  gift_treatment_names?: string[] | null
  base_amount_cents?: number | null
  tax_cents?: number | null
  message?: string | null
  print_amount: boolean
  print_message: boolean
  print_recipient: boolean
  print_treatments: boolean
  notes?: string | null
}

export async function POST(request: NextRequest) {
  let body: IssuePayload
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.buyer_name?.trim()) {
    return NextResponse.json({ error: 'buyer_name required' }, { status: 400 })
  }
  if (!body.recipient_name?.trim()) {
    return NextResponse.json({ error: 'recipient_name required' }, { status: 400 })
  }
  if (!Number.isInteger(body.amount_cents) || body.amount_cents <= 0) {
    return NextResponse.json({ error: 'amount_cents must be a positive integer' }, { status: 400 })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Mint the serial from the single global counter.
  const { data: serial, error: serialError } = await supabase.rpc('next_giftcard_serial')

  if (serialError || !serial) {
    console.error('next_giftcard_serial RPC error:', serialError)
    return NextResponse.json(
      { error: serialError?.message || 'Failed to generate serial' },
      { status: 500 }
    )
  }

  const treatmentNames =
    Array.isArray(body.gift_treatment_names) && body.gift_treatment_names.length > 0
      ? body.gift_treatment_names.map(s => s.trim()).filter(Boolean)
      : null

  const insert = {
    serial,
    format: 'gift_card', // single global type
    buyer_name: body.buyer_name.trim(),
    buyer_email: body.buyer_email?.trim() || null,
    buyer_phone: body.buyer_phone?.trim() || null,
    recipient_name: body.recipient_name.trim(),
    recipient_email: body.recipient_email?.trim() || null,
    amount_cents: body.amount_cents,
    base_amount_cents: body.base_amount_cents ?? null,
    tax_cents: body.tax_cents ?? null,
    gift_treatment_names: treatmentNames,
    message: body.message?.trim() || null,
    print_amount: body.print_amount,
    print_message: body.print_message,
    print_recipient: body.print_recipient,
    print_treatments: body.print_treatments,
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
