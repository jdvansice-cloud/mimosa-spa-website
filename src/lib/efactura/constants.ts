/**
 * DGI Panama (FEP) enums, defaults and mappers for efacturapty.
 * Codes come from the DGI "Ficha Técnica de Factura Electrónica" catalogs.
 */

/** tipoDocumento */
export const DOC_TYPE_FACTURA = '01'
/** Nota de crédito genérica (no formal CUFE reference required). */
export const DOC_TYPE_NOTA_CREDITO_GENERICA = '06'
/** Nota de crédito referida a una o varias FE (carries the original CUFE). */
export const DOC_TYPE_NOTA_CREDITO_REF = '04'

/** tasaITBMSAplicable */
export const ITBMS_EXENTO = '00'
export const ITBMS_7 = '01'
export const ITBMS_10 = '02'
export const ITBMS_15 = '03'

export function itbmsRateCode(ratePercent: number): string {
  switch (Math.round(ratePercent)) {
    case 0: return ITBMS_EXENTO
    case 7: return ITBMS_7
    case 10: return ITBMS_10
    case 15: return ITBMS_15
    default: return ITBMS_7
  }
}

export const RATE_BY_CODE: Record<string, number> = {
  [ITBMS_EXENTO]: 0,
  [ITBMS_7]: 0.07,
  [ITBMS_10]: 0.1,
  [ITBMS_15]: 0.15,
}

/** tipoReceptorFe */
export const RECEPTOR_CONTRIBUYENTE = '01'
export const RECEPTOR_CONSUMIDOR_FINAL = '02'
export const RECEPTOR_GOBIERNO = '03'
export const RECEPTOR_EXTRANJERO = '04'

export const DEFAULT_PUNTO_FACTURACION = '001'

export const DATOS_GENERALES_DEFAULTS = {
  tipoEmision: '01',         // emisión normal (no contingencia)
  naturalezaOperacion: '01', // venta
  tipoOperacion: 1,          // salida
  destinoOperacion: 1,       // Panamá
  // iFormCAFE 3 = "Papel formato carta" — the CAFE the customer receives.
  // (1 would mean NO CAFE is generated at all, leaving the client with no
  // fiscal document; verified against DGI Ficha Técnica field B15.)
  formatoGeneracionCafe: 3,
  // iEntCAFE 3 = "CAFE enviado para el receptor en formato electrónico" (B16).
  maneraEntregaCafe: 3,
  envioContenedorReceptor: 1, // dEnvFE 1 = normal
  // iProGen 1 = "Generación por el sistema de facturación del contribuyente
  // (desarrollo propio)" — this is us. The old vendor bridge used 2,
  // "generación por tercero contratado" (B18).
  procesoGeneracionFe: 1,
} as const

/**
 * formaPago (DGI catalog): 01 crédito · 02 efectivo · 03 tarjeta de crédito ·
 * 04 tarjeta de débito · 05 tarjeta de fidelización · 06 vale ·
 * 07 tarjeta de regalo · 08 transferencia/depósito · 09 cheque ·
 * 10 punto de pago · 99 otro (requires a description).
 */
export const FORMA_PAGO = {
  credito: '01',
  efectivo: '02',
  tarjetaCredito: '03',
  tarjetaDebito: '04',
  vale: '06',
  tarjetaRegalo: '07',
  transferencia: '08',
  cheque: '09',
  otro: '99',
} as const

/**
 * Map an internal payment kind/tender to a DGI forma de pago.
 * Online card payments (Visa/MC/AMEX via Tilopay) → 03.
 * Gift-card redemption → 07 (the invoice is emitted at redemption, with the
 * card acting as the tender — per the accountant's ruling).
 * Yappy has no dedicated DGI code → 99 with a description.
 */
export function mapPaymentForma(tender: string | null | undefined): string {
  const v = (tender ?? '').trim()
  if (/^\d{2}$/.test(v)) return v
  const s = v.toLowerCase()
  // Order matters: CLAVE (Panama's debit network) must beat the generic card
  // rule, and "Gift Card" must beat it too.
  if (/gift|regalo/.test(s)) return FORMA_PAGO.tarjetaRegalo
  if (/yappy/.test(s)) return FORMA_PAGO.otro
  if (/efectivo|cash/.test(s)) return FORMA_PAGO.efectivo
  if (/d[eé]bito|debit|clave/.test(s)) return FORMA_PAGO.tarjetaDebito
  if (/cheque|check/.test(s)) return FORMA_PAGO.cheque
  // "link pago" is the bank's remote payment link — the money lands as a
  // deposit, so it is a transferencia rather than a card charge.
  if (/transfer|ach|dep[oó]sito|link/.test(s)) return FORMA_PAGO.transferencia
  if (/tarjeta|card|visa|master|amex|american/.test(s)) return FORMA_PAGO.tarjetaCredito
  return FORMA_PAGO.otro
}

/**
 * Description required whenever formaPago is "99" (DGI rule 2601).
 * The XSD field dFormaPagoDesc is minLength 10 / maxLength 100, so short
 * names like "Yappy" must be spelled out.
 */
export function paymentFormaDescripcion(tender: string | null | undefined): string {
  const s = (tender ?? '').trim().toLowerCase()
  let desc: string
  if (/yappy/.test(s)) desc = 'Pago por Yappy'
  else if (/apple\s*pay/.test(s)) desc = 'Pago por Apple Pay'
  else if (/transfer|ach/.test(s)) desc = 'Transferencia bancaria'
  else desc = `Otro medio de pago${s ? `: ${s}` : ''}`
  if (desc.length < 10) desc = `${desc} (otro medio)`
  return desc.slice(0, 100)
}

/**
 * ISO 8601 in Panama local time (UTC−5, no DST): "2026-08-18T14:05:05-05:00".
 */
export function formatPanamaDateTime(date: Date): string {
  const shifted = new Date(date.getTime() - 5 * 60 * 60 * 1000)
  const p = (n: number) => String(n).padStart(2, '0')
  return (
    `${shifted.getUTCFullYear()}-${p(shifted.getUTCMonth() + 1)}-${p(shifted.getUTCDate())}` +
    `T${p(shifted.getUTCHours())}:${p(shifted.getUTCMinutes())}:${p(shifted.getUTCSeconds())}-05:00`
  )
}

/** RUCs carrying the No-Tributario marker belong to government receptors. */
export function isGovernmentRuc(ruc?: string | null): boolean {
  return /(?:^|-)NT(?:-|$)/i.test((ruc ?? '').trim())
}

/** codigoInternoItem is capped at 20 chars by the DGI (rule 10103). */
export const ITEM_CODE_MAX = 20
