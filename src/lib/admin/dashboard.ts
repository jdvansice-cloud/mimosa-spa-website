import { createClient } from '@supabase/supabase-js'
import { getKpis, type KpiPayload } from '@/lib/kpis/queries'

export interface AttentionCounts {
  /** Orders that failed, or that took payment and never finished. */
  ordersNeedingAttention: number
  /** Gift cards still in the `emitida` state — Mindbody hasn't seen the serial. */
  giftCardsPending: number
}

export interface DashboardData {
  kpis: KpiPayload | null
  kpisError: string | null
  attention: AttentionCounts
}

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

/**
 * Counts for the "needs attention" band. Each count is independent — a table
 * that doesn't exist yet (the orders pipeline ships behind a flag) reports
 * zero rather than taking the whole dashboard down.
 */
async function getAttentionCounts(): Promise<AttentionCounts> {
  const supabase = serviceClient()

  const [orders, giftCards] = await Promise.all([
    supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      // Mirrors the ?attention=1 filter in /api/admin/orders.
      .or('failure_code.not.is.null,status.in.(authorized,booked,captured)')
      .then(r => (r.error ? 0 : r.count ?? 0), () => 0),
    supabase
      .from('gift_cards')
      .select('id', { count: 'exact', head: true })
      .is('sold_at', null)
      .is('redeemed_at', null)
      .then(r => (r.error ? 0 : r.count ?? 0), () => 0),
  ])

  return { ordersNeedingAttention: orders, giftCardsPending: giftCards }
}

/**
 * Everything the admin dashboard renders. KPIs and the attention counts fail
 * independently, so a missing kpi_daily_* view still leaves a usable page.
 */
export async function getDashboardData(): Promise<DashboardData> {
  const [kpisResult, attention] = await Promise.all([
    getKpis('mtd', 'all').then(
      (kpis): { kpis: KpiPayload | null; error: string | null } => ({ kpis, error: null }),
      (err: unknown) => ({
        kpis: null,
        error: err instanceof Error ? err.message : 'No se pudieron cargar los KPIs',
      }),
    ),
    getAttentionCounts(),
  ])

  return { kpis: kpisResult.kpis, kpisError: kpisResult.error, attention }
}
