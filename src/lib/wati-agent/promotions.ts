import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/** A promotion as Camila offers it: Spanish keys, ready to hand to the model. */
export interface PromoSuggestion {
  titulo: string
  precio: number
  precio_original: number | null
  minutos: number
  servicios: number[]
  valido_hasta: string | null
}

export const MAX_PROMOS = 4

interface PromotionRow {
  title_es?: string | null
  title?: string | null
  price?: number | null
  original_price?: number | null
  duration_minutes?: number | null
  mindbody_service_ids?: number[] | null
  valid_until?: string | null
}

export function mapPromotion(row: PromotionRow): PromoSuggestion {
  return {
    titulo: row.title_es ?? row.title ?? '',
    precio: Number(row.price ?? 0),
    precio_original: row.original_price == null ? null : Number(row.original_price),
    minutos: Number(row.duration_minutes ?? 0),
    servicios: (row.mindbody_service_ids ?? []).map(Number).filter(n => Number.isFinite(n)),
    valido_hasta: row.valid_until ?? null,
  }
}

/**
 * Active promotions for `today` (a Panamá YYYY-MM-DD), newest ordering first.
 * Read-only: unlike /api/promotions this never deactivates expired rows.
 */
export async function loadActivePromotions(today: string, sb?: SupabaseClient): Promise<PromoSuggestion[]> {
  const client = sb ?? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data, error } = await client
    .from('promotions')
    .select('*')
    .eq('is_active', true)
    .gte('valid_until', today)
    .order('sort_order', { ascending: true })
  if (error) throw new Error(`loadActivePromotions: ${error.message}`)
  return ((data ?? []) as PromotionRow[]).slice(0, MAX_PROMOS).map(mapPromotion)
}
