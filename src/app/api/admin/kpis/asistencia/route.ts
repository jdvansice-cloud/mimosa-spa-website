import { NextRequest, NextResponse } from 'next/server'
import { requireKpisAccess } from '@/lib/auth/require-admin'
import { getAttendance } from '@/lib/ta/report'

/**
 * GET /api/admin/kpis/asistencia?month=YYYY-MM-01
 * Attendance review: TC7 clock punches joined with Mindbody scheduled
 * shifts and booked appointments.
 */
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request: NextRequest) {
  const denied = await requireKpisAccess()
  if (denied) return denied

  const { searchParams } = new URL(request.url)
  const month = searchParams.get('month')
  if (month && !/^\d{4}-\d{2}-01$/.test(month)) {
    return NextResponse.json({ error: 'mes inválido' }, { status: 400 })
  }
  try {
    return NextResponse.json(await getAttendance(month))
  } catch (err) {
    console.error('kpis/asistencia failed:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 }
    )
  }
}
