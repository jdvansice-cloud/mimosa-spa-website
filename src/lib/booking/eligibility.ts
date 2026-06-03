// Resource ↔ SessionType eligibility helpers.
// Reads from the Supabase service_resource_eligibility table — see PRD v1.4
// docs/PRD_ROOM_RESOURCE_BOOKING.md (D-10) for why this table exists.

import { createClient } from '@supabase/supabase-js'
import { getResources, type MindbodyResource } from './mindbody'

export interface EligibilityRow {
  session_type_id: number
  location_id: number
  resource_id: number
  resource_name: string | null
}

/**
 * Fetch all active eligibility rows for the given session type and location.
 * Returns the raw rows (not filtered by v1 rules).
 */
export async function getEligibilityRows(
  sessionTypeIds: number[],
  locationId: number,
): Promise<EligibilityRow[]> {
  if (sessionTypeIds.length === 0) return []

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  // Paginate to be safe (table can exceed 1000 rows).
  const rows: EligibilityRow[] = []
  const pageSize = 1000
  let offset = 0
  const maxRows = 50000
  while (offset < maxRows) {
    const { data, error } = await supabase
      .from('service_resource_eligibility')
      .select('session_type_id, location_id, resource_id, resource_name')
      .in('session_type_id', sessionTypeIds)
      .eq('location_id', locationId)
      .eq('is_active', true)
      .range(offset, offset + pageSize - 1)
    if (error) throw new Error(`Eligibility query failed: ${error.message}`)
    if (!data || data.length === 0) break
    rows.push(...data)
    if (data.length < pageSize) break
    offset += pageSize
  }
  return rows
}

/**
 * Parse a resource name into its components per the D-6 naming convention:
 *   "<CE|SF> | <Base Name> -<n>"
 * Returns null if the name doesn't parse (e.g., legacy resources).
 */
export function parseResourceName(name: string): {
  locCode: 'CE' | 'SF'
  baseName: string
  bedNumber: number
} | null {
  const m = name.match(/^\s*(CE|SF)\s*\|\s*(.+?)\s*-\s*(\d+)\s*$/i)
  if (!m) return null
  return {
    locCode: m[1].toUpperCase() as 'CE' | 'SF',
    baseName: m[2].trim(),
    bedNumber: parseInt(m[3], 10),
  }
}

/** True if the parsed resource name represents a Foot Massage chair. */
export function isFootMassageBase(baseName: string): boolean {
  return /^foot\s*massage$/i.test(baseName.trim())
}

/**
 * v1 booking-flow eligibility rule per D-8 / D-9:
 *   - Standard rooms (base name ≠ "Foot Massage"): only bedNumber === 1
 *   - Foot Massage rooms: any bedNumber (every chair is independently bookable)
 *   - Resources with un-parseable names (legacy): never v1-eligible
 */
export function isV1EligibleResource(name: string): boolean {
  const parsed = parseResourceName(name)
  if (!parsed) return false
  if (isFootMassageBase(parsed.baseName)) return true
  return parsed.bedNumber === 1
}

/**
 * Resolve the v1-eligible resource IDs for the given (sessionTypeIds, locationId)
 * combination. For multi-service bookings, returns one Set per service.
 *
 * Cached `resources` parameter avoids re-fetching `/site/resources` repeatedly
 * within a single request.
 */
export async function getV1EligibleResourcesPerService(params: {
  sessionTypeIds: number[]
  locationId: number
  resources?: MindbodyResource[]
}): Promise<Map<number, Set<number>>> {
  const { sessionTypeIds, locationId } = params

  const [rows, resources] = await Promise.all([
    getEligibilityRows(sessionTypeIds, locationId),
    params.resources ? Promise.resolve(params.resources) : getResources({ includeInactive: false }),
  ])

  const v1ResourceIds = new Set<number>()
  for (const r of resources) {
    if (isV1EligibleResource(r.Name)) v1ResourceIds.add(r.Id)
  }

  const perService = new Map<number, Set<number>>()
  for (const stId of sessionTypeIds) perService.set(stId, new Set())
  for (const row of rows) {
    if (v1ResourceIds.has(row.resource_id)) {
      perService.get(row.session_type_id)?.add(row.resource_id)
    }
  }
  return perService
}
