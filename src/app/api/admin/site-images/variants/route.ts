import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { revalidateTag } from 'next/cache'
import { requireAdmin } from '@/lib/auth/require-admin'
import { SITE_IMAGES_TAG } from '@/lib/site-images'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// GET ?key= — list variants for a slot (admin)
export async function GET(request: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  const key = new URL(request.url).searchParams.get('key')
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  let query = supabase
    .from('site_image_variants')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
  if (key) query = query.eq('image_key', key)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

// POST multipart { key, file } — upload a new variant photo for a slot
export async function POST(request: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const formData = await request.formData()
  const file = formData.get('file') as File
  const imageKey = formData.get('key') as string

  if (!file || !imageKey) {
    return NextResponse.json({ error: 'Missing file or key' }, { status: 400 })
  }
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' },
      { status: 400 }
    )
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large. Maximum size: 5MB' }, { status: 400 })
  }

  const extension = file.name.split('.').pop() || 'jpg'
  const filename = `site-images/variants/${imageKey}_${Date.now()}.${extension}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(filename, buffer, { contentType: file.type, upsert: true })
  if (uploadError) {
    return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 })
  }

  const { data: urlData } = supabase.storage.from('images').getPublicUrl(filename)
  const { data, error } = await supabase
    .from('site_image_variants')
    .insert({ image_key: imageKey, image_url: urlData.publicUrl })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  revalidateTag(SITE_IMAGES_TAG, 'max')
  return NextResponse.json({ data })
}

// DELETE ?id= — remove a variant
export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  const id = new URL(request.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const { error } = await supabase.from('site_image_variants').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  revalidateTag(SITE_IMAGES_TAG, 'max')
  return NextResponse.json({ ok: true })
}
