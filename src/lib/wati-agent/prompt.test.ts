import { describe, it, expect } from 'vitest'
import { buildSystem } from './prompt'

describe('buildSystem', () => {
  const blocks = buildSystem({
    personaName: 'Camila',
    now: new Date('2026-09-04T15:00:00-05:00'),
    sucursal: 'cde',
    clientName: 'Ana',
    mindbodyHistory: null,
    summary: null,
    media: [{ key: 'promo_mes', description: 'Promo septiembre', caption: '', storage_path: 'x', valid_from: null, valid_until: null, active: true }],
    intent: 'promo',
    styleGuide: 'GUIA',
  })

  it('first block is cached and stable', () => {
    expect(blocks[0].cache_control).toEqual({ type: 'ephemeral' })
    expect((blocks[0] as any).text).toContain('GUIA')
    expect((blocks[0] as any).text).not.toContain('2026')
  })

  it('second block carries date, client, media keys', () => {
    expect((blocks[1] as any).text).toContain('Ana')
    expect((blocks[1] as any).text).toContain('promo_mes')
    expect((blocks[1] as any).text).toContain('Muy buenas tardes')
  })

  it('states the confirmation and handoff rules', () => {
    expect((blocks[0] as any).text).toMatch(/customer_confirmation/)
    expect((blocks[0] as any).text).toMatch(/handoff/)
  })
})
