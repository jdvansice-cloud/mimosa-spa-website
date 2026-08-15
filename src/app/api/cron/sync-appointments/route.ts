import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getLocations, getStaffAppointments, getClientWithCustomFields, getSessionTypes } from '@/lib/booking/mindbody'
import { sendBookingCancellation, sendBookingConfirmation, sendBookingChange, isWatiConfigured } from '@/lib/booking/wati'
import { sendEmail, isEmailConfigured } from '@/lib/email/resend'
import { bookingCancellationEmail, bookingConfirmationEmail, bookingChangeEmail } from '@/lib/email/templates/booking'

// Real /appointment/staffappointments shape (no nested Client/Location/
// SessionType objects — flat ids only)
interface LiveAppointment {
  Id: number
  StartDateTime: string
  EndDateTime: string
  Duration?: number
  Status: string
  LocationId: number
  SessionTypeId: number
  StaffId: number
  Staff?: { Id: number; FirstName?: string; LastName?: string; DisplayName?: string }
  ClientId: string | null
}

// Mindbody stores phones loosely; WATI wants country code + number, no '+'.
function normalizePhoneForWati(phone: string | null | undefined): string | null {
  const digits = (phone || '').replace(/\D/g, '')
  if (digits.length === 8) return `507${digits}`
  if (digits.length >= 10) return digits
  return null
}

/**
 * GET /api/cron/sync-appointments
 * Syncs appointment statuses from Mindbody back to Supabase.
 * Phase 1 (upcoming): confirmed FUTURE bookings (next 14 days) are checked
 * against Mindbody. Cancellations there DELETE the appointment from the API,
 * so a booking whose appointment id no longer appears is marked cancelled and
 * the customer gets a WhatsApp cancellation notice (template cancelacion_cita).
 * Phase 2 (past): confirmed bookings whose time has passed are updated to
 * completed, cancelled, or noshow.
 *
 * Uses a sliding 7-day window starting from the oldest unsynced booking.
 * This bounds API calls to ~2 requests/run (one per location for 7 days).
 * The backlog clears naturally over time as each run processes the oldest chunk.
 *
 * Mindbody statuses mapped:
 *   Completed      → completed
 *   Cancelled      → cancelled
 *   LateCancelled  → cancelled
 *   NoShow         → noshow
 *   Booked         → confirmed (no change)
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

  // ========== PHASE 1: upcoming bookings (cancellation detection) ==========
  const nowIso = new Date().toISOString()
  const horizon = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
  let upcomingCancelled = 0
  let cancellationNoticesSent = 0

  const liveAppointmentsGlobal: LiveAppointment[] = []
  const liveIds = new Set<number>()
  const okLocations = new Set<number>()
  const locationNames = new Map<number, string>()

  // Fetch the FULL upcoming window (today → +14d) for every location — this
  // single dataset powers cancellation detection AND staff-booking ingestion.
  {
    let allLocationIds: number[] = []
    try {
      const locs = await getLocations()
      allLocationIds = locs.map(l => l.Id)
      for (const l of locs) locationNames.set(l.Id, l.Name)
    } catch (err) {
      console.error('Locations fetch failed:', err)
    }
    const winStart = nowIso.slice(0, 10)
    const winEnd = horizon.slice(0, 10)
    for (const locationId of allLocationIds) {
      try {
        let offset = 0
        const PAGE = 200
        while (true) {
          const { appointments, pagination } = await getStaffAppointments({
            locationId, startDate: winStart, endDate: winEnd, limit: PAGE, offset,
          })
          for (const apt of appointments) {
            liveIds.add(apt.Id)
            liveAppointmentsGlobal.push(apt as unknown as LiveAppointment)
          }
          const total = pagination?.TotalResults ?? appointments.length
          offset += PAGE
          if (offset >= total || appointments.length < PAGE) break
        }
        okLocations.add(locationId)
      } catch (err) {
        console.error(`Upcoming window fetch failed for location ${locationId}:`, err)
      }
    }
  }

  const { data: upcoming } = await supabase
    .from('bookings')
    .select('id, client_name, client_phone, client_email, location_id, location_name, appointment_start, mindbody_appointment_ids, services, therapist_name, staff_requested')
    .eq('status', 'confirmed')
    .gte('appointment_start', nowIso)
    .lte('appointment_start', horizon)
    .not('mindbody_appointment_ids', 'is', null)

  if (upcoming && upcoming.length > 0) {
    for (const booking of upcoming) {
      const firstId = (booking.mindbody_appointment_ids as number[] | null)?.[0]
      if (!firstId) continue
      if (!okLocations.has(booking.location_id as number)) continue
      if (liveIds.has(firstId)) continue

      // Appointment removed in Mindbody → cancelled. Flip status exactly once
      // (guarded update) and notify the customer at that transition.
      const { data: flipped } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          mindbody_status: 'Cancelled',
          status_synced_at: new Date().toISOString(),
        })
        .eq('id', booking.id)
        .eq('status', 'confirmed')
        .select('id')
      if (!flipped || flipped.length === 0) continue
      upcomingCancelled++
      console.log(`Upcoming booking ${booking.id}: appointment ${firstId} gone from Mindbody → cancelled`)

      const raw = booking.appointment_start as string
      const hasOffset = /[Z]$/.test(raw) || /[+-]\d{2}:\d{2}$/.test(raw)
      const d = new Date(hasOffset ? raw : `${raw}-05:00`)
      const dateStr = d.toLocaleDateString('es-PA', { timeZone: 'America/Panama', day: 'numeric', month: 'long', year: 'numeric' })
      const timeStr = d.toLocaleTimeString('es-PA', { timeZone: 'America/Panama', hour: 'numeric', minute: '2-digit', hour12: true })
      const firstServiceId = (booking.services as Array<{ sessionTypeId?: number }> | null)?.[0]?.sessionTypeId
      const reagendarUrl = firstServiceId
        ? `https://www.mimosaretreat.com/es/reservar?serviceId=${firstServiceId}`
        : 'https://www.mimosaretreat.com/es/reservar'

      let noticeSent = false
      if (isWatiConfigured() && booking.client_phone && booking.client_name) {
        const result = await sendBookingCancellation({
          clientName: booking.client_name,
          clientPhone: booking.client_phone,
          locationName: booking.location_name || 'Mimosa Spa Retreat',
          serviceId: firstServiceId,
          date: dateStr,
          time: timeStr,
        })
        if (result.result) {
          noticeSent = true
          cancellationNoticesSent++
        } else {
          // Template may not be approved yet — cancellation still recorded
          console.error(`Cancellation notice failed for booking ${booking.id}:`, JSON.stringify(result).slice(0, 300))
        }
      }

      // Email fallback: no phone in Mindbody, or the WhatsApp send failed
      if (!noticeSent && isEmailConfigured() && booking.client_email) {
        const mail = bookingCancellationEmail({
          clientName: booking.client_name || 'Cliente',
          locationName: booking.location_name || 'Mimosa Spa Retreat',
          date: dateStr, time: timeStr, reagendarUrl,
          services: ((booking.services as Array<{ name?: string }> | null) || []).map(sv => sv.name || 'Servicio'),
        })
        const r = await sendEmail({ to: booking.client_email, ...mail, kind: 'booking' })
        if (r.ok) {
          cancellationNoticesSent++
          console.log(`Cancellation EMAIL sent for booking ${booking.id}`)
        } else {
          console.error(`Cancellation email failed for booking ${booking.id}:`, r.error)
        }
      }
    }
  }

  // ====== PHASE 1.5: staff-created appointments → our notifications ======
  // Any upcoming Mindbody appointment with no bookings row was created by
  // staff (front desk / phone). Ingest it so OUR confirmation, reminder and
  // cancellation flows cover it — this is what lets Mindbody's own client
  // notifications be turned off entirely.
  let ingested = 0
  let staffConfirmationsSent = 0
  {
    // Known ids: every appointment id already tracked, any status
    const { data: knownRows } = await supabase
      .from('bookings')
      .select('mindbody_appointment_ids')
      .gte('appointment_start', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    const knownIds = new Set<number>()
    for (const r of knownRows || []) {
      for (const id of (r.mindbody_appointment_ids as number[] | null) || []) knownIds.add(id)
    }

    // First ingest runs silently (baseline) — otherwise every historic
    // walk-in booking would get a confirmation blast. After the baseline
    // exists, anything unknown was created since the last run (≤2h) → notify.
    const { count: baselineCount } = await supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .like('confirmation_number', 'MB-%')
    const isFirstIngest = (baselineCount ?? 0) === 0

    const fresh = liveAppointmentsGlobal.filter(a =>
      a.ClientId &&
      Number(a.ClientId) > 0 &&
      !knownIds.has(a.Id) &&
      (a.Status === 'Booked' || a.Status === 'Confirmed') &&
      new Date(`${a.StartDateTime}-05:00`).getTime() > Date.now()
    )

    // Session type names for the services list
    const sessionTypeNames = new Map<number, string>()
    if (fresh.length > 0) {
      try {
        for (const st of await getSessionTypes(false)) sessionTypeNames.set(st.Id, st.Name)
      } catch (err) {
        console.error('Session type lookup failed:', err)
      }
    }

    // One visit per client per day (staff book multi-service visits as
    // consecutive appointments)
    const visits = new Map<string, LiveAppointment[]>()
    for (const a of fresh) {
      const key = `${a.ClientId}|${a.StartDateTime.slice(0, 10)}`
      if (!visits.has(key)) visits.set(key, [])
      visits.get(key)!.push(a)
    }

    const MAX_NOTIFY_PER_RUN = 20
    for (const group of visits.values()) {
      group.sort((a, b) => a.StartDateTime.localeCompare(b.StartDateTime))
      const first = group[0]
      const clientId = Number(first.ClientId)
      let phone: string | null = null
      let email: string | null = null
      let clientName = ''
      try {
        const mbClient = await getClientWithCustomFields(String(clientId))
        phone = normalizePhoneForWati(mbClient?.MobilePhone)
        email = mbClient?.Email || null
        clientName = `${mbClient?.FirstName || ''} ${mbClient?.LastName || ''}`.trim()
      } catch (err) {
        console.error(`Client lookup failed for ${clientId}:`, err)
      }

      const durationOf = (a: LiveAppointment) =>
        a.Duration ||
        Math.max(0, Math.round((new Date(a.EndDateTime).getTime() - new Date(a.StartDateTime).getTime()) / 60000))
      const servicesData = group.map(a => ({
        sessionTypeId: a.SessionTypeId,
        name: sessionTypeNames.get(a.SessionTypeId) || 'Servicio',
        duration: durationOf(a),
      }))
      const totalDuration = servicesData.reduce((sum, sv) => sum + sv.duration, 0)
      const therapistName =
        (first.Staff && (`${first.Staff.FirstName || ''} ${first.Staff.LastName || ''}`.trim() || first.Staff.DisplayName)) || null

      const { error: insErr } = await supabase.from('bookings').insert({
        confirmation_number: `MB-${first.Id}`,
        status: 'confirmed',
        mindbody_client_id: clientId,
        client_name: clientName || null,
        client_phone: phone,
        client_email: email,
        location_id: first.LocationId,
        location_name: locationNames.get(first.LocationId) || null,
        staff_id: first.StaffId,
        therapist_name: therapistName,
        staff_requested: false,
        appointment_start: `${first.StartDateTime}-05:00`,
        services: servicesData,
        total_duration: totalDuration,
        mindbody_appointment_ids: group.map(a => a.Id),
        total_requested: group.length,
        total_booked: group.length,
        whatsapp_sent: false,
      })
      if (insErr) {
        // Unique-violation on rerun etc. — skip quietly
        console.error(`Ingest insert failed for appointment ${first.Id}:`, insErr.message)
        continue
      }
      ingested++

      if (isFirstIngest || staffConfirmationsSent >= MAX_NOTIFY_PER_RUN) continue

      const d = new Date(`${first.StartDateTime}-05:00`)
      const dateStr = d.toLocaleDateString('es-PA', { timeZone: 'America/Panama', day: 'numeric', month: 'long', year: 'numeric' })
      const timeStr = d.toLocaleTimeString('es-PA', { timeZone: 'America/Panama', hour: 'numeric', minute: '2-digit', hour12: true })
      let confirmed = false
      if (isWatiConfigured() && phone && clientName) {
        const r = await sendBookingConfirmation({
          clientName, clientPhone: phone,
          locationName: locationNames.get(first.LocationId) || 'Mimosa Spa Retreat',
          date: dateStr, time: timeStr,
          services: servicesData.map(sv => sv.name),
          totalDuration, therapistName: therapistName || 'Por asignar',
        })
        if (r.result) {
          confirmed = true
          staffConfirmationsSent++
          await supabase.from('bookings').update({ whatsapp_sent: true }).eq('confirmation_number', `MB-${first.Id}`)
        }
      }
      if (!confirmed && isEmailConfigured() && email) {
        const mail = bookingConfirmationEmail({
          clientName: clientName || 'Cliente',
          locationName: locationNames.get(first.LocationId) || 'Mimosa Spa Retreat',
          date: dateStr, time: timeStr,
          services: servicesData.map(sv => sv.name),
          therapistName: therapistName || undefined,
        })
        const r = await sendEmail({ to: email, ...mail, kind: 'booking' })
        if (r.ok) staffConfirmationsSent++
      }
    }
    if (isFirstIngest && ingested > 0) {
      console.log(`First ingest baseline: ${ingested} staff bookings recorded silently`)
    }
  }

  // ====== PHASE 1.6: reschedules (appointment moved in place) ======
  // A receptionist dragging an appointment to a new time keeps its Mindbody
  // id but changes StartDateTime. Compare stored vs live start times for
  // known upcoming bookings: when moved, update the record, notify the
  // customer (cambio_cita), and re-arm the 24h reminder.
  let rescheduled = 0
  let changeNoticesSent = 0
  if (upcoming && upcoming.length > 0 && liveAppointmentsGlobal.length > 0) {
    const liveById = new Map<number, LiveAppointment>()
    for (const a of liveAppointmentsGlobal) liveById.set(a.Id, a)

    for (const booking of upcoming) {
      const ids = (booking.mindbody_appointment_ids as number[] | null) || []
      const firstId = ids[0]
      if (!firstId) continue
      const live = liveById.get(firstId)
      if (!live) continue // vanished → handled by cancellation phase

      const liveStartIso = `${live.StartDateTime}-05:00`
      const storedMs = new Date(booking.appointment_start as string).getTime()
      const liveMs = new Date(liveStartIso).getTime()
      if (!Number.isFinite(liveMs) || storedMs === liveMs) continue

      // Guarded update: flip exactly once per move, re-arm the reminder
      const { data: moved } = await supabase
        .from('bookings')
        .update({
          appointment_start: liveStartIso,
          reminder_sent: false,
          reminder_sent_at: null,
          status_synced_at: new Date().toISOString(),
        })
        .eq('id', booking.id)
        .eq('appointment_start', booking.appointment_start)
        .select('id')
      if (!moved || moved.length === 0) continue
      rescheduled++
      console.log(`Booking ${booking.id}: rescheduled ${booking.appointment_start} → ${liveStartIso}`)

      const d = new Date(liveStartIso)
      const dateStr = d.toLocaleDateString('es-PA', { timeZone: 'America/Panama', day: 'numeric', month: 'long', year: 'numeric' })
      const timeStr = d.toLocaleTimeString('es-PA', { timeZone: 'America/Panama', hour: 'numeric', minute: '2-digit', hour12: true })
      const serviceNames = ((booking.services as Array<{ name?: string }> | null) || [])
        .map(sv => sv.name || 'Servicio')
      const totalDuration = ((booking.services as Array<{ duration?: number }> | null) || [])
        .reduce((sum, sv) => sum + (sv.duration || 0), 0) || 60

      let changeSent = false
      if (isWatiConfigured() && booking.client_phone && booking.client_name) {
        const r = await sendBookingChange({
          clientName: booking.client_name,
          clientPhone: booking.client_phone,
          locationName: booking.location_name || 'Mimosa Spa Retreat',
          date: dateStr, time: timeStr,
          services: serviceNames,
          totalDuration,
          therapistName: booking.staff_requested && booking.therapist_name
            ? booking.therapist_name
            : 'Por asignar',
        })
        if (r.result) {
          changeSent = true
          changeNoticesSent++
        } else {
          console.error(`Change notice failed for booking ${booking.id}:`, JSON.stringify(r).slice(0, 300))
        }
      }
      if (!changeSent && isEmailConfigured() && booking.client_email) {
        const mail = bookingChangeEmail({
          clientName: booking.client_name || 'Cliente',
          locationName: booking.location_name || 'Mimosa Spa Retreat',
          date: dateStr, time: timeStr, services: serviceNames,
          therapistName: booking.staff_requested && booking.therapist_name ? booking.therapist_name : undefined,
        })
        const r = await sendEmail({ to: booking.client_email, ...mail, kind: 'booking' })
        if (r.ok) changeNoticesSent++
      }
    }
  }

  // ========== PHASE 2: past bookings (completed / noshow / cancelled) ==========
  // Only sync bookings whose appointment time has already passed
  const now = new Date().toISOString()

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('id, mindbody_appointment_ids, status, appointment_start, location_id')
    .eq('status', 'confirmed')
    .lt('appointment_start', now)
    .not('mindbody_appointment_ids', 'is', null)
    .order('appointment_start', { ascending: true })

  if (error) {
    console.error('Sync query error:', error)
    return NextResponse.json({ error: 'Query failed' }, { status: 500 })
  }

  if (!bookings || bookings.length === 0) {
    return NextResponse.json({
      synced: 0, upcomingCancelled, cancellationNoticesSent, ingested, staffConfirmationsSent, rescheduled, changeNoticesSent, message: 'No past bookings to sync',
    })
  }

  // Build ID → bookingId map (use first appointment ID per booking)
  const idToBookingId = new Map<number, string>()

  for (const booking of bookings) {
    const ids = booking.mindbody_appointment_ids as number[] | null
    if (ids?.length) {
      idToBookingId.set(ids[0], booking.id)
    }
  }

  // Sliding 7-day window starting from oldest unsynced booking.
  // Bounds API calls to ~2/run regardless of backlog size.
  // Backlog clears over time as each run processes the oldest chunk.
  const WINDOW_DAYS = 30

  const oldestDate = new Date(bookings[0].appointment_start as string)
  const windowEnd = new Date(oldestDate)
  windowEnd.setDate(windowEnd.getDate() + WINDOW_DAYS)

  // Bookings within this window
  const windowEnd_iso = windowEnd.toISOString()
  const windowBookings = bookings.filter(b =>
    (b.appointment_start as string) <= windowEnd_iso
  )
  const targetIds = new Set(
    windowBookings
      .map(b => (b.mindbody_appointment_ids as number[])?.[0])
      .filter(Boolean) as number[]
  )

  const startDate = oldestDate.toISOString().split('T')[0]
  const endDate = (windowEnd < new Date() ? windowEnd : new Date())
    .toISOString().split('T')[0]

  console.log(`Syncing ${targetIds.size} of ${bookings.length} total bookings (window: ${startDate} → ${endDate})`)
  console.log(`Target IDs: ${[...targetIds].join(', ')}`)

  // Get all locations
  let locationIds: number[] = []
  try {
    const locations = await getLocations()
    locationIds = locations.map(l => l.Id)
    console.log(`Found ${locationIds.length} locations: ${locationIds.join(', ')}`)
  } catch (err) {
    console.error('Failed to fetch locations:', err)
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 })
  }

  // Fetch staff appointments for the window at each location
  // 7 days × ~50 appointments/day/location = ~350 per location → fits in 2 pages max
  const statusMap = new Map<number, string>()
  const fullyFetchedLocations = new Set<number>()

  for (const locationId of locationIds) {
    let offset = 0
    const PAGE_SIZE = 200

    while (true) {
      try {
        const { appointments, pagination } = await getStaffAppointments({
          locationId,
          startDate,
          endDate,
          limit: PAGE_SIZE,
          offset,
        })

        // Log first few IDs from each page to compare against targets
        if (offset === 0) {
          console.log(`Location ${locationId} page 1 sample IDs: ${appointments.slice(0, 10).map(a => a.Id).join(', ')}`)
        }

        for (const apt of appointments) {
          if (targetIds.has(apt.Id)) {
            statusMap.set(apt.Id, apt.Status)
          }
        }

        // Stop if we found all targets for this location, or no more pages
        const total = pagination?.TotalResults ?? appointments.length
        offset += PAGE_SIZE
        if (offset >= total || appointments.length < PAGE_SIZE) break

        // Safety: stop early once all target IDs are found
        if (statusMap.size >= targetIds.size) break
      } catch (err) {
        console.error(`Failed for location ${locationId} offset ${offset}:`, err)
        break
      }
    }
    fullyFetchedLocations.add(locationId)
    console.log(`Location ${locationId}: found ${statusMap.size} matches so far`)
  }

  console.log(`Status map built: ${statusMap.size} of ${targetIds.size} IDs found`)

  // Map Mindbody status → our status
  function mapStatus(mindbodyStatus: string): string | null {
    switch (mindbodyStatus) {
      case 'Completed':    return 'completed'
      case 'Cancelled':
      case 'LateCancelled': return 'cancelled'
      case 'NoShow':       return 'noshow'
      // The appointment time already passed (this phase only queries past
      // bookings) but the front desk never closed it in Mindbody — treat as
      // attended so the sliding window can advance. Raw status is preserved
      // in mindbody_status.
      case 'Booked':
      case 'Confirmed':
      case 'Arrived':      return 'completed'
      default:             return null
    }
  }

  let synced = 0
  let unchanged = 0

  for (const [mindbodyId, mindbodyStatus] of statusMap) {
    const bookingId = idToBookingId.get(mindbodyId)
    if (!bookingId) continue

    const newStatus = mapStatus(mindbodyStatus)
    if (!newStatus) {
      unchanged++
      continue
    }

    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        status: newStatus,
        mindbody_status: mindbodyStatus,
        status_synced_at: new Date().toISOString(),
      })
      .eq('id', bookingId)

    if (updateError) {
      console.error(`Failed to update booking ${bookingId}:`, updateError)
    } else {
      console.log(`Booking ${bookingId}: confirmed → ${newStatus} (Mindbody: ${mindbodyStatus})`)
      synced++
    }
  }

  // Backlog clearer: past appointments REMOVED from Mindbody (cancelled there)
  // never appear in the fetch, so without this they stay 'confirmed' forever
  // and clog the sliding window. Absent + location fully fetched → cancelled.
  let absentCancelled = 0
  for (const booking of windowBookings) {
    const firstId = (booking.mindbody_appointment_ids as number[])?.[0]
    if (!firstId || statusMap.has(firstId)) continue
    if (!fullyFetchedLocations.has(booking.location_id as number)) continue
    const { error: updErr } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        mindbody_status: 'Cancelled',
        status_synced_at: new Date().toISOString(),
      })
      .eq('id', booking.id)
      .eq('status', 'confirmed')
    if (!updErr) absentCancelled++
  }
  if (absentCancelled > 0) {
    console.log(`Backlog: ${absentCancelled} past bookings absent from Mindbody → cancelled`)
  }

  console.log(`Sync complete: ${synced} past updated, ${unchanged} unchanged, ${upcomingCancelled} upcoming cancelled (${cancellationNoticesSent} notices sent)`)
  return NextResponse.json({ synced, unchanged, upcomingCancelled, cancellationNoticesSent, ingested, staffConfirmationsSent, rescheduled, changeNoticesSent, total_unsynced: bookings.length })
}
