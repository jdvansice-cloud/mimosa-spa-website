import { NextRequest, NextResponse } from 'next/server'
import { requireKpisAccess } from '@/lib/auth/require-admin'
import { getAgendaDay } from '@/lib/kpis/report'
import type { KpiLocation } from '@/lib/kpis/queries'

/**
 * GET /api/admin/kpis/agenda/day?date=YYYY-MM-DD&location=all|1|2
 * One day's appointments (cancelled excluded) for the schedule view.
 */
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const denied = await requireKpisAccess()
  if (denied) return denied

  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date') ?? ''
  const locationParam = searchParams.get('location') ?? 'all'

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'fecha inválida' }, { status: 400 })
  }
  let location: KpiLocation
  if (locationParam === 'all') location = 'all'
  else if (locationParam === '1') location = 1
  else if (locationParam === '2') location = 2
  else return NextResponse.json({ error: 'location inválida' }, { status: 400 })

  try {
    return NextResponse.json({ date, appointments: await getAgendaDay(date, location) })
  } catch (err) {
    console.error('agenda/day failed:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 }
    )
  }
}
