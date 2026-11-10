import { describe, expect, it } from 'vitest'
import {
  PRIVILEGE_DENOMINATIONS_CENTS, PRIVILEGE_KNOWN_PRICES_CENTS,
  formatPrivilegeValue, hasPrivilegeSeries, isPrivilege, isPrivilegeDenomination,
  maxSerialNumber, previewPrivilegeSerial, privilegeAmountError, privilegeDiscountPercent,
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

describe('privilege amounts', () => {
  it('recognises privilege cards by format', () => {
    expect(isPrivilege({ format: 'privilege' })).toBe(true)
    expect(isPrivilege({ format: 'gift_card' })).toBe(false)
    expect(isPrivilege(undefined)).toBe(false)
  })

  it('computes the discount of price against value', () => {
    expect(privilegeDiscountPercent(100000, 80000)).toBe(20)
    expect(privilegeDiscountPercent(50000, 42500)).toBe(15)
    expect(privilegeDiscountPercent(100000, 100000)).toBeNull()
    expect(privilegeDiscountPercent(100000, 0)).toBeNull()
  })

  it('only exists in $500, $1,000 and $2,500', () => {
    expect([...PRIVILEGE_DENOMINATIONS_CENTS]).toEqual([50000, 100000, 250000])
    expect(isPrivilegeDenomination(50000)).toBe(true)
    expect(isPrivilegeDenomination(250000)).toBe(true)
    expect(isPrivilegeDenomination(75000)).toBe(false)
    expect(formatPrivilegeValue(250000)).toBe('$2,500')
    // A valid price never rescues a value outside the denominations.
    expect(privilegeAmountError(75000, 60000)).toBe(
      'Valor no permitido: las tarjetas Privilege son de $500, $1,000 o $2,500',
    )
    expect(privilegeAmountError(50000, 40000)).toBeNull()
    expect(privilegeAmountError(250000, 200000)).toBeNull()
  })

  it('knows the agreed price only where one was given', () => {
    expect(PRIVILEGE_KNOWN_PRICES_CENTS[100000]).toBe(80000)
    expect(PRIVILEGE_KNOWN_PRICES_CENTS[50000]).toBeUndefined()
    expect(PRIVILEGE_KNOWN_PRICES_CENTS[250000]).toBeUndefined()
    // Every known price must itself be a valid pair.
    for (const [value, price] of Object.entries(PRIVILEGE_KNOWN_PRICES_CENTS)) {
      expect(privilegeAmountError(Number(value), price)).toBeNull()
    }
  })

  it('requires a price below the value', () => {
    expect(privilegeAmountError(100000, 80000)).toBeNull()
    expect(privilegeAmountError(100000, 100000)).toMatch(/menor/)
    expect(privilegeAmountError(100000, 120000)).toMatch(/menor/)
    expect(privilegeAmountError(0, 80000)).toMatch(/Valor/)
    expect(privilegeAmountError(100000, 0)).toMatch(/Precio/)
    expect(privilegeAmountError(100000, undefined as unknown as number)).toMatch(/Precio/)
  })
})
