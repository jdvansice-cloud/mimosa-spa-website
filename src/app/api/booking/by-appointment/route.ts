import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// GET /api/booking/by-appointment?id=<mindbodyAppointmentId>
// Returns old booking details for display in the appointment change flow
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id || isNaN(parseInt(id, 10))) {
    return NextResponse.json({ error: 'Invalid appointment ID' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase
    .from('bookings')
    .select('id, location_name, appointment_start, services, therapist_name')
    .contains('mindbody_appointment_ids', [parseInt(id, 10)])
    .eq('status', 'confirmed')
    .single()

  if (error || !data) {
    // Not found is non-fatal — the ConfirmStep works fine without old booking details
    return NextResponse.json({ booking: null })
  }

  const raw = data.appointment_start as string
  const hasOffset = /[Z]$/.test(raw) || /[+-]\d{2}:\d{2}$/.test(raw)
  const appointmentDate = new Date(hasOffset ? raw : `${raw}-05:00`)

  const dateStr = appointmentDate.toLocaleDateString('es-PA', {
    timeZone: 'America/Panama',
    weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric',
  })
  const timeStr = appointmentDate.toLocaleTimeString('es-PA', {
    timeZone: 'America/Panama',
    hour: 'numeric', minute: '2-digit', hour12: true,
  })

  const services = ((data.services as Array<{ name: string }>) || []).map(s => s.name).filter(Boolean)

  return NextResponse.json({
    booking: {
      date: dateStr,
      time: timeStr,
      locationName: data.location_name || 'Mimosa Spa Retreat',
      services,
      therapistName: data.therapist_name || 'Nuestro equipo',
    },
  })
}
