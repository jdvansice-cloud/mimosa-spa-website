import { describe, it, expect } from 'vitest'
import { cleanPhone } from './phone'

describe('cleanPhone', () => {
  it('strips non-digits', () => expect(cleanPhone('+507 6612-4546')).toBe('50766124546'))
  it('prefixes 507 to 8-digit local numbers', () => expect(cleanPhone('66124546')).toBe('50766124546'))
  it('keeps foreign numbers', () => expect(cleanPhone('17864772422')).toBe('17864772422'))
  it('returns empty for junk', () => expect(cleanPhone('{{phone}}')).toBe(''))
})
