import { describe, it, expect, vi } from 'vitest'
import { loadActivePromotions, mapPromotion } from './promotions'

const TREATMENTS = [
  { mindbody_service_id: 49, service_name: 'Mimosa Relax 60', duration: 60 },
  { mindbody_service_id: 170, service_name: 'Extra Mascarilla Hidratante', duration: 10 },
  { mindbody_service_id: 174, service_name: 'Exfoliación Corporal', duration: 20 },
  { mindbody_service_id: 206, service_name: 'Extra Piedras Calientes', duration: 10 },
]

const fakeSb = (rows: any[], treatments: any[] = TREATMENTS) => {
  const q: any = {
    select: vi.fn(() => q),
    eq: vi.fn(() => q),
    gte: vi.fn(() => q),
    in: vi.fn(async () => ({ data: treatments, error: null })),
    order: vi.fn(async () => ({ data: rows, error: null })),
  }
  return { from: vi.fn(() => q), q } as any
}

describe('promotions loader', () => {
  it('maps a row to the Spanish shape', () => {
    expect(
      mapPromotion({ id: 'p1', title_es: 'Promo 2x1', price: 99, original_price: 150, duration_minutes: 90, mindbody_service_ids: [10, 12], valid_until: '2026-09-30' }),
    ).toEqual({ id: 'p1', titulo: 'Promo 2x1', precio: 99, precio_original: 150, minutos: 90, servicios: [10, 12], incluye: [], duracion_total: 90, valido_hasta: '2026-09-30' })
  })

  it('filters by active + valid_until and caps at 4', async () => {
    const rows = Array.from({ length: 6 }, (_, i) => ({ title_es: `P${i}`, price: i, duration_minutes: 60, mindbody_service_ids: [i] }))
    const sb = fakeSb(rows)
    const out = await loadActivePromotions('2026-09-05', sb)
    expect(out).toHaveLength(4)
    expect(out[0].titulo).toBe('P0')
    expect(sb.q.eq).toHaveBeenCalledWith('is_active', true)
    expect(sb.q.gte).toHaveBeenCalledWith('valid_until', '2026-09-05')
    expect(sb.q.order).toHaveBeenCalledWith('sort_order', { ascending: true })
  })

  it('resolves the included treatment names and totals their minutes', async () => {
    const sb = fakeSb([
      { id: 'p1', title_es: 'Escape Mimosa', price: 129, duration_minutes: 0, mindbody_service_ids: [49, 170, 174, 206], valid_until: '2026-09-30' },
    ])
    const [promo] = await loadActivePromotions('2026-09-05', sb)
    expect(sb.q.in).toHaveBeenCalledWith('mindbody_service_id', [49, 170, 174, 206])
    expect(promo.incluye.map(t => t.nombre)).toEqual([
      'Mimosa Relax 60',
      'Extra Mascarilla Hidratante',
      'Exfoliación Corporal',
      'Extra Piedras Calientes',
    ])
    expect(promo.duracion_total).toBe(100)
  })

  it('falls back to the Mindbody service names for ids the CMS does not carry', async () => {
    const sb = fakeSb(
      [{ id: 'p2', title_es: 'Body Reset', price: 89, duration_minutes: 80, mindbody_service_ids: [152, 206], valid_until: '2026-09-30' }],
      [{ mindbody_service_id: 206, service_name: 'Extra Piedras Calientes', duration: 10 }],
    )
    const [promo] = await loadActivePromotions('2026-09-05', sb, async () => [{ id: 152, name: 'Exfoliación + Envoltura', minutes: 70 }])
    expect(promo.incluye.map(t => t.nombre)).toEqual(['Exfoliación + Envoltura', 'Extra Piedras Calientes'])
    expect(promo.duracion_total).toBe(80)
  })

  it('keeps duration_minutes as the total when nothing resolves', async () => {
    const sb = fakeSb([{ id: 'p3', title_es: 'Solo', price: 50, duration_minutes: 45, mindbody_service_ids: [999], valid_until: '2026-09-30' }], [])
    const [promo] = await loadActivePromotions('2026-09-05', sb)
    expect(promo.incluye).toEqual([])
    expect(promo.duracion_total).toBe(45)
  })

  it('throws with context when supabase errors', async () => {
    const q: any = { select: () => q, eq: () => q, gte: () => q, order: async () => ({ data: null, error: { message: 'boom' } }) }
    await expect(loadActivePromotions('2026-09-05', { from: () => q } as any)).rejects.toThrow(/loadActivePromotions: boom/)
  })
})
