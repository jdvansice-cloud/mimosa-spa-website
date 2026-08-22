import { NextRequest, NextResponse } from 'next/server'
import { ordersAdminClient } from '@/lib/orders/pipeline'
import { emitInvoiceForOrder } from '@/lib/efactura/emit'

export const maxDuration = 300

const MAX_ATTEMPTS = 5
const BATCH_SIZE = 25
const STUCK_EMITTING_MS = 5 * 60 * 1000

/**
 * GET /api/cron/efactura — every 15 min.
 *
 * Invoicing never blocks a customer: an order can be paid, booked and posted
 * while its factura is still pending. This worker drains that queue:
 *  - paid orders with no invoice row yet → emit
 *  - rejected / stuck-emitting rows → retry, capped at 5 attempts so a
 *    permanently-invalid document stops burning calls and waits for a human
 */
export async function GET(request: NextRequest) {
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const supabase = ordersAdminClient()
  const results = { emitted: 0, retried: 0, failed: 0, skipped: 0 }

  // 1. Paid orders that were never invoiced.
  const { data: uninvoiced } = await supabase
    .from('orders')
    .select('id')
    .in('status', ['posted', 'captured'])
    .is('invoice_id', null)
    .order('created_at')
    .limit(BATCH_SIZE)

  for (const o of uninvoiced ?? []) {
    const outcome = await emitInvoiceForOrder(o.id, { supabase })
    if (outcome.ok && outcome.skipped) results.skipped++
    else if (outcome.ok) results.emitted++
    else results.failed++
  }

  // 2. Rejected or stuck documents.
  const stuckBefore = new Date(Date.now() - STUCK_EMITTING_MS).toISOString()
  const { data: retryable } = await supabase
    .from('electronic_invoices')
    .select('id, order_id, doc_type, referenced_cufe, attempts, status, updated_at')
    .or(`status.eq.rejected,and(status.eq.emitting,updated_at.lt.${stuckBefore})`)
    .lt('attempts', MAX_ATTEMPTS)
    .not('order_id', 'is', null)
    .order('created_at')
    .limit(BATCH_SIZE)

  for (const row of retryable ?? []) {
    // Free the one-active-factura slot, then re-emit from scratch: the payload
    // is rebuilt from current order data, so a data fix is picked up.
    await supabase
      .from('electronic_invoices')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', row.id)

    const outcome = await emitInvoiceForOrder(row.order_id as string, {
      supabase,
      docType: row.doc_type,
      referencedCufe: row.referenced_cufe ?? undefined,
    })
    results.retried++
    if (!outcome.ok) {
      results.failed++
      // Carry the attempt count forward onto the new row.
      await supabase
        .from('electronic_invoices')
        .update({ attempts: (row.attempts ?? 0) + 1 })
        .eq('id', outcome.invoiceId ?? '')
    }
  }

  const { count: needsHuman } = await supabase
    .from('electronic_invoices')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'rejected')
    .gte('attempts', MAX_ATTEMPTS)
  if ((needsHuman ?? 0) > 0) {
    console.error(`ALARM: ${needsHuman} factura(s) rechazadas tras ${MAX_ATTEMPTS} intentos — revisar /admin/facturas`)
  }

  return NextResponse.json(results)
}
