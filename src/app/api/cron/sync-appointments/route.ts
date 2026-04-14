import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getLocations, getAllStaffAppointments } from '@/lib/booking/mindbody'

/**
 * GET /api/cron/sync-appointments
 * Syncs appointment statuses from Mindbody back to Supabase.
 * Runs daily. Checks confirmed bookings whose appointment time has passed
 * and updates status to: completed, cancelled, or noshow.
 *
 * Uses /appointment/staffappointments (date-range query) instead of
 * /appointment/appointments (by ID) which is not available for this site.
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

  if (error) {
    console.error('Sync query error:', error)
    return NextResponse.json({ error: 'Query failed' }, { status: 500 })
  }

  if (!bookings || bookings.length === 0) {
    return NextResponse.json({ synced: 0, message: 'No bookings to sync' })
  }

  // Build ID → bookingId map (use first appointment ID per booking)
  const idToBookingId = new Map<number, string>()
  const targetIds = new Set<number>()

  for (const booking of bookings) {
    const ids = booking.mindbody_appointment_ids as number[] | null
    if (ids?.length) {
      idToBookingId.set(ids[0], booking.id)
      targetIds.add(ids[0])
    }
  }

  if (targetIds.size === 0) {
    return NextResponse.json({ synced: 0, message: 'No Mindbody IDs to check' })
  }

  // Determine date range from unsynced bookings (cap lookback at 90 days)
  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

  const appointmentDates = bookings
    .filter(b => b.appointment_start)
    .map(b => new Date(b.appointment_start as string))

  const minDate = new Date(Math.min(...appointmentDates.map(d => d.getTime())))
  const startDate = (minDate < ninetyDaysAgo ? ninetyDaysAgo : minDate)
    .toISOString().split('T')[0]
  const endDate = new Date().toISOString().split('T')[0]

  console.log(`Syncing ${targetIds.size} appointments from ${startDate} to ${endDate}`)

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

  // Fetch staff appointments for the date range at each location
  const statusMap = new Map<number, string>()

  for (const locationId of locationIds) {
    try {
      const appointments = await getAllStaffAppointments({
        locationId,
        startDate,
        endDate,
      })
      console.log(`Location ${locationId}: ${appointments.length} appointments in range`)
      for (const apt of appointments) {
        if (targetIds.has(apt.Id)) {
          statusMap.set(apt.Id, apt.Status)
        }
      }
    } catch (err) {
      console.error(`Failed to fetch appointments for location ${locationId}:`, err)
    }
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
  return NextResponse.json({ synced, unchanged })
}
