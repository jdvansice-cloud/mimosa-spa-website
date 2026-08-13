import { NextRequest, NextResponse } from 'next/server'
import { confirmAppointment } from '@/lib/booking/mindbody'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// GET /api/cita/confirmar?id=12345
// Confirms an appointment in Mindbody.
// UUID ids are Nura (the new platform) appointments — the approved WhatsApp
// template's URL buttons point at this domain, so we forward those to Nura.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const appointmentId = searchParams.get('id')

    if (!appointmentId) {
      return NextResponse.redirect(
        new URL('/cita/resultado?status=error&message=ID de cita no proporcionado', request.url)
      )
    }

    if (UUID_RE.test(appointmentId) && process.env.NURA_PLATFORM_URL) {
      return NextResponse.redirect(
        `${process.env.NURA_PLATFORM_URL}/cita/confirmar?id=${appointmentId}`
      )
    }

    const parsedId = parseInt(appointmentId, 10)
    if (isNaN(parsedId) || parsedId <= 0) {
      console.error('Invalid appointment ID received:', appointmentId)
      return NextResponse.redirect(
        new URL('/cita/resultado?status=error&message=ID de cita inválido', request.url)
      )
    }

    const success = await confirmAppointment(parsedId)

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
