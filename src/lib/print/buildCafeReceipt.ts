import { toCents } from '@/lib/efactura/money'
import { FORMA_PAGO, RECEPTOR_CONSUMIDOR_FINAL } from '@/lib/efactura/constants'
import type { InvoiceRequest } from '@/lib/efactura/types'
import type { CafeReceiptPayload, CafeReceiptLine, CafeReceiptPayment } from './types'

/**
 * Turn an emitted invoice into the paper document.
 *
 * The source is the invoice's OWN request_payload — the exact structure the
 * PAC authorized — rather than the order it came from. Rebuilding from the
 * order would let paper and fiscal record drift apart the moment anything
 * downstream is edited, which is the one thing a fiscal document may not do.
 */

/** Human labels for the DGI forma de pago codes we actually emit. */
const FORMA_LABELS: Record<string, string> = {
  [FORMA_PAGO.credito]: 'Crédito',
  [FORMA_PAGO.efectivo]: 'Efectivo',
  [FORMA_PAGO.tarjetaCredito]: 'Tarjeta de crédito',
  [FORMA_PAGO.tarjetaDebito]: 'Tarjeta de débito',
  [FORMA_PAGO.vale]: 'Vale',
  [FORMA_PAGO.tarjetaRegalo]: 'Gift card',
  [FORMA_PAGO.transferencia]: 'Transferencia',
  [FORMA_PAGO.cheque]: 'Cheque',
}

function paymentLabel(p: { formaPago: string; formaPagoDescripcion?: string }): string {
  // A 99 always carries its description (DGI rule 2601), and that description
  // is more specific than "Otro" — prefer it.
  return FORMA_LABELS[p.formaPago] ?? p.formaPagoDescripcion ?? 'Otro'
}

export interface EmisorDetails {
  razon_social: string | null
  ruc: string | null
  dv: string | null
  direccion: string | null
  telefono: string | null
  receipt_footer: string | null
  codigo_sucursal: string | null
}

export interface InvoiceForPrint {
  doc_type: string
  numero_documento: string | null
  cufe: string | null
  qr_content: string | null
  protocolo_autorizacion: string | null
  fecha_autorizacion: string | null
  environment: string
  codigo_sucursal: string | null
  request_payload: InvoiceRequest | null
}

/** Thrown when we would otherwise hand the customer an invalid document. */
export class ReceiptNotPrintableError extends Error {}

export function buildCafeReceipt(args: {
  invoice: InvoiceForPrint
  emisor: EmisorDetails
  sucursalNombre: string
  referencia?: string | null
}): CafeReceiptPayload {
  const { invoice, emisor, sucursalNombre } = args
  const req = invoice.request_payload

  // These are the things whose absence makes the paper document wrong rather
  // than merely ugly, so they fail loudly instead of printing a blank.
  if (!req) throw new ReceiptNotPrintableError('La factura no tiene payload — no se puede imprimir.')
  if (!invoice.cufe) throw new ReceiptNotPrintableError('La factura no tiene CUFE — no está autorizada.')
  if (!emisor.razon_social || !emisor.ruc) {
    throw new ReceiptNotPrintableError(
      'Faltan la razón social y el RUC del emisor en la configuración de facturación.'
    )
  }

  const lines: CafeReceiptLine[] = req.listaItems.map(it => ({
    description: it.descripcionProductoServicio,
    quantity: it.cantidadProductoServicio,
    // sumaPrecioItem is ALREADY tax-inclusive (buildInvoice sets it to
    // net + tax); precioItem is the net one. Adding montoITBMS here charged
    // the customer's eye the tax twice on every taxed line.
    totalCents: toCents(it.grupoPrecios.sumaPrecioItem),
    taxRateCode: it.grupoITBMS.tasaITBMSAplicable,
    taxCents: toCents(it.grupoITBMS.montoITBMS),
  }))

  const payments: CafeReceiptPayment[] = req.totales.grupoFormasPago.map(p => ({
    label: paymentLabel(p),
    amountCents: toCents(p.valorCuotaPagada),
  }))

  const receptor = req.datosGenerales.informacionReceptor
  const rucReceptor = receptor.datosRucReceptor

  return {
    version: 1,
    emisor: {
      razonSocial: emisor.razon_social,
      ruc: emisor.ruc,
      dv: emisor.dv,
      direccion: emisor.direccion,
      telefono: emisor.telefono,
      sucursal: sucursalNombre,
      codigoSucursal: invoice.codigo_sucursal ?? emisor.codigo_sucursal ?? '',
    },
    receptor: {
      nombre: receptor.nombreRazonReceptor ?? null,
      ruc: rucReceptor?.rucReceptor ?? null,
      dv: rucReceptor?.digitoVerificador ?? null,
      tipo: receptor.tipoReceptorFe ?? RECEPTOR_CONSUMIDOR_FINAL,
    },
    documento: {
      docType: invoice.doc_type,
      numero: invoice.numero_documento,
      cufe: invoice.cufe,
      fechaEmision: invoice.fecha_autorizacion ?? req.datosGenerales.fechaEmision,
      protocoloAutorizacion: invoice.protocolo_autorizacion,
      qrContent: invoice.qr_content,
      environment: invoice.environment === 'prod' ? 'prod' : 'test',
    },
    lines,
    payments,
    totales: {
      netoCents: toCents(req.totales.totalNeto),
      itbmsCents: toCents(req.totales.totalITBMS),
      descuentoCents: toCents(req.totales.totalDescuento ?? 0),
      totalCents: toCents(req.totales.valorTotalFactura),
    },
    referencia: args.referencia ?? null,
    footer: emisor.receipt_footer,
  }
}
