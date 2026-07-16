import { NextRequest, NextResponse } from 'next/server'
import { requireKpisAccess } from '@/lib/auth/require-admin'
import { getBizKpis } from '@/lib/biz/kpis'

/**
 * GET /api/admin/kpis/negocio?month=YYYY-MM-01
 * Business KPI dashboard from the imported monthly packet.
 */
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const denied = await requireKpisAccess()
  if (denied) return denied

  const { searchParams } = new URL(request.url)
  const month = searchParams.get('month')
  if (month && !/^\d{4}-\d{2}-01$/.test(month)) {
    return NextResponse.json({ error: 'mes inválido' }, { status: 400 })
  }
  try {
    return NextResponse.json(await getBizKpis(month))
  } catch (err) {
    console.error('kpis/negocio failed:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 }
    )
  }
}
