import { NextRequest, NextResponse } from 'next/server'
import { requireKpisAccess } from '@/lib/auth/require-admin'
import { importAttendanceFiles } from '@/lib/ta/import'

/**
 * POST /api/admin/kpis/asistencia/import — multipart form with `files`.
 * Parses NGTeco Time exports (xlsx/xls/csv) and upserts punches; re-uploads
 * of overlapping date ranges correct earlier rows instead of duplicating.
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
    if (entries.length > 20) {
      return NextResponse.json({ error: 'demasiados archivos (máx. 20)' }, { status: 400 })
    }
    const files = await Promise.all(
      entries.map(async f => ({ filename: f.name, buffer: Buffer.from(await f.arrayBuffer()) }))
    )
    const results = await importAttendanceFiles(files)
    return NextResponse.json({ results })
  } catch (err) {
    console.error('asistencia/import failed:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 }
    )
  }
}
