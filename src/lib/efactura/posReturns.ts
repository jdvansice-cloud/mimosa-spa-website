import type { SupabaseClient } from '@supabase/supabase-js'
import type { InvoiceLineInput, InvoicePaymentInput } from './types'
import { ITBMS_7, ITBMS_EXENTO } from './constants'
import { isCourtesySale, isExcludedFromInvoice } from './fromMindbodySale'

/**
 * Returns (devoluciones) at the counter, and the nota de crédito that has to
 * follow one.
 *
 * A Mindbody return is a SEPARATE sale whose lines carry negative quantities
 * and amounts; `returned = true` is stamped on the original sale's lines and
 * on the return's lines alike. What Mindbody does NOT give us is a pointer
 * from the return back to the sale it reverses, so the original is identified
 * by matching: same client, same item, exactly opposite amount, most recent
 * qualifying sale before the return.
 *
 * That match is a heuristic, and a nota de crédito pointed at the WRONG
 * factura is a worse fiscal error than one that points at nothing. So when the
 * original (or its CUFE) cannot be established, we emit a nota de crédito
 * genérica (tipo 06) — a real DGI document type — rather than guessing a CUFE.
 */

const cents = (n: unknown) => Math.round(Number(n ?? 0) * 100)

/** How far back to look for the sale a return reverses. */
const LOOKBACK_DAYS = 120
/** See the note in findOriginalSaleId — same-day returns can appear "before". */
const FORWARD_TOLERANCE_DAYS = 1

export type PosReturnInput = {
  emit: true
  /** The return sale itself. */
  saleId: number
  /** The sale being reversed, when we could identify it. */
  originalSaleId: number | null
  locationId: number
  clientId: string | null
  /** Positive amounts: a credit note states what is being credited. */
  lines: InvoiceLineInput[]
  payments: InvoicePaymentInput[]
  creditedCents: number
  excluded: Array<{ description: string; cents: number; reason: string }>
}
export type PosReturnSkip = { emit: false; saleId: number; reason: string }
export type PosReturnDecision = PosReturnInput | PosReturnSkip

/** Is this sale a return? Mindbody expresses one as a negative total. */
export function isReturnSale(totalPaid: unknown): boolean {
  return cents(totalPaid) < 0
}

type SaleRow = {
  id: number
  sale_datetime: string
  location_id: number | null
  client_id: string | null
  payments: Array<{ type?: string; amount?: number }> | null
  payment_types: string[] | null
  comp_paid: number | null
  total_paid: number | null
}

type ItemRow = {
  line_no: number
  item_id: number | null
  description: string | null
  bucket: string | null
  quantity: number | null
  unit_price: number | null
  discount_amount: number | null
  tax_amount: number | null
  total_amount: number | null
}

const SALE_COLS = 'id, sale_datetime, location_id, client_id, payments, payment_types, comp_paid, total_paid'
const ITEM_COLS = 'line_no, item_id, description, bucket, quantity, unit_price, discount_amount, tax_amount, total_amount'

/**
 * Find the sale a return reverses.
 *
 * Requires the SAME client and an exactly opposite line for every credited
 * line — a partial or approximate match is treated as "not found", because the
 * only use for the answer is deciding which CUFE to reference.
 */
export async function findOriginalSaleId(
  supabase: SupabaseClient,
  returnSale: { id: number; client_id: string | null; sale_datetime: string },
  returnLines: ItemRow[]
): Promise<number | null> {
  if (!returnSale.client_id || returnLines.length === 0) return null

  // Candidate sales: same client, near the return in time, positive total.
  //
  // Deliberately NOT "strictly before the return". Mindbody's sale_datetime is
  // not reliably ordered for a same-day return — sale 106727 (the original) is
  // stamped 23:14 while its own return 106851 is stamped 15:15 — so a strict
  // `<` filter drops the very sale we are looking for. A forward tolerance of
  // one day recovers those without loosening the match itself, which still
  // demands the same client and an exactly opposite line for every item.
  const from = new Date(Date.parse(returnSale.sale_datetime) - LOOKBACK_DAYS * 86400000)
  const until = new Date(Date.parse(returnSale.sale_datetime) + FORWARD_TOLERANCE_DAYS * 86400000)

  const { data: rows } = await supabase
    .from('mb_sales')
    .select('id, sale_datetime, total_paid')
    .eq('client_id', returnSale.client_id)
    .gt('total_paid', 0)
    .gte('sale_datetime', from.toISOString().slice(0, 19))
    .lte('sale_datetime', until.toISOString().slice(0, 19))
    .limit(100)
  if (!rows?.length) return null

  // Nearest in time first: with several identical purchases, the one closest to
  // the return is the one being reversed.
  const target = Date.parse(returnSale.sale_datetime)
  const candidates = (rows as Array<{ id: number; sale_datetime: string }>)
    .filter(c => c.id !== returnSale.id)
    .sort(
      (a, b) =>
        Math.abs(Date.parse(a.sale_datetime) - target) -
        Math.abs(Date.parse(b.sale_datetime) - target)
    )
  if (!candidates.length) return null

  const wanted = returnLines.map(l => ({ itemId: l.item_id, cents: -cents(l.total_amount) }))

  for (const candidate of candidates) {
    const { data: items } = await supabase
      .from('mb_sale_items')
      .select('item_id, total_amount')
      .eq('sale_id', candidate.id)
    if (!items?.length) continue

    const pool = (items as Array<{ item_id: number | null; total_amount: number | null }>).map(i => ({
      itemId: i.item_id,
      cents: cents(i.total_amount),
      used: false,
    }))

    const allFound = wanted.every(w => {
      const hit = pool.find(p => !p.used && p.itemId === w.itemId && p.cents === w.cents)
      if (hit) hit.used = true
      return !!hit
    })
    if (allFound) return candidate.id
  }
  return null
}

/**
 * Build the nota de crédito input for a return sale.
 *
 * Applies exactly the same exclusion rules as a factura, which matters: the
 * return of a tip or of a gift card must produce NO credit note, because
 * neither was ever invoiced. Crediting them would put money on a fiscal
 * document that never carried it.
 */
export async function buildPosReturnInput(
  supabase: SupabaseClient,
  saleId: number
): Promise<PosReturnDecision> {
  const { data: sale } = await supabase
    .from('mb_sales')
    .select(SALE_COLS)
    .eq('id', saleId)
    .maybeSingle<SaleRow>()
  if (!sale) return { emit: false, saleId, reason: 'venta no encontrada' }
  if (!isReturnSale(sale.total_paid)) {
    return { emit: false, saleId, reason: 'no es una devolución (total no negativo)' }
  }

  // A refunded courtesy never had a factura to credit. `comp_paid` is itself
  // negative on these, so the positive-only courtesy test is applied to the
  // absolute value.
  if (isCourtesySale(sale.payment_types ?? [], Math.abs(Number(sale.comp_paid ?? 0)))) {
    return { emit: false, saleId, reason: 'devolución de cortesía — no hubo factura que acreditar' }
  }

  const { data: items } = await supabase
    .from('mb_sale_items')
    .select(ITEM_COLS)
    .eq('sale_id', saleId)
    .order('line_no')

  const lines: InvoiceLineInput[] = []
  const excluded: PosReturnInput['excluded'] = []
  const creditedRaw: ItemRow[] = []

  for (const it of (items ?? []) as ItemRow[]) {
    const verdict = isExcludedFromInvoice(it.bucket, it.description)
    if (verdict) {
      excluded.push({ description: it.description ?? '', cents: cents(it.total_amount), reason: verdict })
      continue
    }
    creditedRaw.push(it)
    lines.push({
      description: it.description ?? 'Servicio',
      code: it.item_id ? `MB${it.item_id}` : 'SERVICIO',
      // A credit note states POSITIVE values; tipoDocumento is what makes it a
      // credit. Negative amounts on an 04/06 are rejected by the DGI.
      quantity: Math.abs(Number(it.quantity) || 1),
      inclusiveCents: Math.abs(cents(it.total_amount)),
      discountCents: Math.abs(cents(it.discount_amount)),
      taxRateCode: Math.abs(cents(it.tax_amount)) > 0 ? ITBMS_7 : ITBMS_EXENTO,
    })
  }

  if (lines.length === 0) {
    return {
      emit: false,
      saleId,
      reason: 'devolución sin líneas facturables (propina, gift card o pago a cuenta)',
    }
  }

  const creditedCents = lines.reduce((s, l) => s + l.inclusiveCents, 0)

  // The tenders being given back, in the same order the factura applied them.
  const payments: InvoicePaymentInput[] = []
  let remaining = creditedCents
  const ordered = [...(sale.payments ?? [])].sort((a, b) =>
    /gift|regalo/i.test(a.type ?? '') ? -1 : /gift|regalo/i.test(b.type ?? '') ? 1 : 0
  )
  for (const p of ordered) {
    if (remaining <= 0) break
    const applied = Math.min(Math.abs(cents(p.amount)), remaining)
    if (applied <= 0) continue
    payments.push({ tender: p.type ?? 'efectivo', amountCents: applied })
    remaining -= applied
  }
  if (remaining > 0) {
    return {
      emit: false,
      saleId,
      reason: `devoluciones insuficientes: faltan ${remaining} centavos para cubrir lo acreditable`,
    }
  }

  const originalSaleId = await findOriginalSaleId(
    supabase,
    { id: sale.id, client_id: sale.client_id, sale_datetime: sale.sale_datetime },
    creditedRaw
  )

  return {
    emit: true,
    saleId,
    originalSaleId,
    locationId: Number(sale.location_id) || 1,
    clientId: sale.client_id ? String(sale.client_id) : null,
    lines,
    payments,
    creditedCents,
    excluded,
  }
}
