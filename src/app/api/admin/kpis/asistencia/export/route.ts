import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { requireKpisAccess } from '@/lib/auth/require-admin'
import { getAttendance, LATE_GRACE_MIN } from '@/lib/ta/report'

/**
 * GET /api/admin/kpis/asistencia/export?month=YYYY-MM-01
 * Payroll handoff for the accountant: one Excel with a per-employee summary
 * (total + per-quincena hours — Panama pays biweekly: 1–15 and 16–end)
 * and a per-day detail sheet with punches and incident flags.
 */
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const h2 = (min: number): number => Math.round((min / 60) * 100) / 100

export async function GET(request: NextRequest) {
  const denied = await requireKpisAccess()
  if (denied) return denied

  const { searchParams } = new URL(request.url)
  const month = searchParams.get('month')
  if (month && !/^\d{4}-\d{2}-01$/.test(month)) {
    return NextResponse.json({ error: 'mes inválido' }, { status: 400 })
  }
  try {
    const data = await getAttendance(month)
    if (!('month' in data)) {
      return NextResponse.json({ error: 'sin marcaciones' }, { status: 404 })
    }

    const q1End = `${data.month.slice(0, 7)}-15`
    const summary = data.employees.map(e => {
      const q1 = e.detail.filter(d => d.date <= q1End && d.shifts > 0)
      const q2 = e.detail.filter(d => d.date > q1End && d.shifts > 0)
      return {
        'Empleado': e.name,
        'Staff Mindbody': e.mbName ?? 'SIN MATCH',
        'Días trabajados': e.days,
        'Horas totales': h2(e.workedMin),
        'Horas Q1 (1–15)': h2(q1.reduce((s, d) => s + d.workedMin, 0)),
        'Horas Q2 (16–fin)': h2(q2.reduce((s, d) => s + d.workedMin, 0)),
        'Horas programadas (Mindbody)': e.schedMin > 0 ? h2(e.schedMin) : null,
        'Horas en citas': h2(e.apptMin),
        'Tardanzas (>5 min)': e.lateDays,
        'Salidas tempranas': e.earlyOutDays,
        'Sin marcar salida': e.missingOutDays,
        'Ausencias con horario': e.absentDays,
      }
    })

    const detail = data.employees.flatMap(e =>
      e.detail.map(d => ({
        'Empleado': e.name,
        'Fecha': d.date,
        'Entrada': d.clockIn ?? '',
        'Salida': d.clockOut ?? '',
        'Horas': d.shifts > 0 ? h2(d.workedMin) : null,
        'Horario Mindbody': d.schedStart ? `${d.schedStart}–${d.schedEnd}` : '',
        'Citas (min)': d.apptMin || null,
        'Observación': [
          d.shifts === 0 ? 'no marcó (tenía horario)' : '',
          d.lateMin !== null && d.lateMin > LATE_GRACE_MIN ? `llegó ${d.lateMin} min tarde` : '',
          d.missingOut ? 'sin marcar salida' : '',
          !d.missingOut && d.earlyOutMin !== null && d.earlyOutMin > LATE_GRACE_MIN ? `salió ${d.earlyOutMin} min antes` : '',
        ].filter(Boolean).join(' · '),
      }))
    )

    const wb = XLSX.utils.book_new()
    const ws1 = XLSX.utils.json_to_sheet(summary)
    ws1['!cols'] = [{ wch: 24 }, { wch: 24 }, { wch: 14 }, { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 24 }, { wch: 13 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 20 }]
    XLSX.utils.book_append_sheet(wb, ws1, 'Resumen planilla')
    const ws2 = XLSX.utils.json_to_sheet(detail)
    ws2['!cols'] = [{ wch: 24 }, { wch: 11 }, { wch: 8 }, { wch: 8 }, { wch: 7 }, { wch: 16 }, { wch: 10 }, { wch: 40 }]
    XLSX.utils.book_append_sheet(wb, ws2, 'Detalle diario')

    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer
    const filename = `asistencia-${data.month.slice(0, 7)}.xlsx`
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('asistencia/export failed:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 }
    )
  }
}
