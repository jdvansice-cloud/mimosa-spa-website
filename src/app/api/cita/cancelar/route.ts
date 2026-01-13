import { NextRequest, NextResponse } from 'next/server'
import { mindbodyRequest } from '@/lib/booking/mindbody'

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
    
    // Cancel appointment in Mindbody
    // The AppointmentId uniquely identifies the appointment in Mindbody
    // Mindbody will find and cancel that specific appointment
    const result = await mindbodyRequest<{ Appointment?: unknown; Error?: { Message: string } }>(
      '/appointment/updateappointment',
      {
        method: 'POST',
        body: {
          AppointmentId: parseInt(appointmentId),
          Status: 'Cancelled',
          Notes: 'Cancelado por cliente vía WhatsApp',
        },
      }
    )
    
    if (result.Error) {
      console.error('Mindbody error cancelling appointment:', result.Error)
      return NextResponse.redirect(
        new URL('/cita/resultado?status=error&message=No se pudo cancelar la cita', request.url)
      )
    }
    
    // Redirect to cancellation success page
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
