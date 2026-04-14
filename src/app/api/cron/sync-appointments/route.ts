import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getLocations, getStaffAppointments } from '@/lib/booking/mindbody'

/**
 * GET /api/cron/sync-appointments
 * Syncs appointment statuses from Mindbody back to Supabase.
 * Runs daily. Checks confirmed bookings whose appointment time has passed
 * and updates status to: completed, cancelled, or noshow.
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

  // Only sync bookings whose appointment time has already passed
  const now = new Date().toISOString()

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('id, mindbody_appointment_ids, status, appointment_start')
    .eq('status', 'confirmed')
    .lt('appointment_start', now)
    .not('mindbody_appointment_ids', 'is', null)
    .order('appointment_start', { ascending: true })

  if (error) {
    console.error('Sync query error:', error)
    return NextResponse.json({ error: 'Query failed' }, { status: 500 })
  }

  if (!bookings || bookings.length === 0) {
    return NextResponse.json({ synced: 0, message: 'No bookings to sync' })
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
  const WINDOW_DAYS = 7

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
      default:             return null // 'Booked' = still upcoming, no change
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

  console.log(`Sync complete: ${synced} updated, ${unchanged} unchanged`)
  return NextResponse.json({ synced, unchanged, total_unsynced: bookings.length })
}
