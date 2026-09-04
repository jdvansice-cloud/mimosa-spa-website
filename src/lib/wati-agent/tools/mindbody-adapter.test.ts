import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/booking/mindbody', () => ({
  getAllServices: vi.fn(async () => [
    { Id: 10, Name: 'Mimosa Relax - 60 min', Duration: 60, Price: 75, Category: 'Masajes', IsAddOn: false },
    { Id: 11, Name: 'Facial Glow', Duration: 45, Price: 60, Category: 'Faciales', IsAddOn: false },
  ]),
  searchClients: vi.fn(async () => [{ Id: 'C1', FirstName: 'Ana', LastName: 'Ruiz', Email: 'a@x.com', MobilePhone: '6612-4546' }]),
  addClient: vi.fn(),
  addMultipleAppointments: vi.fn(),
  getClientSchedule: vi.fn(async () => ({ visits: [] })),
  getClientVisits: vi.fn(async () => ({ visits: [] })),
  removeAppointment: vi.fn(async () => true),
}))
vi.mock('@/lib/booking/wati', () => ({ sendBookingConfirmation: vi.fn(async () => ({ result: true })) }))

import * as mb from '@/lib/booking/mindbody'
import { listServices, availability, findClientByPhone, book, createClient } from './mindbody-adapter'

beforeEach(() => vi.clearAllMocks())

describe('adapter', () => {
  it('filters services by query and caches', async () => {
    const a = await listServices('cde', 'relax')
    const b = await listServices('cde', 'facial')
    expect(a.map(s => s.id)).toEqual([10])
    expect(b.map(s => s.id)).toEqual([11])
    expect(mb.getAllServices).toHaveBeenCalledTimes(1)
  })

  it('availability pairs for couples', async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(
        JSON.stringify({
          availableDates: [
            {
              date: '2026-09-06',
              slots: [
                { time: '10:00', availableStaffIds: [1] },
                { time: '11:00', availableStaffIds: [1, 2] },
              ],
            },
          ],
        })
      )
    )
    const slots = await availability({ sucursal: 'cde', date: '2026-09-06', serviceIds: [10], people: 2, origin: 'https://x', phone: '50766124546', fetchImpl })
    expect(slots.map(s => s.time)).toEqual(['11:00'])
    const init = (fetchImpl.mock.calls[0] as unknown as [string, RequestInit])[1]
    expect((init.headers as Record<string, string>)['x-forwarded-for']).toBe('wati-agent-50766124546')
  })

  it('finds client by phone suffix', async () => {
    const c = await findClientByPhone('50766124546')
    expect(c?.name).toBe('Ana Ruiz')
  })

  it('rolls back the first booking when the second person fails to book', async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(
        JSON.stringify({
          availableDates: [
            {
              date: '2026-09-06',
              slots: [{ time: '10:00', availableStaffIds: [1, 2] }],
            },
          ],
        })
      )
    )
    vi.stubGlobal('fetch', fetchImpl)

    ;(mb.addMultipleAppointments as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({ success: true, appointments: [{ Id: 111 }, { Id: 112 }] })
      .mockResolvedValueOnce({ success: false, error: 'no room' })

    await expect(
      book({
        clientId: 'C1',
        sucursal: 'cde',
        date: '2026-09-06',
        time: '10:00',
        serviceIds: [10],
        people: 2,
        origin: 'https://x',
        clientName: 'Ana Ruiz',
        phone: '50766124546',
      })
    ).rejects.toThrow('No se pudo reservar la segunda cabina; se liberó la primera')

    expect(mb.removeAppointment).toHaveBeenCalledTimes(2)
    expect(mb.removeAppointment).toHaveBeenCalledWith(111)
    expect(mb.removeAppointment).toHaveBeenCalledWith(112)

    vi.unstubAllGlobals()
  })

  it('still reports the intended error, naming the cabins it could not free', async () => {
    vi.stubGlobal('fetch', vi.fn(async () =>
      new Response(JSON.stringify({ availableDates: [{ date: '2026-09-06', slots: [{ time: '10:00', availableStaffIds: [1, 2] }] }] }))
    ))
    ;(mb.addMultipleAppointments as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({ success: true, appointments: [{ Id: 111 }, { Id: 112 }] })
      .mockResolvedValueOnce({ success: false, error: 'no room' })
    ;(mb.removeAppointment as ReturnType<typeof vi.fn>)
      .mockRejectedValueOnce(new Error('mindbody down'))
      .mockResolvedValueOnce(true)

    await expect(
      book({ clientId: 'C1', sucursal: 'cde', date: '2026-09-06', time: '10:00', serviceIds: [10], people: 2, origin: 'https://x', clientName: 'Ana Ruiz', phone: '50766124546' })
    ).rejects.toThrow(/se liberó la primera \(no se pudieron liberar las citas 111\)/)

    expect(mb.removeAppointment).toHaveBeenCalledTimes(2)
    vi.unstubAllGlobals()
  })

  it('does not create a duplicate when the client already has that slot', async () => {
    const fetchImpl = vi.fn()
    vi.stubGlobal('fetch', fetchImpl)
    ;(mb.getClientSchedule as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      visits: [{ AppointmentId: 777, StartDateTime: '2026-09-06T10:00:00', LocationId: 1, Name: 'Relax', ServiceId: 10 }],
    })

    const r = await book({ clientId: 'C1', sucursal: 'cde', date: '2026-09-06', time: '10:00', serviceIds: [10], people: 1, origin: 'https://x', clientName: 'Ana Ruiz', phone: '50766124546' })

    expect(r).toEqual({ appointmentIds: [777], therapist: 'ya reservada', alreadyBooked: true })
    expect(mb.addMultipleAppointments).not.toHaveBeenCalled()
    expect(fetchImpl).not.toHaveBeenCalled()
    vi.unstubAllGlobals()
  })

  it('recovers a duplicate client by email on creation', async () => {
    ;(mb.addClient as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error('Mindbody API error: Client creation cannot result in duplicate client records')
    )
    ;(mb.searchClients as ReturnType<typeof vi.fn>).mockResolvedValueOnce([
      { Id: 'C9', FirstName: 'Otro', LastName: 'Persona', Email: 'other@x.com', MobilePhone: '' },
      { Id: 'C1', FirstName: 'Ana', LastName: 'Ruiz', Email: 'A@X.COM', MobilePhone: '' },
    ])
    const r = await createClient({ first: 'Ana', last: 'Ruiz', email: 'a@x.com', phone: '50766124546' })
    expect(r).toEqual({ id: 'C1', existing: true })
  })

  it('rethrows the duplicate error when no matching client is found', async () => {
    const err = new Error('Mindbody API error: Client creation cannot result in duplicate client records')
    ;(mb.addClient as ReturnType<typeof vi.fn>).mockRejectedValueOnce(err)
    ;(mb.searchClients as ReturnType<typeof vi.fn>).mockResolvedValueOnce([])
    await expect(createClient({ first: 'Ana', last: 'Ruiz', email: 'a@x.com', phone: '50766124546' })).rejects.toBe(err)
  })

  it('books normally when the existing appointment is at another time or location', async () => {
    vi.stubGlobal('fetch', vi.fn(async () =>
      new Response(JSON.stringify({ availableDates: [{ date: '2026-09-06', slots: [{ time: '10:00', availableStaffIds: [1] }] }] }))
    ))
    ;(mb.getClientSchedule as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      visits: [
        { AppointmentId: 777, StartDateTime: '2026-09-06T11:00:00', LocationId: 1 },
        { AppointmentId: 778, StartDateTime: '2026-09-06T10:00:00', LocationId: 2 },
      ],
    })
    ;(mb.addMultipleAppointments as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ success: true, appointments: [{ Id: 999 }] })

    const r = await book({ clientId: 'C1', sucursal: 'cde', date: '2026-09-06', time: '10:00', serviceIds: [10], people: 1, origin: 'https://x', clientName: 'Ana Ruiz', phone: '50766124546' })
    expect(r.appointmentIds).toEqual([999])
    expect(r.alreadyBooked).toBeUndefined()
    vi.unstubAllGlobals()
  })
})
