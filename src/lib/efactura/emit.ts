import type { SupabaseClient } from '@supabase/supabase-js'
import { buildInvoiceRequest } from './buildInvoice'
import { DOC_TYPE_FACTURA, DOC_TYPE_NOTA_CREDITO_REF } from './constants'
import { ONLINE_CHANNEL_ID, emitInvoice, loadEfacturaConfig } from './pac'
import type { InvoiceLineInput, InvoicePaymentInput } from './types'
import { loadOrder, ordersAdminClient } from '@/lib/orders/pipeline'
import { getClientTaxIds } from '@/lib/booking/mindbody'

/**
 * Emits the electronic invoice for a paid order.
 *
 * Scope rule (accountant, Aug 2026): the factura carries SERVICE lines only.
 * A gift-card purchase is stored value — it gets a sales receipt, not a
 * factura — so a mixed order produces one invoice for the services and the
 * gift card simply doesn't appear on it. An order with no service lines is
 * skipped entirely rather than invoiced for $0.
 *
 * Gift cards used as PAYMENT are the mirror image: they show up in
 * grupoFormasPago as forma 07, which is exactly when the DGI expects the
 * factura for previously-sold stored value.
 */

/**
 * Does this PAC rejection point at the receptor's RUC/DV rather than at the
 * document itself? Those are the only ones worth retrying as consumidor final
 * — a total mismatch or a bad item code would fail again either way.
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

export type EmitOutcome =
  | { ok: true; skipped: true; reason: string }
  | { ok: true; skipped?: false; invoiceId: string; cufe: string }
  | { ok: false; invoiceId?: string; error: string }

export async function emitInvoiceForOrder(
  orderId: string,
  opts: { docType?: string; referencedCufe?: string; supabase?: SupabaseClient } = {}
): Promise<EmitOutcome> {
  const supabase = opts.supabase ?? ordersAdminClient()
  const loaded = await loadOrder(supabase, orderId)
  if (!loaded) return { ok: false, error: 'Order not found' }

  const { order, items, payments } = loaded
  const docType = opts.docType ?? DOC_TYPE_FACTURA
  const isCredit = docType !== DOC_TYPE_FACTURA

  // Web orders invoice under the "Mimosa Online" sucursal (0002) regardless of
  // which spa delivers the service, so online revenue is identifiable in DGI
  // reporting. Falls back to the service location if the online row is absent.
  const config =
    (await loadEfacturaConfig(supabase, ONLINE_CHANNEL_ID)) ??
    (await loadEfacturaConfig(supabase, order.location_id))
  if (!config) return { ok: true, skipped: true, reason: 'efactura no configurada' }

  // Service lines only — gift cards are stored value, never invoiced at sale.
  const serviceItems = items.filter(i => i.item_type === 'service')
  if (serviceItems.length === 0) {
    return { ok: true, skipped: true, reason: 'orden sin servicios (solo gift cards)' }
  }

  // One active factura per order (the DB partial unique index is the backstop).
  if (!isCredit) {
    const { data: existing } = await supabase
      .from('electronic_invoices')
      .select('id, cufe, status')
      .eq('order_id', orderId)
      .eq('doc_type', DOC_TYPE_FACTURA)
      .in('status', ['authorized', 'emitting'])
      .maybeSingle()
    if (existing?.status === 'authorized' && existing.cufe) {
      return { ok: true, invoiceId: existing.id, cufe: existing.cufe }
    }
  }

  const lines: InvoiceLineInput[] = serviceItems.map(i => ({
    description: i.name_es,
    code: i.mindbody_session_type_id ? `SVC${i.mindbody_session_type_id}` : 'SERVICIO',
    quantity: i.quantity,
    inclusiveCents: i.total_cents,
    discountCents: i.discount_cents,
    taxRateCode: i.tax_rate_code,
  }))

  // The invoice covers the services only, so the tenders must add up to the
  // service total — allocate each payment against it in order (gift card
  // first, then card), which mirrors how the money was actually applied.
  const serviceTotalCents = lines.reduce((s, l) => s + l.inclusiveCents, 0)
  const invoicePayments: InvoicePaymentInput[] = []
  let remaining = serviceTotalCents
  const ordered = [...payments].sort((a, b) => (a.kind === 'gift_card' ? -1 : 1))
  for (const p of ordered) {
    if (remaining <= 0) break
    const applied = Math.min(p.amount_cents, remaining)
    if (applied <= 0) continue
    invoicePayments.push({
      tender: p.kind === 'gift_card' ? 'gift card' : p.mindbody_tender || 'tarjeta',
      amountCents: applied,
    })
    remaining -= applied
  }
  if (remaining > 0) {
    // Services partly paid by something we didn't record — refuse rather than
    // emit a document whose payments don't cover it.
    return { ok: false, error: `Pagos insuficientes para facturar: faltan ${remaining} centavos` }
  }

  // Receptor identity: a client whose Mindbody profile carries a RUC is a
  // contribuyente (01), not consumidor final (02) — RUC alone = natural
  // person, RUC + DV = company. Absent or DGI-rejected, we fall back to 02.
  const tax = order.mindbody_client_id
    ? await getClientTaxIds(order.mindbody_client_id)
    : { ruc: null, dv: null, isCompany: false }

  const buildPayload = (useTaxId: boolean) =>
    buildInvoiceRequest({
      lines,
      payments: invoicePayments,
      customer: {
        name: order.buyer_name,
        email: order.buyer_email,
        phone: order.buyer_phone,
        ...(useTaxId && tax.ruc
          ? { ruc: tax.ruc, dv: tax.dv, isCompany: tax.isCompany }
          : {}),
      },
      puntoFacturacion: config.punto_facturacion,
      codigoSucursal: config.codigo_sucursal,
      docType,
      referencedCufe: opts.referencedCufe,
      cpbsShortDefault: config.default_cpbs_code_short,
    })

  let invoiceRow: { id: string } | null = null
  try {
    let usingTaxId = !!tax.ruc
    let payload = buildPayload(usingTaxId)

    const { data: created } = await supabase
      .from('electronic_invoices')
      .insert({
        order_id: orderId,
        location_id: order.location_id,
        codigo_sucursal: config.codigo_sucursal,
        doc_type: docType,
        environment: config.environment,
        status: 'emitting',
        referenced_cufe: opts.referencedCufe ?? null,
        request_payload: payload,
        attempts: 1,
      })
      .select('id')
      .single()
    invoiceRow = created

    let result = await emitInvoice(config, payload)

    // The DGI validates RUC/DV against its own registry. A bad number must not
    // cost the customer their invoice, so re-emit once as consumidor final.
    if (!result.autorizada && usingTaxId && isTaxIdRejection(result.error)) {
      console.warn(
        `RUC ${tax.ruc} rejected by the DGI (${result.error}) — re-emitting as consumidor final`
      )
      usingTaxId = false
      payload = buildPayload(false)
      await supabase
        .from('electronic_invoices')
        .update({ request_payload: payload, error: `RUC rechazado: ${result.error}`.slice(0, 500) })
        .eq('id', invoiceRow!.id)
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
        .eq('id', invoiceRow!.id)
      return { ok: false, invoiceId: invoiceRow!.id, error: result.error ?? 'rechazada' }
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
      .eq('id', invoiceRow!.id)

    if (!isCredit) {
      await supabase
        .from('orders')
        .update({
          status: 'invoiced',
          invoiced_at: now,
          invoice_id: invoiceRow!.id,
          invoice_number: result.invoice ?? null,
          invoice_cufe: result.cufe ?? null,
          invoice_status: 'authorized',
          updated_at: now,
        })
        .eq('id', orderId)
        .in('status', ['posted', 'captured'])
    }

    return { ok: true, invoiceId: invoiceRow!.id, cufe: result.cufe! }
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

/**
 * Nota de crédito for a refunded order, referencing the original factura's
 * CUFE (tipoDocumento 04). Falls back to a generic NC only if the original
 * has no CUFE on record.
 */
export async function emitCreditNoteForOrder(
  orderId: string,
  supabase?: SupabaseClient
): Promise<EmitOutcome> {
  const db = supabase ?? ordersAdminClient()
  const { data: original } = await db
    .from('electronic_invoices')
    .select('cufe')
    .eq('order_id', orderId)
    .eq('doc_type', DOC_TYPE_FACTURA)
    .eq('status', 'authorized')
    .maybeSingle()

  return emitInvoiceForOrder(orderId, {
    docType: DOC_TYPE_NOTA_CREDITO_REF,
    referencedCufe: original?.cufe ?? undefined,
    supabase: db,
  })
}
