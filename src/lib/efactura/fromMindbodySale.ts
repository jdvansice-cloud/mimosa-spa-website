import type { SupabaseClient } from '@supabase/supabase-js'
import type { InvoiceLineInput, InvoicePaymentInput } from './types'
import { ITBMS_7, ITBMS_EXENTO } from './constants'

/**
 * Turns a Mindbody POS sale into invoice input, applying the rules that decide
 * what is actually invoiceable (confirmed with the owner/accountant, Aug 2026):
 *
 *   invoiced   services (including genuinely exempt ones, tasa 00) and real
 *              retail goods
 *   excluded   tips (pass-through, not revenue), gift cards, certificados and
 *              memberships (all stored value — invoiced at redemption), and
 *              account payments
 *   skipped    cortesía/invitado sales emit no factura at all
 *
 * Certificados and memberships live in Mindbody's "retail" bucket but are
 * prepaid value, not goods — invoicing them would repeat the very defect this
 * integration exists to remove.
 */

export type PosInvoiceInput = {
  emit: true
  saleId: number
  locationId: number
  clientId: string | null
  lines: InvoiceLineInput[]
  payments: InvoicePaymentInput[]
  invoicedCents: number
  saleTotalCents: number
  excluded: Array<{ description: string; bucket: string | null; cents: number; reason: string }>
}
export type PosInvoiceSkip = { emit: false; saleId: number; reason: string }
export type PosInvoiceDecision = PosInvoiceInput | PosInvoiceSkip

const cents = (n: unknown) => Math.round(Number(n ?? 0) * 100)

/** Stored value sold as if it were retail: certificados, memberships, bonos. */
export function isStoredValue(description: string | null): boolean {
  return /certificad|membres[ií]a|gift\s*card|tarjeta\s+de\s+regalo|bono/i.test(description ?? '')
}

/** A courtesy sale — no fiscal document is emitted for it. */
export function isCourtesySale(paymentTypes: string[], compPaid: number): boolean {
  return compPaid > 0 || paymentTypes.some(t => /cortes[ií]a|invitad|comp\b/i.test(t ?? ''))
}

function lineDecision(bucket: string | null, description: string | null):
  { include: boolean; reason?: string } {
  const b = (bucket ?? '').toLowerCase()
  if (b === 'tip' || /propina/i.test(description ?? '')) {
    return { include: false, reason: 'propina (no es ingreso)' }
  }
  if (b === 'giftcard') return { include: false, reason: 'gift card (valor almacenado)' }
  if (/account|abono a cuenta|pago a cuenta/i.test(description ?? '')) {
    return { include: false, reason: 'pago a cuenta' }
  }
  if (isStoredValue(description)) return { include: false, reason: 'valor almacenado (certificado/membresía)' }
  return { include: true }
}

export async function buildPosInvoiceInput(
  supabase: SupabaseClient,
  saleId: number
): Promise<PosInvoiceDecision> {
  const { data: sale } = await supabase
    .from('mb_sales')
    .select('id, location_id, client_id, payments, payment_types, comp_paid, total_paid')
    .eq('id', saleId)
    .maybeSingle()
  if (!sale) return { emit: false, saleId, reason: 'venta no encontrada' }

  const paymentTypes: string[] = sale.payment_types ?? []
  if (isCourtesySale(paymentTypes, Number(sale.comp_paid ?? 0))) {
    return { emit: false, saleId, reason: 'cortesía — no se factura' }
  }

  const { data: items } = await supabase
    .from('mb_sale_items')
    .select('line_no, item_id, description, bucket, quantity, unit_price, discount_amount, tax_amount, total_amount')
    .eq('sale_id', saleId)
    .order('line_no')

  const lines: InvoiceLineInput[] = []
  const excluded: PosInvoiceInput['excluded'] = []

  for (const it of items ?? []) {
    const decision = lineDecision(it.bucket, it.description)
    if (!decision.include) {
      excluded.push({
        description: it.description ?? '', bucket: it.bucket,
        cents: cents(it.total_amount), reason: decision.reason!,
      })
      continue
    }
    lines.push({
      description: it.description ?? 'Servicio',
      code: it.item_id ? `MB${it.item_id}` : 'SERVICIO',
      quantity: Number(it.quantity) || 1,
      // Mindbody totals are tax-INCLUSIVE; a zero tax_amount is a genuinely
      // exempt line and must go out as tasa 00 rather than be forced to 7%.
      inclusiveCents: cents(it.total_amount),
      discountCents: cents(it.discount_amount),
      taxRateCode: cents(it.tax_amount) > 0 ? ITBMS_7 : ITBMS_EXENTO,
    })
  }

  if (lines.length === 0) {
    return { emit: false, saleId, reason: 'sin líneas facturables (solo valor almacenado, propinas o pagos a cuenta)' }
  }

  // Tenders must add up to the INVOICED total, not the sale total — a sale can
  // mix a service with a gift card we don't invoice. Gift-card tender is
  // applied first: that is the redemption the factura is documenting.
  const invoicedCents = lines.reduce((s, l) => s + l.inclusiveCents, 0)
  const ordered = [...(sale.payments ?? [])].sort(
    (a: { type?: string }, b: { type?: string }) => (/gift|regalo/i.test(a.type ?? '') ? -1 : /gift|regalo/i.test(b.type ?? '') ? 1 : 0)
  )
  const payments: InvoicePaymentInput[] = []
  let remaining = invoicedCents
  for (const p of ordered as Array<{ type?: string; amount?: number }>) {
    if (remaining <= 0) break
    const applied = Math.min(cents(p.amount), remaining)
    if (applied <= 0) continue
    payments.push({ tender: p.type ?? 'efectivo', amountCents: applied })
    remaining -= applied
  }
  if (remaining > 0) {
    return { emit: false, saleId, reason: `pagos insuficientes: faltan ${remaining} centavos para cubrir lo facturable` }
  }

  return {
    emit: true, saleId,
    locationId: Number(sale.location_id) || 1,
    clientId: sale.client_id ? String(sale.client_id) : null,
    lines, payments, invoicedCents,
    saleTotalCents: cents(sale.total_paid),
    excluded,
  }
}
