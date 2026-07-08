import { NextRequest, NextResponse } from 'next/server'
import {
  runIncrementalSync,
  syncSales,
  syncAppointments,
  syncClients,
} from '@/lib/kpis/sync'

/**
 * GET /api/cron/sync-kpis
 * Copies Mindbody sales/appointments/clients into the mb_* cache tables.
 *
 * Scheduled (no params): incremental sync — see runIncrementalSync().
 *
 * Backfill mode (manual, same CRON_SECRET auth):
 *   ?start=YYYY-MM-DD&end=YYYY-MM-DD          sales + appointments for range
 *   &entities=sales,appointments,clients      restrict what to sync
 *   (clients in backfill mode = full client pull, ignores the range)
 * Call in monthly chunks to stay within the function time limit.
 */
export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const start = searchParams.get('start')
  const end = searchParams.get('end')

  try {
    if (start && end) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end)) {
        return NextResponse.json({ error: 'start/end must be YYYY-MM-DD' }, { status: 400 })
      }
      const entities = (searchParams.get('entities') || 'sales,appointments').split(',')
      const result: Record<string, unknown> = { mode: 'backfill', start, end }
      if (entities.includes('sales')) Object.assign(result, await syncSales(start, end))
      if (entities.includes('appointments')) Object.assign(result, await syncAppointments(start, end))
      if (entities.includes('clients')) Object.assign(result, await syncClients())
      console.log('KPI backfill:', JSON.stringify(result))
      return NextResponse.json(result)
    }

    const result = await runIncrementalSync()
    console.log('KPI sync:', JSON.stringify(result))
    return NextResponse.json({ mode: 'incremental', ...result })
  } catch (err) {
    console.error('KPI sync failed:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Sync failed' },
      { status: 500 }
    )
  }
}
