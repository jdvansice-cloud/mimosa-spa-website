import { describe, it, expect } from 'vitest'
import { shouldResume } from './resume'

const NOW = new Date('2026-09-05T12:00:00.000Z')
const hoursAgo = (h: number) => new Date(NOW.getTime() - h * 3600_000).toISOString()

describe('shouldResume', () => {
  it('resumes after idleHours with a non-sticky reason (takeover)', () => {
    expect(shouldResume({
      mode: 'human',
      handoffReason: 'takeover',
      humanSince: hoursAgo(4),
      lastHumanOutboundAt: hoursAgo(4),
      now: NOW,
      idleHours: 3,
    })).toBe(true)
  })

  it('does not resume when idle time is under idleHours', () => {
    expect(shouldResume({
      mode: 'human',
      handoffReason: 'takeover',
      humanSince: hoursAgo(1),
      lastHumanOutboundAt: hoursAgo(1),
      now: NOW,
      idleHours: 3,
    })).toBe(false)
  })

  it('does not resume for sticky reason "queja" even after 5h idle', () => {
    expect(shouldResume({
      mode: 'human',
      handoffReason: 'queja',
      humanSince: hoursAgo(5),
      lastHumanOutboundAt: hoursAgo(5),
      now: NOW,
      idleHours: 3,
    })).toBe(false)
  })

  it('resumes after 25h regardless of sticky reason', () => {
    expect(shouldResume({
      mode: 'human',
      handoffReason: 'queja',
      humanSince: hoursAgo(25),
      lastHumanOutboundAt: hoursAgo(25),
      now: NOW,
      idleHours: 3,
    })).toBe(true)
  })

  it('never resumes when mode is agent', () => {
    expect(shouldResume({
      mode: 'agent',
      handoffReason: null,
      humanSince: hoursAgo(25),
      lastHumanOutboundAt: hoursAgo(25),
      now: NOW,
      idleHours: 3,
    })).toBe(false)
  })

  it('falls back to human_since when there is no lastHumanOutboundAt', () => {
    expect(shouldResume({
      mode: 'human',
      handoffReason: 'takeover',
      humanSince: hoursAgo(4),
      lastHumanOutboundAt: null,
      now: NOW,
      idleHours: 3,
    })).toBe(true)
  })
})
