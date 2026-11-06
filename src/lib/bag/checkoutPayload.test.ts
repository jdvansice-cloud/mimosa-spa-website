import { describe, it, expect } from 'vitest'
import { bagGiftCardsToCheckout } from './checkoutPayload'
import type { BagGiftCard } from './store'

const base = { key: 'k', catalogItemId: 'c1', name: 'GC', amountCents: 5000, recipientName: 'Ana', designSlug: 'navidad', message: 'Hola' }

describe('bagGiftCardsToCheckout', () => {
  it('email card', () => {
    const g: BagGiftCard = { ...base, deliveryMethod: 'email', recipientEmail: 'a@x.co', deliveryDate: '2026-12-01' }
    expect(bagGiftCardsToCheckout([g])).toEqual([{ catalogItemId: 'c1', recipientName: 'Ana', recipientEmail: 'a@x.co', deliveryMethod: 'email', designSlug: 'navidad', message: 'Hola', deliveryDate: '2026-12-01' }])
  })
  it('whatsapp card', () => {
    const g: BagGiftCard = { ...base, deliveryMethod: 'whatsapp', recipientPhone: '50760000000' }
    expect(bagGiftCardsToCheckout([g])).toEqual([{ catalogItemId: 'c1', recipientName: 'Ana', recipientPhone: '50760000000', deliveryMethod: 'whatsapp', designSlug: 'navidad', message: 'Hola' }])
  })
  it('self card has no email/phone keys', () => {
    const g: BagGiftCard = { ...base, deliveryMethod: 'self', recipientEmail: 'stale@x.co', recipientPhone: '5071' }
    const [o] = bagGiftCardsToCheckout([g])
    expect(o).not.toHaveProperty('recipientEmail')
    expect(o).not.toHaveProperty('recipientPhone')
    expect(o).toMatchObject({ deliveryMethod: 'self', catalogItemId: 'c1' })
  })
})
