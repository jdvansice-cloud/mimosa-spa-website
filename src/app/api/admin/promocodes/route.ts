import { NextRequest, NextResponse } from 'next/server'
import { getGiftCardAdminContext } from '@/lib/giftcards/auth'
import { ordersAdminClient } from '@/lib/orders/pipeline'

// GET /api/admin/promocodes — codes with usage counts.
export async function GET() {
  const ctx = await getGiftCardAdminContext()
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = ordersAdminClient()
  const { data, error } = await supabase
    .from('promo_codes')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: redemptions } = await supabase.from('promo_redemptions').select('promo_code_id')
  const uses = new Map<string, number>()
  for (const r of redemptions ?? []) {
    uses.set(r.promo_code_id, (uses.get(r.promo_code_id) ?? 0) + 1)
  }

  return NextResponse.json({
    data: (data ?? []).map(c => ({ ...c, uses: uses.get(c.id) ?? 0 })),
  })
}

// POST /api/admin/promocodes — create or update a code.
export async function POST(request: NextRequest) {
  const ctx = await getGiftCardAdminContext()
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  const code = String(body.code ?? '').trim().toUpperCase()
  if (!/^[A-Z0-9_-]{3,32}$/.test(code)) {
    return NextResponse.json(
      { error: 'El código debe tener 3–32 caracteres (letras, números, - o _)' },
      { status: 400 }
    )
  }
  const kind = body.kind === 'fixed' ? 'fixed' : 'percent'
  const value = Math.round(Number(body.value) || 0)
  if (value <= 0 || (kind === 'percent' && value > 100)) {
    return NextResponse.json(
      { error: kind === 'percent' ? 'El porcentaje debe ser 1–100' : 'El monto debe ser mayor a 0' },
      { status: 400 }
    )
  }

  const row = {
    code,
    kind,
    // percent: 1–100 · fixed: cents (the form sends dollars)
    value: kind === 'fixed' ? Math.round(value) : value,
    scope: ['all', 'services', 'gift_cards', 'programs'].includes(body.scope) ? body.scope : 'all',
    program_ids: Array.isArray(body.programIds) ? body.programIds.map(Number).filter(Boolean) : [],
    min_subtotal_cents: Math.max(0, Math.round(Number(body.minSubtotalCents) || 0)),
    starts_at: body.startsAt || null,
    ends_at: body.endsAt || null,
    max_uses: body.maxUses ? Math.max(1, Math.round(Number(body.maxUses))) : null,
    max_uses_per_customer: body.maxUsesPerCustomer
      ? Math.max(1, Math.round(Number(body.maxUsesPerCustomer)))
      : null,
    is_active: body.isActive !== false,
    description: body.description ? String(body.description).slice(0, 200) : null,
    updated_at: new Date().toISOString(),
  }

  const supabase = ordersAdminClient()
  const { data, error } = body.id
    ? await supabase.from('promo_codes').update(row).eq('id', body.id).select().single()
    : await supabase.from('promo_codes').insert(row).select().single()

  if (error) {
    const msg = error.code === '23505' ? 'Ya existe un código con ese nombre' : error.message
    return NextResponse.json({ error: msg }, { status: 400 })
  }
  return NextResponse.json({ data })
}

// DELETE /api/admin/promocodes?id= — remove a code (redemptions cascade).
export async function DELETE(request: NextRequest) {
  const ctx = await getGiftCardAdminContext()
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = new URL(request.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Falta el id' }, { status: 400 })

  const { error } = await ordersAdminClient().from('promo_codes').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
