import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/auth/require-admin'
import { validateMediaKey, validateMediaFile } from '@/lib/wati-agent/media-validate'

const BUCKET = 'wati-agent-media'

function serviceClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied
  const sb = serviceClient()
  const { data, error } = await sb.from('wati_agent_media').select('*').order('key', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const rows = (data ?? []).map(row => ({
    ...row,
    publicUrl: sb.storage.from(BUCKET).getPublicUrl(row.storage_path).data.publicUrl,
  }))
  return NextResponse.json({ data: rows })
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  const form = await req.formData()
  const file = form.get('file') as File | null
  const rawKey = form.get('key')
  const description = String(form.get('description') ?? '')
  const caption = String(form.get('caption') ?? '')
  const valid_from = (form.get('valid_from') as string) || null
  const valid_until = (form.get('valid_until') as string) || null

  if (!file || !rawKey) {
    return NextResponse.json({ error: 'file y key son requeridos' }, { status: 400 })
  }

  const key = validateMediaKey(rawKey)
  if (!key) {
    return NextResponse.json(
      { error: 'key inválida: use letras minúsculas, números, guiones' },
      { status: 400 },
    )
  }

  const fileError = validateMediaFile(file)
  if (fileError) {
    return NextResponse.json({ error: fileError }, { status: 400 })
  }

  const sb = serviceClient()
  const safeName = file.name.replace(/[^A-Za-z0-9._-]/g, '_')
  const storagePath = `${key}/${Date.now()}-${safeName}`
  const bytes = new Uint8Array(await file.arrayBuffer())
  const { error: uploadError } = await sb.storage
    .from(BUCKET)
    .upload(storagePath, bytes, { contentType: file.type || 'application/octet-stream', upsert: true })
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  const { data, error } = await sb
    .from('wati_agent_media')
    .upsert(
      { key, description, caption, storage_path: storagePath, valid_from, valid_until, active: true },
      { onConflict: 'key' },
    )
    .select('*')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    data: { ...data, publicUrl: sb.storage.from(BUCKET).getPublicUrl(storagePath).data.publicUrl },
  })
}

export async function DELETE(req: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied
  const rawKey = req.nextUrl.searchParams.get('key')
  if (!rawKey) return NextResponse.json({ error: 'key es requerido' }, { status: 400 })
  const key = validateMediaKey(rawKey)
  if (!key) {
    return NextResponse.json(
      { error: 'key inválida: use letras minúsculas, números, guiones' },
      { status: 400 },
    )
  }

  const sb = serviceClient()
  const { data: row } = await sb.from('wati_agent_media').select('storage_path').eq('key', key).maybeSingle()
  if (row?.storage_path) {
    await sb.storage.from(BUCKET).remove([row.storage_path])
  }
  const { error } = await sb.from('wati_agent_media').delete().eq('key', key)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
