import { describe, it, expect } from 'vitest'
import { isOpen, greetingFor } from './hours'

// 2026-09-04 is a Friday. Panama is UTC-5, no DST.
const pa = (h: number, day = '2026-09-04') => new Date(`${day}T${String(h).padStart(2,'0')}:00:00-05:00`)

describe('hours', () => {
  it('weekday 10:00 open', () => expect(isOpen(pa(10))).toBe(true))
  it('weekday 20:30 closed', () => expect(isOpen(new Date('2026-09-04T20:30:00-05:00'))).toBe(false))
  it('saturday 18:30 closed', () => expect(isOpen(new Date('2026-09-05T18:30:00-05:00'))).toBe(false))
  it('sunday 09:00 open', () => expect(isOpen(pa(9, '2026-09-06'))).toBe(true))
  it('greeting morning', () => expect(greetingFor(pa(8))).toBe('Muy buenos días'))
  it('greeting afternoon', () => expect(greetingFor(pa(15))).toBe('Muy buenas tardes'))
  it('greeting night', () => expect(greetingFor(pa(19))).toBe('Muy buenas noches'))
})
