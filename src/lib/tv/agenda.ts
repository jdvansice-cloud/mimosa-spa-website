import { createClient } from '@supabase/supabase-js'
import { getScheduleItems, getStaff } from '@/lib/booking/mindbody'

// ===========================================
// TV Agenda — daily therapist schedule for the work-area display.
// One live Mindbody fetch (staff + scheduleitems) per request; client
// names come from the mb_clients cache and service names fall back to
// treatment_settings when scheduleitems omits SessionType.Name.
// ===========================================

export interface TvBlock {
  startMin: number
  endMin: number
}

export interface TvUnavailability extends TvBlock {
  label: string
}

export interface TvAppointment extends TvBlock {
  id: number
  startTime: string // HH:MM
  endTime: string
  clientName: string | null
  serviceName: string
  sessionTypeId: number | null
  resourceName: string | null
  status: string
}

export interface TvColumn {
  staffId: number
  staffName: string
  availability: TvBlock[]
  unavailabilities: TvUnavailability[]
  appointments: TvAppointment[]
}

export interface TvAgenda {
  date: string
  locationId: number
  /** Grid window in minutes from midnight. */
  windowStartMin: number
  windowEndMin: number
  columns: TvColumn[]
  generatedAt: string
}

const EXCLUDED_STATUS = new Set(['Cancelled', 'LateCancelled'])

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/** Mindbody stamps are site-local ("2026-08-22T09:15:00") → minutes from midnight. */
function stampToMin(stamp: string): number {
  const hh = Number(stamp.slice(11, 13))
  const mm = Number(stamp.slice(14, 16))
  return hh * 60 + mm
}

const minToHHMM = (min: number): string =>
  `${String(Math.floor(min / 60) % 24).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`

/** "QUESADA, M" — Mindbody-calendar style client label. */
function shortClientName(first: string | null, last: string | null): string | null {
  const l = (last || '').trim()
  const f = (first || '').trim()
  if (!l && !f) return null
  if (!l) return f.toUpperCase()
  return `${l.toUpperCase()}${f ? `, ${f[0].toUpperCase()}` : ''}`
}

export async function getTvAgenda(date: string, locationId: number): Promise<TvAgenda> {
  const staff = await getStaff()
  const staffIds = staff.map(s => s.Id)
  const members = staffIds.length > 0
    ? await getScheduleItems({ locationIds: [locationId], staffIds, startDate: date, endDate: date })
    : []

  // ---- gather ids for the enrichment lookups ----
  const clientIds = new Set<string>()
  const sessionTypeIdsMissingName = new Set<number>()
  for (const m of members) {
    for (const a of m.Appointments ?? []) {
      if (EXCLUDED_STATUS.has(a.Status)) continue
      if (a.ClientId) clientIds.add(String(a.ClientId))
      if (!a.SessionType?.Name && a.SessionTypeId) sessionTypeIdsMissingName.add(a.SessionTypeId)
    }
  }

  const supabase = serviceClient()
  const nameById = new Map<string, string | null>()
  if (clientIds.size > 0) {
    const ids = [...clientIds]
    for (let i = 0; i < ids.length; i += 200) {
      const { data } = await supabase
        .from('mb_clients')
        .select('id,first_name,last_name')
        .in('id', ids.slice(i, i + 200))
      for (const c of (data ?? []) as Array<{ id: string; first_name: string | null; last_name: string | null }>) {
        nameById.set(c.id, shortClientName(c.first_name, c.last_name))
      }
    }
  }

  const serviceNameById = new Map<number, string>()
  if (sessionTypeIdsMissingName.size > 0) {
    const { data } = await supabase
      .from('treatment_settings')
      .select('mindbody_service_id,service_name')
      .in('mindbody_service_id', [...sessionTypeIdsMissingName])
    for (const t of (data ?? []) as Array<{ mindbody_service_id: number; service_name: string }>) {
      serviceNameById.set(t.mindbody_service_id, t.service_name)
    }
  }

  // ---- build columns ----
  const columns: TvColumn[] = []
  for (const m of members) {
    const availability: TvBlock[] = (m.Availabilities ?? []).map(a => ({
      startMin: stampToMin(a.StartDateTime),
      endMin: stampToMin(a.EndDateTime),
    })).filter(b => b.endMin > b.startMin)

    const unavailabilities: TvUnavailability[] = (m.Unavailabilities ?? []).map(u => ({
      startMin: stampToMin(u.StartDateTime),
      endMin: stampToMin(u.EndDateTime),
      label: (u.Description || '').trim() || 'No disponible',
    })).filter(b => b.endMin > b.startMin)

    const appointments: TvAppointment[] = []
    for (const a of m.Appointments ?? []) {
      if (EXCLUDED_STATUS.has(a.Status)) continue
      const startMin = stampToMin(a.StartDateTime)
      const endMin = Math.max(stampToMin(a.EndDateTime), startMin + 15)
      appointments.push({
        id: a.Id,
        startMin,
        endMin,
        startTime: minToHHMM(startMin),
        endTime: minToHHMM(endMin),
        clientName: a.ClientId ? nameById.get(String(a.ClientId)) ?? null : null,
        serviceName:
          a.SessionType?.Name ||
          (a.SessionTypeId ? serviceNameById.get(a.SessionTypeId) : undefined) ||
          'Tratamiento',
        sessionTypeId: a.SessionTypeId ?? a.SessionType?.Id ?? null,
        resourceName: a.Resources?.find(r => r.Name)?.Name ?? null,
        status: a.Status,
      })
    }
    appointments.sort((x, y) => x.startMin - y.startMin)

    // Only therapists actually on the floor that day
    if (availability.length === 0 && appointments.length === 0) continue

    columns.push({
      staffId: m.Id,
      staffName: [m.FirstName, m.LastName].filter(Boolean).join(' ').trim() || `Staff ${m.Id}`,
      availability,
      unavailabilities,
      appointments,
    })
  }

  // Columns ordered by shift start, then name — same as Mindbody's day view
  columns.sort((a, b) => {
    const sa = Math.min(...a.availability.map(x => x.startMin), ...a.appointments.map(x => x.startMin))
    const sb = Math.min(...b.availability.map(x => x.startMin), ...b.appointments.map(x => x.startMin))
    return sa - sb || a.staffName.localeCompare(b.staffName, 'es')
  })

  // Window: one hour of margin around the day's actual schedule — from 1h
  // before the first therapist availability to 1h after the last one, rounded
  // to whole hours. Appointments outside working hours still stretch it so a
  // block can never fall off the board. Empty day falls back to 8:00–21:00.
  const starts = columns.flatMap(c => [...c.availability, ...c.appointments].map(b => b.startMin))
  const ends = columns.flatMap(c => [...c.availability, ...c.appointments].map(b => b.endMin))
  const windowStartMin = starts.length
    ? Math.max(0, Math.floor((Math.min(...starts) - 60) / 60) * 60)
    : 8 * 60
  const windowEndMin = ends.length
    ? Math.min(24 * 60, Math.ceil((Math.max(...ends) + 60) / 60) * 60)
    : 21 * 60

  return {
    date,
    locationId,
    windowStartMin,
    windowEndMin,
    columns,
    generatedAt: new Date().toISOString(),
  }
}
