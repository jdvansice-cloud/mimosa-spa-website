// Single source of truth for public routes: feeds the sitemap and nav surfaces.

// Launch switches: flip to true when each area is ready to go public.
// Hiding removes nav entries + sitemap entries and redirects the pages.
export const FEATURES = {
  parejas: false,
  giftShop: false,
} as const

// Where the "Gift Cards" nav entries point. Flip to '/giftcards' when the
// online shop goes live (single-line change picked up by Header/Footer/tiles).
export const GIFT_CARDS_PATH = '/menu/giftcards'

export interface PublicRoute {
  /** Locale-relative path ('' = homepage) */
  path: string
  /** Include in sitemap.xml */
  sitemap: boolean
  /** Relative crawl priority */
  priority?: number
}

export const PUBLIC_ROUTES: PublicRoute[] = [
  { path: '', sitemap: true, priority: 1.0 },
  { path: '/menu', sitemap: true, priority: 0.9 },
  { path: '/menu/corporales', sitemap: true, priority: 0.9 },
  { path: '/menu/faciales', sitemap: true, priority: 0.9 },
  { path: '/menu/paquetes', sitemap: true, priority: 0.8 },
  { path: '/menu/membresia', sitemap: true, priority: 0.7 },
  { path: '/menu/giftcards', sitemap: true, priority: 0.8 },
  { path: '/promociones', sitemap: true, priority: 0.8 },
  { path: '/nosotros', sitemap: true, priority: 0.6 },
  { path: '/galeria', sitemap: true, priority: 0.5 },
  { path: '/reservar', sitemap: true, priority: 0.9 },
  { path: '/parejas', sitemap: FEATURES.parejas, priority: 0.9 },
  { path: '/empresas', sitemap: true, priority: 0.7 },
  { path: '/club-mimosa', sitemap: true, priority: 0.8 },
  { path: '/primera-visita', sitemap: true, priority: 0.8 },
  { path: '/referidos', sitemap: true, priority: 0.4 },
  { path: '/masajes-costa-del-este', sitemap: true, priority: 0.7 },
  { path: '/spa-san-francisco', sitemap: true, priority: 0.7 },
  { path: '/masaje-de-parejas-panama', sitemap: FEATURES.parejas, priority: 0.7 },
  { path: '/drenaje-linfatico-panama', sitemap: true, priority: 0.7 },
  { path: '/privacidad', sitemap: true, priority: 0.2 },
  { path: '/terminos', sitemap: true, priority: 0.2 },
  { path: '/politica-de-cancelacion', sitemap: true, priority: 0.2 },
]

export const LOCALES = ['es', 'en'] as const
export const DEFAULT_LOCALE = 'es'

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://www.mimosaretreat.com'
