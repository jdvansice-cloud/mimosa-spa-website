import { describe, it, expect } from 'vitest'
import { requireConfirmation, pairSlotsForCouple } from './validate'
import { TOOLS } from './definitions'

describe('requireConfirmation cross-check', () => {
  it('accepts the exact text the customer wrote, ignoring case and accents', () => {
    expect(requireConfirmation({ customer_confirmation: 'Sí, confirmo' }, ['cuanto cuesta', 'si, confirmo'])).toBeNull()
  })
  it('rejects a yes the model invented', () => {
    expect(requireConfirmation({ customer_confirmation: 'sí' }, ['a que hora abren?']))
      .toBe('La confirmación debe ser el texto exacto que escribió el cliente')
  })
  it('rejects when there are no recent inbound messages at all', () => {
    expect(requireConfirmation({ customer_confirmation: 'si' })).toBe('La confirmación debe ser el texto exacto que escribió el cliente')
  })
  it('still rejects a non-yes before looking at history', () => {
    expect(requireConfirmation({ customer_confirmation: 'mañana' }, ['mañana'])).toMatch(/Falta la confirmación/)
  })
})

describe('validate', () => {
  it('rejects empty confirmation', () => expect(requireConfirmation({ customer_confirmation: '' })).toMatch(/confirmaci/))
  it('rejects non-affirmative', () => expect(requireConfirmation({ customer_confirmation: 'no sé' })).toMatch(/confirmaci/))
  it('accepts sí', () => expect(requireConfirmation({ customer_confirmation: 'Si perfecto' }, ['Si perfecto'])).toBeNull())
  it('accepts accented sí', () => expect(requireConfirmation({ customer_confirmation: 'sí' }, ['sí'])).toBeNull())
  it('accepts accented Sí with trailing text', () => expect(requireConfirmation({ customer_confirmation: 'Sí, perfecto' }, ['Sí, perfecto'])).toBeNull())
  it('rejects sí followed by no', () => expect(requireConfirmation({ customer_confirmation: 'Sí pero no' })).toMatch(/confirmaci/))
  it('accepts dale', () => expect(requireConfirmation({ customer_confirmation: 'dale' }, ['dale'])).toBeNull())
  it('rejects plain no', () => expect(requireConfirmation({ customer_confirmation: 'no' })).toMatch(/confirmaci/))
  it('couple pairing needs 2 staff', () => {
    expect(pairSlotsForCouple([{ time: '10:00', staffIds: [1] }, { time: '11:00', staffIds: [1, 2] }])).toEqual(['11:00'])
  })
  it('all tools strict', () => expect(TOOLS.every(t => (t as any).strict === true)).toBe(true))
})
