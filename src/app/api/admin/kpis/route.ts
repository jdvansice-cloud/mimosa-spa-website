import { NextRequest, NextResponse } from 'next/server'
import { requireKpisAccess } from '@/lib/auth/require-admin'
import { getKpis, type KpiLocation, type KpiPeriod } from '@/lib/kpis/queries'

/**
 * GET /api/admin/kpis?period=today|7d|mtd|90d&location=all|1|2
 * KPI payload for the /admin/kpis dashboard. Reads only the mb_* cache
 * tables (never calls Mindbody), so responses are fast.
 */
export const dynamic = 'force-dynamic'

const PERIODS = new Set<KpiPeriod>(['today', 'mtd', 'lastmonth', 'ytd'])

export async function GET(request: NextRequest) {
  const denied = await requireKpisAccess()
  if (denied) return denied

  const { searchParams } = new URL(request.url)
  const periodParam = (searchParams.get('period') ?? 'mtd') as KpiPeriod
  const locationParam = searchParams.get('location') ?? 'all'

  if (!PERIODS.has(periodParam)) {
    return NextResponse.json({ error: 'period inválido' }, { status: 400 })
  }
  let location: KpiLocation
  if (locationParam === 'all') location = 'all'
  else if (locationParam === '1') location = 1
  else if (locationParam === '2') location = 2
  else return NextResponse.json({ error: 'location inválida' }, { status: 400 })

  try {
    const payload = await getKpis(periodParam, location, searchParams.get('gc') === '1')
    return NextResponse.json(payload)
  } catch (err) {
    console.error('KPI query failed:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 }
    )
  }
}
