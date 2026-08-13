import { createClient } from '@supabase/supabase-js'
import { unstable_cache } from 'next/cache'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const SETTINGS_TAG = 'settings'

export interface ServerSiteSettings {
  phone_costa_del_este: string
  phone_san_francisco: string
  email: string
  whatsapp_number: string
  whatsapp_message: string
  weekday_open: string
  weekday_close: string
  weekend_open: string
  weekend_close: string
  instagram_url: string
  facebook_url: string
  google_rating: number
  google_review_count: number
  google_reviews_url: string
  google_rating_cde: number | null
  google_review_count_cde: number | null
  google_reviews_url_cde: string | null
  google_rating_sfc: number | null
  google_review_count_sfc: number | null
  google_reviews_url_sfc: string | null
}

export interface LocationRating {
  rating: number
  count: number
  url: string
}

export interface AggregateRatingInfo {
  rating: number
  count: number
  url: string
  cde: LocationRating | null
  sfc: LocationRating | null
}

/**
 * Combined Google rating across both locations: total review count and the
 * review-count-weighted average rating. Falls back to the legacy single
 * fields when per-location values are absent.
 */
export function aggregateRating(s: ServerSiteSettings): AggregateRatingInfo {
  const cde =
    s.google_rating_cde && s.google_review_count_cde
      ? {
          rating: Number(s.google_rating_cde),
          count: Number(s.google_review_count_cde),
          url: s.google_reviews_url_cde || '',
        }
      : null
  const sfc =
    s.google_rating_sfc && s.google_review_count_sfc
      ? {
          rating: Number(s.google_rating_sfc),
          count: Number(s.google_review_count_sfc),
          url: s.google_reviews_url_sfc || '',
        }
      : null

  const parts = [cde, sfc].filter(Boolean) as LocationRating[]
  if (parts.length === 0) {
    return {
      rating: Number(s.google_rating) || 0,
      count: Number(s.google_review_count) || 0,
      url: s.google_reviews_url || '',
      cde: null,
      sfc: null,
    }
  }
  const count = parts.reduce((sum, p) => sum + p.count, 0)
  const weighted = parts.reduce((sum, p) => sum + p.rating * p.count, 0) / (count || 1)
  // One decimal, never overstating (4.85 → 4.8)
  const rating = Math.floor(weighted * 10) / 10
  return { rating, count, url: cde?.url || sfc?.url || s.google_reviews_url || '', cde, sfc }
}

export const DEFAULT_SETTINGS: ServerSiteSettings = {
  phone_costa_del_este: '398-5295',
  phone_san_francisco: '398-5295',
  email: 'info@mimosaretreat.com',
  whatsapp_number: '50764049464',
  whatsapp_message: 'Hola, me gustaría obtener información sobre sus servicios.',
  weekday_open: '09:00',
  weekday_close: '20:00',
  weekend_open: '09:00',
  weekend_close: '18:00',
  instagram_url: 'https://instagram.com/mimosaretreat',
  facebook_url: 'https://facebook.com/mimosaretreat',
  google_rating: 4.8,
  google_review_count: 96,
  google_reviews_url: '',
  google_rating_cde: null,
  google_review_count_cde: null,
  google_reviews_url_cde: null,
  google_rating_sfc: null,
  google_review_count_sfc: null,
  google_reviews_url_sfc: null,
}

/**
 * Server-side cached read of the single site_settings row.
 * Revalidated via revalidateTag(SETTINGS_TAG) from the admin settings PUT.
 */
export const getServerSettings = unstable_cache(
  async (): Promise<ServerSiteSettings> => {
    try {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)

      if (error || !data || data.length === 0) return DEFAULT_SETTINGS
      return { ...DEFAULT_SETTINGS, ...data[0] }
    } catch {
      return DEFAULT_SETTINGS
    }
  },
  ['site-settings'],
  { tags: [SETTINGS_TAG], revalidate: 3600 }
)
