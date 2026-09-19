import { describe, it, expect } from 'vitest'
import { recapLine } from './recap'

const base = { recipientName: 'María', deliveryMethod: 'email' as const, recipientEmail: 'maria@example.com', recipientPhone: '', scheduledDate: '' }

describe('recapLine', () => {
  it('email, sent on payment', () => {
    expect(recapLine(base, 'es')).toBe('Para María · por correo a maria@example.com · se envía al pagar')
    expect(recapLine(base, 'en')).toBe('For María · by email to maria@example.com · sent when you pay')
  })
  it('email, scheduled', () => {
    expect(recapLine({ ...base, scheduledDate: '2026-09-20' }, 'es')).toBe('Para María · por correo a maria@example.com · se envía el 20 de septiembre')
    expect(recapLine({ ...base, scheduledDate: '2026-09-20' }, 'en')).toBe('For María · by email to maria@example.com · sent on September 20')
  })
  it('whatsapp', () => {
    expect(recapLine({ ...base, deliveryMethod: 'whatsapp', recipientEmail: '', recipientPhone: '50761234567' }, 'es')).toBe('Para María · por WhatsApp al +50761234567 · se envía al pagar')
  })
  it('self', () => {
    expect(recapLine({ ...base, deliveryMethod: 'self', recipientEmail: '' }, 'es')).toBe('Para María · te la entregamos a ti en el comprobante')
    expect(recapLine({ ...base, deliveryMethod: 'self', recipientEmail: '' }, 'en')).toBe('For María · we hand it to you in your receipt')
  })
})
