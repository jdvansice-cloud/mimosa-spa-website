import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendBookingReminder } from '@/lib/booking/wati'
import { getStaffAppointments } from '@/lib/booking/mindbody'
import { sendEmail, isEmailConfigured } from '@/lib/email/resend'
import { bookingReminderEmail } from '@/lib/email/templates/booking'

/**
 * GET /api/cron/reminders
 * Sends WhatsApp reminders for appointments happening in ~24 hours.
 * Called by Vercel cron every hour (see vercel.json).
 * Protected by CRON_SECRET env var.
 *
 * Optional query params (for manual testing):
 *   ?bookingId=<uuid> — force-send reminder for a specific booking, bypassing
 *                       the 23-25h time window and the reminder_sent check.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const forceBookingId = searchParams.get('bookingId')

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  let query = supabase
    .from('bookings')
    .select('id, client_name, client_phone, client_email, location_id, location_name, appointment_start, reminder_sent, mindbody_appointment_ids')

  if (forceBookingId) {
    // Manual test: bypass time window + reminder_sent check
    query = query.eq('id', forceBookingId)
    console.log(`Force-sending reminder for booking ${forceBookingId}`)
  } else {
    // Normal cron: appointments starting between 23h and 25h from now
    const now = new Date()
    const windowStart = new Date(now.getTime() + 23 * 60 * 60 * 1000)
    const windowEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000)
    query = query
      .eq('status', 'confirmed')
      .eq('reminder_sent', false)
      .gte('appointment_start', windowStart.toISOString())
      .lte('appointment_start', windowEnd.toISOString())
  }

  const { data: bookings, error } = await query

  if (error) {
    console.error('Reminders query error:', error)
    return NextResponse.json({ error: 'Query failed' }, { status: 500 })
  }

  if (!bookings || bookings.length === 0) {
    return NextResponse.json({ sent: 0, message: 'No reminders to send' })
  }

  // Guard against stale statuses: cancellations made in Mindbody (front desk,
  // phone) VANISH from its API instead of returning status=Cancelled, and the
  // daily status sync only covers past appointments. Verify each reminder's
  // appointment still exists in Mindbody right now; if it's gone, mark the
  // booking cancelled and send nothing.
  const liveAppointmentIds = new Set<number>()
  const verifiedLocations = new Set<number>()
  if (!forceBookingId) {
    const locIds = [...new Set(bookings.map(b => b.location_id as number).filter(Boolean))]
    const dates = [...new Set(bookings.map(b => String(b.appointment_start).slice(0, 10)))].sort()
    const startDate = dates[0]
    const endDate = dates[dates.length - 1]
    for (const locationId of locIds) {
      try {
        let offset = 0
        const PAGE = 200
        let sawAll = false
        while (!sawAll) {
          const { appointments, pagination } = await getStaffAppointments({
            locationId, startDate, endDate, limit: PAGE, offset,
          })
          for (const apt of appointments) liveAppointmentIds.add(apt.Id)
          const total = pagination?.TotalResults ?? appointments.length
          offset += PAGE
          sawAll = offset >= total || appointments.length < PAGE
        }
        verifiedLocations.add(locationId)
      } catch (err) {
        // Fetch failed → we can't verify this location; reminders for it
        // still go out (never suppress on our own error)
        console.error(`Reminder verification fetch failed for location ${locationId}:`, err)
      }
    }
  }

  let sent = 0
  let failed = 0
  let cancelled = 0
  let emailed = 0

  // Email fallback: no phone, or the WhatsApp send failed
  const sendReminderEmail = async (booking: {
    id: string; client_name: string | null; client_email: string | null
    location_name: string | null; appointment_start: string
  }, dateStr: string, timeStr: string): Promise<boolean> => {
    if (!isEmailConfigured() || !booking.client_email) return false
    const mail = bookingReminderEmail({
      clientName: booking.client_name || 'Cliente',
      locationName: booking.location_name || 'Mimosa Spa Retreat',
      date: dateStr, time: timeStr,
    })
    const r = await sendEmail({ to: booking.client_email, ...mail, kind: 'booking' })
    if (r.ok) {
      await supabase.from('bookings')
        .update({ reminder_sent: true, reminder_sent_at: new Date().toISOString() })
        .eq('id', booking.id)
      console.log(`Reminder EMAIL sent for booking ${booking.id} (${booking.client_email})`)
      return true
    }
    console.error(`Reminder email failed for booking ${booking.id}:`, r.error)
    return false
  }

  for (const booking of bookings) {
    // Appointment no longer exists in Mindbody → it was cancelled there.
    const firstId = (booking.mindbody_appointment_ids as number[] | null)?.[0]
    if (
      !forceBookingId &&
      firstId &&
      verifiedLocations.has(booking.location_id as number) &&
      !liveAppointmentIds.has(firstId)
    ) {
      await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          mindbody_status: 'Cancelled',
          status_synced_at: new Date().toISOString(),
        })
        .eq('id', booking.id)
      console.log(`Booking ${booking.id}: appointment ${firstId} gone from Mindbody → cancelled, reminder suppressed`)
      cancelled++
      continue
    }
    const raw = booking.appointment_start as string
    const hasOffset = /[Z]$/.test(raw) || /[+-]\d{2}:\d{2}$/.test(raw)
    const appointmentDate = new Date(hasOffset ? raw : `${raw}-05:00`)
    const dateStr = appointmentDate.toLocaleDateString('es-PA', {
      timeZone: 'America/Panama',
      day: 'numeric', month: 'long', year: 'numeric',
    })
    const timeStr = appointmentDate.toLocaleTimeString('es-PA', {
      timeZone: 'America/Panama',
      hour: 'numeric', minute: '2-digit', hour12: true,
    })

    if (!booking.client_phone) {
      if (await sendReminderEmail(booking, dateStr, timeStr)) { emailed++ } else { failed++ }
      continue
    }

    // Use first Mindbody appointment ID for confirm/cancel button URLs.
    // UUID fallback is intentionally removed — parseInt(UUID) → NaN → broken link.
    const mindbodyIds = booking.mindbody_appointment_ids as number[] | null
    const firstMindbodyId = mindbodyIds?.[0]

    if (!firstMindbodyId) {
      console.warn(`Booking ${booking.id} has no Mindbody appointment IDs — skipping reminder`)
      failed++
      continue
    }

    const appointmentId = String(firstMindbodyId)

    const result = await sendBookingReminder({
      clientName: booking.client_name || 'Cliente',
      clientPhone: booking.client_phone,
      locationName: booking.location_name || 'Mimosa Spa Retreat',
      date: dateStr,
      time: timeStr,
      appointmentId,
    })

    if (result.result) {
      // Mark reminder as sent
      await supabase
        .from('bookings')
        .update({ reminder_sent: true, reminder_sent_at: new Date().toISOString() })
        .eq('id', booking.id)
      console.log(`Reminder sent for booking ${booking.id} (phone: ${booking.client_phone}, apptId: ${appointmentId})`)
      sent++
    } else {
      console.error('Reminder failed for booking', booking.id, JSON.stringify(result))
      if (await sendReminderEmail(booking, dateStr, timeStr)) { emailed++ } else { failed++ }
    }
  }

  console.log(`Reminders: ${sent} sent, ${emailed} emailed, ${failed} failed, ${cancelled} cancelled-suppressed`)
  return NextResponse.json({ sent, emailed, failed, cancelled })
}
