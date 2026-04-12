import { NextRequest, NextResponse } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { addMultipleAppointments, getClientWithCustomFields, removeAppointment } from '@/lib/booking/mindbody'
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

// Lazy-initialized Supabase client to avoid build-time errors
let supabaseAdmin: SupabaseClient | null = null

function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }
  return supabaseAdmin
}

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
      globalDiscountPercent,
      // Client info for WhatsApp notification
      clientName,
      clientPhone,
      locationName,
      therapistName,
      totalDuration,
      staffRequested, // true when user chose a specific therapist
      // Pricing info for Supabase record
      subtotalBeforeTax,
      taxAmount,
      totalWithTax,
      // Appointment replacement: cancel this Mindbody appointment ID after success
      replaceAppointmentId,
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

    // CRITICAL: Verify the client exists in Mindbody and has a name
    // This prevents bookings for non-existent or incomplete client records
    const mindbodyClient = await getClientWithCustomFields(String(clientId))
    if (!mindbodyClient) {
      console.error('Client not found in Mindbody:', clientId)
      return NextResponse.json(
        {
          error: 'Cliente no encontrado en Mindbody',
          details: 'No pudimos encontrar tu cuenta en nuestro sistema. Por favor contacta al spa.'
        },
        { status: 404 }
      )
    }

    // Warn if client has no name (but don't block - Mindbody might still work)
    if (!mindbodyClient.FirstName && !mindbodyClient.LastName) {
      console.warn('BOOKING WARNING: Mindbody client has no name:', {
        Id: mindbodyClient.Id,
        UniqueId: mindbodyClient.UniqueId,
        Email: mindbodyClient.Email
      })
    } else {
      console.log('Mindbody client verified:', {
        Id: mindbodyClient.Id,
        FirstName: mindbodyClient.FirstName,
        LastName: mindbodyClient.LastName,
        Email: mindbodyClient.Email
      })
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
      StaffRequested: boolean
    }> = []
    let currentStartTime = new Date(startDateTime)

    console.log('=== BOOKING API ===')
    console.log('Client ID:', clientId, '(type:', typeof clientId, ')')
    console.log('Client Name from request:', clientName)
    console.log('Client Phone from request:', clientPhone)
    console.log('Location ID:', locationId)
    console.log('Staff ID:', staffId)
    console.log('Start DateTime:', startDateTime)
    console.log('Services:', JSON.stringify(services, null, 2))

    for (const service of services as BookingService[]) {
      // Build notes: always include "Reservado en línea" + optional promotion or global discount + optional custom notes
      const noteParts: string[] = ['Reservado en línea']
      if (promotionName) {
        noteParts.push(`Promo: ${promotionName}`)
      } else if (globalDiscountPercent && globalDiscountPercent > 0) {
        noteParts.push(`Promo Online ${globalDiscountPercent}%`)
      }
      if (notes) {
        noteParts.push(notes)
      }

      appointments.push({
        ClientId: clientId,
        LocationId: locationId,
        StaffId: staffId || undefined,
        SessionTypeId: service.sessionTypeId,
        StartDateTime: currentStartTime.toISOString(),
        Notes: noteParts.join(' | '),
        StaffRequested: !!staffRequested,
      })

      // Move start time for next service
      currentStartTime = new Date(
        currentStartTime.getTime() + (service.duration * 60 * 1000)
      )
    }

    console.log('Appointments to create:', JSON.stringify(appointments, null, 2))

    // Submit all appointments (all-or-nothing: rolls back on failure)
    const result = await addMultipleAppointments(appointments)

    console.log('Booking result:', JSON.stringify(result, null, 2))

    // If booking failed (any appointment couldn't be created), save to Supabase and return error
    if (!result.success) {
      console.error('Booking failed:', result.error)

      // Save failed attempt to Supabase for troubleshooting
      try {
        const supabase = getSupabaseAdmin()
        const servicesData = (services as BookingService[]).map(s => ({
          sessionTypeId: s.sessionTypeId,
          name: s.name || 'Unknown Service',
          duration: s.duration,
        }))

        await supabase.from('bookings').insert({
          confirmation_number: `FAIL-${Date.now().toString(36).toUpperCase()}`,
          status: 'failed',
          mindbody_client_id: clientId,
          client_name: clientName || null,
          client_phone: clientPhone || null,
          client_email: mindbodyClient?.Email || null,
          location_id: locationId,
          location_name: locationName || null,
          staff_id: staffId || null,
          therapist_name: therapistName || null,
          staff_requested: !!staffRequested,
          appointment_start: startDateTime,
          services: servicesData,
          total_duration: totalDuration || null,
          mindbody_appointment_ids: [],
          promotion_name: promotionName || null,
          total_requested: (services as BookingService[]).length,
          total_booked: 0,
          subtotal_before_tax: subtotalBeforeTax || null,
          tax_amount: taxAmount || null,
          total_with_tax: totalWithTax || null,
          whatsapp_sent: false,
          failure_reason: result.error,
        })
      } catch (supabaseError) {
        console.error('Error saving failed booking to Supabase:', supabaseError)
      }

      return NextResponse.json(
        {
          error: 'El horario seleccionado no está disponible para todos los servicios. Por favor elige otro horario.',
          timeUnavailable: true,
        },
        { status: 409 }
      )
    }

    const successfulAppointments = result.appointments

    // Generate confirmation number
    const confirmationNumber = `MIM-${Date.now().toString(36).toUpperCase()}`

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
    // finalTherapistName may be empty when "Any Therapist" was selected — fall back to a default
    if (!finalTherapistName) {
      finalTherapistName = 'Nuestro equipo'
    }

    let whatsappSent = false
    console.log('WhatsApp pre-check:', { watiConfigured: isWatiConfigured(), clientPhone: !!clientPhone, clientName: !!clientName, finalTherapistName })
    if (isWatiConfigured() && clientPhone && clientName) {
      try {
        // Format date for WhatsApp template (dd/mm/yyyy and h:mm a.m./p.m.)
        // startDateTime has no timezone offset — treat it as Panama local time (-05:00)
        const hasOffset = /[Z]$/.test(startDateTime) || /[+-]\d{2}:\d{2}$/.test(startDateTime)
        const bookingDate = new Date(hasOffset ? startDateTime : `${startDateTime}-05:00`)
        const dateStr = bookingDate.toLocaleDateString('es-PA', {
          timeZone: 'America/Panama',
          day: '2-digit', month: '2-digit', year: 'numeric',
        })
        const timeStr = bookingDate.toLocaleTimeString('es-PA', {
          timeZone: 'America/Panama',
          hour: 'numeric', minute: '2-digit', hour12: true,
        })

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

    // Save booking to Supabase (never block the booking response)
    try {
      const supabase = getSupabaseAdmin()

      const mindbodyAppointmentIds = successfulAppointments
        .map(apt => apt?.Id)
        .filter((id): id is number => typeof id === 'number')

      const servicesData = (services as BookingService[]).map(s => ({
        sessionTypeId: s.sessionTypeId,
        name: s.name || 'Unknown Service',
        duration: s.duration,
      }))

      const { error: insertError } = await supabase
        .from('bookings')
        .insert({
          confirmation_number: confirmationNumber,
          status: 'confirmed',
          mindbody_client_id: clientId,
          client_name: clientName || null,
          client_phone: clientPhone || null,
          client_email: mindbodyClient?.Email || null,
          location_id: locationId,
          location_name: locationName || null,
          staff_id: staffId || null,
          therapist_name: finalTherapistName || null,
          staff_requested: !!staffRequested,
          appointment_start: startDateTime,
          services: servicesData,
          total_duration: totalDuration || null,
          mindbody_appointment_ids: mindbodyAppointmentIds,
          promotion_name: promotionName || null,
          total_requested: (services as BookingService[]).length,
          total_booked: successfulAppointments.length,
          subtotal_before_tax: subtotalBeforeTax || null,
          tax_amount: taxAmount || null,
          total_with_tax: totalWithTax || null,
          whatsapp_sent: whatsappSent,
        })

      if (insertError) {
        console.error('Failed to save booking to Supabase:', insertError)
      } else {
        console.log('Booking saved to Supabase:', confirmationNumber)
      }
    } catch (supabaseError) {
      console.error('Error saving booking to Supabase:', supabaseError)
    }

    // Cancel old appointment if this is a replacement
    let replacedOldAppointment = false
    if (replaceAppointmentId) {
      const oldId = parseInt(replaceAppointmentId, 10)
      if (!isNaN(oldId)) {
        try {
          replacedOldAppointment = await removeAppointment(oldId)
          if (!replacedOldAppointment) {
            console.warn('Could not cancel old appointment', oldId, '— new booking still confirmed')
          }
        } catch (cancelErr) {
          console.error('Error cancelling old appointment:', cancelErr)
          // Don't fail the response — new booking is already created
        }
      }
    }

    return NextResponse.json({
      success: true,
      confirmationNumber,
      appointments: successfulAppointments,
      totalBooked: successfulAppointments.length,
      totalRequested: services.length,
      whatsappSent,
      replaced: replacedOldAppointment,
      message: 'Todos los servicios reservados exitosamente'
    })

  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: sanitizeError(error) },
      { status: 500 }
    )
  }
}
