import { NextRequest, NextResponse } from 'next/server'
import { removeAppointment } from '@/lib/booking/mindbody'

// GET /api/cita/cancelar?id=12345
// Cancels an appointment in Mindbody
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const appointmentId = searchParams.get('id')

    if (!appointmentId) {
      return NextResponse.redirect(
        new URL('/cita/resultado?status=error&message=ID de cita no proporcionado', request.url)
      )
    }

    const success = await removeAppointment(parseInt(appointmentId))

    if (!success) {
      return NextResponse.redirect(
        new URL('/cita/resultado?status=error&message=No se pudo cancelar la cita', request.url)
      )
    }

    return NextResponse.redirect(
      new URL('/cita/resultado?status=cancelada', request.url)
    )

  } catch (error) {
    console.error('Error cancelling appointment:', error)
    return NextResponse.redirect(
      new URL('/cita/resultado?status=error&message=Error al procesar la solicitud', request.url)
    )
  }
}
