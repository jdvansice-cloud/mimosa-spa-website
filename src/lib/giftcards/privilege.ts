/**
 * Privilege cards — NOT gifts. A Privilege card is a bearer card with
 * benefits for whoever holds it: high value sold at a preferential price
 * (worth $1,000, sold for $800), numbered on its own per-location series.
 * It has a buyer but no recipient and no dedication.
 *
 * Storage (see supabase/migrations/20261110_gc_privilege.sql):
 *   gift_cards.format            = 'privilege'
 *   gift_cards.amount_cents      = the card's VALUE (Mindbody balance, label)
 *   gift_cards.sale_amount_cents = what the buyer paid
 *   gift_cards.recipient_name    = PRIVILEGE_BEARER (the column is NOT NULL)
 *   gift_card_serial_config.privilege_* = the location's second series
 */

export const PRIVILEGE_FORMAT = 'privilege'

/** Stored as the recipient of every Privilege card: any holder may use it. */
export const PRIVILEGE_BEARER = 'Al portador'

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

/** Whole-percent discount of price vs value, e.g. 800 on 1000 -> 20. */
export function privilegeDiscountPercent(valueCents: number, saleCents: number): number | null {
  if (!(valueCents > 0) || !(saleCents > 0) || saleCents >= valueCents) return null
  return Math.round(((valueCents - saleCents) / valueCents) * 100)
}

/**
 * Validate a value/price pair. Returns a Spanish message for the staff, or
 * null when the pair is acceptable.
 */
export function privilegeAmountError(valueCents: number, saleCents: number): string | null {
  if (!Number.isInteger(valueCents) || valueCents <= 0) return 'Valor de la tarjeta inválido'
  if (!Number.isInteger(saleCents) || saleCents <= 0) return 'Precio de venta inválido'
  if (saleCents >= valueCents) return 'El precio de venta debe ser menor que el valor de la tarjeta'
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
