import { NextRequest, NextResponse } from 'next/server'
import { requireKpisAccess } from '@/lib/auth/require-admin'
import { getStaffKpis } from '@/lib/kpis/staff'
import type { KpiLocation, KpiPeriod } from '@/lib/kpis/queries'

/**
 * GET /api/admin/kpis/staff?period=mtd|lastmonth|ytd&location=all|1|2
 * Per-therapist performance KPIs for the Staff page.
 */
export const dynamic = 'force-dynamic'

const PERIODS = new Set<KpiPeriod>(['mtd', 'lastmonth', 'ytd'])

export async function GET(request: NextRequest) {
  const denied = await requireKpisAccess()
  if (denied) return denied

  const { searchParams } = new URL(request.url)
  const period = (searchParams.get('period') ?? 'mtd') as KpiPeriod
  const locationParam = searchParams.get('location') ?? 'all'

  if (!PERIODS.has(period)) {
    return NextResponse.json({ error: 'period inválido' }, { status: 400 })
  }
  let location: KpiLocation
  if (locationParam === 'all') location = 'all'
  else if (locationParam === '1') location = 1
  else if (locationParam === '2') location = 2
  else return NextResponse.json({ error: 'location inválida' }, { status: 400 })

  try {
    return NextResponse.json(await getStaffKpis(period, location))
  } catch (err) {
    console.error('staff kpis failed:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 }
    )
  }
}
