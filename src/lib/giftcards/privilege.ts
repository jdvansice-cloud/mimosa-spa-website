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
 * The only values a Privilege card can have, in cents: $500, $1,000, $2,500
 * (owner rule, 2026-11-10). Enforced in the form AND in the issue/edit APIs
 * through privilegeValueError().
 */
export const PRIVILEGE_DENOMINATIONS_CENTS = [50000, 100000, 250000] as const

export function isPrivilegeDenomination(valueCents: number): boolean {
  return (PRIVILEGE_DENOMINATIONS_CENTS as readonly number[]).includes(valueCents)
}

/** "$1,000" — denominations are whole dollars. */
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
 * staff, or null when the value is one of the denominations.
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
