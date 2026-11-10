import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getGiftCardAdminContext } from '@/lib/giftcards/auth'
import { PRIVILEGE_BEARER, PRIVILEGE_FORMAT, privilegeExpiresAt, privilegeValueError } from '@/lib/giftcards/privilege'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

interface IssuePayload {
  gift_card_serial_config_id: string
  buyer_name: string
  buyer_email?: string | null
  buyer_phone?: string | null
  buyer_mindbody_client_id?: number | null
  recipient_mindbody_client_id?: number | null
  recipient_name: string
  recipient_email?: string | null
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
  /** 'privilege' issues from the location's Privilege series. Default: regular. */
  format?: 'gift_card' | 'privilege'
}

export async function POST(request: NextRequest) {
  const ctx = await getGiftCardAdminContext()
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: IssuePayload
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.gift_card_serial_config_id) {
    return NextResponse.json({ error: 'gift_card_serial_config_id required' }, { status: 400 })
  }
  if (!body.buyer_name?.trim()) {
    return NextResponse.json({ error: 'buyer_name required' }, { status: 400 })
  }
  // A Privilege card is a bearer card, not a gift: it has no recipient.
  const privilege = body.format === PRIVILEGE_FORMAT
  if (!privilege && !body.recipient_name?.trim()) {
    return NextResponse.json({ error: 'recipient_name required' }, { status: 400 })
  }
  if (!Number.isInteger(body.amount_cents) || body.amount_cents <= 0) {
    return NextResponse.json({ error: 'amount_cents must be a positive integer' }, { status: 400 })
  }

  // Privilege cards exist only in fixed denominations. The sale price is not
  // recorded: Mindbody carries it on the card staff pick when selling.
  if (privilege) {
    const problem = privilegeValueError(body.amount_cents)
    if (problem) return NextResponse.json({ error: problem }, { status: 400 })
  }

  // Location-restricted admins can only issue for their own location.
  if (ctx.locationConfigId && ctx.locationConfigId !== body.gift_card_serial_config_id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Load the config to capture mindbody_location_id and verify it's active.
  const { data: config, error: configError } = await supabase
    .from('gift_card_serial_config')
    .select('id, mindbody_location_id, is_active')
    .eq('id', body.gift_card_serial_config_id)
    .single()

  if (configError || !config) {
    return NextResponse.json({ error: 'location config not found' }, { status: 404 })
  }
  if (!config.is_active) {
    return NextResponse.json({ error: 'location config is inactive' }, { status: 400 })
  }

  // Mint the serial from the location's counter — Privilege cards from the
  // location's separate Privilege series, so the two never share numbers.
  const { data: serial, error: serialError } = await supabase.rpc(
    privilege ? 'next_giftcard_privilege_serial' : 'next_giftcard_serial',
    { p_config_id: body.gift_card_serial_config_id }
  )

  if (serialError || !serial) {
    console.error('gift card serial RPC error:', serialError)
    return NextResponse.json(
      {
        error: privilege
          ? 'Esta ubicación no tiene una serie Privilege configurada. Configúrala en Gift Cards → Ubicaciones y Seriales.'
          : serialError?.message || 'Failed to generate serial',
      },
      { status: privilege ? 409 : 500 }
    )
  }

  const treatmentNames =
    Array.isArray(body.gift_treatment_names) && body.gift_treatment_names.length > 0
      ? body.gift_treatment_names.map(s => s.trim()).filter(Boolean)
      : null

  const insert: Record<string, unknown> = {
    serial,
    format: privilege ? PRIVILEGE_FORMAT : 'gift_card',
    gift_card_serial_config_id: config.id,
    mindbody_location_id: config.mindbody_location_id,
    buyer_name: body.buyer_name.trim(),
    // Present only when staff picked the client from the lookup — a typed
    // custom name carries no id, and that distinction is the point.
    buyer_mindbody_client_id: body.buyer_mindbody_client_id ?? null,
    buyer_email: body.buyer_email?.trim() || null,
    buyer_phone: body.buyer_phone?.trim() || null,
    recipient_name: privilege ? PRIVILEGE_BEARER : body.recipient_name.trim(),
    recipient_mindbody_client_id: privilege ? null : body.recipient_mindbody_client_id ?? null,
    recipient_email: privilege ? null : body.recipient_email?.trim() || null,
    amount_cents: body.amount_cents,
    // A Privilege card is pure stored value: no treatments, tax split, promo
    // or dedication.
    base_amount_cents: privilege ? null : body.base_amount_cents ?? null,
    tax_cents: privilege ? null : body.tax_cents ?? null,
    gift_treatment_names: privilege ? null : treatmentNames,
    message: privilege ? null : body.message?.trim() || null,
    print_amount: body.print_amount,
    print_message: privilege ? false : body.print_message,
    print_recipient: privilege ? false : body.print_recipient,
    print_treatments: privilege ? false : body.print_treatments,
    notes: body.notes?.trim() || null,
    // Snapshot alongside the reference: the card must still name the promo
    // after the promotion itself is edited or deleted.
    promotion_id: privilege ? null : body.promotion_id || null,
    promotion_name: privilege ? null : body.promotion_name?.trim() || null,
    issued_by: ctx.userId,
  }

  // A Privilege card is valid 12 or 18 months from its purchase date, which
  // is the day it is issued. Set issued_at here (not by column default) so
  // the expiry is counted from exactly the date the label prints.
  if (privilege) {
    const issuedAt = new Date()
    insert.issued_at = issuedAt.toISOString()
    insert.expires_at = privilegeExpiresAt(issuedAt, body.amount_cents)
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
