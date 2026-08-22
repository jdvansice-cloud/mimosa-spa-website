/**
 * Dry run: build the exact PAC payload for representative Mimosa orders and
 * validate it against the DGI rules that cause rejections. Sends NOTHING.
 *
 *   node --experimental-strip-types scripts/spikes/efactura-dryrun.ts
 */
import { buildInvoiceRequest } from '../../src/lib/efactura/buildInvoice.ts'
import type { BuildInvoiceInput } from '../../src/lib/efactura/types.ts'

const scenarios: Array<{ title: string; note?: string; input: BuildInvoiceInput }> = [
  {
    title: 'Servicio pagado con tarjeta (caso típico)',
    input: {
      puntoFacturacion: '001',
      codigoSucursal: '0002',
      lines: [
        { description: 'Masaje Relax 60 min', code: 'SVC101', quantity: 1, inclusiveCents: 7900, taxRateCode: '01' },
      ],
      payments: [{ tender: 'Visa/MC Web', amountCents: 7900 }],
      customer: { name: 'María González', email: 'maria@example.com' },
    },
  },
  {
    title: 'Servicio + adicional, con descuento online 10%',
    input: {
      puntoFacturacion: '001',
      codigoSucursal: '0002',
      lines: [
        { description: 'Masaje Relax 60 min', code: 'SVC101', quantity: 1, inclusiveCents: 7110, discountCents: 790, taxRateCode: '01' },
        { description: 'Piedras Calientes', code: 'SVC205', quantity: 1, inclusiveCents: 900, discountCents: 100, taxRateCode: '01' },
      ],
      payments: [{ tender: 'Visa/MC Web', amountCents: 8010 }],
      customer: { name: 'Ana Lorena Pérez', email: 'ana@example.com' },
    },
  },
  {
    title: 'Servicio canjeado con GIFT CARD + tarjeta (split)',
    note: 'La gift card aparece como forma de pago 07 — este es el momento en que se factura el valor almacenado.',
    input: {
      puntoFacturacion: '001',
      codigoSucursal: '0002',
      lines: [
        { description: 'Ritual Mimosa', code: 'SVC310', quantity: 1, inclusiveCents: 9900, taxRateCode: '01' },
      ],
      payments: [
        { tender: 'gift card', amountCents: 5000 },
        { tender: 'Visa/MC Web', amountCents: 4900 },
      ],
      customer: { name: 'Fabián Espinosa' },
    },
  },
  {
    title: 'Turista con pasaporte (receptor 04)',
    input: {
      puntoFacturacion: '001',
      codigoSucursal: '0002',
      lines: [
        { description: 'Masaje Profundo 90 min', code: 'SVC120', quantity: 2, inclusiveCents: 27800, taxRateCode: '01' },
      ],
      payments: [{ tender: 'Yappy Web', amountCents: 27800 }],
      customer: { name: 'John Smith', passport: 'X1234567', countryCode: 'US' },
    },
  },
{
    title: 'Persona con RUC (sin DV) — receptor 01, contribuyente natural',
    note: 'RUC sin DV = persona natural (tipoContribuyente 1).',
    input: {
      puntoFacturacion: '001',
      codigoSucursal: '0002',
      lines: [
        { description: 'Masaje Relax 60 min', code: 'SVC101', quantity: 1, inclusiveCents: 7900, taxRateCode: '01' },
      ],
      payments: [{ tender: 'Visa/MC Web', amountCents: 7900 }],
      customer: { name: 'Juan Pérez', ruc: '8-711-1495' },
    },
  },
  {
    title: 'Empresa con RUC (receptor 01)',
    input: {
      puntoFacturacion: '001',
      codigoSucursal: '0002',
      lines: [
        { description: 'Paquete Corporativo Bienestar', code: 'SVC900', quantity: 10, inclusiveCents: 79000, taxRateCode: '01' },
      ],
      payments: [{ tender: 'Visa/MC Web', amountCents: 79000 }],
      customer: { name: 'Acme Panamá, S.A.', ruc: '155123456-2-2021', dv: '45', isCompany: true, email: 'pagos@acme.com' },
    },
  },
  {
    title: 'Nota de crédito por reembolso (tipo 04)',
    input: {
      puntoFacturacion: '001',
      codigoSucursal: '0002',
      docType: '04',
      referencedCufe: 'FE0120000000000000155123456220210010000000012026081812345678901',
      lines: [
        { description: 'Masaje Relax 60 min', code: 'SVC101', quantity: 1, inclusiveCents: 7900, taxRateCode: '01' },
      ],
      payments: [{ tender: 'Visa/MC Web', amountCents: 7900 }],
      customer: { name: 'María González' },
    },
  },
]

let failures = 0
const check = (label: string, ok: boolean, detail = '') => {
  if (!ok) failures++
  console.log(`   ${ok ? '✓' : '✗'} ${label}${detail ? ' — ' + detail : ''}`)
}

for (const s of scenarios) {
  console.log('\n' + '═'.repeat(74))
  console.log('▶ ' + s.title)
  if (s.note) console.log('  ' + s.note)
  console.log('═'.repeat(74))

  let payload
  try {
    payload = buildInvoiceRequest(s.input)
  } catch (e) {
    failures++
    console.log('   ✗ ERROR: ' + (e instanceof Error ? e.message : String(e)))
    continue
  }

  console.log(JSON.stringify(payload, null, 1))
  console.log('\n  Validaciones DGI:')

  const t = payload.totales
  const r2 = (n: number) => Math.round(n * 100) / 100

  check('numeroDocumento ausente (lo asigna el PAC)',
    payload.datosGenerales.numeroDocumento === undefined)
  check('neto + ITBMS = total factura',
    r2(t.totalNeto + t.totalITBMS) === t.valorTotalFactura,
    `${t.totalNeto} + ${t.totalITBMS} = ${r2(t.totalNeto + t.totalITBMS)} vs ${t.valorTotalFactura}`)
  check('pagos = total factura',
    t.sumaValoresRecibidos === t.valorTotalFactura)
  check('suma de líneas = total',
    r2(payload.listaItems.reduce((a, i) => a + i.grupoPrecios.sumaPrecioItem, 0)) === t.valorTotalFactura)

  for (const it of payload.listaItems) {
    const q = it.cantidadProductoServicio
    const recomputed = r2((it.grupoPrecios.precioUnitarioTransferencia - (it.grupoPrecios.descuento ?? 0)) * q)
    check(`ítem ${it.numeroSecuenciaItem}: (unitario − descuento) × ${q} = precioItem`,
      recomputed === it.grupoPrecios.precioItem,
      `${recomputed} vs ${it.grupoPrecios.precioItem}`)
    check(`ítem ${it.numeroSecuenciaItem}: codigoInternoItem ≤ 20`,
      it.codigoInternoItem.length <= 20, `"${it.codigoInternoItem}" (${it.codigoInternoItem.length})`)
    check(`ítem ${it.numeroSecuenciaItem}: neto + ITBMS = suma`,
      r2(it.grupoPrecios.precioItem + it.grupoITBMS.montoITBMS) === it.grupoPrecios.sumaPrecioItem)
  }

  for (const fp of t.grupoFormasPago) {
    if (fp.formaPago === '99') {
      const d = fp.formaPagoDescripcion ?? ''
      check(`forma 99 con descripción de 10–100 caracteres`,
        d.length >= 10 && d.length <= 100, `"${d}" (${d.length})`)
    } else {
      check(`forma de pago ${fp.formaPago} (sin descripción requerida)`, true)
    }
  }

  if (s.input.referencedCufe) {
    const refs = payload.datosGenerales.documentosFiscalesReferenciados
    check('NC referencia el CUFE original',
      refs?.[0]?.informacionReferencia?.informacionReferencia?.cufeReferenciado === s.input.referencedCufe)
  }
}

console.log('\n' + '═'.repeat(74))
console.log(failures === 0 ? '✓ TODAS LAS VALIDACIONES PASARON' : `✗ ${failures} VALIDACIÓN(ES) FALLARON`)
console.log('═'.repeat(74))
process.exit(failures === 0 ? 0 : 1)
