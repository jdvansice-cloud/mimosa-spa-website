import type { CafeReceiptPayload } from './types'

/**
 * A representative CAFE for provisioning and calibration.
 *
 * Exercises everything that can go wrong on 80 mm paper: a long service name
 * that must wrap, an exempt line beside a taxed one, two tenders, and a QR of
 * realistic length. Always marked as a test document, so a stray print can
 * never be mistaken for a fiscal one.
 */
export function sampleCafeReceipt(emisor?: Partial<CafeReceiptPayload['emisor']>): CafeReceiptPayload {
  return {
    version: 1,
    emisor: {
      razonSocial: 'MIMOSA SPA RETREAT, S.A.',
      ruc: '000000000-0-000000',
      dv: '00',
      direccion: 'Costa del Este, Star Plaza, Ciudad de Panamá',
      telefono: '000-0000',
      sucursal: 'Prueba',
      codigoSucursal: '0000',
      ...emisor,
    },
    receptor: { nombre: null, ruc: null, dv: null, tipo: '02' },
    documento: {
      docType: '01',
      numero: '0000-000-00000000',
      cufe: 'FE0120000000000000000000000000000000000000000000000000000000',
      fechaEmision: new Date().toISOString(),
      protocoloAutorizacion: '0000000000',
      qrContent:
        'https://dgi-fep.mef.gob.pa/Consultas/FacturasPorCUFE?CUFE=FE0120000000000000000000000000000000000000000000000000000000',
      environment: 'test',
    },
    lines: [
      {
        description: 'Masaje de tejido profundo 80 minutos con aromaterapia',
        quantity: 1,
        totalCents: 12500,
        taxRateCode: '01',
        taxCents: 818,
      },
      { description: 'Certificado de regalo', quantity: 1, totalCents: 5000, taxRateCode: '00', taxCents: 0 },
    ],
    payments: [
      { label: 'Tarjeta de crédito', amountCents: 15000 },
      { label: 'Gift card', amountCents: 2500 },
    ],
    totales: { netoCents: 16682, itbmsCents: 818, descuentoCents: 0, totalCents: 17500 },
    referencia: 'PRUEBA DE IMPRESIÓN',
    footer: 'Gracias por su visita',
  }
}
