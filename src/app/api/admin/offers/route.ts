import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { revalidateTag } from 'next/cache'
import { requireAdmin } from '@/lib/auth/require-admin'
import { OFFERS_TAG } from '@/lib/offers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const EDITABLE_FIELDS = [
  'key',
  'page',
  'name_es',
  'name_en',
  'description_es',
  'description_en',
  'price',
  'price_note_es',
  'price_note_en',
  'includes_es',
  'includes_en',
  'whatsapp_text_es',
  'whatsapp_text_en',
  'image_key',
  'mindbody_service_id',
  'badge_es',
  'badge_en',
  'is_active',
  'sort_order',
] as const

function pickEditable(body: Record<string, unknown>) {
  const out: Record<string, unknown> = {}
  for (const f of EDITABLE_FIELDS) {
    if (f in body) out[f] = body[f]
  }
  return out
}

// GET - all offers (admin, includes inactive)
export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const { data, error } = await supabase
    .from('marketing_offers')
    .select('*')
    .order('page', { ascending: true })
    .order('sort_order', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

// POST - create offer
export async function POST(request: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  const body = await request.json()
  const insert = pickEditable(body)
  if (!insert.key || !insert.page || !insert.name_es || !insert.name_en) {
    return NextResponse.json(
      { error: 'key, page, name_es and name_en are required' },
      { status: 400 }
    )
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const { data, error } = await supabase
    .from('marketing_offers')
    .insert(insert)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidateTag(OFFERS_TAG, 'max')
  return NextResponse.json({ data })
}

// PUT - update offer { id, ...fields }
export async function PUT(request: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  const body = await request.json()
  if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const { data, error } = await supabase
    .from('marketing_offers')
    .update({ ...pickEditable(body), updated_at: new Date().toISOString() })
    .eq('id', body.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidateTag(OFFERS_TAG, 'max')
  return NextResponse.json({ data })
}

// DELETE - ?id=
export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  const id = new URL(request.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const { error } = await supabase.from('marketing_offers').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidateTag(OFFERS_TAG, 'max')
  return NextResponse.json({ ok: true })
}
