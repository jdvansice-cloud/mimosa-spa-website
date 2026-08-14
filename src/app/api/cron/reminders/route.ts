import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendBookingReminder } from '@/lib/booking/wati'

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
    .select('id, client_name, client_phone, location_name, appointment_start, reminder_sent, mindbody_appointment_ids')

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

  let sent = 0
  let failed = 0

  for (const booking of bookings) {
    if (!booking.client_phone) {
      failed++
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
      failed++
    }
  }

  console.log(`Reminders: ${sent} sent, ${failed} failed`)
  return NextResponse.json({ sent, failed })
}
