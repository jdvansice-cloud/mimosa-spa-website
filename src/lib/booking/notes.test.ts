import { describe, it, expect } from 'vitest'
import { buildAppointmentNotes } from './notes'

describe('buildAppointmentNotes', () => {
  it('base note only', () => {
    expect(buildAppointmentNotes({ isPromoService: false })).toBe('Reservado en línea')
  })
  it('promo service carries the promotion name, not the global discount', () => {
    expect(buildAppointmentNotes({ isPromoService: true, promotionName: 'Día Spa', globalDiscountPercent: 10 })).toBe('Reservado en línea | Promo: Día Spa')
  })
  it('non-promo service with a global discount', () => {
    expect(buildAppointmentNotes({ isPromoService: false, globalDiscountPercent: 10 })).toBe('Reservado en línea | Promo Online 10%')
  })
  it('custom notes then gift code, in that order', () => {
    expect(buildAppointmentNotes({ isPromoService: false, customNotes: 'Alergia a nueces', giftCode: 'MO000123' })).toBe('Reservado en línea | Alergia a nueces | Gift card: MO000123')
  })
})
