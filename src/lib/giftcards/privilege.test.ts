import { describe, expect, it } from 'vitest'
import {
  PRIVILEGE_DENOMINATIONS_CENTS,
  formatPrivilegeValue, hasPrivilegeSeries, isPrivilege, isPrivilegeDenomination,
  maxSerialNumber, previewPrivilegeSerial, privilegeValueError,
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

  it('only exists in $500, $1,000 and $2,500', () => {
    expect([...PRIVILEGE_DENOMINATIONS_CENTS]).toEqual([50000, 100000, 250000])
    expect(isPrivilegeDenomination(50000)).toBe(true)
    expect(isPrivilegeDenomination(250000)).toBe(true)
    expect(isPrivilegeDenomination(75000)).toBe(false)
    expect(formatPrivilegeValue(250000)).toBe('$2,500')
  })

  it('accepts a denomination with no sale price: Mindbody holds the price', () => {
    for (const cents of PRIVILEGE_DENOMINATIONS_CENTS) {
      expect(privilegeValueError(cents)).toBeNull()
    }
  })

  it('rejects any other value', () => {
    const message = 'Valor no permitido: las tarjetas Privilege son de $500, $1,000 o $2,500'
    expect(privilegeValueError(75000)).toBe(message)
    expect(privilegeValueError(0)).toBe(message)
    expect(privilegeValueError(100001)).toBe(message)
    expect(privilegeValueError(undefined as unknown as number)).toBe(message)
  })
})
