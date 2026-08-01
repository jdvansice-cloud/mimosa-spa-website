import { NextResponse } from 'next/server'
import { requireKpisAccess } from '@/lib/auth/require-admin'
import { runIncrementalSync } from '@/lib/kpis/sync'

/**
 * POST /api/admin/kpis/sync
 * "Actualizar ahora" button on the KPI dashboard — runs the same
 * incremental sync as the hourly cron, on demand.
 */
export const dynamic = 'force-dynamic'
export const maxDuration = 120

export async function POST() {
  const denied = await requireKpisAccess()
  if (denied) return denied

  try {
    const result = await runIncrementalSync()
    return NextResponse.json(result)
  } catch (err) {
    console.error('Manual KPI sync failed:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Sync failed' },
      { status: 500 }
    )
  }
}
