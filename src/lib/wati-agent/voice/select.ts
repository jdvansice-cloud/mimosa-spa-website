import exemplarsJson from './exemplars.json'
import type { Sucursal } from '../types'

export type Intent = 'saludo'|'ubicacion'|'horario'|'precios'|'promo'|'reservar'|'cambiar'|'cancelar'|'certificado'|'pago'|'queja'|'cierre'|'otro'
export interface Exemplar { intent: Intent; sucursal: Sucursal | null; customer: string[]; staff: string[] }

/** Patterns that make a mined exemplar unsafe to show the model as a "real receptionist" example. */
const DIRTY: RegExp[] = [
  /\{codigo\}/i,
  /\{telefono\}/i,
  /Caption:/i,
  /[0-9a-f]{8}-[0-9a-f]{4}/i,
  /Banco General/i,
  /Cuenta Corriente/i,
  /Relax Cala/i,
  /v[\u00e1a]lid[ao]s? hasta/i,
  /hasta el \d/i,
]

/** Drops exemplars carrying redaction placeholders, media-filename noise, bank details or dated promos. */
export function filterExemplars(list: Exemplar[]): Exemplar[] {
  return list.filter(e => ![...e.staff, ...e.customer].some(s => DIRTY.some(re => re.test(s))))
}

export const EXEMPLARS: Exemplar[] = filterExemplars(exemplarsJson as Exemplar[])

const RULES: Array<[Intent, RegExp]> = [
  ['ubicacion', /d[oó]nde|ubicaci|direcci|waze|mapa|llegar|quedan/i],
  ['horario', /horario|abren|cierran|hasta qu[eé] hora|abierto|abiertos/i],
  ['cambiar', /cambiar|mover|reagendar|otra hora|pasar(la|lo)? para/i],
  ['cancelar', /cancelar/i],
  ['promo', /promo|oferta|descuento|paquete/i],
  ['precios', /precio|cu[aá]nto|costo|vale|tarifa/i],
  ['pago', /yappy|pagar|pago|transferencia|tarjeta/i],
  ['reservar', /reserv|agendar|cita|disponib|masaje|facial|cabina|pareja/i],
]

export function detectIntent(text: string): Intent {
  const t = text.trim()
  const words = t.split(/\s+/).length
  for (const [intent, re] of RULES) if (re.test(t)) return intent
  if (words <= 3 && /hola|buen[oa]s|saludos/i.test(t)) return 'saludo'
  if (words <= 4 && /gracias|listo|perfecto|ok|vale/i.test(t)) return 'cierre'
  return 'otro'
}

export function selectExemplars(intent: Intent, sucursal: Sucursal | null, max = 12): Exemplar[] {
  const same = EXEMPLARS.filter(e => e.intent === intent && e.sucursal === sucursal)
  const other = EXEMPLARS.filter(e => e.intent === intent && e.sucursal !== sucursal)
  return [...same, ...other].slice(0, max)
}
