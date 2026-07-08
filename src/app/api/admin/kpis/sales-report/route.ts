import { NextRequest, NextResponse } from 'next/server'
import { requireKpisAccess } from '@/lib/auth/require-admin'
import { getSalesReport } from '@/lib/kpis/report'
import type { KpiLocation } from '@/lib/kpis/queries'

/**
 * GET /api/admin/kpis/sales-report?start=YYYY-MM-DD&end=YYYY-MM-DD&location=all|1|2
 * Range summary for the daily sales report: comparative series vs the same
 * dates last year + per-day rollups. Reads only the kpi_daily_* views.
 */
export const dynamic = 'force-dynamic'

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const MAX_SPAN_DAYS = 730

export async function GET(request: NextRequest) {
  const denied = await requireKpisAccess()
  if (denied) return denied

  const { searchParams } = new URL(request.url)
  const start = searchParams.get('start') ?? ''
  const end = searchParams.get('end') ?? ''
  const locationParam = searchParams.get('location') ?? 'all'

  if (!DATE_RE.test(start) || !DATE_RE.test(end) || start > end) {
    return NextResponse.json({ error: 'rango de fechas inválido' }, { status: 400 })
  }
  const span = (Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86400000
  if (span > MAX_SPAN_DAYS) {
    return NextResponse.json({ error: `máximo ${MAX_SPAN_DAYS} días` }, { status: 400 })
  }
  let location: KpiLocation
  if (locationParam === 'all') location = 'all'
  else if (locationParam === '1') location = 1
  else if (locationParam === '2') location = 2
  else return NextResponse.json({ error: 'location inválida' }, { status: 400 })

  try {
    return NextResponse.json(await getSalesReport(start, end, location, searchParams.get('gc') === '1'))
  } catch (err) {
    console.error('sales-report failed:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 }
    )
  }
}
