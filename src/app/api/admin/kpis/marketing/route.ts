import { NextRequest, NextResponse } from 'next/server'
import { requireKpisAccess } from '@/lib/auth/require-admin'
import { getMarketing } from '@/lib/kpis/marketing'
import type { KpiLocation, KpiPeriod } from '@/lib/kpis/queries'

/**
 * GET /api/admin/kpis/marketing?period=mtd|lastmonth|ytd&location=all|1|2
 * First-party web analytics: traffic, channels, booking funnel.
 */
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const denied = await requireKpisAccess()
  if (denied) return denied

  const { searchParams } = new URL(request.url)
  const periodParam = searchParams.get('period') ?? 'mtd'
  const locationParam = searchParams.get('location') ?? 'all'

  if (!['mtd', 'lastmonth', 'ytd'].includes(periodParam)) {
    return NextResponse.json({ error: 'período inválido' }, { status: 400 })
  }
  let location: KpiLocation
  if (locationParam === 'all') location = 'all'
  else if (locationParam === '1') location = 1
  else if (locationParam === '2') location = 2
  else return NextResponse.json({ error: 'location inválida' }, { status: 400 })

  try {
    return NextResponse.json(await getMarketing(periodParam as KpiPeriod, location))
  } catch (err) {
    console.error('kpis/marketing failed:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 }
    )
  }
}
