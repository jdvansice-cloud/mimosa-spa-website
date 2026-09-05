import { describe, it, expect, vi } from 'vitest'
import { loadActivePromotions, mapPromotion } from './promotions'

const fakeSb = (rows: any[]) => {
  const q: any = {
    select: vi.fn(() => q),
    eq: vi.fn(() => q),
    gte: vi.fn(() => q),
    order: vi.fn(async () => ({ data: rows, error: null })),
  }
  return { from: vi.fn(() => q), q } as any
}

describe('promotions loader', () => {
  it('maps a row to the Spanish shape', () => {
    expect(
      mapPromotion({ title_es: 'Promo 2x1', price: 99, original_price: 150, duration_minutes: 90, mindbody_service_ids: [10, 12], valid_until: '2026-09-30' }),
    ).toEqual({ titulo: 'Promo 2x1', precio: 99, precio_original: 150, minutos: 90, servicios: [10, 12], valido_hasta: '2026-09-30' })
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

  it('throws with context when supabase errors', async () => {
    const q: any = { select: () => q, eq: () => q, gte: () => q, order: async () => ({ data: null, error: { message: 'boom' } }) }
    await expect(loadActivePromotions('2026-09-05', { from: () => q } as any)).rejects.toThrow(/loadActivePromotions: boom/)
  })
})
