// Client-safe fallback image map shared by server lib and client components.
// Single source of truth for per-key fallbacks.
export const DEFAULT_IMAGES: Record<string, string> = {
  // Menu banners
  menu_corporales_banner: '/placeholders/banner.jpg',
  menu_corporales_deluxe_banner: '/placeholders/banner.jpg',
  menu_faciales_banner: '/placeholders/banner.jpg',
  menu_paquetes_banner: '/placeholders/banner.jpg',
  logo: '/logo.png',
  // Hero section
  hero_banner: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070',
  booking_cta_background: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=2070',
  // Featured categories
  category_body_treatments: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=800',
  category_facial_treatments: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800',
  category_packages: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=800',
  category_giftcards: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800',
  category_membership: 'https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=800',
  category_promotions: 'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?q=80&w=800',
  category_parejas: 'https://images.unsplash.com/photo-1591343395902-1adcb454c4e2?q=80&w=800',
  // Location cards
  location_costa_del_este: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800',
  location_san_francisco: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=800',
  // About page
  about_image_1: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600',
  about_image_2: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=600',
  // Promotions fallback
  promotion_default: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800',
  // FY27 marketing pages (replaced by real photography via /admin/imagenes)
  parejas_banner: 'https://images.unsplash.com/photo-1591343395902-1adcb454c4e2?q=80&w=1900',
  parejas_ritual: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=800',
  parejas_escape: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=800',
  parejas_aniversario: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800',
  empresas_banner: 'https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=1900',
  club_banner: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1900',
  primera_visita_banner: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=1900',
  giftcards_banner: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1900',
}
