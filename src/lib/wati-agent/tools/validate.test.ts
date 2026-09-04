import { describe, it, expect } from 'vitest'
import { requireConfirmation, checkNoticePolicy, pairSlotsForCouple } from './validate'
import { TOOLS } from './definitions'

describe('validate', () => {
  it('rejects empty confirmation', () => expect(requireConfirmation({ customer_confirmation: '' })).toMatch(/confirmaci/))
  it('rejects non-affirmative', () => expect(requireConfirmation({ customer_confirmation: 'no sé' })).toMatch(/confirmaci/))
  it('accepts sí', () => expect(requireConfirmation({ customer_confirmation: 'Si perfecto' })).toBeNull())
  it('24h policy blocks', () => expect(checkNoticePolicy('2026-09-05T10:00:00-05:00', new Date('2026-09-05T08:00:00-05:00'))).toMatch(/24/))
  it('24h policy allows', () => expect(checkNoticePolicy('2026-09-07T10:00:00-05:00', new Date('2026-09-05T08:00:00-05:00'))).toBeNull())
  it('couple pairing needs 2 staff', () => {
    expect(pairSlotsForCouple([{ time: '10:00', staffIds: [1] }, { time: '11:00', staffIds: [1, 2] }])).toEqual(['11:00'])
  })
  it('all tools strict', () => expect(TOOLS.every(t => (t as any).strict === true)).toBe(true))
})
