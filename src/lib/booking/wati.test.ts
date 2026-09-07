import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { isPlaceholderPhone, sendTemplateMessage } from './wati'

describe('isPlaceholderPhone', () => {
  it('flags the bare 6000-0000 placeholder', () => {
    expect(isPlaceholderPhone('60000000')).toBe(true)
  })
  it('flags the fully-normalized 50760000000 placeholder', () => {
    expect(isPlaceholderPhone('50760000000')).toBe(true)
  })
  it('accepts a real Panama phone number', () => {
    expect(isPlaceholderPhone('50766124546')).toBe(false)
  })
  it('flags a repeated-digit number (all-same-digit tail)', () => {
    expect(isPlaceholderPhone('50711111111')).toBe(true)
  })
  it('accepts a short local-format real number after normalization', () => {
    expect(isPlaceholderPhone('6612-4546')).toBe(false)
  })
})

describe('sendTemplateMessage with a placeholder phone', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    global.fetch = vi.fn() as unknown as typeof fetch
  })

  afterEach(() => {
    global.fetch = originalFetch
    vi.restoreAllMocks()
  })

  it('never calls fetch and returns result:false', async () => {
    // WATI_ACCESS_TOKEN is read once at module load, so its configured state
    // in this test run depends on the environment — but either way (not
    // configured, or configured-and-placeholder-blocked) fetch must never
    // be reached for a placeholder phone.
    const r = await sendTemplateMessage('50760000000', 'confirmacion_cita2', [])
    expect(r.result).toBe(false)
    expect(global.fetch).not.toHaveBeenCalled()
  })
})
