import { describe, it, expect } from 'vitest'
import { sanitizeGiftCode } from './giftCode'

describe('sanitizeGiftCode', () => {
  it('uppercases and accepts serials and barcodes', () => {
    expect(sanitizeGiftCode(' mo000123 ')).toBe('MO000123')
    expect(sanitizeGiftCode('MW-000001')).toBe('MW-000001')
  })
  it('rejects junk', () => {
    expect(sanitizeGiftCode('abc')).toBeNull()
    expect(sanitizeGiftCode('has space')).toBeNull()
    expect(sanitizeGiftCode('x'.repeat(21))).toBeNull()
    expect(sanitizeGiftCode(42)).toBeNull()
    expect(sanitizeGiftCode(null)).toBeNull()
  })
})
