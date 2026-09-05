import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  buildKnowledge,
  findTreatment,
  getKnowledge,
  invalidateKnowledge,
  normalize,
  TOPIC_KEYS,
  type TreatmentEntry,
} from './knowledge'
import { DEFAULT_SETTINGS } from '@/lib/settings'

const TREATMENTS = [
  { mindbody_service_id: 10, service_name: 'Masaje Mimosa Relax', category: 'Masajes', price: 75, duration: 60, description: 'Masaje sueco suave de cuerpo completo con aceites tibios.', is_top_pick: true },
  { mindbody_service_id: 12, service_name: 'Liberador de Tensión', category: 'Masajes', price: 80, duration: 60, description: 'Presión profunda en espalda, cuello y hombros para deshacer nudos acumulados por el estrés del día a día y la mala postura.', is_top_pick: false },
  { mindbody_service_id: 20, service_name: 'Facial Hidratante', category: 'Faciales', price: 70, duration: 50, description: '<p>Limpieza profunda  e hidratación.</p>', is_top_pick: false },
]

const OFFERS = [
  { page: 'parejas', name_es: 'Ritual para Dos', price: 190, price_note_es: 'por pareja', includes_es: ['dos masajes', 'brindis'], description_es: 'Cabina doble.' },
  { page: 'club-mimosa', name_es: 'Plan Esencial', price: 69, price_note_es: 'al mes', includes_es: [], description_es: 'Un masaje mensual a precio de miembro.' },
]

/** Minimal Supabase double: one thenable query builder per table. */
function fakeSb(tables: Record<string, unknown[]>, errors: Record<string, string> = {}) {
  return {
    from: (table: string) => {
      const q: any = {
        select: () => q,
        eq: () => q,
        order: async () => ({ data: tables[table] ?? [], error: errors[table] ? { message: errors[table] } : null }),
      }
      return q
    },
  } as any
}

const deps = (over: Record<string, unknown> = {}) => ({
  sb: fakeSb({ treatment_settings: TREATMENTS, marketing_offers: OFFERS }),
  promotions: async () => [
    {
      id: 'p1',
      titulo: 'Promo Septiembre',
      precio: 99,
      precio_original: 150,
      minutos: 90,
      servicios: [10, 12],
      incluye: [
        { id: 10, nombre: 'Masaje Mimosa Relax', minutos: 60 },
        { id: 12, nombre: 'Liberador de Tensión', minutos: 30 },
      ],
      duracion_total: 90,
      valido_hasta: '2026-09-30',
    },
  ],
  settings: async () => ({ ...DEFAULT_SETTINGS, phone_costa_del_este: '398-5295', phone_san_francisco: '300-1111' }),
  giftCatalog: async () => [
    { kind: 'monetary', name_es: 'Gift Card $50', amount_cents: 5000 } as any,
    { kind: 'experience', name_es: 'Ritual Mimosa', amount_cents: 12000 } as any,
  ],
  now: new Date('2026-09-05T10:00:00-05:00'),
  ...over,
})

describe('buildKnowledge', () => {
  it('renders the catalogue with one line per treatment, grouped by category', async () => {
    const k = await buildKnowledge(deps())
    expect(k.catalogText).toContain('## Catálogo de tratamientos')
    expect(k.catalogText).toContain('### Masajes')
    expect(k.catalogText).toContain('### Faciales')
    expect(k.catalogText).toContain('- ★ Masaje Mimosa Relax · 60 min · $75 · Masajes — Masaje sueco suave')
    expect(k.treatments).toHaveLength(3)
    expect(k.treatments[0].topPick).toBe(true)
  })

  it('marks only top picks with ★ and truncates long descriptions', async () => {
    const k = await buildKnowledge(deps())
    const tension = k.catalogText.split('\n').find(l => l.includes('Liberador de Tensión'))!
    expect(tension.startsWith('- Liberador')).toBe(true)
    expect(tension).toContain('…')
    // 110-char cap on the description part
    expect(tension.split('—')[1].trim().length).toBeLessThanOrEqual(111)
  })

  it('strips HTML and collapses whitespace from descriptions', async () => {
    const k = await buildKnowledge(deps())
    expect(k.treatments[2].description).toBe('Limpieza profunda e hidratación.')
    expect(k.catalogText).not.toContain('<p>')
  })

  it('includes active promotions and page offers', async () => {
    const k = await buildKnowledge(deps())
    expect(k.catalogText).toContain('## Promociones activas (web)')
    expect(k.catalogText).toContain(
      '- Promo Septiembre · $99 (antes $150) · 90 min — incluye: Masaje Mimosa Relax + Liberador de Tensión',
    )
    expect(k.catalogText).toContain('## Ofertas de página')
    expect(k.catalogText).toContain('Ritual para Dos · $190 (por pareja)')
    expect(k.catalogText).toContain('Plan Esencial · $69 (al mes)')
  })

  it('carries hours, phones and the google rating in Datos', async () => {
    const k = await buildKnowledge(deps())
    expect(k.catalogText).toContain('## Datos')
    expect(k.catalogText).toContain('Lun-Vie 9AM-8PM')
    expect(k.catalogText).toContain('398-5295')
    expect(k.catalogText).toContain('300-1111')
    expect(k.catalogText).toMatch(/Google: [\d.]+ ★/)
  })

  it('lists gift card amounts and the buying link without inventing a validity', async () => {
    const k = await buildKnowledge(deps())
    expect(k.topics.giftcards).toContain('$50')
    expect(k.topics.giftcards).toContain('Ritual Mimosa ($120)')
    expect(k.topics.giftcards).toContain('mimosaretreat.com/giftcards')
    expect(k.topics.giftcards).toContain('consulte la vigencia en el certificado')
    expect(k.topics.giftcards).not.toMatch(/\d+\s*(meses|años|días)/i)
  })

  it('states the no-penalty policy and never mentions prepayment or no-show', async () => {
    const k = await buildKnowledge(deps())
    expect(k.topics.politicas).toContain('sin penalidad')
    expect(k.topics.politicas.toLowerCase()).not.toContain('prepago')
    expect(k.topics.politicas.toLowerCase()).not.toContain('no-show')
    expect(k.topics.politicas).toContain('3 personas o más')
  })

  it('marks referidos as coming soon and fills every topic key', async () => {
    const k = await buildKnowledge(deps())
    for (const key of TOPIC_KEYS) expect(k.topics[key].length).toBeGreaterThan(10)
    expect(k.topics.referidos.toLowerCase()).toContain('próximamente')
    expect(k.topics.parejas).toContain('Cumpleaños Mimosa')
    expect(k.topics.club).toContain('Club Mimosa')
    expect(k.topics.empresas).toContain('Regalos corporativos')
    expect(k.topics.ubicaciones).toContain('Costa del Este')
  })

  it('is deterministic and carries no timestamp inside the text', async () => {
    const a = await buildKnowledge(deps())
    const b = await buildKnowledge(deps({ now: new Date('2026-12-25T08:00:00-05:00') }))
    expect(a.catalogText).toBe(b.catalogText)
    expect(a.catalogText).not.toContain('2026-09-05')
  })

  it('degrades to an empty catalogue instead of throwing when a source fails', async () => {
    const k = await buildKnowledge(
      deps({ sb: fakeSb({}, { treatment_settings: 'boom', marketing_offers: 'boom' }), promotions: async () => { throw new Error('x') } }),
    )
    expect(k.treatments).toEqual([])
    expect(k.catalogText).toContain('(sin tratamientos)')
    expect(k.catalogText).toContain('(ninguna activa)')
  })
})

describe('findTreatment', () => {
  const list: TreatmentEntry[] = [
    { id: 10, name: 'Masaje Mimosa Relax', category: 'Masajes', minutes: 60, price: 75, description: 'a', topPick: true },
    { id: 12, name: 'Liberador de Tensión', category: 'Masajes', minutes: 60, price: 80, description: 'b', topPick: false },
    { id: 20, name: 'Facial Hidratante', category: 'Faciales', minutes: 50, price: 70, description: 'c', topPick: false },
  ]

  it('normalizes accents and case', () => {
    expect(normalize('Liberador de Tensión')).toBe('liberador de tension')
    expect(findTreatment('liberador de tension', list).match?.id).toBe(12)
    expect(findTreatment('LIBERADOR DE TENSIÓN', list).match?.id).toBe(12)
  })

  it('matches on a partial name', () => {
    expect(findTreatment('mimosa relax', list).match?.id).toBe(10)
    expect(findTreatment('quiero el facial hidratante por favor', list).match?.id).toBe(20)
  })

  it('returns up to 3 suggestions when nothing matches', () => {
    const r = findTreatment('reflexología podal', list)
    expect(r.match).toBeNull()
    expect(r.similar.length).toBeLessThanOrEqual(3)
    expect(r.similar.length).toBeGreaterThan(0)
  })

  it('handles an empty query and an empty catalogue', () => {
    expect(findTreatment('', list).match).toBeNull()
    expect(findTreatment('masaje', []).match).toBeNull()
  })
})

describe('getKnowledge cache', () => {
  beforeEach(() => invalidateKnowledge())

  it('builds once and rebuilds after invalidation', async () => {
    const promotions = vi.fn(async () => [])
    const d = deps({ promotions }) as any
    await getKnowledge(d)
    await getKnowledge(d)
    expect(promotions).toHaveBeenCalledTimes(1)
    invalidateKnowledge()
    await getKnowledge(d)
    expect(promotions).toHaveBeenCalledTimes(2)
  })
})
