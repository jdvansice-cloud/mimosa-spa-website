import { NextRequest, NextResponse } from 'next/server'
import { confirmAppointment } from '@/lib/booking/mindbody'

// GET /api/cita/confirmar?id=12345
// Confirms an appointment in Mindbody
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const appointmentId = searchParams.get('id')

    if (!appointmentId) {
      return NextResponse.redirect(
        new URL('/cita/resultado?status=error&message=ID de cita no proporcionado', request.url)
      )
    }

    const success = await confirmAppointment(parseInt(appointmentId))

    if (!success) {
      return NextResponse.redirect(
        new URL('/cita/resultado?status=error&message=No se pudo confirmar la cita', request.url)
      )
    }

    return NextResponse.redirect(
      new URL('/cita/resultado?status=confirmada', request.url)
    )

  } catch (error) {
    console.error('Error confirming appointment:', error)
    return NextResponse.redirect(
      new URL('/cita/resultado?status=error&message=Error al procesar la solicitud', request.url)
    )
  }
}
