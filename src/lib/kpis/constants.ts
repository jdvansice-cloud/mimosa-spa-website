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
 * Monthly sales budgets per location (Jan..Dec), set by ownership
 * ("Budget Mimosa 2026.xlsx"). 2025 CDE: $1,050,000 budget, landed
 * $1,093,300 (+4%); 2026 CDE is +10% → $1,200,000. SFC totals $515,000.
 */
export const MONTHLY_BUDGETS: Record<number, Record<number, number[]>> = {
  2026: {
    1: [75_000, 95_000, 95_000, 90_000, 95_000, 105_000, 85_000, 100_000, 100_000, 100_000, 100_000, 160_000],
    2: [30_000, 35_000, 40_000, 40_000, 40_000, 45_000, 35_000, 40_000, 45_000, 45_000, 50_000, 70_000],
  },
}
