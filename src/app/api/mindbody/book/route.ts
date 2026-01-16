import { NextRequest, NextResponse } from 'next/server'
import { addMultipleAppointments } from '@/lib/booking/mindbody'
import { sendBookingConfirmation, isWatiConfigured } from '@/lib/booking/wati'
import {
  validateRequired,
  sanitizeError,
  ERROR_MESSAGES,
  formatDateForPanama,
  formatTimeForPanama,
  isDateTimeInPastForPanama
} from '@/lib/booking/constants'
import {
  checkRateLimit,
  getClientIdentifier,
  createRateLimitHeaders,
  RATE_LIMIT_BOOKING
} from '@/lib/booking/rate-limit'

// Service type from request body
interface BookingService {
  sessionTypeId: number
  duration: number
  name?: string
}

// POST /api/mindbody/book
export async function POST(request: NextRequest) {
  // Apply rate limiting first
  const clientId_rl = getClientIdentifier(request)
  const rateLimitResult = checkRateLimit(`book:${clientId_rl}`, RATE_LIMIT_BOOKING)

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Por favor espera unos minutos.' },
      {
        status: 429,
        headers: createRateLimitHeaders(rateLimitResult)
      }
    )
  }

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

    // Validate required fields
    const validation = validateRequired(
      { clientId, locationId, services, startDateTime },
      ['clientId', 'locationId', 'services', 'startDateTime']
    )

    if (!validation.valid) {
      return NextResponse.json(
        {
          error: 'Faltan campos requeridos',
          details: `Campos faltantes: ${validation.missing.join(', ')}`
        },
        { status: 400 }
      )
    }

    // CRITICAL: Validate Mindbody client ID is a valid number
    // This prevents bookings without a proper Mindbody client record
    if (!clientId || typeof clientId !== 'number' || clientId <= 0 || !Number.isInteger(clientId)) {
      console.error('Invalid Mindbody client ID:', clientId, typeof clientId)
      return NextResponse.json(
        {
          error: 'ID de cliente Mindbody inválido',
          details: 'Se requiere un ID de cliente válido de Mindbody para crear la reserva. Por favor inicia sesión nuevamente.'
        },
        { status: 400 }
      )
    }

    // Validate services array
    if (!Array.isArray(services) || services.length === 0) {
      return NextResponse.json(
        { error: 'Debes seleccionar al menos un servicio' },
        { status: 400 }
      )
    }

    // Validate each service has required fields
    for (const service of services as BookingService[]) {
      if (!service.sessionTypeId || typeof service.sessionTypeId !== 'number') {
        return NextResponse.json(
          { error: 'Servicio inválido: falta sessionTypeId' },
          { status: 400 }
        )
      }
      if (!service.duration || typeof service.duration !== 'number' || service.duration <= 0) {
        return NextResponse.json(
          { error: 'Servicio inválido: duración debe ser mayor a 0' },
          { status: 400 }
        )
      }
    }

    // Validate startDateTime is a valid date
    const startDate = new Date(startDateTime)
    if (isNaN(startDate.getTime())) {
      return NextResponse.json(
        { error: 'Fecha/hora de inicio inválida' },
        { status: 400 }
      )
    }

    // Don't allow bookings in the past (using Panama timezone)
    if (isDateTimeInPastForPanama(startDateTime)) {
      return NextResponse.json(
        { error: 'No se puede reservar en el pasado' },
        { status: 400 }
      )
    }

    // Build appointments array with consecutive start times
    const appointments: Array<{
      ClientId: number
      LocationId: number
      StaffId: number | undefined
      SessionTypeId: number
      StartDateTime: string
      Notes: string | undefined
    }> = []
    let currentStartTime = new Date(startDateTime)

    console.log('=== BOOKING API ===')
    console.log('Client ID:', clientId)
    console.log('Location ID:', locationId)
    console.log('Staff ID:', staffId)
    console.log('Start DateTime:', startDateTime)
    console.log('Services:', JSON.stringify(services, null, 2))

    for (const service of services as BookingService[]) {
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

    console.log('Appointments to create:', JSON.stringify(appointments, null, 2))

    // Submit all appointments
    const results = await addMultipleAppointments(appointments)

    console.log('Booking results:', JSON.stringify(results, null, 2))

    // Check for any failures
    const failures = results.filter(r => !r.success)
    const successes = results.filter(r => r.success)

    // If all failed, return error
    if (failures.length === results.length) {
      console.error('All appointments failed:', failures)
      return NextResponse.json(
        { error: ERROR_MESSAGES.BOOKING_FAILED },
        { status: 500 }
      )
    }

    // Generate confirmation number
    const confirmationNumber = `MIM-${Date.now().toString(36).toUpperCase()}`

    // Get successful appointments
    const successfulAppointments = successes.map(r => r.appointment)

    // Get therapist name - either from request or from Mindbody response
    let finalTherapistName = therapistName
    if (!finalTherapistName && successfulAppointments.length > 0) {
      const firstAppointment = successfulAppointments[0]
      if (firstAppointment?.Staff) {
        finalTherapistName = firstAppointment.Staff.DisplayName ||
          `${firstAppointment.Staff.FirstName} ${firstAppointment.Staff.LastName}`
      }
    }

    // Handle partial booking failures
    let partialBookingWarning: string | null = null
    if (failures.length > 0 && successes.length > 0) {
      // Map failures to service names for better logging
      const failedServiceDetails = failures.map((f, i) => {
        const failedResult = f as { error: string; sessionTypeId?: number; startDateTime?: string }
        const matchingService = (services as BookingService[]).find(s =>
          appointments.findIndex(a =>
            a.SessionTypeId === s.sessionTypeId &&
            failedResult.sessionTypeId === s.sessionTypeId
          ) >= 0
        )
        return {
          index: i,
          serviceName: matchingService?.name || 'Unknown',
          sessionTypeId: failedResult.sessionTypeId,
          startDateTime: failedResult.startDateTime,
          error: failedResult.error
        }
      })

      console.warn('Partial booking failure:', {
        totalRequested: services.length,
        successful: successes.length,
        failed: failures.length,
        failedServices: failedServiceDetails
      })
      partialBookingWarning = ERROR_MESSAGES.PARTIAL_BOOKING
    }

    // Send WhatsApp confirmation if WATI is configured and client phone is provided
    let whatsappSent = false
    if (isWatiConfigured() && clientPhone && clientName && finalTherapistName) {
      try {
        // Format date for display using Panama timezone
        const bookingDate = new Date(startDateTime)
        const dateStr = formatDateForPanama(bookingDate)
        const timeStr = formatTimeForPanama(bookingDate)

        // Get service names
        const serviceNames = (services as BookingService[])
          .map(s => s.name || 'Servicio')
          .filter(Boolean)

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
      totalRequested: services.length,
      whatsappSent,
      partialBookingWarning,
      message: failures.length > 0
        ? `${successfulAppointments.length} de ${services.length} servicios reservados`
        : 'Todos los servicios reservados exitosamente'
    })

  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: sanitizeError(error) },
      { status: 500 }
    )
  }
}
