import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  getLocations,
  getResources,
  getSessionTypes,
} from '@/lib/booking/mindbody'

/**
 * POST /api/mindbody/admin/eligibility-import
 *
 * Bulk-upsert rows into service_resource_eligibility (PRD v1.4, D-10).
 * Mimosa mirrors the Service↔Resource eligibility from Mindbody admin into
 * this table; once the table is populated, audit's `gateReady` flips to true
 * and Phase 1 can ship.
 *
 * Protected by CRON_SECRET. Validates every row against:
 *   - /site/sessiontypes  (session_type_id must exist and be online-bookable)
 *   - /site/locations     (location_id must exist)
 *   - /site/resources     (resource_id must exist)
 *
 * Request body (JSON):
 *   {
 *     mode: "replace" | "upsert" (default: "upsert"),
 *     rows: [
 *       { session_type_id: 49, location_id: 1, resource_id: 39 },
 *       { session_type_id: 49, location_id: 1, resource_id: 41 },
 *       ...
 *     ]
 *   }
 *
 *   mode=upsert  → insert new rows, update existing (by unique key). Keeps
 *                  rows not in the payload untouched.
 *   mode=replace → atomically deactivate ALL existing rows then insert these.
 *                  Use when re-syncing the full map.
 *
 * Response:
 *   {
 *     accepted: number,
 *     rejected: Array<{row, reason}>,
 *     inserted: number,
 *     updated: number,
 *     deactivated: number,
 *     totalActiveAfter: number,
 *   }
 */
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { mode = 'upsert', rows, rooms } = (body as {
    mode?: 'replace' | 'upsert'
    rows?: Array<{
      session_type_id?: number
      location_id?: number
      resource_id?: number
      session_type_name?: string | null
      resource_name?: string | null
      notes?: string | null
    }>
    rooms?: Array<{
      resource_id?: number
      session_type_ids?: number[]
      notes?: string | null
    }>
  })

  if (
    (!Array.isArray(rows) || rows.length === 0)
    && (!Array.isArray(rooms) || rooms.length === 0)
  ) {
    return NextResponse.json(
      { error: 'Provide either `rows` (canonical per-row format) or `rooms` (per-room shortcut), non-empty' },
      { status: 400 },
    )
  }
  if (mode !== 'upsert' && mode !== 'replace') {
    return NextResponse.json(
      { error: 'mode must be "upsert" or "replace"' },
      { status: 400 },
    )
  }

  // Load lookups for validation.
  const [sessionTypes, locations, resources] = await Promise.all([
    getSessionTypes(true),
    getLocations(),
    getResources({ includeInactive: false }),
  ])
  const sessionTypeById = new Map<number, { Id: number; Name: string }>()
  for (const st of sessionTypes) sessionTypeById.set(st.Id, st)
  const locationById = new Map<number, { Id: number; Name: string }>()
  for (const l of locations as Array<{ Id: number; Name: string }>) {
    locationById.set(l.Id, l)
  }
  const resourceById = new Map<number, { Id: number; Name: string }>()
  for (const r of resources) resourceById.set(r.Id, r)

  // Derive location ID from resource name prefix (D-7). "CE | …" → 1, "SF | …" → 2.
  // If a resource doesn't parse, we reject and surface a clear error.
  const LOC_PREFIX_MAP: Record<string, number> = { CE: 1, SF: 2 }
  const parseLocationFromResourceName = (name: string): number | null => {
    const m = name.match(/^\s*(CE|SF)\s*\|/i)
    if (!m) return null
    return LOC_PREFIX_MAP[m[1].toUpperCase()] ?? null
  }

  // Expand per-room shortcut into canonical (session_type_id, location_id, resource_id) rows.
  // location_id is derived from the resource's name prefix.
  type IncomingRow = {
    session_type_id?: number
    location_id?: number
    resource_id?: number
    session_type_name?: string | null
    resource_name?: string | null
    notes?: string | null
  }
  const expandedRows: IncomingRow[] = Array.isArray(rows) ? [...rows] : []
  const roomExpansionRejected: Array<{ room: unknown; reason: string }> = []

  if (Array.isArray(rooms)) {
    for (const room of rooms) {
      const resId = room?.resource_id
      const stIds = room?.session_type_ids
      if (typeof resId !== 'number' || !Array.isArray(stIds) || stIds.length === 0) {
        roomExpansionRejected.push({
          room,
          reason: 'Each room entry must have resource_id (number) and session_type_ids (non-empty number[])',
        })
        continue
      }
      const resource = resourceById.get(resId)
      if (!resource) {
        roomExpansionRejected.push({ room, reason: `resource_id ${resId} does not exist` })
        continue
      }
      const locationId = parseLocationFromResourceName(resource.Name)
      if (locationId === null) {
        roomExpansionRejected.push({
          room,
          reason: `Could not derive location from resource name "${resource.Name}" — expected "CE | …" or "SF | …" prefix (D-7)`,
        })
        continue
      }
      for (const stId of stIds) {
        if (typeof stId !== 'number') {
          roomExpansionRejected.push({
            room: { ...room, bad_session_type_id: stId },
            reason: 'session_type_ids must be numbers',
          })
          continue
        }
        expandedRows.push({
          session_type_id: stId,
          location_id: locationId,
          resource_id: resId,
          notes: room.notes ?? null,
        })
      }
    }
  }

  const rejected: Array<{ row: unknown; reason: string }> = [
    ...roomExpansionRejected.map(r => ({ row: r.room, reason: r.reason })),
  ]
  const valid: Array<{
    session_type_id: number
    location_id: number
    resource_id: number
    session_type_name: string | null
    resource_name: string | null
    notes: string | null
    is_active: boolean
  }> = []

  const seen = new Set<string>()
  for (const row of expandedRows) {
    const stId = row?.session_type_id
    const locId = row?.location_id
    const resId = row?.resource_id
    if (
      typeof stId !== 'number'
      || typeof locId !== 'number'
      || typeof resId !== 'number'
    ) {
      rejected.push({ row, reason: 'session_type_id, location_id, resource_id must all be numbers' })
      continue
    }
    if (!sessionTypeById.has(stId)) {
      rejected.push({ row, reason: `session_type_id ${stId} is not an online-bookable session type` })
      continue
    }
    if (!locationById.has(locId)) {
      rejected.push({ row, reason: `location_id ${locId} does not exist` })
      continue
    }
    if (!resourceById.has(resId)) {
      rejected.push({ row, reason: `resource_id ${resId} does not exist` })
      continue
    }
    const key = `${stId}::${locId}::${resId}`
    if (seen.has(key)) {
      rejected.push({ row, reason: 'duplicate row in payload' })
      continue
    }
    seen.add(key)
    valid.push({
      session_type_id: stId,
      location_id: locId,
      resource_id: resId,
      // Denormalize names from Mindbody for readability — not authoritative.
      session_type_name: row.session_type_name ?? sessionTypeById.get(stId)?.Name ?? null,
      resource_name: row.resource_name ?? resourceById.get(resId)?.Name ?? null,
      notes: row.notes ?? null,
      is_active: true,
    })
  }

  if (valid.length === 0) {
    return NextResponse.json(
      {
        accepted: 0,
        rejected,
        inserted: 0,
        updated: 0,
        deactivated: 0,
        totalActiveAfter: 0,
        error: 'No valid rows in payload',
      },
      { status: 400 },
    )
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  let deactivated = 0
  if (mode === 'replace') {
    // Soft-deactivate everything currently active, then upsert the new set.
    const { count, error } = await supabase
      .from('service_resource_eligibility')
      .update({ is_active: false }, { count: 'exact' })
      .eq('is_active', true)
    if (error) {
      return NextResponse.json({ error: `Failed to deactivate: ${error.message}` }, { status: 500 })
    }
    deactivated = count ?? 0
  }

  // Upsert each row by the unique (session_type_id, location_id, resource_id) key.
  const { data: upserted, error: upsertError } = await supabase
    .from('service_resource_eligibility')
    .upsert(valid, { onConflict: 'session_type_id,location_id,resource_id' })
    .select('id')
  if (upsertError) {
    return NextResponse.json(
      { error: `Failed to upsert: ${upsertError.message}` },
      { status: 500 },
    )
  }

  const { count: activeCount, error: countError } = await supabase
    .from('service_resource_eligibility')
    .select('id', { count: 'exact', head: true })
    .eq('is_active', true)
  if (countError) {
    return NextResponse.json(
      { error: `Failed to count: ${countError.message}` },
      { status: 500 },
    )
  }

  return NextResponse.json({
    accepted: valid.length,
    rejected,
    rejectedCount: rejected.length,
    // Supabase doesn't distinguish inserted vs updated in upsert response,
    // so we report the sum as `affected`.
    affected: upserted?.length ?? 0,
    deactivated,
    totalActiveAfter: activeCount ?? 0,
  })
}

/**
 * GET /api/mindbody/admin/eligibility-import?format=<format>
 *
 * Helpers for populating the service_resource_eligibility table. Mimosa
 * fills in the data in Google Sheets and POSTs it back to this endpoint.
 *
 * Available formats:
 *
 *   ?format=sessiontypes-csv
 *     Reference list of every online-bookable SessionType:
 *       session_type_id, session_type_name, category, subcategory, program_id, duration_minutes
 *     Mimosa uses this to look up service IDs while filling the rooms sheet.
 *
 *   ?format=rooms-csv
 *     Per-room template (the *fast* format — matches the Mindbody "Manage
 *     Rooms" admin UI 1:1). One row per resource, with a `session_type_ids`
 *     column to fill with a comma-separated list of session type IDs.
 *     Location is derived from the resource name prefix on import.
 *
 *   ?format=rows-csv
 *     Canonical per-row template (legacy — slower to fill). One row per
 *     (service × location) with resource_id blank.
 *
 *   ?format=json (default)
 *     JSON dump of all three views, useful for programmatic processing.
 *
 * Protected by CRON_SECRET.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const format = (searchParams.get('format') || 'json').toLowerCase()

  const [sessionTypes, locations, resources] = await Promise.all([
    getSessionTypes(true),
    getLocations(),
    getResources({ includeInactive: false }),
  ])

  // Parse resource names to derive location code (CE/SF) — D-6.
  const resourcesWithParsed = resources.map(r => {
    const m = (r.Name || '').match(/^\s*(CE|SF)\s*\|/i)
    return {
      Id: r.Id,
      Name: r.Name,
      locCode: m ? m[1].toUpperCase() as 'CE' | 'SF' : null,
      // Location id: CE -> 1, SF -> 2 (matches Mindbody at Mimosa).
      locationId: m ? (m[1].toUpperCase() === 'CE' ? 1 : 2) : null,
    }
  })

  // Helpers for CSV emission.
  const escape = (s: string | number | null | undefined) =>
    `"${String(s ?? '').replace(/"/g, '""')}"`
  const csv = (filename: string, header: string, lines: string[]) =>
    new NextResponse([header, ...lines].join('\n'), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })

  if (format === 'sessiontypes-csv') {
    const header = 'session_type_id,session_type_name,category,subcategory,program_id,duration_minutes'
    const sorted = [...sessionTypes].sort((a, b) => {
      const ac = (a as { Category?: string }).Category || ''
      const bc = (b as { Category?: string }).Category || ''
      if (ac !== bc) return ac.localeCompare(bc)
      return a.Name.localeCompare(b.Name)
    })
    const lines = sorted.map(st => {
      const stx = st as {
        Id: number
        Name: string
        Category?: string
        Subcategory?: string
        ProgramId?: number
        DefaultTimeLength?: number
      }
      return [
        stx.Id,
        escape(stx.Name),
        escape(stx.Category || ''),
        escape(stx.Subcategory || ''),
        stx.ProgramId ?? '',
        stx.DefaultTimeLength ?? '',
      ].join(',')
    })
    return csv('sessiontypes-reference.csv', header, lines)
  }

  if (format === 'rooms-csv') {
    const header = 'resource_id,resource_name,location_id,location_code,session_type_ids'
    // Only include resources that follow the D-6 naming convention (have a CE/SF prefix).
    // Legacy unprefixed resources can't be imported via the per-room shortcut anyway
    // because we can't derive their location.
    const eligibleForImport = resourcesWithParsed.filter(r => r.locCode !== null)
    const sorted = [...eligibleForImport].sort((a, b) => {
      const ac = a.locCode || 'ZZ'
      const bc = b.locCode || 'ZZ'
      if (ac !== bc) return ac.localeCompare(bc)
      return (a.Name || '').localeCompare(b.Name || '')
    })
    const lines = sorted.map(r => [
      r.Id,
      escape(r.Name),
      r.locationId ?? '',
      escape(r.locCode || ''),
      '', // session_type_ids — Mimosa fills (comma-separated IDs)
    ].join(','))
    return csv('rooms-template.csv', header, lines)
  }

  if (format === 'rows-csv') {
    const header = 'session_type_id,session_type_name,location_id,location_name,resource_id,resource_name'
    const lines: string[] = []
    for (const st of sessionTypes) {
      for (const loc of locations as Array<{ Id: number; Name: string }>) {
        lines.push([
          st.Id,
          escape(st.Name),
          loc.Id,
          escape(loc.Name),
          '',
          '',
        ].join(','))
      }
    }
    return csv('eligibility-template.csv', header, lines)
  }

  // Default: JSON dump.
  return NextResponse.json({
    note: 'Two CSVs help you populate the eligibility table fastest. Download both with ?format=sessiontypes-csv and ?format=rooms-csv. Fill in session_type_ids per room, then POST { mode: "replace", rooms: [...] } back here.',
    sessionTypes: sessionTypes.map(st => {
      const stx = st as {
        Id: number
        Name: string
        Category?: string
        Subcategory?: string
        ProgramId?: number
        DefaultTimeLength?: number
      }
      return {
        Id: stx.Id,
        Name: stx.Name,
        Category: stx.Category || null,
        Subcategory: stx.Subcategory || null,
        ProgramId: stx.ProgramId ?? null,
        DurationMinutes: stx.DefaultTimeLength ?? null,
      }
    }),
    locations: (locations as Array<{ Id: number; Name: string }>).map(l => ({
      Id: l.Id,
      Name: l.Name,
    })),
    resources: resourcesWithParsed.map(r => ({
      Id: r.Id,
      Name: r.Name,
      LocationId: r.locationId,
      LocationCode: r.locCode,
    })),
  })
}
