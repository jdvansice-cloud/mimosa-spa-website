import { NextRequest, NextResponse } from 'next/server'
import { requireKpisAccess } from '@/lib/auth/require-admin'
import { importPacketFiles } from '@/lib/biz/import'

/**
 * POST /api/admin/kpis/negocio/import — multipart form with `files`.
 * Parses the monthly accountant packet (content-based detection) and stores
 * rows + originals in Supabase. Re-uploads supersede same-month imports.
 */
export const dynamic = 'force-dynamic'
export const maxDuration = 120

export async function POST(request: NextRequest) {
  const denied = await requireKpisAccess()
  if (denied) return denied

  try {
    const form = await request.formData()
    const entries = form.getAll('files').filter((f): f is File => f instanceof File)
    if (entries.length === 0) {
      return NextResponse.json({ error: 'sin archivos' }, { status: 400 })
    }
    if (entries.length > 60) {
      return NextResponse.json({ error: 'demasiados archivos (máx. 60)' }, { status: 400 })
    }
    const files = await Promise.all(
      entries.map(async f => ({ filename: f.name, buffer: Buffer.from(await f.arrayBuffer()) }))
    )
    const results = await importPacketFiles(files)
    return NextResponse.json({ results })
  } catch (err) {
    console.error('negocio/import failed:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 }
    )
  }
}
