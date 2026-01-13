import { NextRequest, NextResponse } from 'next/server'
import { addMultipleAppointments } from '@/lib/booking/mindbody'
import { sendBookingConfirmation, isWatiConfigured } from '@/lib/booking/wati'

// POST /api/mindbody/book
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      clientId, 
      locationId, 
      services, // Array of { sessionTypeId, duration, name }
      staffId,
      startDateTime, // ISO string
      notes,
      promotionName,
      // Client info for WhatsApp notification
      clientName,
      clientPhone,
      locationName,
      therapistName,
      totalDuration,
    } = body
    
    if (!clientId || !locationId || !services || !startDateTime) {
      return NextResponse.json(
        { error: 'clientId, locationId, services, and startDateTime are required' },
        { status: 400 }
      )
    }
    
    // Build appointments array with consecutive start times
    const appointments = []
    let currentStartTime = new Date(startDateTime)
    
    for (const service of services) {
      appointments.push({
        ClientId: clientId,
        LocationId: locationId,
        StaffId: staffId || undefined,
        SessionTypeId: service.sessionTypeId,
        StartDateTime: currentStartTime.toISOString(),
        Notes: promotionName 
          ? `Promoción: ${promotionName}${notes ? ` | ${notes}` : ''}`
          : notes,
      })
      
      // Move start time for next service
      currentStartTime = new Date(
        currentStartTime.getTime() + (service.duration * 60 * 1000)
      )
    }
    
    // Submit all appointments
    const results = await addMultipleAppointments(appointments)
    
    // Check for any failures
    const failures = results.filter(r => !r.success)
    if (failures.length > 0) {
      console.error('Some appointments failed:', failures)
      
      // If all failed, return error
      if (failures.length === results.length) {
        return NextResponse.json(
          { error: 'Failed to create appointments', details: failures },
          { status: 500 }
        )
      }
    }
    
    // Generate confirmation number
    const confirmationNumber = `MIM-${Date.now().toString(36).toUpperCase()}`
    
    // Get successful appointments
    const successfulAppointments = results
      .filter(r => r.success)
      .map(r => r.appointment)
    
    // Get therapist name - either from request or from Mindbody response
    let finalTherapistName = therapistName
    if (!finalTherapistName && successfulAppointments.length > 0) {
      const firstAppointment = successfulAppointments[0]
      if (firstAppointment?.Staff) {
        finalTherapistName = firstAppointment.Staff.DisplayName || 
          `${firstAppointment.Staff.FirstName} ${firstAppointment.Staff.LastName}`
      }
    }
    
    // Send WhatsApp confirmation if WATI is configured and client phone is provided
    let whatsappSent = false
    if (isWatiConfigured() && clientPhone && clientName && finalTherapistName) {
      try {
        // Format date for display
        const bookingDate = new Date(startDateTime)
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
        const dateStr = `${days[bookingDate.getDay()]}, ${bookingDate.getDate()} de ${months[bookingDate.getMonth()]} ${bookingDate.getFullYear()}`
        
        // Format time
        const hours = bookingDate.getHours()
        const minutes = bookingDate.getMinutes()
        const period = hours >= 12 ? 'PM' : 'AM'
        const displayHours = hours % 12 || 12
        const timeStr = `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
        
        // Get service names
        const serviceNames = services.map((s: { name?: string }) => s.name || 'Servicio').filter(Boolean)
        
        const watiResult = await sendBookingConfirmation({
          clientName,
          clientPhone,
          locationName: locationName || 'Mimosa Spa Retreat',
          date: dateStr,
          time: timeStr,
          services: serviceNames,
          totalDuration: totalDuration || 60,
          therapistName: finalTherapistName,
        })
        
        whatsappSent = watiResult.result
        if (!watiResult.result) {
          console.warn('WhatsApp notification failed:', watiResult.error)
        }
      } catch (watiError) {
        console.error('Error sending WhatsApp notification:', watiError)
        // Don't fail the booking if WhatsApp fails
      }
    }
    
    return NextResponse.json({
      success: true,
      confirmationNumber,
      appointments: successfulAppointments,
      totalBooked: successfulAppointments.length,
      whatsappSent,
      message: failures.length > 0 
        ? `${successfulAppointments.length} of ${services.length} services booked`
        : 'All services booked successfully'
    })
    
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
