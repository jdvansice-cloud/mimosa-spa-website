import { BUSINESS } from './config/business'

const TZ = 'America/Panama'

function parts(d: Date) {
  const f = new Intl.DateTimeFormat('en-US', { timeZone: TZ, hour: 'numeric', hour12: false, weekday: 'short', minute: 'numeric' })
  const p = Object.fromEntries(f.formatToParts(d).map(x => [x.type, x.value]))
  const hour = Number(p.hour) % 24
  const minute = Number(p.minute)
  const weekend = p.weekday === 'Sat' || p.weekday === 'Sun'
  return { hour, minute, weekend }
}

export function isOpen(at: Date): boolean {
  const { hour, minute, weekend } = parts(at)
  const h = weekend ? BUSINESS.hours.weekend : BUSINESS.hours.weekday
  const t = hour + minute / 60
  return t >= h.open && t < h.close
}

export function greetingFor(at: Date): 'Muy buenos días' | 'Muy buenas tardes' | 'Muy buenas noches' {
  const { hour } = parts(at)
  if (hour < 12) return 'Muy buenos días'
  if (hour < 18) return 'Muy buenas tardes'
  return 'Muy buenas noches'
}

export function panamaNow(): Date { return new Date() }

/** "viernes 4 de septiembre de 2026, 3:05 p. m." */
export function formatPanama(d: Date): string {
  return new Intl.DateTimeFormat('es-PA', { timeZone: TZ, dateStyle: 'full', timeStyle: 'short' }).format(d)
}

/** YYYY-MM-DD in Panamá for a Date. */
export function panamaDate(d: Date): string {
  const f = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' })
  return f.format(d)
}
