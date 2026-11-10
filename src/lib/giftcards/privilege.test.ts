import { describe, expect, it } from 'vitest'
import {
  PRIVILEGE_CARDS, PRIVILEGE_DENOMINATIONS_CENTS,
  formatPrivilegeValue, hasPrivilegeSeries, isPrivilege, isPrivilegeDenomination,
  maxSerialNumber, previewPrivilegeSerial, privilegeCardName, privilegeValueError,
} from './privilege'

describe('privilege series', () => {
  it('is unavailable until the location has a prefix', () => {
    expect(hasPrivilegeSeries(undefined)).toBe(false)
    // Row as returned BEFORE the migration: the columns simply aren't there.
    expect(hasPrivilegeSeries({})).toBe(false)
    expect(hasPrivilegeSeries({ privilege_prefix: null, privilege_serial_length: 6 })).toBe(false)
    expect(hasPrivilegeSeries({ privilege_prefix: 'PCE' })).toBe(true)
  })

  it('previews the next serial zero-padded to the series length', () => {
    expect(previewPrivilegeSerial({ privilege_prefix: 'PCE', privilege_serial_length: 6, privilege_next_sequence_value: 1 }))
      .toBe('PCE000001')
    expect(previewPrivilegeSerial({ privilege_prefix: 'PSF', privilege_serial_length: 4, privilege_next_sequence_value: 27 }))
      .toBe('PSF0027')
    expect(previewPrivilegeSerial({ privilege_prefix: null })).toBeNull()
  })

  it('finds the highest number already printed for a prefix', () => {
    const serials = ['PCE000001', 'PCE000012', 'PCE00003X', 'PSF000099', 'CE000500']
    expect(maxSerialNumber(serials, 'PCE')).toBe(12)
    expect(maxSerialNumber(serials, 'PSF')).toBe(99)
    expect(maxSerialNumber(serials, 'PV')).toBe(0)
  })
})

describe('privilege value', () => {
  it('recognises privilege cards by format', () => {
    expect(isPrivilege({ format: 'privilege' })).toBe(true)
    expect(isPrivilege({ format: 'gift_card' })).toBe(false)
    expect(isPrivilege(undefined)).toBe(false)
  })

  it('has two cards: Privilege $500 worth $625 and Privilege $1,000 worth $1,350', () => {
    expect(PRIVILEGE_CARDS).toEqual([
      { name: 'Privilege $500', valueCents: 62500 },
      { name: 'Privilege $1,000', valueCents: 135000 },
    ])
    expect([...PRIVILEGE_DENOMINATIONS_CENTS]).toEqual([62500, 135000])
    expect(isPrivilegeDenomination(62500)).toBe(true)
    expect(isPrivilegeDenomination(135000)).toBe(true)
    expect(formatPrivilegeValue(62500)).toBe('$625')
    expect(formatPrivilegeValue(135000)).toBe('$1,350')
  })

  it('names a card by what the buyer pays, from its consumption value', () => {
    expect(privilegeCardName(62500)).toBe('Privilege $500')
    expect(privilegeCardName(135000)).toBe('Privilege $1,000')
    expect(privilegeCardName(100000)).toBeNull()
  })

  it('no longer accepts the face amounts or the dropped $2,500 card as values', () => {
    expect(isPrivilegeDenomination(50000)).toBe(false)
    expect(isPrivilegeDenomination(100000)).toBe(false)
    expect(isPrivilegeDenomination(250000)).toBe(false)
  })

  it('accepts a denomination with no sale price: Mindbody holds the price', () => {
    for (const cents of PRIVILEGE_DENOMINATIONS_CENTS) {
      expect(privilegeValueError(cents)).toBeNull()
    }
  })

  it('rejects any other value', () => {
    const message = 'Valor no permitido: las tarjetas Privilege son de $625 o $1,350'
    expect(privilegeValueError(75000)).toBe(message)
    expect(privilegeValueError(100000)).toBe(message)
    expect(privilegeValueError(250000)).toBe(message)
    expect(privilegeValueError(0)).toBe(message)
    expect(privilegeValueError(100001)).toBe(message)
    expect(privilegeValueError(undefined as unknown as number)).toBe(message)
  })
})
