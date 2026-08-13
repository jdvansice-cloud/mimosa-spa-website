import { createClient } from '@supabase/supabase-js'
import { unstable_cache } from 'next/cache'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const GIFTSHOP_TAG = 'giftshop'

export function giftshopAdminClient() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

export interface GcShopSettings {
  shop_enabled: boolean
  hero_banner_es: string | null
  hero_banner_en: string | null
  occasion_slug: string | null
  default_mindbody_location_id: number
  whatsapp_delivery_enabled: boolean
  notify_email: string | null
}

export interface GcCatalogItem {
  id: string
  kind: 'monetary' | 'experience'
  name_es: string
  name_en: string
  description_es: string | null
  description_en: string | null
  amount_cents: number
  treatment_names: string[]
  image_url: string | null
  default_design_slug: string
  mindbody_giftcard_id: number | null
  mindbody_layout_id: number | null
  badge_es: string | null
  badge_en: string | null
  sort_order: number
  is_active: boolean
}

const DEFAULT_SHOP_SETTINGS: GcShopSettings = {
  shop_enabled: false,
  hero_banner_es: null,
  hero_banner_en: null,
  occasion_slug: null,
  default_mindbody_location_id: 1,
  whatsapp_delivery_enabled: false,
  notify_email: null,
}

export const getShopSettings = unstable_cache(
  async (): Promise<GcShopSettings> => {
    try {
      const supabase = giftshopAdminClient()
      const { data } = await supabase
        .from('gc_shop_settings')
        .select('*')
        .eq('id', 1)
        .single()
      return data ? { ...DEFAULT_SHOP_SETTINGS, ...data } : DEFAULT_SHOP_SETTINGS
    } catch {
      return DEFAULT_SHOP_SETTINGS
    }
  },
  ['gc-shop-settings'],
  { tags: [GIFTSHOP_TAG], revalidate: 600 }
)

export const getActiveCatalog = unstable_cache(
  async (): Promise<GcCatalogItem[]> => {
    try {
      const supabase = giftshopAdminClient()
      const { data } = await supabase
        .from('gc_catalog_items')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
      return (data as GcCatalogItem[]) ?? []
    } catch {
      return []
    }
  },
  ['gc-catalog-active'],
  { tags: [GIFTSHOP_TAG], revalidate: 600 }
)

/** ITBMS on experience cards (monetary cards charge face value). */
export function itbmsCentsFor(item: Pick<GcCatalogItem, 'kind' | 'amount_cents'>): number {
  if (item.kind !== 'experience') return 0
  const rate = Number(process.env.NEXT_PUBLIC_ITBM_RATE || '0.07')
  return Math.round(item.amount_cents * rate)
}
