/**
 * Privilege cards — NOT gifts. A Privilege card is a bearer card with
 * benefits for whoever holds it, in fixed denominations, numbered on its own
 * per-location series. It has a buyer but no recipient and no dedication.
 *
 * The SALE PRICE is not tracked here: staff sell the matching Privilege card
 * in Mindbody, and Mindbody already carries its price (owner, 2026-11-10).
 * This system only records the denomination.
 *
 * Storage (see supabase/migrations/20261110_gc_privilege.sql):
 *   gift_cards.format            = 'privilege'
 *   gift_cards.amount_cents      = the card's VALUE (Mindbody balance, label)
 *   gift_cards.recipient_name    = PRIVILEGE_BEARER (the column is NOT NULL)
 *   gift_card_serial_config.privilege_* = the location's second series
 *   gift_cards.sale_amount_cents exists from that migration but is unused.
 */

export const PRIVILEGE_FORMAT = 'privilege'

/** Stored as the recipient of every Privilege card: any holder may use it. */
export const PRIVILEGE_BEARER = 'Al portador'

/**
 * The two Privilege cards (owner, 2026-11-10). A card is NAMED after what the
 * buyer pays and CARRIES a higher consumption value:
 *
 *   Privilege $500   → $625 to spend   (25% benefit)
 *   Privilege $1,000 → $1,350 to spend (35% benefit)
 *
 * gift_cards.amount_cents stores the consumption value. The name is only a
 * label so staff can match the card to the one they sell in Mindbody; the
 * price paid is charged there and not recorded here.
 *
 * History, same day: values were first the face amounts ($500 / $1,000) and a
 * $2,500 card existed for a few hours and was dropped before any was issued.
 */
export const PRIVILEGE_CARDS: ReadonlyArray<{ name: string; valueCents: number; validityMonths: number }> = [
  { name: 'Privilege $500', valueCents: 62500, validityMonths: 12 },
  { name: 'Privilege $1,000', valueCents: 135000, validityMonths: 18 },
]

/**
 * The only values a Privilege card can have, in cents. Enforced in the form
 * AND in the issue/edit APIs through privilegeValueError().
 */
export const PRIVILEGE_DENOMINATIONS_CENTS: readonly number[] = PRIVILEGE_CARDS.map(c => c.valueCents)

export function isPrivilegeDenomination(valueCents: number): boolean {
  return PRIVILEGE_DENOMINATIONS_CENTS.includes(valueCents)
}

/** "Privilege $500" for a card worth $625; null for a value that is not a current card. */
export function privilegeCardName(valueCents: number): string | null {
  return PRIVILEGE_CARDS.find(c => c.valueCents === valueCents)?.name ?? null
}

/** 12 for a Privilege $500, 18 for a Privilege $1,000; null for any other value. */
export function privilegeValidityMonths(valueCents: number): number | null {
  return PRIVILEGE_CARDS.find(c => c.valueCents === valueCents)?.validityMonths ?? null
}

// Panama is UTC−5 all year (no daylight saving), so a fixed offset gives the
// spa's calendar day exactly, on the server (UTC) and in any browser.
const PANAMA_OFFSET_MS = -5 * 60 * 60 * 1000

/** The spa's calendar day for an instant. Month is 1–12. */
function panamaDay(at: string | Date): { y: number; m: number; d: number } | null {
  const t = new Date(at).getTime()
  if (Number.isNaN(t)) return null
  const local = new Date(t + PANAMA_OFFSET_MS)
  return { y: local.getUTCFullYear(), m: local.getUTCMonth() + 1, d: local.getUTCDate() }
}

/**
 * When a Privilege card stops being valid: the card's validity counted in
 * calendar months from the day it was issued (its purchase date), through the
 * end of that day in Panama. 10 Nov 2026 + 18 months → 10 May 2028, 23:59:59.
 * A day the target month doesn't have falls back to its last day
 * (31 Aug + 18 months → 28/29 Feb). Returns an ISO instant, or null when the
 * value is not a current card or the date is unreadable.
 */
export function privilegeExpiresAt(issuedAt: string | Date, valueCents: number): string | null {
  const months = privilegeValidityMonths(valueCents)
  const day = panamaDay(issuedAt)
  if (months == null || !day) return null
  const monthIndex = day.m - 1 + months
  const y = day.y + Math.floor(monthIndex / 12)
  const m = monthIndex % 12 // 0-based
  const lastDay = new Date(Date.UTC(y, m + 1, 0)).getUTCDate()
  const d = Math.min(day.d, lastDay)
  // 23:59:59 in Panama is 04:59:59 UTC on the following day.
  return new Date(Date.UTC(y, m, d, 23, 59, 59) - PANAMA_OFFSET_MS).toISOString()
}

const MONTHS_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

/**
 * "10 nov 2026" — the spa's calendar day, month spelled out so a printed card
 * can't be misread as day/month vs month/day. Empty string for a bad date.
 */
export function formatPrivilegeDate(at: string | Date): string {
  const day = panamaDay(at)
  return day ? `${day.d} ${MONTHS_ES[day.m - 1]} ${day.y}` : ''
}

/** "$1,350" — values are whole dollars. */
export function formatPrivilegeValue(valueCents: number): string {
  return `$${(valueCents / 100).toLocaleString('en-US')}`
}

export function isPrivilege(card: { format?: string | null } | null | undefined): boolean {
  return card?.format === PRIVILEGE_FORMAT
}

/** The Privilege half of a gift_card_serial_config row. */
export interface PrivilegeSeries {
  privilege_prefix?: string | null
  privilege_serial_length?: number | null
  privilege_next_sequence_value?: number | null
}

/** True once the migration ran AND the location has a prefix. */
export function hasPrivilegeSeries(cfg: PrivilegeSeries | null | undefined): boolean {
  return !!cfg?.privilege_prefix
}

/** "PCE000001" — the serial the next Privilege card would get, or null. */
export function previewPrivilegeSerial(cfg: PrivilegeSeries | null | undefined): string | null {
  if (!cfg?.privilege_prefix) return null
  const length = cfg.privilege_serial_length ?? 6
  const next = cfg.privilege_next_sequence_value ?? 1
  return cfg.privilege_prefix + String(next).padStart(length, '0')
}

/**
 * Validate a Privilege card's value. Returns a Spanish message for the
 * staff, or null when the value is the consumption value of one of the cards.
 */
export function privilegeValueError(valueCents: number): string | null {
  if (!isPrivilegeDenomination(valueCents)) {
    const options = PRIVILEGE_DENOMINATIONS_CENTS.map(formatPrivilegeValue)
    return `Valor no permitido: las tarjetas Privilege son de ${options.slice(0, -1).join(', ')} o ${options[options.length - 1]}`
  }
  return null
}

/** Highest number already used by serials of the form prefix + digits. */
export function maxSerialNumber(serials: readonly string[], prefix: string): number {
  let max = 0
  for (const s of serials) {
    if (!s.startsWith(prefix)) continue
    const rest = s.slice(prefix.length)
    if (!/^\d+$/.test(rest)) continue
    max = Math.max(max, Number(rest))
  }
  return max
}
