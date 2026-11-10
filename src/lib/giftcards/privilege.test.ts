import { describe, expect, it } from 'vitest'
import {
  PRIVILEGE_CARDS, PRIVILEGE_DENOMINATIONS_CENTS,
  formatPrivilegeDate, formatPrivilegeValue, hasPrivilegeSeries, isPrivilege, isPrivilegeDenomination,
  maxSerialNumber, previewPrivilegeSerial, privilegeCardName, privilegeExpiresAt,
  privilegeValidityMonths, privilegeValueError,
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
      { name: 'Privilege $500', valueCents: 62500, validityMonths: 12 },
      { name: 'Privilege $1,000', valueCents: 135000, validityMonths: 18 },
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

  it('is valid 12 months (Privilege $500) or 18 months (Privilege $1,000)', () => {
    expect(privilegeValidityMonths(62500)).toBe(12)
    expect(privilegeValidityMonths(135000)).toBe(18)
    expect(privilegeValidityMonths(100000)).toBeNull()
  })

  it('expires at the end of the same calendar day, 12 or 18 months after purchase', () => {
    // Issued 10 Nov 2026, 2:06 pm in Panama.
    const issued = '2026-11-10T19:06:31.343292+00:00'
    expect(privilegeExpiresAt(issued, 62500)).toBe('2027-11-11T04:59:59.000Z') // 10 Nov 2027, 23:59:59 Panama
    expect(privilegeExpiresAt(issued, 135000)).toBe('2028-05-11T04:59:59.000Z') // 10 May 2028, 23:59:59 Panama
    expect(formatPrivilegeDate(issued)).toBe('10 nov 2026')
    expect(formatPrivilegeDate('2027-11-11T04:59:59.000Z')).toBe('10 nov 2027')
    expect(formatPrivilegeDate('2028-05-11T04:59:59.000Z')).toBe('10 may 2028')
  })

  it("counts from the spa's calendar day, not the UTC one", () => {
    // 9:30 pm on 10 Nov in Panama is already 11 Nov in UTC.
    const evening = '2026-11-11T02:30:00Z'
    expect(formatPrivilegeDate(evening)).toBe('10 nov 2026')
    expect(privilegeExpiresAt(evening, 62500)).toBe('2027-11-11T04:59:59.000Z')
  })

  it('falls back to the last day of a shorter month', () => {
    // 31 Aug 2026 + 18 months → Feb 2028 has no 31st (leap year: 29).
    expect(formatPrivilegeDate(privilegeExpiresAt('2026-08-31T15:00:00Z', 135000)!)).toBe('29 feb 2028')
    // 29 Feb 2028 + 12 months → 28 Feb 2029.
    expect(formatPrivilegeDate(privilegeExpiresAt('2028-02-29T15:00:00Z', 62500)!)).toBe('28 feb 2029')
    // Crossing a year boundary: 15 Dec 2026 + 12 months.
    expect(formatPrivilegeDate(privilegeExpiresAt('2026-12-15T15:00:00Z', 62500)!)).toBe('15 dic 2027')
  })

  it('gives no expiry for a value that is not a current card or an unreadable date', () => {
    expect(privilegeExpiresAt('2026-11-10T19:06:31Z', 100000)).toBeNull()
    expect(privilegeExpiresAt('not a date', 62500)).toBeNull()
    expect(formatPrivilegeDate('not a date')).toBe('')
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
