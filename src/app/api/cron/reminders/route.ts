import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendBookingReminder } from '@/lib/booking/wati'

/**
 * GET /api/cron/reminders
 * Sends WhatsApp reminders for appointments happening in ~24 hours.
 * Called by Vercel cron every hour (see vercel.json).
 * Protected by CRON_SECRET env var.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Window: appointments starting between 23h and 25h from now
  const now = new Date()
  const windowStart = new Date(now.getTime() + 23 * 60 * 60 * 1000)
  const windowEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000)

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('id, client_name, client_phone, location_name, appointment_start, reminder_sent')
    .eq('status', 'confirmed')
    .eq('reminder_sent', false)
    .gte('appointment_start', windowStart.toISOString())
    .lte('appointment_start', windowEnd.toISOString())

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
      day: '2-digit', month: '2-digit', year: 'numeric',
    })
    const timeStr = appointmentDate.toLocaleTimeString('es-PA', {
      timeZone: 'America/Panama',
      hour: 'numeric', minute: '2-digit', hour12: true,
    })

    const result = await sendBookingReminder({
      clientName: booking.client_name || 'Cliente',
      clientPhone: booking.client_phone,
      locationName: booking.location_name || 'Mimosa Spa Retreat',
      date: dateStr,
      time: timeStr,
      appointmentId: String(booking.id),
    })

    if (result.result) {
      // Mark reminder as sent
      await supabase
        .from('bookings')
        .update({ reminder_sent: true, reminder_sent_at: new Date().toISOString() })
        .eq('id', booking.id)
      sent++
    } else {
      console.error('Reminder failed for booking', booking.id, result.error)
      failed++
    }
  }

  console.log(`Reminders: ${sent} sent, ${failed} failed`)
  return NextResponse.json({ sent, failed })
}
