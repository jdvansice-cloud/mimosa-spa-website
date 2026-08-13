import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { revalidateTag } from 'next/cache'
import { requireAdmin } from '@/lib/auth/require-admin'
import { REVIEWS_TAG } from '@/lib/reviews'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const EDITABLE_FIELDS = [
  'kind',
  'quote_es',
  'quote_en',
  'author_name',
  'rating',
  'source',
  'is_active',
  'sort_order',
  'location',
] as const

function pickEditable(body: Record<string, unknown>) {
  const out: Record<string, unknown> = {}
  for (const f of EDITABLE_FIELDS) {
    if (f in body) out[f] = body[f]
  }
  return out
}

// GET - all reviews (admin list, includes inactive)
export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const { data, error } = await supabase
    .from('site_reviews')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

// POST - create review
export async function POST(request: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  const body = await request.json()
  const insert = pickEditable(body)
  if (!insert.quote_es || !insert.quote_en || !insert.author_name) {
    return NextResponse.json(
      { error: 'quote_es, quote_en and author_name are required' },
      { status: 400 }
    )
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const { data, error } = await supabase
    .from('site_reviews')
    .insert(insert)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidateTag(REVIEWS_TAG, 'max')
  return NextResponse.json({ data })
}

// PUT - update review { id, ...fields }
export async function PUT(request: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  const body = await request.json()
  if (!body.id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const { data, error } = await supabase
    .from('site_reviews')
    .update({ ...pickEditable(body), updated_at: new Date().toISOString() })
    .eq('id', body.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidateTag(REVIEWS_TAG, 'max')
  return NextResponse.json({ data })
}

// DELETE - remove review ?id=
export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  const id = new URL(request.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const { error } = await supabase.from('site_reviews').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidateTag(REVIEWS_TAG, 'max')
  return NextResponse.json({ ok: true })
}
