/**
 * Build the printable CAFE for a wide slice of REAL sales.
 *
 * electronic_invoices is empty (no document has been emitted from this
 * database yet), so this builds the PAC payload from actual Mindbody sales the
 * way emitPos would, wraps it in the invoice row shape, and runs the receipt
 * builder over it. That exercises the real variety — many lines, exempt lines,
 * split tenders, credit notes — instead of a sample I wrote myself.
 *
 * Transmits nothing and prints nothing.
 */
import { createClient } from '@supabase/supabase-js'
import { buildPosInvoiceInput } from '../../src/lib/efactura/fromMindbodySale.ts'
import { buildPosReturnInput } from '../../src/lib/efactura/posReturns.ts'
import { buildInvoiceRequest } from '../../src/lib/efactura/buildInvoice.ts'
import { DOC_TYPE_FACTURA, DOC_TYPE_NOTA_CREDITO_REF } from '../../src/lib/efactura/constants.ts'
import { buildCafeReceipt, ReceiptNotPrintableError } from '../../src/lib/print/buildCafeReceipt.ts'

const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const LIMIT = Number(process.argv[2] || 400)

const emisor = {
  razon_social: 'MIMOSA SPA RETREAT, S.A.', ruc: '000000000-0-000000', dv: '00',
  direccion: 'Costa del Este, Star Plaza', telefono: '000-0000',
  receipt_footer: 'Gracias por su visita', codigo_sucursal: null,
}
const FAKE_CUFE = 'FE0120000229945200000000000000000000000000000000000000000001'

const { data: sales } = await s.from('mb_sales').select('id,total_paid,location_id')
  .order('sale_datetime', { ascending: false }).limit(LIMIT)

let built = 0, skipped = 0, refused = 0, broke = 0
let maxLines = 0, maxPayments = 0, exemptLines = 0, creditNotes = 0
const problems = new Map<string, number>()
const widest: { desc: string; len: number } = { desc: '', len: 0 }

for (const sale of (sales ?? []) as any[]) {
  const isReturn = Number(sale.total_paid) < 0
  const d = isReturn ? await buildPosReturnInput(s, sale.id) : await buildPosInvoiceInput(s, sale.id)
  if (!d.emit) { skipped++; continue }

  try {
    const payload = buildInvoiceRequest({
      lines: d.lines, payments: d.payments, customer: {},
      puntoFacturacion: '001',
      codigoSucursal: d.locationId === 1 ? '0000' : '0001',
      docType: isReturn ? DOC_TYPE_NOTA_CREDITO_REF : DOC_TYPE_FACTURA,
      referencedCufe: isReturn ? FAKE_CUFE : undefined,
    })
    const receipt = buildCafeReceipt({
      invoice: {
        doc_type: isReturn ? DOC_TYPE_NOTA_CREDITO_REF : DOC_TYPE_FACTURA,
        numero_documento: '0000-000-00000001',
        cufe: FAKE_CUFE,
        qr_content: `https://dgi-fep.mef.gob.pa/Consultas/FacturasPorCUFE?CUFE=${FAKE_CUFE}`,
        protocolo_autorizacion: '0000000000',
        fecha_autorizacion: new Date().toISOString(),
        environment: 'test',
        codigo_sucursal: d.locationId === 1 ? '0000' : '0001',
        request_payload: payload,
      },
      emisor,
      sucursalNombre: d.locationId === 1 ? 'Costa del Este' : 'San Francisco',
      referencia: `Venta ${sale.id}`,
    })

    built++
    if (isReturn) creditNotes++
    maxLines = Math.max(maxLines, receipt.lines.length)
    maxPayments = Math.max(maxPayments, receipt.payments.length)
    for (const l of receipt.lines) {
      if (l.taxRateCode === '00') exemptLines++
      if (l.description.length > widest.len) { widest.desc = l.description; widest.len = l.description.length }
    }

    // The receipt must agree with the document it represents, to the cent.
    const lineSum = receipt.lines.reduce((a, l) => a + l.totalCents, 0)
    if (lineSum !== receipt.totales.totalCents) {
      problems.set(`líneas ${lineSum} ≠ total ${receipt.totales.totalCents}`, 1)
    }
    const paySum = receipt.payments.reduce((a, p) => a + p.amountCents, 0)
    if (paySum !== receipt.totales.totalCents) {
      problems.set('pagos no cuadran con el total', (problems.get('pagos no cuadran con el total') ?? 0) + 1)
    }
    if (receipt.totales.netoCents + receipt.totales.itbmsCents !== receipt.totales.totalCents) {
      problems.set('neto + ITBMS ≠ total', (problems.get('neto + ITBMS ≠ total') ?? 0) + 1)
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    if (e instanceof ReceiptNotPrintableError) refused++
    else broke++
    problems.set(msg.slice(0, 90), (problems.get(msg.slice(0, 90)) ?? 0) + 1)
  }
}

console.log(`\nventas revisadas: ${sales?.length ?? 0}`)
console.log(`  recibo construido      : ${built}   (de los cuales notas de crédito: ${creditNotes})`)
console.log(`  sin documento (correcto): ${skipped}`)
console.log(`  rechazado a propósito   : ${refused}`)
console.log(`  ERROR INESPERADO        : ${broke}`)
console.log(`\n  máximo de líneas en un recibo : ${maxLines}`)
console.log(`  máximo de formas de pago      : ${maxPayments}`)
console.log(`  líneas exentas (tasa 00)      : ${exemptLines}`)
console.log(`  descripción más larga (${widest.len} car.): ${widest.desc}`)
console.log(problems.size ? '\n  PROBLEMAS:' : '\n  Sin descuadres: líneas, pagos y neto+ITBMS cuadran con el total en todos.')
for (const [k, v] of problems) console.log(`    ${v}  ${k}`)
