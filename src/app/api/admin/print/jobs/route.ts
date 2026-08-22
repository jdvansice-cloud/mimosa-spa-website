import { NextRequest, NextResponse } from 'next/server'
import { getGiftCardAdminContext } from '@/lib/giftcards/auth'
import { ordersAdminClient } from '@/lib/orders/pipeline'
import { claimPrintJobs } from '@/lib/print/queue'

/**
 * GET  /api/admin/print/jobs?locationId=1[&status=…]  recent queue, for the monitor
 * POST /api/admin/print/jobs  { locationId, stationId }  claim work to print
 *
 * The station polls POST; anyone watching the queue reads GET. They are split
 * so opening the monitor in a second tab never claims jobs away from the
 * machine that is actually wired to the printer.
 */

export async function GET(request: NextRequest) {
  const ctx = await getGiftCardAdminContext()
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const locationId = Number(request.nextUrl.searchParams.get('locationId'))
  const limit = Math.min(Number(request.nextUrl.searchParams.get('limit')) || 40, 200)

  let query = ordersAdminClient()
    .from('print_jobs')
    .select('id, kind, invoice_id, order_id, location_id, status, attempts, claimed_by, claimed_at, printed_at, failed_at, error, reprint_of, created_at, payload')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (Number.isFinite(locationId) && locationId > 0) query = query.eq('location_id', locationId)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ jobs: data ?? [] })
}

export async function POST(request: NextRequest) {
  const ctx = await getGiftCardAdminContext()
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const locationId = Number(body.locationId)
  const stationId = String(body.stationId ?? '').trim()

  if (!Number.isFinite(locationId) || locationId <= 0) {
    return NextResponse.json({ error: 'locationId requerido' }, { status: 400 })
  }
  // Without a station id we cannot tell two counters apart, and the claim
  // stops protecting anything.
  if (!stationId) return NextResponse.json({ error: 'stationId requerido' }, { status: 400 })

  const jobs = await claimPrintJobs(locationId, stationId, Math.min(Number(body.limit) || 3, 10))
  return NextResponse.json({ jobs })
}
