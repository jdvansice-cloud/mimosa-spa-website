import {
  getAllServices,
  searchClients,
  addClient,
  addMultipleAppointments,
  getClientSchedule,
  getClientVisits,
  removeAppointment,
} from '@/lib/booking/mindbody'
import { sendBookingConfirmation } from '@/lib/booking/wati'
import { BUSINESS } from '../config/business'
import { pairSlotsForCouple } from './validate'
import type { Sucursal } from '../types'

export interface ServiceSummary { id: number; name: string; minutes: number; price: number; category: string }

const cache = new Map<Sucursal, { at: number; items: ServiceSummary[] }>()
const SIX_H = 6 * 3600_000

function stripAccents(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export async function listServices(sucursal: Sucursal, query?: string): Promise<ServiceSummary[]> {
  const hit = cache.get(sucursal)
  let items = hit && Date.now() - hit.at < SIX_H ? hit.items : null
  if (!items) {
    const raw = await getAllServices(BUSINESS.locations[sucursal].mindbodyLocationId)
    items = raw
      .filter(s => !s.IsAddOn)
      .map(s => ({ id: s.Id, name: s.Name, minutes: s.Duration, price: Math.round(s.Price * 100) / 100, category: s.Category }))
    cache.set(sucursal, { at: Date.now(), items })
  }
  if (!query?.trim()) return items
  const q = stripAccents(query)
  return items.filter(s => stripAccents(s.name).includes(q))
}

export async function findClientByPhone(phone: string): Promise<{ id: string; name: string; email: string; lastVisits: string[] } | null> {
  const last8 = phone.slice(-8)
  const clients = await searchClients(last8)
  const c = clients.find(x => (x.MobilePhone || '').replace(/\D/g, '').endsWith(last8))
  if (!c) return null
  const visits = await getClientVisits({ clientId: String(c.Id), limit: 5 }).catch(() => ({ visits: [], pagination: undefined }))
  const lastVisits = (visits.visits || [])
    .slice(0, 3)
    .map(v => `${String(v.StartDateTime).slice(0, 10)} ${v.Name ?? ''}`.trim())
  return { id: String(c.Id), name: `${c.FirstName} ${c.LastName}`.trim(), email: c.Email, lastVisits }
}

export async function findClientByEmail(email: string): Promise<{ id: string; name: string; email: string } | null> {
  const clients = await searchClients(email)
  if (!clients.length) return null
  const target = email.toLowerCase()
  const c = clients.find(x => (x.Email || '').toLowerCase() === target) ?? clients[0]
  return { id: String(c.Id), name: `${c.FirstName} ${c.LastName}`.trim(), email: c.Email }
}

export async function createClient(i: { first: string; last: string; email: string; phone: string }): Promise<{ id: string; existing?: boolean }> {
  try {
    const r = await addClient({ FirstName: i.first, LastName: i.last, Email: i.email, MobilePhone: i.phone })
    return { id: String(r.Id) }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (!/duplicate/i.test(msg)) throw err
    const existing = await findClientByEmail(i.email)
    if (!existing) throw err
    return { id: existing.id, existing: true }
  }
}

export async function availability(i: {
  sucursal: Sucursal
  date: string
  serviceIds: number[]
  people: 1 | 2
  origin: string
  phone: string
  fetchImpl?: typeof fetch
}): Promise<Array<{ time: string; staffIds: number[] }>> {
  const services = await listServices(i.sucursal)
  const duration = i.serviceIds.reduce((s, id) => s + (services.find(x => x.id === id)?.minutes ?? 60), 0)
  const params = new URLSearchParams({
    locationId: String(BUSINESS.locations[i.sucursal].mindbodyLocationId),
    serviceIds: i.serviceIds.join(','),
    startDate: i.date,
    endDate: i.date,
    duration: String(duration),
  })
  const doFetch = i.fetchImpl ?? fetch
  const res = await doFetch(`${i.origin}/api/mindbody/availability?${params}`, {
    // Per-customer rate-limit bucket: without this every agent lookup shares the 'unknown' bucket.
    headers: { 'x-internal-staff-resolution': '1', 'x-forwarded-for': `wati-agent-${i.phone}` },
  })
  const json: { availableDates?: Array<{ date: string; slots?: Array<{ time: string; availableStaffIds?: number[] }> }> } = await res.json()
  const day = (json.availableDates || []).find(d => d.date === i.date)
  const slots: Array<{ time: string; staffIds: number[] }> = (day?.slots || []).map(s => ({ time: s.time, staffIds: s.availableStaffIds || [] }))
  if (i.people === 2) {
    const ok = new Set(pairSlotsForCouple(slots))
    return slots.filter(s => ok.has(s.time))
  }
  return slots
}

/** Idempotency guard: appointment ids this client already has at exactly this date+time+location. */
async function findExistingAt(clientId: string, date: string, time: string, locationId: number): Promise<number[]> {
  const target = `${date}T${time}:00`.slice(0, 16)
  const r = await getClientSchedule({ clientId, startDate: date, limit: 20 }).catch(() => ({ visits: [] as any[] }))
  return (r.visits || [])
    .filter(v => String(v.StartDateTime).slice(0, 16) === target && v.LocationId === locationId)
    .map(v => v.AppointmentId)
}

export async function book(i: {
  clientId: string
  sucursal: Sucursal
  date: string
  time: string
  serviceIds: number[]
  people: 1 | 2
  origin: string
  clientName: string
  phone: string
}): Promise<{ appointmentIds: number[]; therapist: string; alreadyBooked?: boolean }> {
  const existing = await findExistingAt(i.clientId, i.date, i.time, BUSINESS.locations[i.sucursal].mindbodyLocationId)
  if (existing.length) return { appointmentIds: existing, therapist: 'ya reservada', alreadyBooked: true }

  const slots = await availability({ sucursal: i.sucursal, date: i.date, serviceIds: i.serviceIds, people: i.people, origin: i.origin, phone: i.phone })
  const slot = slots.find(s => s.time === i.time)
  if (!slot) throw new Error('Esa hora ya no está disponible')
  const services = await listServices(i.sucursal)
  const loc = BUSINESS.locations[i.sucursal]

  const chain = (staffId: number) =>
    i.serviceIds.map(id => ({
      ClientId: i.clientId,
      LocationId: loc.mindbodyLocationId,
      StaffId: staffId,
      SessionTypeId: id,
      StartDateTime: `${i.date}T${i.time}:00`,
      Notes: 'Reservado por WhatsApp (Camila)',
    }))

  const firstStaffId = slot.staffIds[0]
  const firstResult = await addMultipleAppointments(chain(firstStaffId))
  if (!firstResult.success) throw new Error(`No se pudo reservar: ${firstResult.error}`)
  let appointments = firstResult.appointments

  if (i.people === 2) {
    const secondStaffId = slot.staffIds.find(id => id !== firstStaffId) ?? slot.staffIds[1]
    let secondResult: Awaited<ReturnType<typeof addMultipleAppointments>> | undefined
    try {
      secondResult = await addMultipleAppointments(chain(secondStaffId))
    } catch {
      secondResult = undefined
    }
    if (!secondResult || !secondResult.success) {
      const removals = await Promise.allSettled(appointments.map(a => removeAppointment(a.Id)))
      const stuck = appointments.filter((_, n) => {
        const r = removals[n]
        return r.status === 'rejected' || r.value === false
      })
      throw new Error(
        'No se pudo reservar la segunda cabina; se liberó la primera' +
          (stuck.length ? ` (no se pudieron liberar las citas ${stuck.map(a => a.Id).join(', ')})` : '')
      )
    }
    appointments = [...appointments, ...secondResult.appointments]
  }

  const therapist = appointments[0]?.Staff ? `${appointments[0].Staff.FirstName} ${appointments[0].Staff.LastName}` : 'Por asignar'
  const minutes = i.serviceIds.reduce((s, id) => s + (services.find(x => x.id === id)?.minutes ?? 0), 0)

  await sendBookingConfirmation({
    clientName: i.clientName,
    clientPhone: i.phone,
    locationName: `Mimosa ${loc.name}`,
    date: new Intl.DateTimeFormat('es-PA', { timeZone: 'America/Panama', dateStyle: 'long' }).format(new Date(`${i.date}T12:00:00-05:00`)),
    time: new Intl.DateTimeFormat('es-PA', { timeZone: 'America/Panama', timeStyle: 'short' }).format(new Date(`${i.date}T${i.time}:00-05:00`)),
    services: i.serviceIds.map(id => services.find(x => x.id === id)?.name ?? String(id)),
    totalDuration: minutes,
    therapistName: therapist,
  })

  return { appointmentIds: appointments.map(a => a.Id), therapist }
}

export async function upcoming(clientId: string): Promise<Array<{ id: number; start: string; service: string; location: string; sessionTypeId: number }>> {
  const r = await getClientSchedule({ clientId, startDate: new Date().toISOString().slice(0, 10), limit: 10 })
  return (r.visits || []).map(v => ({
    id: v.AppointmentId,
    start: v.StartDateTime,
    service: v.Name,
    sessionTypeId: v.ServiceId,
    location: v.LocationId === 1 ? 'Costa del Este' : 'San Francisco',
  }))
}

export async function cancelAppointment(id: number): Promise<boolean> {
  return removeAppointment(id)
}
