import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/** One treatment included in a promotion, named as the customer hears it. */
export interface PromoTreatment {
  id: number
  nombre: string
  minutos: number
}

/** A promotion as Camila offers it: Spanish keys, ready to hand to the model. */
export interface PromoSuggestion {
  id: string
  titulo: string
  precio: number
  precio_original: number | null
  minutos: number
  servicios: number[]
  /** The treatments the promo bundles, in the promo's own order. */
  incluye: PromoTreatment[]
  /** Sum of the included minutes; falls back to `duration_minutes` when unresolved. */
  duracion_total: number
  valido_hasta: string | null
}

export const MAX_PROMOS = 4

interface PromotionRow {
  id?: string | number | null
  title_es?: string | null
  title?: string | null
  price?: number | null
  original_price?: number | null
  duration_minutes?: number | null
  mindbody_service_ids?: number[] | null
  valid_until?: string | null
}

export function mapPromotion(row: PromotionRow): PromoSuggestion {
  const minutos = Number(row.duration_minutes ?? 0)
  return {
    id: row.id == null ? '' : String(row.id),
    titulo: row.title_es ?? row.title ?? '',
    precio: Number(row.price ?? 0),
    precio_original: row.original_price == null ? null : Number(row.original_price),
    minutos,
    servicios: (row.mindbody_service_ids ?? []).map(Number).filter(n => Number.isFinite(n)),
    incluye: [],
    duracion_total: minutos,
    valido_hasta: row.valid_until ?? null,
  }
}

/** Optional last resort for ids the CMS does not name: the live Mindbody catalogue. */
export type ServiceNameLookup = () => Promise<Array<{ id: number; name: string; minutes: number }>>

/**
 * Fills `incluye` / `duracion_total` on every promo from `treatment_settings`
 * (one `.in()` query for all promos), falling back to `lookup` for ids the CMS
 * does not carry. Mutates nothing: returns new objects.
 */
export async function resolvePromoTreatments(
  promos: PromoSuggestion[],
  client: SupabaseClient,
  lookup?: ServiceNameLookup,
): Promise<PromoSuggestion[]> {
  const ids = [...new Set(promos.flatMap(p => p.servicios))]
  if (!ids.length) return promos

  const byId = new Map<number, PromoTreatment>()
  const { data, error } = await client
    .from('treatment_settings')
    .select('mindbody_service_id, service_name, duration')
    .in('mindbody_service_id', ids)
  if (!error) {
    for (const row of (data ?? []) as Record<string, unknown>[]) {
      const id = Number(row.mindbody_service_id ?? 0)
      const nombre = String(row.service_name ?? '').trim()
      if (!id || !nombre || byId.has(id)) continue
      byId.set(id, { id, nombre, minutos: Number(row.duration ?? 0) })
    }
  }

  if (lookup && ids.some(id => !byId.has(id))) {
    const services = await lookup().catch(() => [])
    for (const s of services) {
      if (!byId.has(s.id) && ids.includes(s.id)) byId.set(s.id, { id: s.id, nombre: s.name, minutos: Number(s.minutes ?? 0) })
    }
  }

  return promos.map(p => {
    const incluye = p.servicios.map(id => byId.get(id)).filter((t): t is PromoTreatment => !!t)
    const suma = incluye.reduce((s, t) => s + t.minutos, 0)
    return { ...p, incluye, duracion_total: suma || p.minutos }
  })
}

/**
 * Active promotions for `today` (a Panamá YYYY-MM-DD), newest ordering first.
 * Read-only: unlike /api/promotions this never deactivates expired rows.
 */
export async function loadActivePromotions(
  today: string,
  sb?: SupabaseClient,
  lookup?: ServiceNameLookup,
): Promise<PromoSuggestion[]> {
  const client = sb ?? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data, error } = await client
    .from('promotions')
    .select('*')
    .eq('is_active', true)
    .gte('valid_until', today)
    .order('sort_order', { ascending: true })
  if (error) throw new Error(`loadActivePromotions: ${error.message}`)
  const promos = ((data ?? []) as PromotionRow[]).slice(0, MAX_PROMOS).map(mapPromotion)
  return resolvePromoTreatments(promos, client, lookup)
}
