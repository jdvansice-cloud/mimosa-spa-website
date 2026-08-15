import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getLocations, getStaffAppointments } from '@/lib/booking/mindbody'
import { sendBookingCancellation, isWatiConfigured } from '@/lib/booking/wati'
import { sendEmail, isEmailConfigured } from '@/lib/email/resend'
import { bookingCancellationEmail } from '@/lib/email/templates/booking'

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

  const { data: upcoming } = await supabase
    .from('bookings')
    .select('id, client_name, client_phone, client_email, location_id, location_name, appointment_start, mindbody_appointment_ids, services')
    .eq('status', 'confirmed')
    .gte('appointment_start', nowIso)
    .lte('appointment_start', horizon)
    .not('mindbody_appointment_ids', 'is', null)

  if (upcoming && upcoming.length > 0) {
    const upLocIds = [...new Set(upcoming.map(b => b.location_id as number).filter(Boolean))]
    const upDates = upcoming.map(b => String(b.appointment_start).slice(0, 10)).sort()
    const upStart = upDates[0]
    const upEnd = upDates[upDates.length - 1]
    const liveIds = new Set<number>()
    const okLocations = new Set<number>()

    for (const locationId of upLocIds) {
      try {
        let offset = 0
        const PAGE = 200
        while (true) {
          const { appointments, pagination } = await getStaffAppointments({
            locationId, startDate: upStart, endDate: upEnd, limit: PAGE, offset,
          })
          for (const apt of appointments) liveIds.add(apt.Id)
          const total = pagination?.TotalResults ?? appointments.length
          offset += PAGE
          if (offset >= total || appointments.length < PAGE) break
        }
        okLocations.add(locationId)
      } catch (err) {
        console.error(`Upcoming sync fetch failed for location ${locationId}:`, err)
      }
    }

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
      synced: 0, upcomingCancelled, cancellationNoticesSent, message: 'No past bookings to sync',
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
  return NextResponse.json({ synced, unchanged, upcomingCancelled, cancellationNoticesSent, total_unsynced: bookings.length })
}
