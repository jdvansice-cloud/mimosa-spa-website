import { describe, it, expect } from 'vitest'
import { thankYouSentence, isSelfDelivery, discountLine, isPaidStatus, giftForwardUrl, type ThankYouOrder } from './thankYou'

describe('discountLine', () => {
  const o = { faceValueCents: 10000, baseAmountCents: 8000, totalCents: 8000, itbmsCents: 0, locale: 'es' }
  it('monetary, es', () => {
    expect(discountLine(o)).toBe('Pagaste $80 (20% de descuento)')
  })
  it('experience with ITBMS, en: percent from the pre-tax price', () => {
    expect(discountLine({ ...o, totalCents: 8560, itbmsCents: 560, locale: 'en' })).toBe(
      'You paid $85.60 (20% off, incl. ITBMS)'
    )
  })
  it('null without a face value', () => {
    expect(discountLine({ ...o, faceValueCents: null })).toBeNull()
  })
  it('null when face equals base', () => {
    expect(discountLine({ ...o, faceValueCents: 8000 })).toBeNull()
  })
})

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

describe('isPaidStatus', () => {
  it('true only for paid statuses', () => {
    for (const s of ['captured', 'posted', 'invoiced', 'fulfilled', 'booked']) expect(isPaidStatus(s)).toBe(true)
    for (const s of ['authorized', 'totals_verified', 'cancelled', 'expired', '', null, undefined]) expect(isPaidStatus(s)).toBe(false)
  })
})

describe('giftForwardUrl', () => {
  it('encodes the localized text with the link', () => {
    const u = giftForwardUrl('https://x.test/gift/abc', 'es')
    expect(u.startsWith('https://wa.me/?text=')).toBe(true)
    expect(decodeURIComponent(u.split('text=')[1])).toBe('Un regalo de Mimosa Spa para ti 🎁 https://x.test/gift/abc')
    expect(decodeURIComponent(giftForwardUrl('u', 'en').split('text=')[1])).toBe('A Mimosa Spa gift for you 🎁 u')
  })
})
