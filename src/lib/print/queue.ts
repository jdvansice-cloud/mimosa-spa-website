import type { SupabaseClient } from '@supabase/supabase-js'
import { ordersAdminClient } from '@/lib/orders/pipeline'
import { LOCATION_NAMES } from '@/lib/kpis/constants'
import { ONLINE_CHANNEL_ID } from '@/lib/efactura/pac'
import { buildCafeReceipt, ReceiptNotPrintableError } from './buildCafeReceipt'
import type { CafeReceiptPayload, PrintJob } from './types'

/**
 * The CAFE print queue.
 *
 * Printing is deliberately NOT part of invoice emission: a jammed roll must
 * never fail a fiscal document that the DGI has already authorized. Emission
 * queues a row and returns; the print station drains the queue and reports
 * back what actually came out of the printer.
 */

/**
 * How long a claimed job may sit in 'printing' before another station may take
 * it. Long enough that a slow QZ job is never stolen mid-print, short enough
 * that a closed laptop doesn't strand a customer's receipt.
 */
const STALE_CLAIM_MS = 90_000

export type EnqueueResult =
  | { ok: true; jobId: string }
  | { ok: true; skipped: true; reason: string }
  | { ok: false; error: string }

/**
 * Queue the CAFE for an authorized invoice.
 *
 * Never throws: the caller is the emission path, and a printing problem must
 * not roll back or fail an invoice that already exists at the DGI.
 */
export async function enqueueCafePrint(
  invoiceId: string,
  supabase?: SupabaseClient
): Promise<EnqueueResult> {
  const db = supabase ?? ordersAdminClient()
  try {
    const { data: invoice } = await db
      .from('electronic_invoices')
      .select('id, order_id, mindbody_sale_id, location_id, doc_type, numero_documento, cufe, qr_content, protocolo_autorizacion, fecha_autorizacion, environment, codigo_sucursal, request_payload, status')
      .eq('id', invoiceId)
      .maybeSingle()

    if (!invoice) return { ok: false, error: 'Factura no encontrada' }
    if (invoice.status !== 'authorized') {
      return { ok: true, skipped: true, reason: `factura en estado ${invoice.status}` }
    }

    // Online orders are delivered by email, not over a counter — queuing them
    // would leave a receipt sitting unprinted at a spa nobody is standing in.
    const isOnline = invoice.codigo_sucursal === '0002'
    if (isOnline) return { ok: true, skipped: true, reason: 'pedido en línea (CAFE por correo)' }

    const locationId = invoice.location_id ?? ONLINE_CHANNEL_ID
    const { data: config } = await db
      .from('efactura_config')
      .select('razon_social, ruc, dv, direccion, telefono, receipt_footer, codigo_sucursal')
      .eq('location_id', locationId)
      .maybeSingle()

    if (!config) return { ok: false, error: `Sin configuración de facturación para la sede ${locationId}` }

    // Reference printed on the receipt so staff can tie paper back to a
    // record. Counter documents have no order — they ARE a Mindbody sale.
    let referencia: string | null = invoice.mindbody_sale_id
      ? `Venta ${invoice.mindbody_sale_id}`
      : null
    if (invoice.order_id) {
      const { data } = await db
        .from('orders')
        .select('order_number, mindbody_sale_id')
        .eq('id', invoice.order_id)
        .maybeSingle()
      referencia =
        data?.order_number ?? (data?.mindbody_sale_id ? `Venta ${data.mindbody_sale_id}` : referencia)
    }

    const payload = buildCafeReceipt({
      invoice,
      emisor: config,
      sucursalNombre: LOCATION_NAMES[locationId] ?? `Sede ${locationId}`,
      referencia,
    })

    const { data: job, error } = await db
      .from('print_jobs')
      .insert({
        kind: 'cafe',
        invoice_id: invoice.id,
        order_id: invoice.order_id,
        location_id: locationId,
        payload,
      })
      .select('id')
      .single()

    if (error) {
      // The partial unique index means a live job already exists — that is the
      // duplicate guard doing its job, not a failure.
      if (error.code === '23505') return { ok: true, skipped: true, reason: 'ya estaba en cola' }
      return { ok: false, error: error.message }
    }
    return { ok: true, jobId: job.id }
  } catch (e) {
    if (e instanceof ReceiptNotPrintableError) return { ok: false, error: e.message }
    return { ok: false, error: e instanceof Error ? e.message : 'error desconocido' }
  }
}

/**
 * Hand the next pending jobs to a station, marking them 'printing' so a second
 * station can't take the same one.
 *
 * The claim is a conditional UPDATE rather than select-then-update: two
 * counters polling in the same second would otherwise both print the receipt.
 */
export async function claimPrintJobs(
  locationId: number,
  stationId: string,
  limit = 3,
  supabase?: SupabaseClient
): Promise<PrintJob[]> {
  const db = supabase ?? ordersAdminClient()
  const now = new Date().toISOString()
  const staleBefore = new Date(Date.now() - STALE_CLAIM_MS).toISOString()

  const { data: candidates } = await db
    .from('print_jobs')
    .select('id')
    .eq('location_id', locationId)
    .or(`status.eq.pending,and(status.eq.printing,claimed_at.lt.${staleBefore})`)
    .order('created_at', { ascending: true })
    .limit(limit)

  if (!candidates?.length) return []

  const claimed: PrintJob[] = []
  for (const { id } of candidates) {
    // .select() returns rows only when the WHERE matched, so an empty result
    // means another station won the race — skip it rather than double-print.
    const { data } = await db
      .from('print_jobs')
      .update({
        status: 'printing',
        claimed_at: now,
        claimed_by: stationId,
        updated_at: now,
      })
      .eq('id', id)
      .or(`status.eq.pending,and(status.eq.printing,claimed_at.lt.${staleBefore})`)
      .select('*')
    if (data?.length) claimed.push(data[0] as PrintJob)
  }
  return claimed
}

/** The station reporting what the printer actually did. */
export async function completePrintJob(
  jobId: string,
  outcome: { ok: true } | { ok: false; error: string },
  supabase?: SupabaseClient
): Promise<void> {
  const db = supabase ?? ordersAdminClient()
  const now = new Date().toISOString()

  if (outcome.ok) {
    await db
      .from('print_jobs')
      .update({ status: 'printed', printed_at: now, error: null, updated_at: now })
      .eq('id', jobId)
    return
  }

  const { data: job } = await db.from('print_jobs').select('attempts').eq('id', jobId).maybeSingle()
  await db
    .from('print_jobs')
    .update({
      status: 'failed',
      failed_at: now,
      error: outcome.error.slice(0, 500),
      attempts: (job?.attempts ?? 0) + 1,
      updated_at: now,
    })
    .eq('id', jobId)
}

/**
 * Reprint: a NEW row rather than resetting the old one, so the trail shows
 * that a document was printed twice and why the first attempt failed.
 */
export async function reprintJob(
  jobId: string,
  supabase?: SupabaseClient
): Promise<EnqueueResult> {
  const db = supabase ?? ordersAdminClient()
  const { data: job } = await db
    .from('print_jobs')
    .select('kind, invoice_id, order_id, location_id, payload, status')
    .eq('id', jobId)
    .maybeSingle()
  if (!job) return { ok: false, error: 'Trabajo no encontrado' }

  // A successful print holds the live-CAFE slot; release it so the reprint can
  // take it, keeping "one live job per invoice" true.
  if (job.kind === 'cafe' && job.status === 'printed') {
    await db.from('print_jobs').update({ status: 'cancelled' }).eq('id', jobId)
  }

  const { data: created, error } = await db
    .from('print_jobs')
    .insert({
      kind: job.kind,
      invoice_id: job.invoice_id,
      order_id: job.order_id,
      location_id: job.location_id,
      payload: job.payload as CafeReceiptPayload,
      reprint_of: jobId,
    })
    .select('id')
    .single()

  if (error) return { ok: false, error: error.message }
  return { ok: true, jobId: created.id }
}
