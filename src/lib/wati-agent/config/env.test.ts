import { describe, it, expect, afterEach } from 'vitest'
import { env } from './env'

const original = process.env.WATI_AGENT_WHITELIST

afterEach(() => {
  if (original === undefined) delete process.env.WATI_AGENT_WHITELIST
  else process.env.WATI_AGENT_WHITELIST = original
})

describe('env().whitelist', () => {
  it('normalises entries the same way inbound phones are normalised', () => {
    process.env.WATI_AGENT_WHITELIST = '6612-4546, +507 6000 0000 ,,'
    expect(env().whitelist).toEqual(['50766124546', '50760000000'])
  })

  it("an 8-digit entry matches the stored phone", () => {
    process.env.WATI_AGENT_WHITELIST = '66124546'
    expect(env().whitelist).toContain('50766124546')
  })
})
