import { createHash } from 'crypto'
import { serviceClient, type Supabase } from '@/lib/kpis/queries'
import { classifyExpense } from './classify'
import { parseWorkbook, type ParsedFile } from './parse'

// ===========================================
// Packet import orchestration: hash-dedupe, supersede same-month re-uploads,
// insert parsed rows, enrich bank txns with ACH purpose notes, and keep the
// original file in the private biz-packet bucket (audit, ≥7-year retention).
// ===========================================

export interface ImportFileResult {
  filename: string
  docType: string
  locationId: number | null
  month: string | null
  status: 'imported' | 'reference' | 'duplicate' | 'superseded-replaced' | 'error'
  rows: number
  detail?: string
}

const DATA_TYPES = new Set([
  'bg_statement', 'sg_statement', 'bac_statement', 'visa_txns',
  'sg_settlement', 'mb_closeout', 'gc_sold', 'gc_redeemed', 'efactura', 'socio_expenses',
])

const chunk = <T,>(arr: T[], n: number): T[][] => {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n))
  return out
}

async function insertRows(supabase: Supabase, table: string, rows: Record<string, unknown>[]) {
  for (const part of chunk(rows, 400)) {
    const { error } = await supabase.from(table).insert(part)
    if (error) throw new Error(`${table}: ${error.message}`)
  }
}

/** Apply ACH purpose notes to matching bank movements (same account, amount, ±3 days). */
async function enrichWithAchNotes(supabase: Supabase, parsed: ParsedFile): Promise<number> {
  if (!parsed.achNotes?.length || !parsed.accountKey) return 0
  const dates = parsed.achNotes.map(n => n.txnDate).sort()
  const pad = (d: string, days: number) => {
    const t = new Date(`${d}T00:00:00Z`)
    t.setUTCDate(t.getUTCDate() + days)
    return t.toISOString().slice(0, 10)
  }
  const { data: txns, error } = await supabase
    .from('biz_bank_txns')
    .select('id,txn_date,debit,description,note')
    .eq('account_key', parsed.accountKey)
    .gte('txn_date', pad(dates[0], -3))
    .lte('txn_date', pad(dates[dates.length - 1], 3))
    .gt('debit', 0)
    .order('id', { ascending: true })
  if (error || !txns) return 0

  const used = new Set<number>()
  let matched = 0
  for (const note of parsed.achNotes) {
    const target = txns.find(t =>
      !used.has(t.id) &&
      !t.note &&
      Math.abs(Number(t.debit) - note.amount) < 0.005 &&
      Math.abs(Date.parse(t.txn_date) - Date.parse(note.txnDate)) <= 3 * 86400000
    )
    if (!target) continue
    used.add(target.id)
    const { error: upErr } = await supabase
      .from('biz_bank_txns')
      .update({ note: note.note, category: classifyExpense(target.description, note.note) })
      .eq('id', target.id)
    if (!upErr) matched++
  }
  return matched
}

export async function importPacketFiles(
  files: Array<{ filename: string; buffer: Buffer }>
): Promise<ImportFileResult[]> {
  const supabase = serviceClient()
  const results: ImportFileResult[] = []

  // Parse everything first so reference files can inherit the batch month.
  const parsed = files.map(f => {
    try {
      return { ...f, parsed: parseWorkbook(f.buffer, f.filename), error: null as string | null }
    } catch (err) {
      return { ...f, parsed: null, error: err instanceof Error ? err.message : String(err) }
    }
  })
  const monthCounts = new Map<string, number>()
  for (const p of parsed) {
    if (p.parsed?.month) monthCounts.set(p.parsed.month, (monthCounts.get(p.parsed.month) ?? 0) + 1)
  }
  const batchMonth = [...monthCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
    ?? `${new Date().toISOString().slice(0, 7)}-01`

  // Import ACH-note files last: their targets must exist first.
  parsed.sort((a, b) => Number(a.parsed?.docType === 'bg_ach') - Number(b.parsed?.docType === 'bg_ach'))

  for (const item of parsed) {
    const { filename, buffer } = item
    if (!item.parsed) {
      results.push({ filename, docType: 'unknown', locationId: null, month: null, status: 'error', rows: 0, detail: item.error ?? 'parse failed' })
      continue
    }
    const p = item.parsed
    const month = p.month ?? batchMonth
    try {
      const hash = createHash('sha256').update(buffer).digest('hex')
      const { data: dupe } = await supabase.from('biz_files').select('id,filename').eq('file_hash', hash).maybeSingle()
      if (dupe) {
        results.push({ filename, docType: p.docType, locationId: p.locationId, month, status: 'duplicate', rows: 0, detail: `ya importado como "${dupe.filename}"` })
        continue
      }

      // A re-upload of the same report replaces the earlier import (partial-month → full-month)
      let replaced = false
      if (DATA_TYPES.has(p.docType)) {
        let q = supabase.from('biz_files').select('id').eq('doc_type', p.docType).eq('month', month).eq('status', 'imported')
        q = p.locationId === null ? q.is('location_id', null) : q.eq('location_id', p.locationId)
        const { data: olds } = await q
        for (const old of olds ?? []) {
          for (const table of ['biz_bank_txns', 'biz_card_settlements', 'biz_daily_sales', 'biz_socio_expenses', 'biz_invoices']) {
            await supabase.from(table).delete().eq('file_id', old.id)
          }
          await supabase.from('biz_files').update({ status: 'superseded' }).eq('id', old.id)
          replaced = true
        }
      }

      const isData = DATA_TYPES.has(p.docType)
      const { data: fileRow, error: fileErr } = await supabase
        .from('biz_files')
        .insert({
          month,
          doc_type: p.docType,
          location_id: p.locationId,
          filename,
          file_hash: hash,
          status: isData ? 'imported' : 'reference',
          summary: p.summary ?? null,
        })
        .select('id')
        .single()
      if (fileErr || !fileRow) throw new Error(fileErr?.message ?? 'no file row')
      const fileId = fileRow.id as number

      let rows = 0
      if (p.bankTxns?.length && p.accountKey) {
        await insertRows(supabase, 'biz_bank_txns', p.bankTxns.map(t => ({
          file_id: fileId,
          account_key: p.accountKey,
          location_id: p.locationId,
          txn_date: t.txnDate,
          description: t.description,
          debit: t.debit,
          credit: t.credit,
          balance: t.balance,
          category: t.debit > 0 ? classifyExpense(t.description) : null,
        })))
        rows = p.bankTxns.length
      }
      if (p.settlements?.length) {
        await insertRows(supabase, 'biz_card_settlements', p.settlements.map(t => ({
          file_id: fileId, location_id: t.locationId, terminal: t.terminal, txn_date: t.txnDate,
          card_number: t.cardNumber, gross: t.gross, consumo: t.consumo, tip: t.tip,
          sale_itbms: t.saleItbms, itbms_withheld: t.itbmsWithheld, commission: t.commission,
          commission_itbms: t.commissionItbms, ecommerce: t.ecommerce, refunded: t.refunded,
        })))
        rows = p.settlements.length
      }
      if (p.dailySales?.length && p.locationId) {
        await insertRows(supabase, 'biz_daily_sales', p.dailySales.map(t => ({
          file_id: fileId, doc_type: p.docType, location_id: p.locationId, sale_date: t.saleDate,
          tickets: t.tickets, cash: t.cash, marcar: t.marcar, card: t.card, misc: t.misc,
          subtotal: t.subtotal, itbms: t.itbms, total: t.total,
        })))
        rows = p.dailySales.length
      }
      if (p.invoices?.length) {
        await insertRows(supabase, 'biz_invoices', p.invoices.map(t => ({
          file_id: fileId, location_id: p.locationId, invoice_number: t.invoiceNumber,
          issued_at: t.issuedAt, status: t.status, cufe: t.cufe, amount: t.amount, itbms: t.itbms,
        })))
        rows = p.invoices.length
      }
      if (p.socioExpenses?.length) {
        await insertRows(supabase, 'biz_socio_expenses', p.socioExpenses.map(t => ({
          file_id: fileId, vendor: t.vendor, expense_date: t.expenseDate, description: t.description,
          amount: t.amount, itbms: t.itbms, total: t.total,
        })))
        rows = p.socioExpenses.length
      }
      let detail: string | undefined
      if (p.docType === 'bg_ach') {
        const matched = await enrichWithAchNotes(supabase, p)
        rows = matched
        detail = `${matched} movimientos enriquecidos con el propósito del pago`
      }

      // keep the original in the private bucket (best-effort)
      const path = `${month.slice(0, 7)}/${filename}`
      const { error: upErr } = await supabase.storage.from('biz-packet').upload(path, buffer, {
        contentType: filename.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream',
        upsert: true,
      })
      await supabase.from('biz_files').update({ rows_imported: rows, storage_path: upErr ? null : path }).eq('id', fileId)

      results.push({
        filename, docType: p.docType, locationId: p.locationId, month,
        status: replaced ? 'superseded-replaced' : isData ? 'imported' : 'reference',
        rows,
        detail,
      })
    } catch (err) {
      results.push({ filename, docType: p.docType, locationId: p.locationId, month, status: 'error', rows: 0, detail: err instanceof Error ? err.message : String(err) })
    }
  }
  return results
}
