import { describe, it, expect } from 'vitest'
import { validateMediaKey, validateMediaFile } from './media-validate'

describe('validateMediaKey', () => {
  it('accepts a valid key', () => expect(validateMediaKey('promo-2026')).toBe('promo-2026'))
  it('rejects a key with a slash', () => expect(validateMediaKey('a/b')).toBeNull())
  it('rejects a key with ..', () => expect(validateMediaKey('..')).toBeNull())
  it('normalizes uppercase to lowercase', () => expect(validateMediaKey('  PROMO  ')).toBe('promo'))
})

describe('validateMediaFile', () => {
  it('accepts a 1 MB jpeg', () =>
    expect(validateMediaFile({ type: 'image/jpeg', size: 1 * 1024 * 1024 })).toBeNull())
  it('rejects a 6 MB png', () =>
    expect(validateMediaFile({ type: 'image/png', size: 6 * 1024 * 1024 })).not.toBeNull())
  it('accepts a 15 MB pdf', () =>
    expect(validateMediaFile({ type: 'application/pdf', size: 15 * 1024 * 1024 })).toBeNull())
  it('rejects text/html', () =>
    expect(validateMediaFile({ type: 'text/html', size: 1024 })).not.toBeNull())
})
