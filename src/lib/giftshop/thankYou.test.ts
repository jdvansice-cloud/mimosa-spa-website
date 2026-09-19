import { describe, it, expect } from 'vitest'
import { thankYouSentence, isSelfDelivery, type ThankYouOrder } from './thankYou'

const base: ThankYouOrder = {
  recipient_name: 'María',
  recipient_email: null,
  recipient_phone: null,
  delivery_email: false,
  delivery_whatsapp: false,
  scheduled_send_at: null,
}

describe('thankYouSentence', () => {
  it('email, immediate', () => {
    const o = { ...base, delivery_email: true, recipient_email: 'maria@example.com' }
    expect(thankYouSentence(o, 'es')).toBe('María recibirá su gift card por correo (maria@example.com) en los próximos minutos.')
    expect(thankYouSentence(o, 'en')).toBe('María will receive the gift card by email (maria@example.com) in the next few minutes.')
  })

  it('email, scheduled', () => {
    const o = { ...base, delivery_email: true, recipient_email: 'maria@example.com', scheduled_send_at: '2026-09-20T14:00:00.000Z' }
    expect(thankYouSentence(o, 'es')).toBe('María recibirá su gift card por correo (maria@example.com) el 20 de septiembre.')
    expect(thankYouSentence(o, 'en')).toBe('María will receive the gift card by email (maria@example.com) on September 20.')
  })

  it('whatsapp', () => {
    const o = { ...base, delivery_whatsapp: true, recipient_phone: '50761234567' }
    expect(thankYouSentence(o, 'es')).toBe('María recibirá su gift card por WhatsApp (+50761234567) en los próximos minutos.')
  })

  it('self', () => {
    expect(thankYouSentence(base, 'es')).toBe('Aquí tienes la gift card para María. Envíasela cuando quieras.')
    expect(thankYouSentence(base, 'en')).toBe("Here is María's gift card. Share it whenever you like.")
    expect(isSelfDelivery(base)).toBe(true)
    expect(isSelfDelivery({ ...base, delivery_email: true })).toBe(false)
  })
})
