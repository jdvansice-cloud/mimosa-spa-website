import { NextRequest, NextResponse } from 'next/server'
import { requireKpisAccess } from '@/lib/auth/require-admin'
import { getAgendaMonth } from '@/lib/kpis/report'
import type { KpiLocation } from '@/lib/kpis/queries'

/**
 * GET /api/admin/kpis/agenda?month=YYYY-MM&location=all|1|2
 * Appointment counts per day for the calendar view.
 */
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const denied = await requireKpisAccess()
  if (denied) return denied

  const { searchParams } = new URL(request.url)
  const month = searchParams.get('month') ?? ''
  const locationParam = searchParams.get('location') ?? 'all'

  if (!/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ error: 'mes inválido' }, { status: 400 })
  }
  let location: KpiLocation
  if (locationParam === 'all') location = 'all'
  else if (locationParam === '1') location = 1
  else if (locationParam === '2') location = 2
  else return NextResponse.json({ error: 'location inválida' }, { status: 400 })

  try {
    return NextResponse.json(await getAgendaMonth(month, location))
  } catch (err) {
    console.error('agenda failed:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 }
    )
  }
}
