import { describe, it, expect, vi } from 'vitest'
import { executeTool } from './execute'

const deps = (over: Partial<any> = {}) => ({
  store: { logEvent: vi.fn(async () => {}), upsertConversation: vi.fn(async (c: any) => c) },
  wati: { sendText: vi.fn(async () => ({ ok: true })), sendFile: vi.fn(async () => ({ ok: true })), sendButtons: vi.fn(async () => ({ ok: true })), updateChatStatus: vi.fn(async () => ({ ok: true })) },
  conv: { phone: '507', sucursal: 'cde', mindbody_client_id: 'C1', client_name: 'Ana', summary: null },
  origin: 'https://x', shadow: false, now: new Date('2026-09-05T08:00:00-05:00'),
  mediaBytes: vi.fn(async () => ({ bytes: new Uint8Array([1]), mime: 'image/png', filename: 'a.png' })),
  mb: { upcoming: vi.fn(async () => [{ id: 9, start: '2026-09-05T10:00:00', service: 'Relax', location: 'Costa del Este' }]), cancelAppointment: vi.fn(async () => true), listServices: vi.fn(async () => []) },
  ...over,
}) as any

describe('executeTool', () => {
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
