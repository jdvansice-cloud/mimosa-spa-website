/**
 * What the print station needs to put a CAFE on paper.
 *
 * This is a SNAPSHOT, frozen into print_jobs.payload when the job is queued.
 * Nothing here is re-read at print time, so a reprint six months later
 * reproduces the document that was handed to the customer — even if the
 * order, the price list or the emisor's details have moved on since.
 */

export interface CafeReceiptLine {
  description: string
  quantity: number
  /** Tax-inclusive line total in cents (what the customer sees). */
  totalCents: number
  /** '00' exento · '01' 7% · '02' 10% · '03' 15% */
  taxRateCode: string
  taxCents: number
}

export interface CafeReceiptPayment {
  /** Already-resolved label, e.g. 'Tarjeta de crédito', 'Gift card'. */
  label: string
  amountCents: number
}

export interface CafeReceiptPayload {
  /** Bumped when the render changes shape; the station rejects what it can't read. */
  version: 1

  emisor: {
    razonSocial: string
    ruc: string
    dv: string | null
    direccion: string | null
    telefono: string | null
    sucursal: string
    codigoSucursal: string
  }

  /** Absent for consumidor final — the receipt then says so explicitly. */
  receptor: {
    nombre: string | null
    ruc: string | null
    dv: string | null
    /** '01' contribuyente · '02' consumidor final · '03' gobierno · '04' extranjero */
    tipo: string
  }

  documento: {
    /** '01' factura · '04'/'06' nota de crédito — changes the printed title. */
    docType: string
    numero: string | null
    cufe: string
    /** ISO 8601. */
    fechaEmision: string
    protocoloAutorizacion: string | null
    /** Encoded into the QR the customer scans to verify with the DGI. */
    qrContent: string | null
    /** 'test' documents print a banner so nobody files one as real. */
    environment: 'test' | 'prod'
  }

  lines: CafeReceiptLine[]
  payments: CafeReceiptPayment[]

  totales: {
    netoCents: number
    itbmsCents: number
    descuentoCents: number
    totalCents: number
  }

  /** Order number / Mindbody sale, so staff can tie paper back to a record. */
  referencia: string | null
  footer: string | null
}

export type PrintJobStatus = 'pending' | 'printing' | 'printed' | 'failed' | 'cancelled'

export interface PrintJob {
  id: string
  kind: 'cafe' | 'gift_card' | 'test'
  invoice_id: string | null
  order_id: string | null
  location_id: number
  status: PrintJobStatus
  payload: CafeReceiptPayload
  attempts: number
  claimed_at: string | null
  claimed_by: string | null
  printed_at: string | null
  failed_at: string | null
  error: string | null
  reprint_of: string | null
  created_at: string
}
