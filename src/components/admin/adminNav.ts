import {
  LayoutDashboard,
  BarChart3,
  Receipt,
  CalendarDays,
  Users,
  Tag,
  BadgePercent,
  Image,
  ImagePlus,
  Settings,
  Sparkles,
  Gift,
  Award,
  Plus,
  List,
  Megaphone,
  BedDouble,
  MessageSquareQuote,
  ShoppingBag,
  Ticket,
  Clock,
  Building2,
} from 'lucide-react'

export interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  /** Hidden from mobile managers and location-restricted admins. */
  fullAdminOnly?: boolean
}

export interface NavGroup {
  id: string
  label: string
  items: NavItem[]
}

/** Entries that sit above the groups, ungrouped. */
export const TOP_ITEMS: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
]

export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'operacion',
    label: 'Operación',
    items: [
      { href: '/admin/kpis/agenda', label: 'Agenda', icon: CalendarDays },
      { href: '/admin/giftcards', label: 'Gift Cards', icon: Gift },
      { href: '/admin/resenas', label: 'Reseñas', icon: MessageSquareQuote },
    ],
  },
  {
    id: 'desempeno',
    label: 'Desempeño',
    items: [
      { href: '/admin/kpis', label: 'KPIs', icon: BarChart3 },
      { href: '/admin/kpis/ventas', label: 'Reporte de Ventas', icon: Receipt },
      { href: '/admin/kpis/staff', label: 'Staff', icon: Users },
      { href: '/admin/kpis/marketing', label: 'Marketing', icon: Megaphone },
      { href: '/admin/kpis/capacidad', label: 'Capacidad', icon: BedDouble },
      { href: '/admin/kpis/asistencia', label: 'Asistencia', icon: Clock },
      // Rent, planilla and accountant-packet figures — owner-level data.
      { href: '/admin/kpis/negocio', label: 'Negocio', icon: Building2, fullAdminOnly: true },
    ],
  },
  {
    id: 'catalogo',
    label: 'Catálogo',
    items: [
      { href: '/admin/tratamientos', label: 'Tratamientos', icon: Sparkles },
      { href: '/admin/promociones', label: 'Promociones', icon: Tag },
      { href: '/admin/ofertas', label: 'Ofertas y Precios', icon: BadgePercent },
      { href: '/admin/membresia', label: 'Membresía', icon: Award },
    ],
  },
  {
    id: 'sitio',
    label: 'Sitio web',
    items: [
      { href: '/admin/galeria', label: 'Galería', icon: Image },
      { href: '/admin/imagenes', label: 'Imágenes del Sitio', icon: ImagePlus },
    ],
  },
  {
    id: 'sistema',
    label: 'Sistema',
    items: [
      { href: '/admin/configuracion', label: 'Configuración', icon: Settings },
    ],
  },
]

/** Mobile managers get Agenda plus the whole performance group. */
const MOBILE_MANAGER_GROUPS = ['desempeno']
const MOBILE_MANAGER_EXTRA_HREFS = ['/admin/kpis/agenda']

/** Location-restricted gift card staff get a flat two-item menu. */
export const LOCATION_ADMIN_ITEMS: NavItem[] = [
  { href: '/admin/giftcards/issue', label: 'Emitir Gift Card', icon: Plus },
  { href: '/admin/giftcards/issued', label: 'Emitidas', icon: List },
]

export interface ResolvedNav {
  topItems: NavItem[]
  groups: NavGroup[]
  /** Flat items rendered without a group header (location-restricted admins). */
  flatItems: NavItem[]
}

export function resolveNav(
  { isMobileManager, isLocationRestricted }: { isMobileManager: boolean; isLocationRestricted: boolean },
): ResolvedNav {
  if (isLocationRestricted) {
    return { topItems: [], groups: [], flatItems: LOCATION_ADMIN_ITEMS }
  }

  if (isMobileManager) {
    const extras = NAV_GROUPS
      .flatMap(g => g.items)
      .filter(i => MOBILE_MANAGER_EXTRA_HREFS.includes(i.href))
    return {
      topItems: extras,
      groups: NAV_GROUPS
        .filter(g => MOBILE_MANAGER_GROUPS.includes(g.id))
        .map(g => ({ ...g, items: g.items.filter(i => !i.fullAdminOnly) })),
      flatItems: [],
    }
  }

  return { topItems: TOP_ITEMS, groups: NAV_GROUPS, flatItems: [] }
}

/**
 * Hub routes own their sub-pages, so an exact match would leave the sidebar
 * with nothing highlighted while you're inside one.
 */
export function isItemActive(href: string, pathname: string): boolean {
  // These have children that are separate nav entries of their own.
  if (href === '/admin' || href === '/admin/kpis') return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

/** The nav entry matching the current route, for the mobile header title. */
export function findActiveItem(pathname: string, nav: ResolvedNav): { item: NavItem; group?: NavGroup } | null {
  const all: Array<{ item: NavItem; group?: NavGroup }> = [
    ...nav.topItems.map(item => ({ item })),
    ...nav.flatItems.map(item => ({ item })),
    ...nav.groups.flatMap(group => group.items.map(item => ({ item, group }))),
  ]
  // Longest href first so /admin/kpis/ventas beats /admin/kpis.
  const sorted = [...all].sort((a, b) => b.item.href.length - a.item.href.length)
  const exact = sorted.find(({ item }) => isItemActive(item.href, pathname))
  if (exact) return exact

  // Pages that aren't nav entries of their own (e.g. /admin/kpis/diccionario)
  // still belong under their hub. The bare /admin is excluded — it prefixes
  // every admin route, so it would label unknown pages "Dashboard".
  return sorted.find(
    ({ item }) => item.href !== '/admin' && pathname.startsWith(`${item.href}/`),
  ) ?? null
}
