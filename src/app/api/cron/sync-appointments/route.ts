import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getAppointmentStatuses } from '@/lib/booking/mindbody'

/**
 * GET /api/cron/sync-appointments
 * Syncs appointment statuses from Mindbody back to Supabase.
 * Runs daily. Checks confirmed bookings whose appointment time has passed
 * and updates status to: completed, cancelled, or noshow.
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
    .select('id, mindbody_appointment_ids, status')
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

  // Collect all Mindbody appointment IDs across all bookings
  const allMindbodyIds: number[] = []
  const idToBookingId = new Map<number, string>()

  for (const booking of bookings) {
    const ids = booking.mindbody_appointment_ids as number[] | null
    if (ids?.length) {
      // Use the first appointment ID as representative for the booking
      allMindbodyIds.push(ids[0])
      idToBookingId.set(ids[0], booking.id)
    }
  }

  if (allMindbodyIds.length === 0) {
    return NextResponse.json({ synced: 0, message: 'No Mindbody IDs to check' })
  }

  // Fetch statuses from Mindbody in one call
  let statuses: Array<{ id: number; status: string }> = []
  try {
    statuses = await getAppointmentStatuses(allMindbodyIds)
  } catch (err) {
    console.error('Failed to fetch appointment statuses from Mindbody:', err)
    return NextResponse.json({ error: 'Mindbody fetch failed' }, { status: 500 })
  }

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

  for (const { id: mindbodyId, status: mindbodyStatus } of statuses) {
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
