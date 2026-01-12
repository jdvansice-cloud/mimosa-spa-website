import { NextRequest, NextResponse } from 'next/server'
import { addMultipleAppointments } from '@/lib/booking/mindbody'

// POST /api/mindbody/book
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      clientId, 
      locationId, 
      services, // Array of { sessionTypeId, duration }
      staffId,
      startDateTime, // ISO string
      notes,
      promotionName
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
    
    return NextResponse.json({
      success: true,
      confirmationNumber,
      appointments: successfulAppointments,
      totalBooked: successfulAppointments.length,
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
