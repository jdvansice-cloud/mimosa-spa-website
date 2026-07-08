import { NextResponse } from 'next/server'
import { requireKpisAccess } from '@/lib/auth/require-admin'
import { syncTodayAppointments } from '@/lib/kpis/sync'

/**
 * POST /api/admin/kpis/sync-today
 * Fired in the background when the Agenda opens: refreshes today's
 * appointments (skipped if already synced in the last 5 minutes).
 */
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST() {
  const denied = await requireKpisAccess()
  if (denied) return denied

  try {
    return NextResponse.json(await syncTodayAppointments(5))
  } catch (err) {
    console.error('sync-today failed:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Sync failed' },
      { status: 500 }
    )
  }
}
