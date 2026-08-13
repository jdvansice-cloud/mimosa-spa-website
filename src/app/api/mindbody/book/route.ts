import { NextRequest, NextResponse } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { addMultipleAppointments, getClientWithCustomFields, updateClient, removeAppointment } from '@/lib/booking/mindbody'
import { sendBookingConfirmation, sendBookingChange, isWatiConfigured } from '@/lib/booking/wati'
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
      promoServiceIds,
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

    // Auto-reactivate inactive clients — Mindbody rejects bookings for inactive records
    // even when the GET lookup succeeds. Reactivating restores full booking capability.
    if (mindbodyClient.Active === false) {
      console.warn('Client is inactive in Mindbody, attempting reactivation:', {
        Id: mindbodyClient.Id,
        UniqueId: mindbodyClient.UniqueId,
        Email: mindbodyClient.Email,
      })
      try {
        await updateClient({ Id: mindbodyClient.Id, Active: true })
      } catch (reactivateError) {
        console.error('Failed to reactivate client:', reactivateError)
        return NextResponse.json(
          {
            error: 'Tu cuenta está inactiva. Por favor contacta al spa para habilitarla.',
            details: 'Client reactivation failed'
          },
          { status: 409 }
        )
      }
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
        Active: mindbodyClient.Active,
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
    // Use the string Id from the verified Mindbody client record — this is what
    // Mindbody's addappointment endpoint expects for the ClientId field.
    const mindbodyClientId = mindbodyClient.Id
    const appointments: Array<{
      ClientId: string
      LocationId: number
      StaffId: number | undefined
      SessionTypeId: number
      StartDateTime: string
      Notes: string | undefined
      StaffRequested: boolean
    }> = []
    let currentStartTime = new Date(startDateTime)


    const promoServiceIdSet = new Set<number>(Array.isArray(promoServiceIds) ? promoServiceIds : [])

    for (const service of services as BookingService[]) {
      // Build notes: always include "Reservado en línea" + optional promotion or global discount + optional custom notes
      // Promo-included services get the promotion name; all other discounted items get the global discount label.
      const noteParts: string[] = ['Reservado en línea']
      const isPromoService = promoServiceIdSet.has(service.sessionTypeId)
      if (isPromoService && promotionName) {
        noteParts.push(`Promo: ${promotionName}`)
      } else if (globalDiscountPercent && globalDiscountPercent > 0) {
        noteParts.push(`Promo Online ${globalDiscountPercent}%`)
      }
      if (notes) {
        noteParts.push(notes)
      }

      appointments.push({
        ClientId: mindbodyClientId,  // use verified string Id, not raw numeric clientId
        LocationId: locationId,
        StaffId: staffId || undefined,
        SessionTypeId: service.sessionTypeId,
        StartDateTime: currentStartTime.toISOString().replace(/\.\d{3}Z$/, ''),
        Notes: noteParts.join(' | '),
        StaffRequested: !!staffRequested,
      })

      // Move start time for next service
      currentStartTime = new Date(
        currentStartTime.getTime() + (service.duration * 60 * 1000)
      )
    }


    // Submit all appointments (all-or-nothing: rolls back on failure)
    const result = await addMultipleAppointments(appointments)


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
          appointment_start: /[Z]$/.test(startDateTime) || /[+-]\d{2}:\d{2}$/.test(startDateTime)
            ? startDateTime
            : `${startDateTime}-05:00`,
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

    // Pre-compute WhatsApp notification data (used for both confirmation and change messages)
    // Use 'Nuestro equipo' only for the WhatsApp message — keep null in Supabase when no therapist selected
    let whatsappSent = false
    let watiNotificationData: {
      clientName: string; clientPhone: string; locationName: string
      date: string; time: string; services: string[]; totalDuration: number; therapistName: string
    } | null = null

    if (isWatiConfigured() && clientPhone && clientName) {
      const hasOffset = /[Z]$/.test(startDateTime) || /[+-]\d{2}:\d{2}$/.test(startDateTime)
      const bookingDate = new Date(hasOffset ? startDateTime : `${startDateTime}-05:00`)
      const dateStr = bookingDate.toLocaleDateString('es-PA', {
        timeZone: 'America/Panama', day: '2-digit', month: '2-digit', year: 'numeric',
      })
      const timeStr = bookingDate.toLocaleTimeString('es-PA', {
        timeZone: 'America/Panama', hour: 'numeric', minute: '2-digit', hour12: true,
      })
      const serviceNames = (services as BookingService[]).map(s => s.name || 'Servicio').filter(Boolean)
      const whatsappTherapistName = finalTherapistName || 'Nuestro equipo'

      watiNotificationData = {
        clientName, clientPhone,
        locationName: locationName || 'Mimosa Spa Retreat',
        date: dateStr, time: timeStr,
        services: serviceNames,
        totalDuration: totalDuration || 60,
        therapistName: whatsappTherapistName,
      }

      // For new bookings (not replacements) send confirmation immediately.
      // For replacements, the change message is sent after the old appointment is cancelled below.
      if (!replaceAppointmentId) {
        try {
          const watiResult = await sendBookingConfirmation(watiNotificationData)
          whatsappSent = watiResult.result
          if (!watiResult.result) {
            console.warn('WhatsApp confirmation failed:', watiResult.error)
          }
        } catch (watiError) {
          console.error('Error sending WhatsApp confirmation:', watiError)
        }
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
          // Store with Panama offset (-05:00) so Supabase saves the correct UTC value.
          // Without it, Supabase treats the bare datetime as UTC, causing a 5-hour shift.
          appointment_start: /[Z]$/.test(startDateTime) || /[+-]\d{2}:\d{2}$/.test(startDateTime)
            ? startDateTime
            : `${startDateTime}-05:00`,
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
      }
    } catch (supabaseError) {
      console.error('Error saving booking to Supabase:', supabaseError)
    }

    // Cancel old appointment if this is a replacement
    let replacedOldAppointment = false
    if (replaceAppointmentId) {
      const oldId = parseInt(replaceAppointmentId, 10)
      if (!isNaN(oldId)) {
        // Fetch old booking details before cancelling (for notification)
        let oldBooking: { id: string; appointment_start: string; location_name: string | null } | null = null
        try {
          const supabase = getSupabaseAdmin()
          const { data } = await supabase
            .from('bookings')
            .select('id, appointment_start, location_name')
            .contains('mindbody_appointment_ids', [oldId])
            .eq('status', 'confirmed')
            .single()
          oldBooking = data
        } catch {
          // Non-fatal — proceed with cancellation
        }

        try {
          replacedOldAppointment = await removeAppointment(oldId)

          if (replacedOldAppointment) {
            // Update old booking status in Supabase
            if (oldBooking) {
              try {
                const supabase = getSupabaseAdmin()
                await supabase
                  .from('bookings')
                  .update({ status: 'cancelled' })
                  .eq('id', oldBooking.id)
              } catch (updateErr) {
                console.error('Error updating old booking status:', updateErr)
              }
            }

            // Send a single "cambio de cita" message with the new appointment details
            if (watiNotificationData) {
              try {
                const watiResult = await sendBookingChange(watiNotificationData)
                whatsappSent = watiResult.result
                if (!watiResult.result) {
                  console.warn('WhatsApp change notification failed:', watiResult.error)
                }
              } catch (changeWatiErr) {
                console.error('Error sending change WhatsApp:', changeWatiErr)
              }
            }
          } else {
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
