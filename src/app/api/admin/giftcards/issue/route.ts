import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

type Format = 'gift_card' | 'certificado'

interface IssuePayload {
  format: Format
  buyer_mindbody_client_id?: string | null
  buyer_name: string
  buyer_email?: string | null
  buyer_phone?: string | null
  recipient_name: string
  recipient_email?: string | null
  amount_cents: number
  base_amount_cents?: number | null
  tax_cents?: number | null
  treatment_mindbody_id?: string | null
  treatment_name?: string | null
  message?: string | null
  print_amount: boolean
  print_message: boolean
  print_recipient: boolean
  notes?: string | null
}

function parseClientId(value: string | null | undefined): number | null {
  if (!value) return null
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? Math.trunc(n) : null
}

export async function POST(request: NextRequest) {
  let body: IssuePayload
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (body.format !== 'gift_card' && body.format !== 'certificado') {
    return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
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

  const insert = {
    format: body.format,
    buyer_mindbody_client_id: parseClientId(body.buyer_mindbody_client_id),
    buyer_name: body.buyer_name.trim(),
    buyer_email: body.buyer_email?.trim() || null,
    buyer_phone: body.buyer_phone?.trim() || null,
    recipient_name: body.recipient_name.trim(),
    recipient_email: body.recipient_email?.trim() || null,
    amount_cents: body.amount_cents,
    base_amount_cents: body.base_amount_cents ?? null,
    tax_cents: body.tax_cents ?? null,
    treatment_mindbody_id: body.treatment_mindbody_id?.trim() || null,
    treatment_name: body.treatment_name?.trim() || null,
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
