import { NextRequest, NextResponse } from 'next/server'
import { requireKpisAccess } from '@/lib/auth/require-admin'
import { getCapacity } from '@/lib/kpis/capacity'

/**
 * GET /api/admin/kpis/capacidad?date=YYYY-MM-DD
 * Bed/space occupancy per 30-min block for both locations, plus the
 * last-4-weeks weekday peak summary. Capacity ceilings: CDE 14 · SFC 19.
 */
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const denied = await requireKpisAccess()
  if (denied) return denied

  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date') ?? ''
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'fecha inválida' }, { status: 400 })
  }

  try {
    return NextResponse.json(await getCapacity(date))
  } catch (err) {
    console.error('capacidad failed:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 }
    )
  }
}
