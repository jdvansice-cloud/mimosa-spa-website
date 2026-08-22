/** efacturapty request DTOs (subset we send). Mirrors their OpenAPI schema. */

export interface RucData {
  tipoContribuyente: number // 1 natural · 2 jurídico
  rucReceptor: string
  digitoVerificador: string
}

export interface UbicacionReceptor {
  codigoUbicacion?: string
  corregimiento?: string
  distrito?: string
  provincia?: string
}

export interface InformacionReceptor {
  tipoReceptorFe: string
  datosRucReceptor?: RucData
  nombreRazonReceptor?: string
  direccionReceptor?: string
  ubicacionReceptor?: UbicacionReceptor
  grupoIdentificacionExtranjera?: {
    pasaportNumeroIdentificacionExtranjera: string
    paisExtranjero?: string
  }
  correoElectronicoReceptor?: string
  telefonoContactoReceptor?: string
  paisReceptor: string
}

export interface DocumentoFiscalReferenciado {
  informacionReferencia: {
    informacionReferencia: { cufeReferenciado: string }
  }
}

export interface InformacionEmisor {
  /** 4-digit DGI branch code — how the PAC tells our sucursales apart. */
  codigoSucursal: string
}

export interface DatosGenerales {
  tipoEmision: string
  tipoDocumento: string
  /** Never sent on emission — the PAC owns the series and assigns it. */
  numeroDocumento?: number
  puntoFacturacion: string
  fechaEmision: string
  naturalezaOperacion: string
  tipoOperacion: number
  destinoOperacion: number
  formatoGeneracionCafe: number
  maneraEntregaCafe: number
  envioContenedorReceptor: number
  procesoGeneracionFe: number
  informacionEmisor?: InformacionEmisor
  informacionReceptor: InformacionReceptor
  documentosFiscalesReferenciados?: DocumentoFiscalReferenciado[]
}

export interface ItemPrecios {
  precioUnitarioTransferencia: number
  descuento?: number
  precioItem: number
  sumaPrecioItem: number
}

export interface ItemITBMS {
  tasaITBMSAplicable: string
  montoITBMS: number
}

export interface ListaItem {
  numeroSecuenciaItem: number
  descripcionProductoServicio: string
  codigoInternoItem: string
  cantidadProductoServicio: number
  codigoItemCodificacionPanamenaAbreviada?: number
  grupoPrecios: ItemPrecios
  grupoITBMS: ItemITBMS
}

export interface FormaPago {
  formaPago: string
  formaPagoDescripcion?: string
  valorCuotaPagada: number
}

export interface Totales {
  totalNeto: number
  totalITBMS: number
  totalGravado: number
  totalDescuento?: number
  valorTotalFactura: number
  sumaValoresRecibidos: number
  vueltoEntregado?: number
  tiempoPago: number
  numeroTotalItems: number
  totalTodosItems: number
  grupoFormasPago: FormaPago[]
}

export interface InvoiceRequest {
  datosGenerales: DatosGenerales
  listaItems: ListaItem[]
  totales: Totales
}

/** Input shape our builder consumes (one row per invoiceable line). */
export interface InvoiceLineInput {
  description: string
  /** Internal code (≤20 chars after sanitizing). */
  code: string
  quantity: number
  /** Line total the customer pays, TAX-INCLUSIVE, in cents, after discount. */
  inclusiveCents: number
  /** Discount already applied to this line, tax-inclusive cents. */
  discountCents?: number
  /** DGI rate code: '00' exento · '01' 7% · '02' 10% · '03' 15%. */
  taxRateCode: string
  cpbsShort?: number
}

export interface InvoicePaymentInput {
  /** Tender label or a 2-digit DGI code. */
  tender: string
  /** Amount applied, in cents. */
  amountCents: number
}

export interface InvoiceCustomerInput {
  name?: string | null
  email?: string | null
  phone?: string | null
  ruc?: string | null
  dv?: string | null
  isCompany?: boolean
  passport?: string | null
  countryCode?: string | null
  address?: string | null
}

export interface BuildInvoiceInput {
  lines: InvoiceLineInput[]
  payments: InvoicePaymentInput[]
  customer?: InvoiceCustomerInput | null
  puntoFacturacion: string
  /** DGI sucursal: '0000' CDE · '0001' SF · '0002' Mimosa Online. */
  codigoSucursal?: string | null
  docType?: string
  referencedCufe?: string | null
  emittedAt?: Date
  cpbsShortDefault?: number | null
}

export class EInvoiceReconciliationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EInvoiceReconciliationError'
  }
}
