import { createClient } from '@supabase/supabase-js'
import { unstable_cache } from 'next/cache'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const REVIEWS_TAG = 'reviews'

export interface SiteReview {
  id: string
  kind: 'review' | 'press' | 'ugc'
  quote_es: string
  quote_en: string
  author_name: string
  rating: number
  source: string
  is_active: boolean
  sort_order: number
  location: 'cde' | 'sfc' | null
}

/** Active curated reviews, cached and revalidated from the admin CRUD. */
export const getActiveReviews = unstable_cache(
  async (): Promise<SiteReview[]> => {
    try {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      const { data, error } = await supabase
        .from('site_reviews')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
      if (error || !data) return []
      return data as SiteReview[]
    } catch {
      return []
    }
  },
  ['site-reviews-active'],
  { tags: [REVIEWS_TAG], revalidate: 3600 }
)
