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

interface EditPayload {
  buyer_name: string
  buyer_email?: string | null
  buyer_phone?: string | null
  buyer_mindbody_client_id?: number | null
  recipient_name: string
  recipient_email?: string | null
  recipient_mindbody_client_id?: number | null
  amount_cents: number
  gift_treatment_names?: string[] | null
  base_amount_cents?: number | null
  tax_cents?: number | null
  message?: string | null
  print_amount: boolean
  print_message: boolean
  print_recipient: boolean
  print_treatments: boolean
  notes?: string | null
  promotion_id?: string | null
  promotion_name?: string | null
}

/**
 * Edit a card that is still only Emitida. Once Mindbody has registered the
 * sale the amount is money someone paid, so the record freezes — the serial
 * never changes in any case (it's already printed and it's the Mindbody key).
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ctx = await getGiftCardAdminContext()
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { data: card, error: loadError } = await supabase
    .from('gift_cards')
    .select('id, gift_card_serial_config_id, sold_at, redeemed_at, voided_at')
    .eq('id', id)
    .single()
  if (loadError || !card) {
    return NextResponse.json({ error: loadError?.message || 'Not found' }, { status: 404 })
  }
  if (
    ctx.locationConfigId &&
    card.gift_card_serial_config_id &&
    card.gift_card_serial_config_id !== ctx.locationConfigId
  ) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  if (card.sold_at || card.redeemed_at || card.voided_at) {
    return NextResponse.json(
      { error: 'La Gift Card ya fue vendida en Mindbody; ya no se puede editar.' },
      { status: 409 }
    )
  }

  let body: EditPayload
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

  const treatmentNames =
    Array.isArray(body.gift_treatment_names) && body.gift_treatment_names.length > 0
      ? body.gift_treatment_names.map(s => s.trim()).filter(Boolean)
      : null

  const update = {
    buyer_name: body.buyer_name.trim(),
    buyer_mindbody_client_id: body.buyer_mindbody_client_id ?? null,
    buyer_email: body.buyer_email?.trim() || null,
    buyer_phone: body.buyer_phone?.trim() || null,
    recipient_name: body.recipient_name.trim(),
    recipient_mindbody_client_id: body.recipient_mindbody_client_id ?? null,
    recipient_email: body.recipient_email?.trim() || null,
    amount_cents: body.amount_cents,
    base_amount_cents: body.base_amount_cents ?? null,
    tax_cents: body.tax_cents ?? null,
    gift_treatment_names: treatmentNames,
    message: body.message?.trim() || null,
    print_amount: !!body.print_amount,
    print_message: !!body.print_message,
    print_recipient: !!body.print_recipient,
    print_treatments: !!body.print_treatments,
    notes: body.notes?.trim() || null,
    promotion_id: body.promotion_id || null,
    promotion_name: body.promotion_name?.trim() || null,
  }

  const { data, error } = await supabase
    .from('gift_cards')
    .update(update)
    .eq('id', id)
    .select()
    .single()
  if (error) {
    console.error('gift_cards edit error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ data })
}
