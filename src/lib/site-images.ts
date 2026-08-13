import { createClient } from '@supabase/supabase-js'
import { unstable_cache } from 'next/cache'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export { DEFAULT_IMAGES } from './default-images'
import { DEFAULT_IMAGES } from './default-images'


export const SITE_IMAGES_TAG = 'site-images'

// Cached fetch of ALL active site images + their variants. One tagged cache
// entry keeps revalidation simple: any admin image change revalidates it.
const getAllSiteImages = unstable_cache(
  async (): Promise<Record<string, string[]>> => {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const [{ data: base }, variantsRes] = await Promise.all([
      supabase.from('site_images').select('key, image_url').eq('is_active', true),
      supabase
        .from('site_image_variants')
        .select('image_key, image_url')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
    ])

    const result: Record<string, string[]> = {}
    for (const img of base ?? []) {
      result[img.key] = [img.image_url]
    }
    // Variants table may not exist yet (pre-migration) → error is ignored.
    for (const v of variantsRes.data ?? []) {
      ;(result[v.image_key] ??= []).push(v.image_url)
    }
    return result
  },
  ['site-images-all-v2'],
  { tags: [SITE_IMAGES_TAG], revalidate: 3600 }
)

// Deterministic daily rotation: each key advances through its pool on its own
// day offset, so the whole site doesn't swap at once. ISR (1h) republishes
// pages, so the change appears without extra client work.
function pickDaily(key: string, pool: string[]): string {
  if (pool.length <= 1) return pool[0] ?? ''
  const day = Math.floor(Date.now() / 86_400_000)
  let hash = 0
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  return pool[(day + hash) % pool.length]
}

/**
 * Get a site image URL by key (server-side).
 * Falls back to default if not found in database.
 */
export async function getSiteImage(key: string): Promise<string> {
  try {
    const all = await getAllSiteImages()
    const pool = all[key]
    if (pool && pool.length > 0) return pickDaily(key, pool)
    return DEFAULT_IMAGES[key] || ''
  } catch {
    return DEFAULT_IMAGES[key] || ''
  }
}

/**
 * Get multiple site images by keys (server-side).
 * Returns a map of key -> image_url.
 */
export async function getSiteImages(keys: string[]): Promise<Record<string, string>> {
  let all: Record<string, string[]> = {}
  try {
    all = await getAllSiteImages()
  } catch {
    // fall through to defaults
  }
  const result: Record<string, string> = {}
  for (const key of keys) {
    const pool = all[key]
    result[key] =
      pool && pool.length > 0 ? pickDaily(key, pool) : DEFAULT_IMAGES[key] || ''
  }
  return result
}
