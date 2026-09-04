import { describe, it, expect, vi } from 'vitest'
import { executeTool } from './execute'

const deps = (over: Partial<any> = {}) => ({
  store: { logEvent: vi.fn(async () => {}), upsertConversation: vi.fn(async (c: any) => c), getSetting: vi.fn(async (_k: string, f: any) => f) },
  wati: { sendText: vi.fn(async () => ({ ok: true })), sendFile: vi.fn(async () => ({ ok: true })), sendButtons: vi.fn(async () => ({ ok: true })), updateChatStatus: vi.fn(async () => ({ ok: true })) },
  conv: { phone: '507', sucursal: 'cde', mindbody_client_id: 'C1', client_name: 'Ana', summary: null },
  origin: 'https://x', shadow: false, now: new Date('2026-09-05T08:00:00-05:00'), recentInbound: ['si, confirmo'],
  mediaBytes: vi.fn(async () => ({ bytes: new Uint8Array([1]), mime: 'image/png', filename: 'a.png' })),
  mb: { upcoming: vi.fn(async () => [{ id: 9, start: '2026-09-05T10:00:00', service: 'Relax', location: 'Costa del Este' }]), cancelAppointment: vi.fn(async () => true), listServices: vi.fn(async () => []) },
  ...over,
}) as any

describe('executeTool', () => {
  it('book rejects a confirmation the customer never wrote', async () => {
    const d = deps({ recentInbound: ['a que hora abren?'] })
    const r = await executeTool('book', { customer_confirmation: 'si' }, d)
    expect(r.isError).toBe(true)
    expect(r.result).toBe('La confirmación debe ser el texto exacto que escribió el cliente')
  })
  it('book accepts a confirmation quoted from a recent inbound message', async () => {
    const d = deps({
      recentInbound: ['cuanto cuesta?', 'Sí, confírmelo por favor'],
      mb: { book: vi.fn(async () => ({ appointmentIds: [1], therapist: 'Ana' })), listServices: vi.fn(async () => []) },
    })
    const r = await executeTool('book', { sucursal: 'cde', date: '2026-09-06', time: '10:00', service_ids: [10], people: 1, customer_confirmation: 'sí, confírmelo por favor' }, d)
    expect(r.isError).toBeUndefined()
    expect(d.mb.book).toHaveBeenCalled()
  })
  it('book without confirmation is an error', async () => {
    const r = await executeTool('book', { customer_confirmation: '' }, deps())
    expect(r.isError).toBe(true)
  })
  it('cancel inside 24h is blocked', async () => {
    const d = deps(); const r = await executeTool('cancel', { appointment_id: 9, customer_confirmation: 'si' }, d)
    expect(r.isError).toBe(true); expect(d.mb.cancelAppointment).not.toHaveBeenCalled()
  })
  it('get_location_info returns waze', async () => {
    const r = await executeTool('get_location_info', { sucursal: 'sfc' }, deps())
    expect(r.result).toContain('waze')
  })
  it('get_location_info merges business_overrides over the bundled defaults', async () => {
    const d = deps({
      store: {
        logEvent: vi.fn(async () => {}),
        upsertConversation: vi.fn(async (c: any) => c),
        getSetting: vi.fn(async (k: string, f: any) =>
          k === 'business_overrides' ? { sfc: { address: 'Calle 74 este detrás de la delta de Calle 50', parking: 'Estacionamiento propio' } } : f
        ),
      },
    })
    const r = JSON.parse((await executeTool('get_location_info', { sucursal: 'sfc' }, d)).result)
    expect(r.direccion).toBe('Calle 74 este detrás de la delta de Calle 50')
    expect(r.estacionamiento).toBe('Estacionamiento propio')
    // Unset fields fall back to BUSINESS.
    expect(r.waze).toContain('waze.com')
    expect(r.nombre).toBe('San Francisco')
  })
  it('get_location_info is unaffected by an override for the other location', async () => {
    const d = deps({
      store: {
        logEvent: vi.fn(async () => {}),
        upsertConversation: vi.fn(async (c: any) => c),
        getSetting: vi.fn(async (k: string, f: any) => (k === 'business_overrides' ? { sfc: { address: 'X' } } : f)),
      },
    })
    const r = JSON.parse((await executeTool('get_location_info', { sucursal: 'cde' }, d)).result)
    expect(r.direccion).toContain('Star Plaza')
  })
  it('get_payment_info returns the payment text from BUSINESS', async () => {
    const r = await executeTool('get_payment_info', {}, deps())
    expect(r.isError).toBeUndefined()
    expect(r.result).toContain('YAPPY')
    expect(r.result).toContain('Banco General')
  })
  it('send_image in shadow does not send', async () => {
    const d = deps({ shadow: true, store: { logEvent: vi.fn(async () => {}), activeMedia: vi.fn(async () => [{ key: 'promo', storage_path: 'p', caption: 'c', description: '', active: true, valid_from: null, valid_until: null }]) } })
    await executeTool('send_image', { key: 'promo' }, d)
    expect(d.wati.sendFile).not.toHaveBeenCalled()
  })
  it('reschedule keeps the original appointment when booking the new slot fails', async () => {
    const d = deps({
      mb: {
        upcoming: vi.fn(async () => [{ id: 9, start: '2026-09-10T10:00:00', service: 'Relax', location: 'Costa del Este', sessionTypeId: 1 }]),
        cancelAppointment: vi.fn(async () => true),
        book: vi.fn(async () => { throw new Error('slot gone') }),
        listServices: vi.fn(async () => []),
      },
    })
    const r = await executeTool('reschedule', { appointment_id: 9, date: '2026-09-11', time: '10:00', customer_confirmation: 'si' }, d)
    expect(d.mb.cancelAppointment).not.toHaveBeenCalled()
    expect(r.isError).toBe(true)
    expect(r.result).toContain('sigue en pie')
  })
  it('reschedule books the new slot before cancelling the old one', async () => {
    const order: string[] = []
    const d = deps({
      mb: {
        upcoming: vi.fn(async () => [{ id: 9, start: '2026-09-10T10:00:00', service: 'Relax', location: 'Costa del Este', sessionTypeId: 1 }]),
        cancelAppointment: vi.fn(async () => { order.push('cancel'); return true }),
        book: vi.fn(async () => { order.push('book'); return { id: 42, start: '2026-09-11T10:00:00' } }),
        listServices: vi.fn(async () => []),
      },
    })
    const r = await executeTool('reschedule', { appointment_id: 9, date: '2026-09-11', time: '10:00', customer_confirmation: 'si' }, d)
    expect(order).toEqual(['book', 'cancel'])
    expect(r.isError).toBeUndefined()
    expect(r.result).toContain('42')
  })
})
