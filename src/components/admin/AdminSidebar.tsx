'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  BarChart3,
  Receipt,
  CalendarDays,
  Users,
  Tag,
  Image,
  ImagePlus,
  Settings,
  LogOut,
  ExternalLink,
  User,
  Sparkles,
  Gift,
  Award,
  Plus,
  List,
  Megaphone,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/layout/Logo'
import { useAuthStore } from '@/lib/auth/store'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  section?: string
}

const fullNavItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  // Mobile Manager section
  { href: '/admin/kpis', label: 'KPIs', icon: BarChart3, section: 'Mobile Manager' },
  { href: '/admin/kpis/ventas', label: 'Reporte de Ventas', icon: Receipt, section: 'Mobile Manager' },
  { href: '/admin/kpis/agenda', label: 'Agenda', icon: CalendarDays, section: 'Mobile Manager' },
  { href: '/admin/kpis/staff', label: 'Staff', icon: Users, section: 'Mobile Manager' },
  { href: '/admin/kpis/marketing', label: 'Marketing', icon: Megaphone, section: 'Mobile Manager' },
  { href: '/admin/tratamientos', label: 'Tratamientos', icon: Sparkles },
  { href: '/admin/promociones', label: 'Promociones', icon: Tag },
  { href: '/admin/giftcards', label: 'Gift Cards', icon: Gift },
  { href: '/admin/membresia', label: 'Membresía', icon: Award },
  { href: '/admin/galeria', label: 'Galería', icon: Image },
  { href: '/admin/imagenes', label: 'Imágenes del Sitio', icon: ImagePlus },
  { href: '/admin/configuracion', label: 'Configuración', icon: Settings },
]

// Limited nav for location-restricted admins.
const locationAdminNavItems: NavItem[] = [
  { href: '/admin/giftcards/issue', label: 'Emitir Gift Card', icon: Plus },
  { href: '/admin/giftcards/issued', label: 'Emitidas', icon: List },
]

interface AdminSidebarProps {
  isLocationRestricted?: boolean
  locationName?: string | null
  isMobileManager?: boolean
  /** Mobile drawer state — ignored on md+ where the sidebar is always visible. */
  isOpen?: boolean
  onClose?: () => void
}

export function AdminSidebar({
  isLocationRestricted = false,
  locationName = null,
  isMobileManager = false,
  isOpen = false,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut, isLoading } = useAuthStore()

  // Safety net: the server layout may have rendered before the session
  // existed (e.g. right after login), so verify the role client-side too.
  const [clientMM, setClientMM] = useState<boolean | null>(null)
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { getClient } = await import('@/lib/supabase/client')
        const supabase = getClient()
        const { data: { user: u } } = await supabase.auth.getUser()
        if (!u) return
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', u.id)
          .single() as { data: { role: string } | null }
        if (!cancelled && data) setClientMM(data.role === 'mobile_manager')
      } catch { /* keep the server-resolved value */ }
    })()
    return () => { cancelled = true }
  }, [user?.id])

  const effectiveMM = clientMM ?? isMobileManager
  const navItems = effectiveMM
    ? fullNavItems.filter(item => item.section === 'Mobile Manager')
    : isLocationRestricted
      ? locationAdminNavItems
      : fullNavItems

  const isActive = (href: string) => {
    // Exact-match hubs so sub-pages don't light up the parent entry too
    if (href === '/admin' || href === '/admin/kpis') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const handleSignOut = async () => {
    await signOut()
    router.replace('/admin/login')
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 bottom-0 z-40 w-64 bg-dark text-cream flex flex-col',
        'transform transition-transform duration-200 motion-reduce:transition-none',
        'lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      {/* Logo */}
      <div className="p-6 border-b border-cream/10">
        <Logo theme="dark" size="md" />
        <p className="text-xs text-cream/50 mt-3">
          {isLocationRestricted
            ? (locationName ? `Gift Cards · ${locationName}` : 'Gift Cards')
            : 'Panel de Administración'}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item, i) => {
          const Icon = item.icon
          const active = isActive(item.href)
          const section = item.section
          const prevSection = navItems[i - 1]?.section
          const startsSection = section && section !== prevSection
          const endsSection = !section && prevSection

          return (
            <div key={item.href}>
              {startsSection && (
                <p className="px-4 pt-4 pb-1 text-[10px] font-bold tracking-[0.14em] uppercase text-gold/80">
                  {section}
                </p>
              )}
              {endsSection && <div className="h-3" />}
            <Link
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                section ? 'pl-6' : '',
                active
                  ? 'bg-gold text-dark'
                  : 'text-cream/70 hover:bg-cream/10 hover:text-cream'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-cream/10 space-y-2">
        {user && (
          <div className="flex items-center gap-3 px-4 py-2 text-cream/70">
            <User className="h-4 w-4" />
            <span className="text-sm truncate">{user.email}</span>
          </div>
        )}

        {!isLocationRestricted && (
          <Link
            href="/es"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2 text-cream/70 hover:text-cream transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="text-sm">Ver Sitio</span>
          </Link>
        )}
        <button
          onClick={handleSignOut}
          disabled={isLoading}
          className="flex items-center gap-3 px-4 py-2 text-cream/70 hover:text-red-400 transition-colors w-full disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm">{isLoading ? 'Cerrando...' : 'Cerrar Sesión'}</span>
        </button>
      </div>
    </aside>
  )
}
