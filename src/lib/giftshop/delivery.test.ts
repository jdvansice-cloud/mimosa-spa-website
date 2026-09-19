import { describe, it, expect } from 'vitest'
import { resolveDelivery } from './delivery'

describe('resolveDelivery', () => {
  it('email: requires a valid address and sends by email only', () => {
    const r = resolveDelivery({ deliveryMethod: 'email', recipientEmail: ' Maria@Example.com ', recipientPhone: '50761234567' })
    expect(r).toEqual({
      ok: true, method: 'email', recipientEmail: 'maria@example.com', recipientPhone: null,
      deliveryEmail: true, deliveryWhatsapp: false, allowSchedule: true,
    })
  })

  it('email: rejects a missing or malformed address', () => {
    expect(resolveDelivery({ deliveryMethod: 'email', recipientEmail: '' })).toEqual({ ok: false, error: 'Indica el correo de quien recibe' })
    expect(resolveDelivery({ deliveryMethod: 'email', recipientEmail: 'nope' })).toEqual({ ok: false, error: 'Correo del destinatario inválido' })
  })

  it('whatsapp: keeps digits only and sends by WhatsApp only', () => {
    const r = resolveDelivery({ deliveryMethod: 'whatsapp', recipientPhone: '+507 6123-4567', recipientEmail: 'x@y.com' })
    expect(r).toEqual({
      ok: true, method: 'whatsapp', recipientEmail: null, recipientPhone: '50761234567',
      deliveryEmail: false, deliveryWhatsapp: true, allowSchedule: true,
    })
  })

  it('whatsapp: rejects a number shorter than 8 digits', () => {
    expect(resolveDelivery({ deliveryMethod: 'whatsapp', recipientPhone: '1234' })).toEqual({ ok: false, error: 'Indica el WhatsApp de quien recibe' })
  })

  it('self: stores no recipient contact and sends nothing', () => {
    const r = resolveDelivery({ deliveryMethod: 'self', recipientEmail: 'x@y.com', recipientPhone: '50761234567' })
    expect(r).toEqual({
      ok: true, method: 'self', recipientEmail: null, recipientPhone: null,
      deliveryEmail: false, deliveryWhatsapp: false, allowSchedule: false,
    })
  })

  it('self never allows a scheduled send', () => {
    const r = resolveDelivery({ deliveryMethod: 'self' })
    expect(r.ok && r.allowSchedule).toBe(false)
  })

  it('rejects an unknown method', () => {
    expect(resolveDelivery({ deliveryMethod: 'pigeon' })).toEqual({ ok: false, error: 'Método de entrega inválido' })
  })

  it('legacy body without deliveryMethod keeps the old derivation (both flags from the fields)', () => {
    const r = resolveDelivery({ recipientEmail: 'a@b.co', recipientPhone: '50761234567' })
    expect(r).toEqual({
      ok: true, method: 'email', recipientEmail: 'a@b.co', recipientPhone: '50761234567',
      deliveryEmail: true, deliveryWhatsapp: true, allowSchedule: true,
    })
    const none = resolveDelivery({})
    expect(none).toEqual({
      ok: true, method: 'self', recipientEmail: null, recipientPhone: null,
      deliveryEmail: false, deliveryWhatsapp: false, allowSchedule: false,
    })
  })
})
