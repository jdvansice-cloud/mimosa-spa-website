import {
  DATOS_GENERALES_DEFAULTS,
  DEFAULT_PUNTO_FACTURACION,
  DOC_TYPE_FACTURA,
  ITEM_CODE_MAX,
  ITBMS_EXENTO,
  RATE_BY_CODE,
  RECEPTOR_CONSUMIDOR_FINAL,
  RECEPTOR_CONTRIBUYENTE,
  RECEPTOR_EXTRANJERO,
  RECEPTOR_GOBIERNO,
  formatPanamaDateTime,
  isGovernmentRuc,
  mapPaymentForma,
  paymentFormaDescripcion,
} from './constants'
import { fromCents, roundTo, splitInclusive } from './money'
import {
  EInvoiceReconciliationError,
  type BuildInvoiceInput,
  type InformacionReceptor,
  type InvoiceCustomerInput,
  type InvoiceRequest,
  type ListaItem,
  type Totales,
} from './types'

/**
 * Builds the efacturapty payload for a Mimosa order.
 *
 * Two things differ from a generic implementation and drive the whole design:
 *
 * 1. **Our prices are TAX-INCLUSIVE** (Mindbody convention: $31.03 already
 *    contains $2.03 of ITBMS). The DGI wants net and tax stated separately, so
 *    each line is split with `splitInclusive` and the parts are reconciled
 *    against the order total in integer cents.
 * 2. **Gift-card sales never appear here.** Per the accountant's ruling a gift
 *    card is stored value, not a sale: no factura at sale (receipt only), and
 *    the factura is emitted at redemption with the card as forma de pago 07.
 *    Callers pass service lines only.
 *
 * Also encodes the DGI rules that reject documents in practice:
 *  - `numeroDocumento` is never sent — the PAC owns the series.
 *  - `precioUnitarioTransferencia` at 6 decimals, because the DGI recomputes
 *    unitPrice × quantity and rejects (2053) when it doesn't equal precioItem.
 *  - `codigoInternoItem` ≤ 20 chars (rule 10103).
 *  - formaPago "99" carries a 10–100 char description (rule 2601).
 */
export function buildInvoiceRequest(input: BuildInvoiceInput): InvoiceRequest {
  const {
    lines,
    payments,
    customer,
    puntoFacturacion = DEFAULT_PUNTO_FACTURACION,
    codigoSucursal,
    docType = DOC_TYPE_FACTURA,
    referencedCufe,
    emittedAt = new Date(),
    cpbsShortDefault,
  } = input

  if (lines.length === 0) {
    throw new EInvoiceReconciliationError('No hay líneas facturables')
  }

  // ---- per-line net/tax split (prices arrive tax-inclusive) ----
  const split = lines.map(l => {
    const rate = RATE_BY_CODE[l.taxRateCode] ?? 0
    return splitInclusive(l.inclusiveCents, rate)
  })

  const listaItems: ListaItem[] = lines.map((l, i) => {
    const { netCents, taxCents } = split[i]
    const qty = l.quantity > 0 ? l.quantity : 1
    const discountCents = l.discountCents ?? 0
    // Discount is expressed on the same (net) basis as precioItem, so the
    // gross unit price must include it back: gross = net + discount(net part).
    const discountRate = RATE_BY_CODE[l.taxRateCode] ?? 0
    const discountNetCents = discountRate === 0
      ? discountCents
      : Math.round(discountCents / (1 + discountRate))
    const grossNetCents = netCents + discountNetCents

    return {
      numeroSecuenciaItem: i + 1,
      descripcionProductoServicio: l.description.slice(0, 200),
      codigoInternoItem: sanitizeItemCode(l.code),
      cantidadProductoServicio: qty,
      ...(l.cpbsShort ?? cpbsShortDefault
        ? { codigoItemCodificacionPanamenaAbreviada: l.cpbsShort ?? cpbsShortDefault! }
        : {}),
      grupoPrecios: {
        // 6 dp: the DGI recomputes unitPrice × qty and rejects on any drift.
        precioUnitarioTransferencia: roundTo(fromCents(grossNetCents) / qty, 6),
        ...(discountNetCents > 0
          ? { descuento: roundTo(fromCents(discountNetCents) / qty, 6) }
          : {}),
        precioItem: fromCents(netCents),
        sumaPrecioItem: fromCents(netCents + taxCents),
      },
      grupoITBMS: {
        tasaITBMSAplicable: l.taxRateCode,
        montoITBMS: fromCents(taxCents),
      },
    }
  })

  const totalNetoCents = split.reduce((s, x) => s + x.netCents, 0)
  const totalItbmsCents = split.reduce((s, x) => s + x.taxCents, 0)
  const totalCents = totalNetoCents + totalItbmsCents
  const totalDescuentoCents = lines.reduce((s, l) => s + (l.discountCents ?? 0), 0)

  // ---- payments ----
  const paid = payments.length > 0
    ? payments
    : [{ tender: 'efectivo', amountCents: totalCents }]

  const grupoFormasPago = paid.map(p => {
    const forma = mapPaymentForma(p.tender)
    return {
      formaPago: forma,
      ...(forma === '99' ? { formaPagoDescripcion: paymentFormaDescripcion(p.tender) } : {}),
      valorCuotaPagada: fromCents(p.amountCents),
    }
  })

  const receivedCents = paid.reduce((s, p) => s + p.amountCents, 0)
  // Guard: the DGI rejects when the tendered amounts don't cover the document.
  if (receivedCents !== totalCents) {
    throw new EInvoiceReconciliationError(
      `Los pagos (${fromCents(receivedCents)}) no cuadran con el total (${fromCents(totalCents)})`
    )
  }

  const totales: Totales = {
    totalNeto: fromCents(totalNetoCents),
    totalITBMS: fromCents(totalItbmsCents),
    totalGravado: fromCents(totalItbmsCents),
    ...(totalDescuentoCents > 0 ? { totalDescuento: fromCents(totalDescuentoCents) } : {}),
    valorTotalFactura: fromCents(totalCents),
    sumaValoresRecibidos: fromCents(receivedCents),
    tiempoPago: 1, // contado
    numeroTotalItems: listaItems.length,
    totalTodosItems: fromCents(totalCents),
    grupoFormasPago,
  }

  return {
    datosGenerales: {
      ...DATOS_GENERALES_DEFAULTS,
      tipoDocumento: docType,
      puntoFacturacion,
      fechaEmision: formatPanamaDateTime(emittedAt),
      // The PAC resolves the branch's name, address and location from this
      // code; sending it is what routes the document to the right sucursal.
      ...(codigoSucursal ? { informacionEmisor: { codigoSucursal } } : {}),
      informacionReceptor: buildReceptor(customer),
      ...(referencedCufe
        ? {
            documentosFiscalesReferenciados: [
              { informacionReferencia: { informacionReferencia: { cufeReferenciado: referencedCufe } } },
            ],
          }
        : {}),
    },
    listaItems,
    totales,
  }
}

/** SKU-ish internal code, ASCII-safe and capped at the DGI's 20 chars. */
function sanitizeItemCode(code: string): string {
  const clean = (code || 'SERVICIO').replace(/[^A-Za-z0-9._-]/g, '').toUpperCase()
  return (clean || 'SERVICIO').slice(0, ITEM_CODE_MAX)
}

/**
 * Receptor typing:
 *  - RUC present → 01 contribuyente (or 03 gobierno for No-Tributario RUCs)
 *  - passport present → 04 extranjero (tourists)
 *  - otherwise → 02 consumidor final (the overwhelming default for a spa)
 */
function buildReceptor(customer?: InvoiceCustomerInput | null): InformacionReceptor {
  const name = customer?.name?.trim() || undefined
  const email = customer?.email?.trim() || undefined

  if (customer?.ruc) {
    return {
      tipoReceptorFe: isGovernmentRuc(customer.ruc) ? RECEPTOR_GOBIERNO : RECEPTOR_CONTRIBUYENTE,
      datosRucReceptor: {
        tipoContribuyente: customer.isCompany ? 2 : 1,
        rucReceptor: customer.ruc,
        digitoVerificador: customer.dv ?? '',
      },
      ...(name ? { nombreRazonReceptor: name } : {}),
      ...(customer.address ? { direccionReceptor: customer.address.slice(0, 100) } : {}),
      ...(email ? { correoElectronicoReceptor: email } : {}),
      paisReceptor: customer.countryCode?.toUpperCase() || 'PA',
    }
  }

  if (customer?.passport) {
    return {
      tipoReceptorFe: RECEPTOR_EXTRANJERO,
      ...(name ? { nombreRazonReceptor: name } : {}),
      grupoIdentificacionExtranjera: {
        pasaportNumeroIdentificacionExtranjera: customer.passport,
        ...(customer.countryCode ? { paisExtranjero: customer.countryCode.toUpperCase() } : {}),
      },
      ...(email ? { correoElectronicoReceptor: email } : {}),
      paisReceptor: customer.countryCode?.toUpperCase() || 'PA',
    }
  }

  return {
    tipoReceptorFe: RECEPTOR_CONSUMIDOR_FINAL,
    ...(name ? { nombreRazonReceptor: name } : {}),
    ...(email ? { correoElectronicoReceptor: email } : {}),
    paisReceptor: 'PA',
  }
}

export { ITBMS_EXENTO }
