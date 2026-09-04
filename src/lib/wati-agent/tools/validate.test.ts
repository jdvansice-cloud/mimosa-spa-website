import { describe, it, expect } from 'vitest'
import { requireConfirmation, checkNoticePolicy, pairSlotsForCouple, withPanamaOffset } from './validate'
import { TOOLS } from './definitions'

describe('validate', () => {
  it('rejects empty confirmation', () => expect(requireConfirmation({ customer_confirmation: '' })).toMatch(/confirmaci/))
  it('rejects non-affirmative', () => expect(requireConfirmation({ customer_confirmation: 'no sé' })).toMatch(/confirmaci/))
  it('accepts sí', () => expect(requireConfirmation({ customer_confirmation: 'Si perfecto' })).toBeNull())
  it('accepts accented sí', () => expect(requireConfirmation({ customer_confirmation: 'sí' })).toBeNull())
  it('accepts accented Sí with trailing text', () => expect(requireConfirmation({ customer_confirmation: 'Sí, perfecto' })).toBeNull())
  it('rejects sí followed by no', () => expect(requireConfirmation({ customer_confirmation: 'Sí pero no' })).toMatch(/confirmaci/))
  it('accepts dale', () => expect(requireConfirmation({ customer_confirmation: 'dale' })).toBeNull())
  it('rejects plain no', () => expect(requireConfirmation({ customer_confirmation: 'no' })).toMatch(/confirmaci/))
  it('24h policy blocks', () => expect(checkNoticePolicy('2026-09-05T10:00:00-05:00', new Date('2026-09-05T08:00:00-05:00'))).toMatch(/24/))
  it('24h policy allows', () => expect(checkNoticePolicy('2026-09-07T10:00:00-05:00', new Date('2026-09-05T08:00:00-05:00'))).toBeNull())
  it('couple pairing needs 2 staff', () => {
    expect(pairSlotsForCouple([{ time: '10:00', staffIds: [1] }, { time: '11:00', staffIds: [1, 2] }])).toEqual(['11:00'])
  })
  it('all tools strict', () => expect(TOOLS.every(t => (t as any).strict === true)).toBe(true))
})

describe('checkNoticePolicy timezone', () => {
  // Mindbody returns '2026-09-05T10:00:00' with no offset; that is 10:00 Panamá.
  it('treats an offset-less start as Panamá, not the server timezone', () => {
    // 26 h before 10:00 Panamá (= 15:00 UTC) → outside the 24 h window everywhere.
    const now = new Date('2026-09-04T13:00:00Z')
    expect(checkNoticePolicy('2026-09-05T10:00:00', now)).toBeNull()
  })

  it('still blocks inside the window with an offset-less start', () => {
    const now = new Date('2026-09-05T00:00:00Z') // 19:00 Panamá on the 4th, 15 h before
    expect(checkNoticePolicy('2026-09-05T10:00:00', now)).toContain('menos de 24 horas')
  })

  it('leaves an explicit offset alone', () => {
    expect(withPanamaOffset('2026-09-05T10:00:00-05:00')).toBe('2026-09-05T10:00:00-05:00')
    expect(withPanamaOffset('2026-09-05T10:00:00Z')).toBe('2026-09-05T10:00:00Z')
    expect(withPanamaOffset('2026-09-05T10:00:00')).toBe('2026-09-05T10:00:00-05:00')
  })
})
