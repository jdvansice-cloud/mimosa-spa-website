import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Default fallback images for each key
const DEFAULT_IMAGES: Record<string, string> = {
  // Menu banners
  menu_corporales_banner: '/Tratamientos Corporales.png',
  menu_corporales_deluxe_banner: '/Tratamientos Corporales Deluxe.png',
  menu_faciales_banner: '/Tratamientos Faciales.png',
  menu_paquetes_banner: '/Tratamientos en Paquetes.png',
  logo: '/logo.png',
  // Hero section
  hero_banner: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070',
  booking_cta_background: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=2070',
  // Featured categories
  category_body_treatments: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=800',
  category_facial_treatments: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800',
  category_packages: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=800',
  // Location cards
  location_costa_del_este: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800',
  location_san_francisco: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=800',
  // About page
  about_image_1: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600',
  about_image_2: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=600',
  // Promotions fallback
  promotion_default: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800',
}

/**
 * Get a site image URL by key (server-side)
 * Falls back to default if not found in database
 */
export async function getSiteImage(key: string): Promise<string> {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('site_images')
      .select('image_url')
      .eq('key', key)
      .eq('is_active', true)
      .single()

    if (error || !data) {
      return DEFAULT_IMAGES[key] || ''
    }

    return data.image_url
  } catch {
    return DEFAULT_IMAGES[key] || ''
  }
}

/**
 * Get multiple site images by keys (server-side)
 * Returns a map of key -> image_url
 */
export async function getSiteImages(keys: string[]): Promise<Record<string, string>> {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('site_images')
      .select('key, image_url')
      .in('key', keys)
      .eq('is_active', true)

    const result: Record<string, string> = {}

    // Start with defaults
    for (const key of keys) {
      result[key] = DEFAULT_IMAGES[key] || ''
    }

    // Override with database values
    if (!error && data) {
      for (const img of data) {
        result[img.key] = img.image_url
      }
    }

    return result
  } catch {
    // Return defaults on error
    const result: Record<string, string> = {}
    for (const key of keys) {
      result[key] = DEFAULT_IMAGES[key] || ''
    }
    return result
  }
}
