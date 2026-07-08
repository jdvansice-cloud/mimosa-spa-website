export const PANAMA_TZ = 'America/Panama'

/** Mindbody location ids. */
export const LOCATION_IDS = [1, 2] as const

export const LOCATION_NAMES: Record<number, string> = {
  1: 'Costa del Este',
  2: 'San Francisco',
}

export const LOCATION_MANAGERS: Record<number, string> = {
  1: 'Nilka',
  2: 'Maricarmen',
}

/**
 * Annual sales budgets per location (net, excl. ITBMS), set by ownership.
 * 2025 CDE: $1,050,000 budget, landed $1,093,000 (+4%).
 * 2026: CDE +10% → $1,200,000 · SFC $515,000 · total $1,715,000.
 */
export const ANNUAL_BUDGETS: Record<number, Record<number, number>> = {
  2026: { 1: 1_200_000, 2: 515_000 },
}
