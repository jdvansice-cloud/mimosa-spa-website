import * as XLSX from 'xlsx'

// ===========================================
// Monthly accountant-packet parsing. File names change every month, so
// detection is CONTENT-based: sheet names, title text and header shapes.
// Signatures follow the formats verified against the real June 2026 packet.
// ===========================================

export type DocType =
  | 'bg_statement'   // Banco General checking statement (per location)
  | 'bg_ach'         // BG ACH detail — same movements + purpose notes (enrichment only)
  | 'sg_statement'   // St. Georges account statement (per location)
  | 'sg_ach'         // SG ACH mini-report (internal transfers; reference)
  | 'sg_settlement'  // SG card settlement detail (per transaction, includes tips)
  | 'bac_statement'  // BAC checking statement (.xls)
  | 'bac_ach'        // BAC ACH detail (subset of statement; reference)
  | 'visa_txns'      // BAC Visa statement or monthly cut (card expenses)
  | 'mb_closeout'    // Mindbody daily closeout (per location)
  | 'gc_sold'        // gift cards sold per day
  | 'gc_redeemed'    // gift cards redeemed per day
  | 'efactura'       // efacturapty invoice report (per location)
  | 'socio_expenses' // partner-paid expenses (cxp Socios)
  | 'cxp'            // pending payments summary (reference)
  | 'yappy_report'   // Yappy received payments (reference)
  | 'pdf_reference'  // PDFs kept for audit (no structured import)
  | 'unknown'

export interface BankTxn {
  txnDate: string // YYYY-MM-DD
  description: string
  debit: number
  credit: number
  balance: number | null
  /** Row-level location when the source hints one (e.g. Visa notes "Mimosa CDE / …"). */
  locationId?: number | null
}

export interface AchNote {
  txnDate: string
  amount: number
  note: string
}

export interface SettlementRow {
  locationId: number | null
  terminal: string
  txnDate: string
  cardNumber: string
  gross: number
  consumo: number
  tip: number
  saleItbms: number
  itbmsWithheld: number
  commission: number
  commissionItbms: number
  ecommerce: number
  refunded: number
}

export interface DailySalesRow {
  saleDate: string
  tickets: number
  cash: number
  marcar: number
  card: number
  misc: number
  subtotal: number | null
  itbms: number | null
  total: number
}

export interface InvoiceRow {
  invoiceNumber: string
  issuedAt: string | null
  status: string
  cufe: string
  amount: number
  itbms: number
}

export interface SocioExpenseRow {
  vendor: string
  expenseDate: string | null
  description: string
  amount: number
  itbms: number
  total: number
}

export interface ParsedFile {
  docType: DocType
  /** 1 = Costa del Este, 2 = San Francisco, null = company-wide */
  locationId: number | null
  accountKey: string | null
  /** YYYY-MM-01, detected as the modal month of the data rows */
  month: string | null
  bankTxns?: BankTxn[]
  achNotes?: AchNote[]
  settlements?: SettlementRow[]
  dailySales?: DailySalesRow[]
  invoices?: InvoiceRow[]
  socioExpenses?: SocioExpenseRow[]
  /** free-form numbers for reference docs (yappy count, cxp totals…) */
  summary?: Record<string, unknown>
}

type Cell = string | number | boolean | Date | null | undefined
type Row = Cell[]

const s = (c: Cell): string => (c === null || c === undefined ? '' : String(c)).trim()
const up = (c: Cell): string => s(c).toUpperCase()

/** Parse numbers that may look like "B/.99.88", "-B/.10.00", "1,234.56". */
export function toNum(c: Cell): number {
  if (typeof c === 'number') return c
  const cleaned = s(c).replace(/B\/\.|\s|,/g, '')
  if (!cleaned || cleaned === '-') return 0
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : 0
}

const pad = (n: number) => String(n).padStart(2, '0')
const ymd = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`

/**
 * Date cell → YYYY-MM-DD. Handles Date objects, Excel serials and slash strings.
 * `format` disambiguates slash strings: bank exports are DD/MM (default), the SG
 * settlement is MM/DD. Either way a component > 12 self-corrects.
 */
export function toDate(c: Cell, opts?: { swapDayMonth?: boolean; format?: 'DMY' | 'MDY' }): string | null {
  if (c instanceof Date) {
    let dd = c.getDate()
    let mm = c.getMonth() + 1
    // BAC Visa exports: DD/MM parsed as MM/DD by Excel → swap back
    if (opts?.swapDayMonth) [dd, mm] = [mm, dd]
    return ymd(c.getFullYear(), mm, dd)
  }
  if (typeof c === 'number' && c > 40000 && c < 60000) {
    const base = new Date(Date.UTC(1899, 11, 30))
    const d = new Date(base.getTime() + Math.round(c) * 86400000)
    return ymd(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate())
  }
  const m = s(c).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (m) {
    let [dd, mm] = opts?.format === 'MDY' ? [Number(m[2]), Number(m[1])] : [Number(m[1]), Number(m[2])]
    if (mm > 12 && dd <= 12) [dd, mm] = [mm, dd]
    return ymd(Number(m[3]), mm, dd)
  }
  return null
}

/** Most frequent YYYY-MM among row dates → YYYY-MM-01. */
function modalMonth(dates: Array<string | null>): string | null {
  const counts = new Map<string, number>()
  for (const d of dates) {
    if (!d) continue
    const k = d.slice(0, 7)
    counts.set(k, (counts.get(k) ?? 0) + 1)
  }
  let best: string | null = null
  let n = 0
  for (const [k, c] of counts) if (c > n) { best = k; n = c }
  return best ? `${best}-01` : null
}

function sheetRows(wb: XLSX.WorkBook, name: string): Row[] {
  const ws = wb.Sheets[name]
  if (!ws) return []
  return XLSX.utils.sheet_to_json<Row>(ws, { header: 1, raw: true, defval: null })
}

function allText(rows: Row[], limit = 25): string {
  return rows.slice(0, limit).map(r => r.map(up).join(' ')).join(' ')
}

/** CDE/SF from title text (tolerates glued year like "SF2026"). */
function detectLocation(text: string): number | null {
  if (/COSTA DEL ESTE|\bCDE\d*\b/.test(text)) return 1
  if (/SAN FRANCISCO|\bSFC?\d*\b/.test(text)) return 2
  return null
}

function findHeaderRow(rows: Row[], required: string[], max = 30): number {
  for (let i = 0; i < Math.min(rows.length, max); i++) {
    const cells = rows[i].map(up)
    if (required.every(req => cells.some(c => c.startsWith(req)))) return i
  }
  return -1
}

const col = (header: Row, name: string): number =>
  header.findIndex(c => up(c).startsWith(name))

// ---------- individual parsers ----------

function parseBgStatement(rows: Row[], text: string): ParsedFile | null {
  const h = findHeaderRow(rows, ['FECHA', 'DESCRIPCIÓN', 'DÉBITO', 'SALDO'])
  if (h < 0) return null
  const header = rows[h]
  const iDate = col(header, 'FECHA'), iDesc = col(header, 'DESCRIPCIÓN')
  const iDeb = col(header, 'DÉBITO'), iCred = col(header, 'CRÉDITO'), iBal = col(header, 'SALDO')
  const txns: BankTxn[] = []
  for (const r of rows.slice(h + 1)) {
    const date = toDate(r[iDate])
    if (!date || !s(r[iDesc])) continue
    txns.push({
      txnDate: date,
      description: s(r[iDesc]),
      debit: toNum(r[iDeb]),
      credit: iCred >= 0 ? toNum(r[iCred]) : 0,
      balance: iBal >= 0 && r[iBal] !== null ? toNum(r[iBal]) : null,
    })
  }
  const loc = /03-43-01/.test(text) ? 1 : /04-43-00/.test(text) ? 2 : detectLocation(text)
  return {
    docType: 'bg_statement',
    locationId: loc,
    accountKey: loc === 2 ? 'BG-SF' : 'BG-CDE',
    month: modalMonth(txns.map(t => t.txnDate)),
    bankTxns: txns,
  }
}

function parseBgAch(rows: Row[], text: string): ParsedFile | null {
  const h = findHeaderRow(rows, ['FECHA', 'DESCRIPCIÓN', 'DÉBITO'])
  if (h < 0) return null
  const header = rows[h]
  const iDate = col(header, 'FECHA'), iDeb = col(header, 'DÉBITO')
  // two Descripción columns: bank text + purpose note
  const descIdx = header.map((c, i) => (up(c).startsWith('DESCRIPCIÓN') ? i : -1)).filter(i => i >= 0)
  const iNote = descIdx.length > 1 ? descIdx[descIdx.length - 1] : -1
  const notes: AchNote[] = []
  for (const r of rows.slice(h + 1)) {
    const date = toDate(r[iDate])
    if (!date) continue
    const note = iNote >= 0 ? s(r[iNote]) : ''
    if (!note) continue
    notes.push({ txnDate: date, amount: toNum(r[iDeb]), note })
  }
  const loc = /03-43-01/.test(text) ? 1 : /04-43-00/.test(text) ? 2 : detectLocation(text)
  return {
    docType: 'bg_ach',
    locationId: loc,
    accountKey: loc === 2 ? 'BG-SF' : 'BG-CDE',
    month: modalMonth(notes.map(t => t.txnDate)),
    achNotes: notes,
  }
}

function parseSgStatement(rows: Row[], text: string): ParsedFile | null {
  const h = findHeaderRow(rows, ['FECHA', 'DESCRIPCIÓN', 'MONTO'], 40)
  if (h < 0) return null
  const header = rows[h]
  const iDate = col(header, 'FECHA'), iDesc = col(header, 'DESCRIPCIÓN')
  const iAmt = col(header, 'MONTO'), iBal = col(header, 'SALDO')
  const txns: BankTxn[] = []
  for (const r of rows.slice(h + 1)) {
    const date = toDate(r[iDate])
    if (!date || !s(r[iDesc])) continue
    const amt = toNum(r[iAmt])
    txns.push({
      txnDate: date,
      description: s(r[iDesc]),
      debit: amt < 0 ? -amt : 0,
      credit: amt > 0 ? amt : 0,
      balance: iBal >= 0 && r[iBal] !== null ? toNum(r[iBal]) : null,
    })
  }
  const loc = /20000000465492/.test(text) ? 1 : /20000001006543/.test(text) ? 2 : detectLocation(text)
  return {
    docType: 'sg_statement',
    locationId: loc,
    accountKey: loc === 2 ? 'SG-SF' : 'SG-CDE',
    month: modalMonth(txns.map(t => t.txnDate)),
    bankTxns: txns,
  }
}

function parseSettlement(wb: XLSX.WorkBook): ParsedFile | null {
  for (const name of wb.SheetNames) {
    const rows = sheetRows(wb, name)
    if (!/REEMBOLSO POR COMERCIO DETALLADO/.test(allText(rows, 8))) continue
    const h = findHeaderRow(rows, ['SUCURSAL', 'TERMINAL', 'FECHA', 'MONTO BRUTO'])
    if (h < 0) continue
    const header = rows[h]
    const idx = {
      suc: col(header, 'SUCURSAL'), term: col(header, 'TERMINAL'), date: col(header, 'FECHA'),
      card: col(header, 'NUM. TARJETA'), gross: col(header, 'MONTO BRUTO'), consumo: col(header, 'CONSUMO'),
      tip: col(header, 'PROPINA'), impto: col(header, 'IMPTO'), ret: col(header, 'RET'),
      com: col(header, 'COMISION'), itbms: col(header, 'ITBMS'), ecom: col(header, 'ECOMMERCE'),
      reemb: col(header, 'REEMBOLSO'), sucId: header.map(up).lastIndexOf('ID SUCURSAL'),
    }
    const out: SettlementRow[] = []
    for (const r of rows.slice(h + 1)) {
      const date = toDate(r[idx.date], { format: 'MDY' })
      // data rows have a card number; subtotal rows don't
      if (!date || !s(r[idx.card])) continue
      const sucName = up(r[idx.suc])
      out.push({
        // "MIMOSA SPA RETREAT" = CDE; "MIMOSA SPA RETREAT S.F." = San Francisco
        locationId: /S\.? ?F\.?$|SAN FRANCISCO/.test(sucName) ? 2 : 1,
        terminal: s(r[idx.term]),
        txnDate: date,
        cardNumber: s(r[idx.card]),
        gross: Math.abs(toNum(r[idx.gross])),
        consumo: Math.abs(toNum(r[idx.consumo])),
        tip: Math.abs(toNum(r[idx.tip])),
        saleItbms: Math.abs(toNum(r[idx.impto])),
        itbmsWithheld: Math.abs(toNum(r[idx.ret])),
        commission: Math.abs(toNum(r[idx.com])),
        commissionItbms: Math.abs(toNum(r[idx.itbms])),
        ecommerce: Math.abs(toNum(r[idx.ecom])),
        refunded: Math.abs(toNum(r[idx.reemb])),
      })
    }
    return {
      docType: 'sg_settlement',
      locationId: null,
      accountKey: null,
      month: modalMonth(out.map(t => t.txnDate)),
      settlements: out,
    }
  }
  return null
}

function parseBacStatement(rows: Row[]): ParsedFile | null {
  const h = findHeaderRow(rows, ['FECHA', 'DESCRIPCIÓN', 'DÉBITOS', 'BALANCE'])
  if (h < 0) return null
  const header = rows[h]
  const iDate = col(header, 'FECHA'), iDesc = col(header, 'DESCRIPCIÓN')
  const iDeb = col(header, 'DÉBITOS'), iCred = col(header, 'CRÉDITOS'), iBal = col(header, 'BALANCE')
  const txns: BankTxn[] = []
  for (const r of rows.slice(h + 1)) {
    const date = toDate(r[iDate])
    if (!date || !s(r[iDesc])) continue
    txns.push({
      txnDate: date,
      description: s(r[iDesc]),
      debit: toNum(r[iDeb]),
      credit: toNum(r[iCred]),
      balance: r[iBal] !== null ? toNum(r[iBal]) : null,
    })
  }
  return {
    docType: 'bac_statement',
    locationId: null,
    accountKey: 'BAC',
    month: modalMonth(txns.map(t => t.txnDate)),
    bankTxns: txns,
  }
}

function parseVisa(rows: Row[]): ParsedFile | null {
  const h = findHeaderRow(rows, ['FECHA', 'CONCEPTO'], 20)
  if (h < 0) return null
  const header = rows[h]
  const iDate = col(header, 'FECHA'), iDesc = col(header, 'CONCEPTO')
  // amount col is named "Monto" / "Monto dólares" and may sit after a notes column
  let iAmt = -1
  for (let i = header.length - 1; i >= 0; i--) if (up(header[i]).startsWith('MONTO')) { iAmt = i; break }
  if (iAmt < 0) return null
  // the column between Concepto and Monto (when present) is a free-text note
  const iNote = iAmt - iDesc > 1 ? iDesc + 1 : -1
  const txns: BankTxn[] = []
  for (const r of rows.slice(h + 1)) {
    // BAC Visa: DD/MM dates got parsed as MM/DD by Excel — swap Date cells back
    const date = toDate(r[iDate], { swapDayMonth: r[iDate] instanceof Date })
    const desc = s(r[iDesc])
    if (!date || !desc) continue
    const amt = toNum(r[iAmt])
    const note = iNote >= 0 ? s(r[iNote]) : ''
    txns.push({
      txnDate: date,
      description: note ? `${desc} · ${note}` : desc,
      debit: amt > 0 ? amt : 0,
      credit: amt < 0 ? -amt : 0,
      balance: null,
      // the human-written note often names the location ("Mimosa CDE / Insumos…")
      locationId: note ? detectLocation(note.toUpperCase()) : null,
    })
  }
  return {
    docType: 'visa_txns',
    locationId: null,
    accountKey: 'VISA-PRICESMART',
    month: modalMonth(txns.map(t => t.txnDate)),
    bankTxns: txns,
  }
}

function parseDailySales(rows: Row[], docType: 'mb_closeout' | 'gc_sold' | 'gc_redeemed', text: string): ParsedFile | null {
  const h = findHeaderRow(rows, ['FECHA DE VENTA', 'CASH'])
  if (h < 0) return null
  const header = rows[h]
  const idx = {
    date: col(header, 'FECHA DE VENTA'), tickets: col(header, 'TICKETS'), cash: col(header, 'CASH'),
    marcar: col(header, 'MARCAR'), card: col(header, 'TARJETA'), misc: col(header, 'MISC'),
    sub: col(header, 'SUB TOTAL'), itbm: col(header, 'ITBM'),
    total: header.findIndex(c => up(c).replace(/\s/g, '') === 'TOTAL'),
  }
  const out: DailySalesRow[] = []
  for (const r of rows.slice(h + 1)) {
    const date = toDate(r[idx.date])
    if (!date) continue
    out.push({
      saleDate: date,
      tickets: Math.round(toNum(r[idx.tickets])),
      cash: toNum(r[idx.cash]),
      marcar: toNum(r[idx.marcar]),
      card: toNum(r[idx.card]),
      misc: toNum(r[idx.misc]),
      subtotal: idx.sub >= 0 ? toNum(r[idx.sub]) : null,
      itbms: idx.itbm >= 0 ? toNum(r[idx.itbm]) : null,
      total: idx.total >= 0 ? toNum(r[idx.total]) : 0,
    })
  }
  return {
    docType,
    locationId: detectLocation(text),
    accountKey: null,
    month: modalMonth(out.map(t => t.saleDate)),
    dailySales: out,
  }
}

function parseEfactura(rows: Row[], text: string): ParsedFile | null {
  const h = findHeaderRow(rows, ['SUCURSAL', 'NÚMERO', 'ESTADO', 'CUFE'])
  if (h < 0) return null
  const header = rows[h]
  const idx = {
    num: col(header, 'NÚMERO'), issued: col(header, 'EMISIÓN'), status: col(header, 'ESTADO'),
    cufe: col(header, 'CUFE'), amount: col(header, 'MONTO'),
    itbms: header.map((c, i) => (up(c).startsWith('ITBMS') ? i : -1)).filter(i => i >= 0),
  }
  const out: InvoiceRow[] = []
  for (const r of rows.slice(h + 1)) {
    const num = s(r[idx.num])
    if (!num || !s(r[idx.cufe])) continue
    const issued = r[idx.issued] instanceof Date ? (r[idx.issued] as Date).toISOString() : null
    out.push({
      invoiceNumber: num,
      issuedAt: issued,
      status: s(r[idx.status]),
      cufe: s(r[idx.cufe]),
      amount: toNum(r[idx.amount]),
      itbms: idx.itbms.reduce((sum, i) => sum + toNum(r[i]), 0),
    })
  }
  return {
    docType: 'efactura',
    locationId: detectLocation(text),
    accountKey: null,
    month: modalMonth(out.map(t => (t.issuedAt ? t.issuedAt.slice(0, 10) : null))),
    invoices: out,
  }
}

function parseSocios(wb: XLSX.WorkBook): ParsedFile | null {
  const out: SocioExpenseRow[] = []
  for (const name of wb.SheetNames) {
    const rows = sheetRows(wb, name)
    const h = findHeaderRow(rows, ['PROVEEDOR', 'FECHA', 'MONTO', 'ITBM'])
    if (h < 0) continue
    const header = rows[h]
    const idx = {
      vendor: col(header, 'PROVEEDOR'), date: col(header, 'FECHA'), desc: col(header, 'DESCRIPCIÓN'),
      amount: col(header, 'MONTO'), itbms: col(header, 'ITBM'), total: col(header, 'TOTAL'),
    }
    for (const r of rows.slice(h + 1)) {
      const vendor = s(r[idx.vendor])
      const amount = toNum(r[idx.amount])
      if (!vendor || amount === 0) continue
      if (/^TOTAL/i.test(vendor)) continue // summary rows would double-count
      out.push({
        vendor,
        expenseDate: toDate(r[idx.date]),
        description: s(r[idx.desc]),
        amount,
        itbms: toNum(r[idx.itbms]),
        total: toNum(r[idx.total]) || amount,
      })
    }
  }
  if (out.length === 0) return null
  return {
    docType: 'socio_expenses',
    locationId: null,
    accountKey: null,
    month: modalMonth(out.map(t => t.expenseDate)),
    socioExpenses: out,
  }
}

// ---------- entry point ----------

export function parseWorkbook(buffer: Buffer, filename: string): ParsedFile {
  if (/\.pdf$/i.test(filename)) {
    return { docType: 'pdf_reference', locationId: null, accountKey: null, month: null }
  }
  const wb = XLSX.read(buffer, { cellDates: true })
  const names = wb.SheetNames
  const first = sheetRows(wb, names[0])
  const firstText = allText(first)
  const everyText = names.map(n => allText(sheetRows(wb, n), 10)).join(' ')

  // Yappy received-payments report
  if (names.some(n => n.startsWith('BGPYappyPlus'))) {
    const rows = sheetRows(wb, names.find(n => n.startsWith('BGPYappyPlus'))!)
    const h = findHeaderRow(rows, ['FECHA', 'REFERENCIA', 'ESTADO'])
    const iAmt = h >= 0 ? col(rows[h], 'MONTO') : -1
    const processed = rows.slice(h + 1).filter(r => r.some(c => /procesado/i.test(s(c))))
    const total = iAmt >= 0 ? processed.reduce((sum, r) => sum + toNum(r[iAmt]), 0) : 0
    return {
      docType: 'yappy_report', locationId: null, accountKey: null, month: null,
      summary: { payments: processed.length, total: Math.round(total * 100) / 100 },
    }
  }
  // BG ACH detail (has its own sheet even though a statement-shaped sheet tags along)
  if (names.includes('Detalle ACH')) {
    return parseBgAch(sheetRows(wb, 'Detalle ACH'), allText(sheetRows(wb, 'Detalle ACH'))) ?? unknown()
  }
  // SG card settlement
  if (/REEMBOLSO POR COMERCIO DETALLADO/.test(everyText)) {
    return parseSettlement(wb) ?? unknown()
  }
  // SG ACH mini-report (tiny, internal transfers) — before the statement check
  if (/DETALLE DE TRANSACCIONES/.test(firstText) && !/ESTADO DE CUENTA/.test(firstText) && first.length < 25) {
    const loc = detectLocation(firstText)
    return {
      docType: 'sg_ach', locationId: loc, accountKey: null, month: null,
      summary: { note: 'internal transfers — already on the SG statement' },
    }
  }
  // SG statement
  if (/ESTADO DE CUENTA/.test(firstText) && /CUENTA NÚMERO|CUENTA NUMERO/.test(firstText)) {
    return parseSgStatement(first, firstText) ?? unknown()
  }
  // BAC Visa (statement or monthly cut)
  if (/ESTADO DE CUENTA VISA|CORTE DE VISA/.test(firstText)) {
    return parseVisa(first) ?? unknown()
  }
  // BG statement
  if (names.some(n => n.startsWith('BGPChecking') || n.startsWith('BGRExcel'))) {
    const sheet = names.find(n => n.startsWith('BGPChecking') || n.startsWith('BGRExcel'))!
    const rows = sheetRows(wb, sheet)
    return parseBgStatement(rows, allText(rows)) ?? unknown()
  }
  // BAC statement vs BAC ACH (.xls): the Balance column is the discriminator
  if (/DETALLE DE MOVIMIENTOS DEL PERÍODO|DETALLE DE MOVIMIENTOS DEL PERIODO/.test(firstText)) {
    const parsed = parseBacStatement(first)
    if (parsed) return parsed
    return {
      docType: 'bac_ach', locationId: null, accountKey: 'BAC', month: null,
      summary: { note: 'subset of the BAC statement — not imported to avoid double-counting' },
    }
  }
  // Mindbody closeout vs gift-card reports (closeout has SUB TOTAL + ITBM)
  if (findHeaderRow(first, ['FECHA DE VENTA', 'CASH']) >= 0) {
    if (findHeaderRow(first, ['SUB TOTAL', 'ITBM']) >= 0) return parseDailySales(first, 'mb_closeout', firstText) ?? unknown()
    if (/VENTAS DE GIFT CARDS/.test(firstText)) return parseDailySales(first, 'gc_sold', firstText) ?? unknown()
    if (/PAGAS CON GIFT CARDS|PAGADAS CON GIFT CARDS/.test(firstText)) return parseDailySales(first, 'gc_redeemed', firstText) ?? unknown()
    return parseDailySales(first, 'mb_closeout', firstText) ?? unknown()
  }
  // efacturapty report
  if (names.includes('Invoices')) {
    const rows = sheetRows(wb, 'Invoices')
    return parseEfactura(rows, allText(rows)) ?? unknown()
  }
  // cxp Socios
  if (/CUENTAS POR PAGAR DE GASTOS A ACCIONIS/.test(everyText) || names.some(n => n.startsWith('Reembolso'))) {
    return parseSocios(wb) ?? unknown()
  }
  // cxp summary
  if (/PAGOS PENDIENTES/.test(everyText)) {
    const rows = first
    const items: Array<{ item: string; amount: number }> = []
    for (const r of rows) {
      const label = r.map(s).filter(Boolean)
      const nums = r.filter(c => typeof c === 'number') as number[]
      if (label.length >= 2 && nums.length > 0) items.push({ item: label[0], amount: nums[nums.length - 1] })
    }
    return { docType: 'cxp', locationId: null, accountKey: null, month: null, summary: { items } }
  }
  return unknown()

  function unknown(): ParsedFile {
    return { docType: 'unknown', locationId: null, accountKey: null, month: null }
  }
}
