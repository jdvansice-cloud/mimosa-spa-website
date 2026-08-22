import type { SupabaseClient } from '@supabase/supabase-js'
import { buildInvoiceRequest } from './buildInvoice'
import {
  DOC_TYPE_FACTURA,
  DOC_TYPE_NOTA_CREDITO_GENERICA,
  DOC_TYPE_NOTA_CREDITO_REF,
} from './constants'
import { emitInvoice, loadEfacturaConfig } from './pac'
import { buildPosInvoiceInput } from './fromMindbodySale'
import { buildPosReturnInput } from './posReturns'
import { getClientTaxIds } from '@/lib/booking/mindbody'
import type { InvoiceLineInput, InvoicePaymentInput } from './types'

/**
 * Fiscal documents for COUNTER sales.
 *
 * The online path (emit.ts) is driven by an order; this one is driven by a
 * Mindbody sale, and it covers both directions:
 *
 *   a normal sale   → factura (01)
 *   a return        → nota de crédito (04 against the original CUFE, or 06
 *                     generic when the original cannot be established)
 *
 * The credit note matters more than it looks: the vendor bridge has never
 * emitted one (zero negative documents in 1,049 June rows), so every refund
 * taken at the counter today leaves the factura standing with nothing to
 * reverse it.
 */

export type PosEmitOutcome =
  | { ok: true; skipped: true; reason: string }
  | { ok: true; skipped?: false; invoiceId: string; cufe: string; docType: string }
  | { ok: false; invoiceId?: string; error: string }

/**
 * A rejection aimed at the receptor's RUC/DV rather than the document itself —
 * the only kind worth retrying as consumidor final.
 */
function isTaxIdRejection(msg: string | undefined): boolean {
  if (!msg) return false
  const m = msg.toLowerCase()
  return (
    m.includes('ruc') ||
    m.includes('digito verificador') ||
    m.includes('dígito verificador') ||
    m.includes('receptor') ||
    m.includes('contribuyente')
  )
}

/** The CUFE of the factura we issued for a sale, if we issued one. */
async function originalCufe(
  supabase: SupabaseClient,
  saleId: number
): Promise<string | null> {
  const { data } = await supabase
    .from('electronic_invoices')
    .select('cufe')
    .eq('mindbody_sale_id', saleId)
    .eq('doc_type', DOC_TYPE_FACTURA)
    .eq('status', 'authorized')
    .maybeSingle()
  return data?.cufe ?? null
}

/** Park a return a human has to deal with, instead of dropping it silently. */
async function flagForReview(
  supabase: SupabaseClient,
  args: {
    saleId: number
    originalSaleId: number | null
    locationId: number | null
    amountCents: number
    reason: string
  }
): Promise<void> {
  await supabase.from('efactura_return_review').upsert(
    {
      mindbody_sale_id: args.saleId,
      original_sale_id: args.originalSaleId,
      location_id: args.locationId,
      amount_cents: args.amountCents,
      reason: args.reason.slice(0, 500),
    },
    { onConflict: 'mindbody_sale_id' }
  )
}

interface EmitArgs {
  supabase: SupabaseClient
  saleId: number
  locationId: number
  clientId: string | null
  lines: InvoiceLineInput[]
  payments: InvoicePaymentInput[]
  docType: string
  referencedCufe?: string | null
  reversesSaleId?: number | null
}

/** Build → insert → transmit → record. Shared by both document types. */
async function emitDocument(args: EmitArgs): Promise<PosEmitOutcome> {
  const { supabase, saleId, locationId, clientId, lines, payments, docType } = args

  const config = await loadEfacturaConfig(supabase, locationId)
  if (!config) return { ok: true, skipped: true, reason: `efactura no configurada para la sede ${locationId}` }

  // A client whose Mindbody profile carries a RUC is a contribuyente; absent
  // or rejected by the DGI, the document goes out as consumidor final.
  const tax = clientId
    ? await getClientTaxIds(clientId)
    : { ruc: null, dv: null, isCompany: false }

  const buildPayload = (useTaxId: boolean) =>
    buildInvoiceRequest({
      lines,
      payments,
      customer: useTaxId && tax.ruc ? { ruc: tax.ruc, dv: tax.dv, isCompany: tax.isCompany } : {},
      puntoFacturacion: config.punto_facturacion,
      codigoSucursal: config.codigo_sucursal,
      docType,
      referencedCufe: args.referencedCufe ?? undefined,
      cpbsShortDefault: config.default_cpbs_code_short,
    })

  let invoiceRow: { id: string } | null = null
  try {
    let payload = buildPayload(!!tax.ruc)

    const { data: created, error: insertError } = await supabase
      .from('electronic_invoices')
      .insert({
        mindbody_sale_id: saleId,
        reverses_sale_id: args.reversesSaleId ?? null,
        location_id: locationId,
        codigo_sucursal: config.codigo_sucursal,
        doc_type: docType,
        environment: config.environment,
        status: 'emitting',
        referenced_cufe: args.referencedCufe ?? null,
        request_payload: payload,
        attempts: 1,
      })
      .select('id')
      .single()

    // The partial unique indexes are the real idempotency guard: a concurrent
    // run or a re-swept sale hits this rather than emitting a second document.
    if (insertError) {
      if (insertError.code === '23505') {
        return { ok: true, skipped: true, reason: 'ya existe un documento activo para esta venta' }
      }
      return { ok: false, error: insertError.message }
    }
    invoiceRow = created

    let result = await emitInvoice(config, payload)

    if (!result.autorizada && tax.ruc && isTaxIdRejection(result.error)) {
      console.warn(`RUC ${tax.ruc} rechazado (${result.error}) — reemitiendo como consumidor final`)
      payload = buildPayload(false)
      await supabase
        .from('electronic_invoices')
        .update({ request_payload: payload, error: `RUC rechazado: ${result.error}`.slice(0, 500) })
        .eq('id', invoiceRow.id)
      result = await emitInvoice(config, payload)
    }

    const now = new Date().toISOString()

    if (!result.autorizada) {
      await supabase
        .from('electronic_invoices')
        .update({
          status: 'rejected',
          error: result.error ?? 'rechazada',
          response_payload: result.raw as Record<string, unknown>,
          updated_at: now,
        })
        .eq('id', invoiceRow.id)
      return { ok: false, invoiceId: invoiceRow.id, error: result.error ?? 'rechazada' }
    }

    await supabase
      .from('electronic_invoices')
      .update({
        status: 'authorized',
        cufe: result.cufe,
        numero_documento: result.invoice ?? (result.secuence ? String(result.secuence) : null),
        protocolo_autorizacion: result.protocoloAutorizacion,
        fecha_autorizacion: result.fechaAutorizacion ?? now,
        qr_content: result.qrContent,
        response_payload: result.raw as Record<string, unknown>,
        error: null,
        emitted_at: now,
        updated_at: now,
      })
      .eq('id', invoiceRow.id)

    // Paper for the customer. Never fatal — the document already exists at the
    // DGI, and a printer problem must not turn that into a failure.
    const { enqueueCafePrint } = await import('@/lib/print/queue')
    const queued = await enqueueCafePrint(invoiceRow.id, supabase)
    if (!queued.ok) console.error(`No se pudo encolar la impresión de ${invoiceRow.id}: ${queued.error}`)

    return { ok: true, invoiceId: invoiceRow.id, cufe: result.cufe!, docType }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'error desconocido'
    if (invoiceRow) {
      await supabase
        .from('electronic_invoices')
        .update({ status: 'rejected', error: msg.slice(0, 500), updated_at: new Date().toISOString() })
        .eq('id', invoiceRow.id)
    }
    return { ok: false, invoiceId: invoiceRow?.id, error: msg }
  }
}

/** Factura for a counter sale. */
export async function emitPosInvoice(
  supabase: SupabaseClient,
  saleId: number
): Promise<PosEmitOutcome> {
  const decision = await buildPosInvoiceInput(supabase, saleId)
  if (!decision.emit) return { ok: true, skipped: true, reason: decision.reason }

  return emitDocument({
    supabase,
    saleId,
    locationId: decision.locationId,
    clientId: decision.clientId,
    lines: decision.lines,
    payments: decision.payments,
    docType: DOC_TYPE_FACTURA,
  })
}

/**
 * Nota de crédito for a return.
 *
 * Prefers tipo 04 referencing the original factura's CUFE. Falls back to tipo
 * 06 (genérica) when the original sale can't be identified or we never
 * invoiced it — which is the case for every sale the vendor bridge handled
 * before cutover. A generic NC is a real document that credits the customer;
 * guessing a CUFE would be a fiscal error, so we never do that.
 */
export async function emitPosCreditNote(
  supabase: SupabaseClient,
  saleId: number
): Promise<PosEmitOutcome> {
  const decision = await buildPosReturnInput(supabase, saleId)
  if (!decision.emit) return { ok: true, skipped: true, reason: decision.reason }

  const cufe = decision.originalSaleId
    ? await originalCufe(supabase, decision.originalSaleId)
    : null

  if (!cufe) {
    // Visible on a worklist: a generic NC is correct but an accountant should
    // know which returns could not be tied to their original factura.
    await flagForReview(supabase, {
      saleId,
      originalSaleId: decision.originalSaleId,
      locationId: decision.locationId,
      amountCents: decision.creditedCents,
      reason: decision.originalSaleId
        ? `venta original ${decision.originalSaleId} sin factura nuestra — nota de crédito genérica`
        : 'no se pudo identificar la venta original — nota de crédito genérica',
    })
  }

  return emitDocument({
    supabase,
    saleId,
    locationId: decision.locationId,
    clientId: decision.clientId,
    lines: decision.lines,
    payments: decision.payments,
    docType: cufe ? DOC_TYPE_NOTA_CREDITO_REF : DOC_TYPE_NOTA_CREDITO_GENERICA,
    referencedCufe: cufe,
    reversesSaleId: decision.originalSaleId,
  })
}

/** Route a sale to the right document type. */
export async function emitPosDocument(
  supabase: SupabaseClient,
  saleId: number
): Promise<PosEmitOutcome> {
  const { data: sale } = await supabase
    .from('mb_sales')
    .select('total_paid')
    .eq('id', saleId)
    .maybeSingle()
  if (!sale) return { ok: true, skipped: true, reason: 'venta no encontrada' }

  return Math.round(Number(sale.total_paid ?? 0) * 100) < 0
    ? emitPosCreditNote(supabase, saleId)
    : emitPosInvoice(supabase, saleId)
}
