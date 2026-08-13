import { createClient } from '@supabase/supabase-js'
import { unstable_cache } from 'next/cache'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const OFFERS_TAG = 'offers'

export interface MarketingOffer {
  id: string
  key: string
  page: string
  name_es: string
  name_en: string
  description_es: string | null
  description_en: string | null
  price: number | null
  price_note_es: string | null
  price_note_en: string | null
  includes_es: string[]
  includes_en: string[]
  whatsapp_text_es: string | null
  whatsapp_text_en: string | null
  image_key: string | null
  mindbody_service_id: number | null
  badge_es: string | null
  badge_en: string | null
  is_active: boolean
  sort_order: number
}

const getAllActiveOffers = unstable_cache(
  async (): Promise<MarketingOffer[]> => {
    try {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      const { data, error } = await supabase
        .from('marketing_offers')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
      if (error || !data) return []
      return data as MarketingOffer[]
    } catch {
      return []
    }
  },
  ['marketing-offers-active'],
  { tags: [OFFERS_TAG], revalidate: 3600 }
)

/** Active offers for one page ('parejas', 'club-mimosa', 'primera-visita', ...). */
export async function getOffersForPage(page: string): Promise<MarketingOffer[]> {
  const all = await getAllActiveOffers()
  return all.filter((o) => o.page === page)
}

/** One offer by its stable key (e.g. 'first_visit'). */
export async function getOfferByKey(key: string): Promise<MarketingOffer | null> {
  const all = await getAllActiveOffers()
  return all.find((o) => o.key === key) ?? null
}

/** Locale helpers */
export function offerName(o: MarketingOffer, locale: string) {
  return locale === 'en' ? o.name_en : o.name_es
}
export function offerDescription(o: MarketingOffer, locale: string) {
  return locale === 'en' ? o.description_en : o.description_es
}
export function offerIncludes(o: MarketingOffer, locale: string) {
  return locale === 'en' ? o.includes_en : o.includes_es
}
export function offerWhatsappText(o: MarketingOffer, locale: string) {
  return (locale === 'en' ? o.whatsapp_text_en : o.whatsapp_text_es) ?? undefined
}
export function offerBadge(o: MarketingOffer, locale: string) {
  return locale === 'en' ? o.badge_en : o.badge_es
}
