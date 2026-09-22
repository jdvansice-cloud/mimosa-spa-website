import { NextRequest, NextResponse } from 'next/server'
import { loadOrder, ordersAdminClient, runPaidOrderPipeline } from '@/lib/orders/pipeline'
import { SITE_URL } from '@/lib/nav'

export const maxDuration = 300

/**
 * GET /api/cron/orders — every 10 min. Finishes what the callback started
 * whenever a step died mid-flight, and expires abandoned drafts.
 *
 *  - authorized/booked/captured orders older than 3 min → re-run the pipeline
 *    (every step is status-guarded + the poster verifies /sale/sales before
 *    retrying, so re-runs are safe). ≤5 posting attempts, then admin-only.
 *  - draft/totals_verified older than 24h → expired.
 *  - Surfaces alarm counts in the response for log-based alerting.
 */
export async function GET(request: NextRequest) {
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const supabase = ordersAdminClient()
  const origin = SITE_URL || request.nextUrl.origin
  const threeMinAgo = new Date(Date.now() - 3 * 60 * 1000).toISOString()
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  const results = { resumed: 0, ok: 0, failed: 0, expired: 0, needsAdmin: 0 }

  // Resume stuck in-flight orders.
  const { data: stuck } = await supabase
    .from('orders')
    .select('id, status, posting_attempts, failure_code')
    .in('status', ['authorized', 'booked', 'captured'])
    .lt('updated_at', threeMinAgo)
    .order('created_at')
    .limit(20)

  for (const o of stuck ?? []) {
    if (o.failure_code === 'capture_failed') { results.needsAdmin++; continue }
    if (o.posting_attempts >= 5) { results.needsAdmin++; continue }
    results.resumed++
    try {
      const outcome = await runPaidOrderPipeline(o.id, origin)
      if (outcome.ok) results.ok++
      else results.failed++
    } catch (e) {
      results.failed++
      console.error('cron orders: pipeline error for', o.id, e)
    }
  }

  // Expire abandoned checkouts (never paid).
  const { data: expired } = await supabase
    .from('orders')
    .update({ status: 'expired', updated_at: new Date().toISOString() })
    .in('status', ['draft', 'totals_verified'])
    .lt('created_at', dayAgo)
    .select('id')
  results.expired = expired?.length ?? 0

  // Alarm: anything sitting authorized >1h means capture never ran.
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count: staleAuth } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'authorized')
    .lt('authorized_at', hourAgo)
  if ((staleAuth ?? 0) > 0) {
    console.error(`ALARM: ${staleAuth} order(s) authorized >1h without capture — check ${SITE_URL}/admin/pedidos`)
  }

  // Sanity check endpoint usage: also verify a specific order when asked
  // (?orderId= for manual ops, e.g. after fixing a price mismatch).
  const orderId = request.nextUrl.searchParams.get('orderId')
  if (orderId) {
    const loaded = await loadOrder(supabase, orderId)
    if (loaded) {
      const outcome = await runPaidOrderPipeline(orderId, origin)
      return NextResponse.json({ ...results, manual: { orderId, outcome } })
    }
  }

  return NextResponse.json(results)
}
