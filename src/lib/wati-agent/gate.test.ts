import { describe, it, expect } from 'vitest'
import { gate } from './gate'

const base = { globalMode: 'live' as const, enabledSetting: true, whitelist: [], phone: '50766124546', conversationMode: 'agent' as const, owner: false }

describe('gate', () => {
  it('runs live', () => expect(gate(base)).toEqual({ run: true, shadow: false }))
  it('shadow', () => expect(gate({ ...base, globalMode: 'shadow' })).toEqual({ run: true, shadow: true }))
  it('off global', () => expect(gate({ ...base, globalMode: 'off' }).run).toBe(false))
  it('disabled setting', () => expect(gate({ ...base, enabledSetting: false }).run).toBe(false))
  it('whitelist miss', () => expect(gate({ ...base, globalMode: 'whitelist', whitelist: ['50711111111'] }).run).toBe(false))
  it('whitelist hit', () => expect(gate({ ...base, globalMode: 'whitelist', whitelist: ['50766124546'] })).toEqual({ run: true, shadow: false }))
  it('human mode', () => expect(gate({ ...base, conversationMode: 'human' }).run).toBe(false))
  it('owner message', () => expect(gate({ ...base, owner: true }).run).toBe(false))
})
