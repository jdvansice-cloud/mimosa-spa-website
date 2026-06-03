import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  getLocations,
  getResources,
  getResourceAvailabilities,
  getSessionTypes,
  getBookableItems,
  type BookableItem,
  type MindbodyResource,
} from '@/lib/booking/mindbody'

/**
 * GET /api/mindbody/admin/resources-audit
 *
 * Phase 0 discovery / pre-launch gate for the Room/Resource booking PRD
 * (see docs/PRD_ROOM_RESOURCE_BOOKING.md).
 *
 * Read-only. Validates Mimosa's Mindbody resource configuration against the
 * PRD contract (D-6, D-7, D-8):
 *   - Every resource name ends with -1 or -2.
 *   - Each *-2 resource has a matching *-1 in the same base name (couples pair).
 *   - For each (active online-bookable SessionType, location), at least one
 *     compatible *-1 resource is observed in /appointment/bookableitems with
 *     includeResourceAvailability=true.
 *
 * Output's `launchBlockers` is the gate. Empty list → proceed to Phase 1.
 * Any entry → Mimosa fixes Mindbody config and we re-run.
 *
 * Protected by CRON_SECRET — same pattern as /api/cron/*.
 *
 * Query params:
 *   days       (optional, default 14)  — date window size, max 30
 *   locationId (optional)              — restrict to a single location
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const days = Math.min(Math.max(parseInt(searchParams.get('days') || '14'), 1), 30)
  const locationIdParam = searchParams.get('locationId')
  const onlyLocationId = locationIdParam ? parseInt(locationIdParam) : null

  const startDate = new Date()
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + days)
  const startDateStr = startDate.toISOString().split('T')[0]
  const endDateStr = endDate.toISOString().split('T')[0]

  try {
    const [resources, sessionTypes, locations] = await Promise.all([
      getResources({ includeInactive: false }),
      getSessionTypes(true),
      getLocations(),
    ])

    // Load Supabase eligibility map (PRD v1.4 D-10).
    // If the table doesn't exist yet or is empty, we still return useful audit
    // data — `eligibilityTable.populated` flags whether the gate is testable.
    let eligibilityRows: Array<{
      session_type_id: number
      location_id: number
      resource_id: number
      session_type_name: string | null
      resource_name: string | null
      is_active: boolean
    }> = []
    let eligibilityTableError: string | null = null
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
      )
      const { data, error } = await supabase
        .from('service_resource_eligibility')
        .select('session_type_id, location_id, resource_id, session_type_name, resource_name, is_active')
        .eq('is_active', true)
      if (error) {
        eligibilityTableError = error.message
      } else if (data) {
        eligibilityRows = data
      }
    } catch (err) {
      eligibilityTableError = err instanceof Error ? err.message : String(err)
    }

    const locationsToScan = onlyLocationId
      ? locations.filter((l: { Id: number }) => l.Id === onlyLocationId)
      : locations

    if (locationsToScan.length === 0) {
      return NextResponse.json({ error: 'No locations to scan' }, { status: 400 })
    }

    const resourceById = new Map<number, MindbodyResource>()
    for (const r of resources) resourceById.set(r.Id, r)

    // --- Naming-convention parsing (D-6, revised for v1.2) --------------------
    // Expected format: `<LOC> | <Base Name> -<BedNumber>` where:
    //   - <LOC> is "CE" or "SF" (location code)
    //   - <BedNumber> is a positive integer
    // We tolerate optional whitespace around separators.
    const nameRegex = /^\s*(CE|SF)\s*\|\s*(.+?)\s*-\s*(\d+)\s*$/i
    type Parsed = {
      id: number
      name: string
      locCode: 'CE' | 'SF'
      baseName: string
      bedNumber: number
    }
    const parsed: Parsed[] = []
    const namingViolations: Array<{ id: number; name: string; reason: string }> = []
    for (const r of resources) {
      const m = (r.Name || '').match(nameRegex)
      if (!m) {
        namingViolations.push({
          id: r.Id,
          name: r.Name,
          reason: 'Name does not match `<CE|SF> | <Base Name> -<n>` (D-6 violation)',
        })
        continue
      }
      const locCode = m[1].toUpperCase() as 'CE' | 'SF'
      const baseName = m[2].trim()
      const bedNumber = parseInt(m[3], 10)
      parsed.push({ id: r.Id, name: r.Name, locCode, baseName, bedNumber })
    }

    // --- Group by (location, base name) → bed numbers -------------------------
    type RoomGroup = { locCode: 'CE' | 'SF'; baseName: string; beds: Parsed[] }
    const roomGroups = new Map<string, RoomGroup>()
    for (const p of parsed) {
      const key = `${p.locCode}::${p.baseName.toLowerCase()}`
      let group = roomGroups.get(key)
      if (!group) {
        group = { locCode: p.locCode, baseName: p.baseName, beds: [] }
        roomGroups.set(key, group)
      }
      group.beds.push(p)
    }
    for (const group of roomGroups.values()) {
      group.beds.sort((a, b) => a.bedNumber - b.bedNumber)
    }

    // Sequence validation: bed numbers in a room must start at 1 and be contiguous.
    const sequenceViolations: Array<{ locCode: string; baseName: string; reason: string; beds: number[] }> = []
    for (const group of roomGroups.values()) {
      const nums = group.beds.map(b => b.bedNumber)
      const expected = nums.map((_, i) => i + 1)
      if (JSON.stringify(nums) !== JSON.stringify(expected)) {
        sequenceViolations.push({
          locCode: group.locCode,
          baseName: group.baseName,
          reason: `Bed numbers should be contiguous starting at 1. Found: [${nums.join(',')}]`,
          beds: nums,
        })
      }
    }

    // --- Eligibility helpers --------------------------------------------------
    // v1 contract (see docs/MINDBODY_RESOURCES.md):
    //   - Standard rooms (base name != "Foot Massage"):
    //       v1Eligible = resources with bedNumber === 1
    //   - Foot Massage rooms (base name == "Foot Massage"):
    //       v1Eligible = any bedNumber (every chair is independent)
    const isFootMassageBase = (baseName: string) =>
      /^foot\s*massage$/i.test(baseName.trim())

    const isV1Eligible = (p: Parsed) =>
      isFootMassageBase(p.baseName) ? true : p.bedNumber === 1

    // --- Program → Resources via /site/resourceavailabilities -----------------
    // This is the primary eligibility source — independent of bookableitems
    // (which has been returning 0 items at Mimosa's site). Each SessionType has
    // a ProgramId; querying resourceavailabilities filtered by that ProgramId
    // returns the set of resources eligible for that program.
    const programIds = Array.from(
      new Set(
        sessionTypes
          .map(st => (st as { ProgramId?: number }).ProgramId)
          .filter((id): id is number => typeof id === 'number'),
      ),
    ).sort((a, b) => a - b)

    type ProgramEntry = {
      programId: number
      sampleSize: number
      resourceIds: Set<number>
      perLocation: Map<number, Set<number>>
      error?: string
    }
    const programIndex = new Map<number, ProgramEntry>()

    for (const programId of programIds) {
      const entry: ProgramEntry = {
        programId,
        sampleSize: 0,
        resourceIds: new Set(),
        perLocation: new Map(),
      }
      try {
        const items = await getResourceAvailabilities({
          startDate: startDateStr,
          endDate: endDateStr,
          programIds: [programId],
          scheduleTypes: ['Appointment'],
          limit: 200,
        })
        entry.sampleSize = items.length
        for (const item of items) {
          if (typeof item.ResourceId !== 'number') continue
          entry.resourceIds.add(item.ResourceId)
          if (typeof item.LocationId === 'number') {
            let perLoc = entry.perLocation.get(item.LocationId)
            if (!perLoc) { perLoc = new Set(); entry.perLocation.set(item.LocationId, perLoc) }
            perLoc.add(item.ResourceId)
          }
        }
      } catch (err) {
        entry.error = err instanceof Error ? err.message : String(err)
      }
      programIndex.set(programId, entry)
    }

    const parsedById = new Map<number, Parsed>()
    for (const p of parsed) parsedById.set(p.id, p)

    // Build Supabase eligibility lookup: (sessionTypeId, locationId) -> Set<resourceId>
    // and a per-session-type aggregate across all locations.
    const supabaseEligibility = new Map<number, {
      perLocation: Map<number, Set<number>>
      allLocations: Set<number>
    }>()
    for (const row of eligibilityRows) {
      let entry = supabaseEligibility.get(row.session_type_id)
      if (!entry) {
        entry = { perLocation: new Map(), allLocations: new Set() }
        supabaseEligibility.set(row.session_type_id, entry)
      }
      entry.allLocations.add(row.resource_id)
      let perLoc = entry.perLocation.get(row.location_id)
      if (!perLoc) { perLoc = new Set(); entry.perLocation.set(row.location_id, perLoc) }
      perLoc.add(row.resource_id)
    }

    type Entry = {
      sessionTypeName: string
      programId: number | null
      slotsSampled: number
      // From bookableitems (secondary cross-check; 0 at Mimosa's site)
      allObserved: Set<number>
      v1Observed: Set<number>
      perLocation: Map<number, { all: Set<number>; v1: Set<number> }>
      // From resourceavailabilities via ProgramId (secondary cross-check)
      programAllResourceIds: Set<number>
      programV1ResourceIds: Set<number>
      // From Supabase service_resource_eligibility (PRIMARY signal — D-10)
      supabaseAllResourceIds: Set<number>
      supabaseV1ResourceIds: Set<number>
      supabasePerLocation: Map<number, Set<number>>
    }
    const eligibility = new Map<number, Entry>()
    for (const st of sessionTypes) {
      const programId = (st as { ProgramId?: number }).ProgramId ?? null
      const programEntry = programId !== null ? programIndex.get(programId) : undefined
      const programAll = programEntry ? new Set(programEntry.resourceIds) : new Set<number>()
      const programV1 = new Set<number>()
      for (const id of programAll) {
        const p = parsedById.get(id)
        if (p && isV1Eligible(p)) programV1.add(id)
      }
      const supabaseEntry = supabaseEligibility.get(st.Id)
      const supabaseAll = supabaseEntry ? new Set(supabaseEntry.allLocations) : new Set<number>()
      const supabaseV1 = new Set<number>()
      for (const id of supabaseAll) {
        const p = parsedById.get(id)
        if (p && isV1Eligible(p)) supabaseV1.add(id)
      }
      eligibility.set(st.Id, {
        sessionTypeName: st.Name,
        programId,
        slotsSampled: 0,
        allObserved: new Set(),
        v1Observed: new Set(),
        perLocation: new Map(),
        programAllResourceIds: programAll,
        programV1ResourceIds: programV1,
        supabaseAllResourceIds: supabaseAll,
        supabaseV1ResourceIds: supabaseV1,
        supabasePerLocation: supabaseEntry?.perLocation ?? new Map(),
      })
    }

    const upstreamErrors: Array<{ locationId: number; sessionTypeId: number; error: string }> = []

    for (const location of locationsToScan) {
      for (const st of sessionTypes) {
        try {
          const items: BookableItem[] = await getBookableItems({
            locationIds: location.Id,
            sessionTypeIds: [st.Id],
            startDate: startDateStr,
            endDate: endDateStr,
            includeResourceAvailability: true,
          })

          const entry = eligibility.get(st.Id)
          if (!entry) continue

          for (const item of items) {
            entry.slotsSampled += 1
            if (!Array.isArray(item.Resources)) continue
            let perLoc = entry.perLocation.get(location.Id)
            if (!perLoc) {
              perLoc = { all: new Set(), v1: new Set() }
              entry.perLocation.set(location.Id, perLoc)
            }
            for (const r of item.Resources) {
              if (typeof r?.Id !== 'number') continue
              entry.allObserved.add(r.Id)
              perLoc.all.add(r.Id)
              const p = parsedById.get(r.Id)
              if (p && isV1Eligible(p)) {
                entry.v1Observed.add(r.Id)
                perLoc.v1.add(r.Id)
              }
            }
          }
        } catch (err) {
          upstreamErrors.push({
            locationId: location.Id,
            sessionTypeId: st.Id,
            error: err instanceof Error ? err.message : String(err),
          })
        }
      }
    }

    const nameOf = (id: number) => resourceById.get(id)?.Name || `Resource#${id}`

    const matrix = Array.from(eligibility.entries()).map(([sessionTypeId, entry]) => ({
      sessionTypeId,
      sessionTypeName: entry.sessionTypeName,
      programId: entry.programId,
      // PRIMARY signal (D-10): Supabase service_resource_eligibility
      supabaseAllResourceIds: Array.from(entry.supabaseAllResourceIds).sort((a, b) => a - b),
      supabaseV1ResourceIds: Array.from(entry.supabaseV1ResourceIds).sort((a, b) => a - b),
      supabaseV1ResourceNames: Array.from(entry.supabaseV1ResourceIds).map(nameOf).sort(),
      supabasePerLocation: Array.from(entry.supabasePerLocation.entries()).map(([locId, ids]) => ({
        locationId: locId,
        resourceIds: Array.from(ids).sort((a, b) => a - b),
        v1ResourceIds: Array.from(ids).filter(id => {
          const p = parsedById.get(id)
          return p ? isV1Eligible(p) : false
        }).sort((a, b) => a - b),
      })),
      // SECONDARY signal: program-based eligibility (resourceavailabilities)
      programAllResourceIds: Array.from(entry.programAllResourceIds).sort((a, b) => a - b),
      programV1ResourceIds: Array.from(entry.programV1ResourceIds).sort((a, b) => a - b),
      // SECONDARY signal: bookableitems cross-check
      bookableSlotsSampled: entry.slotsSampled,
      bookableAllObservedIds: Array.from(entry.allObserved).sort((a, b) => a - b),
      bookableV1ObservedIds: Array.from(entry.v1Observed).sort((a, b) => a - b),
    }))

    // --- Launch blockers (per PRD v1.4 hard invariant, D-10) -----------------
    // Primary signal: Supabase service_resource_eligibility. A SessionType is
    // v1-bookable iff it has at least one v1-eligible resource row (per location
    // it's offered at) in the table.
    //
    // If the table is empty (Mimosa hasn't populated it yet), every session type
    // is a launch blocker — and the response surfaces eligibilityTable.populated
    // = false so it's obvious why.
    const eligibilityTablePopulated = eligibilityRows.length > 0
    const launchBlockers = matrix
      .filter(m => m.supabaseV1ResourceIds.length === 0)
      .map(m => ({
        sessionTypeId: m.sessionTypeId,
        sessionTypeName: m.sessionTypeName,
        programId: m.programId,
        supabaseAllResourceIds: m.supabaseAllResourceIds,
        reason: !eligibilityTablePopulated
          ? 'ELIGIBILITY_TABLE_EMPTY — service_resource_eligibility has no rows. Mimosa must populate this table (D-10) before Phase 1 can ship. See migration 20260602_service_resource_eligibility.sql.'
          : m.supabaseAllResourceIds.length === 0
            ? 'NO_ELIGIBILITY_ROW — session type has no row in service_resource_eligibility for any location. Either this service is intentionally not bookable online, or Mimosa needs to add eligibility rows for it.'
            : 'NO_V1_ELIGIBLE_RESOURCE — eligibility rows exist but none point to a v1-eligible resource (no -1 for standard rooms, or only -2/-3 mapped). Update the table to include a -1 resource, or hide this service from online single bookings until couples flow ships.',
      }))

    const couplesCapableRoomCount = Array.from(roomGroups.values())
      .filter(g => !isFootMassageBase(g.baseName) && g.beds.length >= 2).length
    const footMassageAreaCount = Array.from(roomGroups.values())
      .filter(g => isFootMassageBase(g.baseName)).length

    // --- Per-resource availability probe (diagnostic) ------------------------
    // Call /site/resourceavailabilities filtered by each individual resource ID
    // to see whether that resource has ANY availability blocks defined. If new
    // resources return 0 blocks, the staff weekly schedules in Mindbody are
    // still referencing the legacy resources.
    const resourceProbe = await Promise.all(
      parsed.map(async p => {
        try {
          const items = await getResourceAvailabilities({
            startDate: startDateStr,
            endDate: endDateStr,
            resourceIds: [p.id],
            scheduleTypes: ['Appointment'],
            limit: 200,
          })
          // Collect all unique program IDs that appear on the blocks for this resource.
          const programIdsSeen = new Set<number>()
          for (const item of items) {
            const block = item as unknown as { Programs?: Array<{ Id: number }>; ProgramId?: number }
            if (Array.isArray(block.Programs)) {
              for (const pr of block.Programs) {
                if (typeof pr?.Id === 'number') programIdsSeen.add(pr.Id)
              }
            }
            if (typeof block.ProgramId === 'number') programIdsSeen.add(block.ProgramId)
          }
          return {
            resourceId: p.id,
            resourceName: p.name,
            availabilityBlockCount: items.length,
            programsObserved: Array.from(programIdsSeen).sort((a, b) => a - b),
            firstBlockSample: items[0] ?? null,
          }
        } catch (err) {
          return {
            resourceId: p.id,
            resourceName: p.name,
            availabilityBlockCount: 0,
            programsObserved: [] as number[],
            firstBlockSample: null,
            error: err instanceof Error ? err.message : String(err),
          }
        }
      }),
    )
    const newResourcesWithAvailability = resourceProbe.filter(r => r.availabilityBlockCount > 0).length

    const programEligibility = Array.from(programIndex.values()).map(e => ({
      programId: e.programId,
      sampleSize: e.sampleSize,
      resourceIds: Array.from(e.resourceIds).sort((a, b) => a - b),
      resourceNames: Array.from(e.resourceIds).map(nameOf).sort(),
      v1ResourceIds: Array.from(e.resourceIds)
        .filter(id => {
          const p = parsedById.get(id)
          return p ? isV1Eligible(p) : false
        })
        .sort((a, b) => a - b),
      perLocation: Array.from(e.perLocation.entries()).map(([locId, ids]) => ({
        locationId: locId,
        resourceIds: Array.from(ids).sort((a, b) => a - b),
      })),
      error: e.error,
    }))

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      prd: 'docs/PRD_ROOM_RESOURCE_BOOKING.md v1.4',
      window: { startDate: startDateStr, endDate: endDateStr, days },
      eligibilityTable: {
        populated: eligibilityTablePopulated,
        rowCount: eligibilityRows.length,
        distinctSessionTypeCount: new Set(eligibilityRows.map(r => r.session_type_id)).size,
        distinctResourceCount: new Set(eligibilityRows.map(r => r.resource_id)).size,
        error: eligibilityTableError,
      },
      site: {
        locationsScanned: locationsToScan.map((l: { Id: number; Name: string }) => ({
          Id: l.Id,
          Name: l.Name,
        })),
        totalResources: resources.length,
        totalSessionTypes: sessionTypes.length,
        totalPrograms: programIds.length,
      },
      contractValidation: {
        namingViolations,
        sequenceViolations,
        totalParsed: parsed.length,
        roomsCount: roomGroups.size,
        v1EligibleResourceCount: parsed.filter(isV1Eligible).length,
        couplesCapableRoomCount,
        footMassageAreaCount,
      },
      resources: resources.map(r => {
        const p = parsedById.get(r.Id)
        return {
          Id: r.Id,
          Name: r.Name,
          Programs: r.Programs?.map(pr => ({ Id: pr.Id, Name: pr.Name })) || [],
          parsed: p
            ? {
                locCode: p.locCode,
                baseName: p.baseName,
                bedNumber: p.bedNumber,
                isFootMassage: isFootMassageBase(p.baseName),
                v1Eligible: isV1Eligible(p),
              }
            : null,
        }
      }),
      rooms: Array.from(roomGroups.values()).map(g => ({
        locCode: g.locCode,
        baseName: g.baseName,
        isFootMassage: isFootMassageBase(g.baseName),
        bedCount: g.beds.length,
        bedIds: g.beds.map(b => b.id),
      })),
      programEligibility,
      resourceProbe,
      eligibilityMatrix: matrix,
      launchBlockers,
      summary: {
        gateReady: eligibilityTablePopulated
          && launchBlockers.length === 0
          && namingViolations.length === 0
          && sequenceViolations.length === 0,
        eligibilityTablePopulated,
        // Primary signal (Supabase D-10):
        sessionTypesWithSupabaseV1Resource: matrix.filter(m => m.supabaseV1ResourceIds.length > 0).length,
        sessionTypesWithoutSupabaseV1Resource: launchBlockers.length,
        sessionTypesWithEligibilityRowsButNoV1: matrix.filter(
          m => m.supabaseAllResourceIds.length > 0 && m.supabaseV1ResourceIds.length === 0,
        ).length,
        // Secondary signals (Mindbody, for cross-check only):
        sessionTypesWithProgramV1Resource: matrix.filter(m => m.programV1ResourceIds.length > 0).length,
        programsScanned: programIds.length,
        programsWithAnyResource: programEligibility.filter(p => p.resourceIds.length > 0).length,
        bookableItemsSlotsTotal: matrix.reduce((s, m) => s + m.bookableSlotsSampled, 0),
        newResourcesWithAvailability,
        // Contract checks:
        namingViolations: namingViolations.length,
        sequenceViolations: sequenceViolations.length,
        upstreamErrors: upstreamErrors.length,
      },
      upstreamErrors,
    })
  } catch (err) {
    console.error('resources-audit error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
