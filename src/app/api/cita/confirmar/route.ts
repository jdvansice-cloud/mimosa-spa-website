import { NextRequest, NextResponse } from 'next/server'
import { mindbodyRequest } from '@/lib/booking/mindbody'

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
    
    // Update appointment in Mindbody
    // The AppointmentId uniquely identifies the appointment in Mindbody
    // Mindbody will find and update that specific appointment
    const result = await mindbodyRequest<{ Appointment?: unknown; Error?: { Message: string } }>(
      '/appointment/updateappointment',
      {
        method: 'POST',
        body: {
          AppointmentId: parseInt(appointmentId),
          Notes: 'Cliente confirmó asistencia vía WhatsApp',
        },
      }
    )
    
    if (result.Error) {
      console.error('Mindbody error confirming appointment:', result.Error)
      return NextResponse.redirect(
        new URL('/cita/resultado?status=error&message=No se pudo confirmar la cita', request.url)
      )
    }
    
    // Redirect to success page
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
