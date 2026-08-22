'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut, ExternalLink, User, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/layout/Logo'
import { useAuthStore } from '@/lib/auth/store'
import { NavItem, isItemActive, resolveNav } from './adminNav'

interface AdminSidebarProps {
  isLocationRestricted?: boolean
  locationName?: string | null
  isMobileManager?: boolean
  /** Mobile drawer state — ignored on lg+ where the sidebar is always visible. */
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
  const asideRef = useRef<HTMLElement>(null)

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
  const nav = useMemo(
    () => resolveNav({ isMobileManager: effectiveMM, isLocationRestricted }),
    [effectiveMM, isLocationRestricted],
  )

  // Which group the current route lives in. It isn't force-opened — the group
  // header goes gold instead, so you can see where you are without the menu
  // expanding itself on every load.
  const activeGroupId = useMemo(
    () => nav.groups.find(g => g.items.some(i => isItemActive(i.href, pathname)))?.id ?? null,
    [nav.groups, pathname],
  )

  // Every load starts with all sections collapsed, so the menu opens short
  // and you expand only what you need. Toggles last for the session.
  const [openGroups, setOpenGroups] = useState<string[]>([])

  const toggleGroup = useCallback((id: string) => {
    setOpenGroups(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id])
  }, [])

  const isGroupOpen = (id: string) => openGroups.includes(id)

  // The drawer stays mounted off-canvas on mobile, so it has to be taken out of
  // the tab order and the a11y tree while closed — otherwise tabbing from the
  // hamburger walks the whole hidden menu.
  const [isDesktop, setIsDesktop] = useState(true)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const sync = () => setIsDesktop(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  const hidden = !isDesktop && !isOpen

  // Move focus into the drawer when it opens so the keyboard follows the eye.
  useEffect(() => {
    if (isOpen && !isDesktop) {
      asideRef.current?.querySelector<HTMLElement>('a, button')?.focus()
    }
  }, [isOpen, isDesktop])

  // Keep Tab inside the open drawer.
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || hidden || isDesktop || !isOpen) return
    const focusable = asideRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    )
    if (!focusable?.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.replace('/admin/login')
  }

  const renderItem = (item: NavItem, indented: boolean) => {
    const Icon = item.icon
    const active = isItemActive(item.href, pathname)
    return (
      <li key={item.href}>
        <Link
          href={item.href}
          onClick={onClose}
          aria-current={active ? 'page' : undefined}
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-inset',
            indented ? 'pl-6' : '',
            active
              ? 'bg-gold text-dark font-semibold'
              : 'text-cream/80 hover:bg-cream/10 hover:text-cream',
          )}
        >
          <Icon className="h-5 w-5 shrink-0" />
          <span className="font-medium">{item.label}</span>
        </Link>
      </li>
    )
  }

  return (
    <aside
      ref={asideRef}
      onKeyDown={handleKeyDown}
      inert={hidden}
      aria-label="Navegación del panel"
      className={cn(
        'fixed left-0 top-0 bottom-0 z-40 w-64 bg-dark text-cream flex flex-col',
        'transform transition-transform duration-200 motion-reduce:transition-none',
        'lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      {/* Logo */}
      <div className="p-6 border-b border-cream/10">
        <Logo theme="dark" size="md" />
        <p className="text-xs text-cream/70 mt-3">
          {isLocationRestricted
            ? (locationName ? `Gift Cards · ${locationName}` : 'Gift Cards')
            : 'Panel de Administración'}
        </p>
      </div>

      {/* Navigation — scrolls when the menu is taller than the screen */}
      <nav className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4">
        <ul className="space-y-1">
          {nav.topItems.map(item => renderItem(item, false))}
          {nav.flatItems.map(item => renderItem(item, false))}
        </ul>

        {nav.groups.map(group => {
          const open = isGroupOpen(group.id)
          const isActiveGroup = group.id === activeGroupId
          return (
            <div key={group.id} className="mt-3">
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                aria-expanded={open}
                aria-controls={`navgroup-${group.id}`}
                className={cn(
                  'w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg',
                  'text-[10px] font-bold tracking-[0.14em] uppercase transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-inset',
                  isActiveGroup ? 'text-gold' : 'text-cream/60 hover:text-cream hover:bg-cream/5',
                )}
              >
                <span>{group.label}</span>
                <ChevronDown
                  className={cn(
                    'h-3.5 w-3.5 shrink-0 transition-transform motion-reduce:transition-none',
                    open ? 'rotate-180' : '',
                  )}
                />
              </button>
              {open && (
                <ul id={`navgroup-${group.id}`} className="space-y-1 mt-1">
                  {group.items.map(item => renderItem(item, true))}
                </ul>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-cream/10 space-y-2">
        {user && (
          <div className="flex items-center gap-3 px-4 py-2 text-cream/70">
            <User className="h-4 w-4 shrink-0" />
            <span className="text-sm truncate">{user.email}</span>
          </div>
        )}

        {!isLocationRestricted && (
          <Link
            href="/es"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-cream/80 hover:text-cream hover:bg-cream/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-inset"
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            <span className="text-sm">Ver Sitio</span>
          </Link>
        )}
        <button
          onClick={handleSignOut}
          disabled={isLoading}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-cream/80 hover:text-red-400 hover:bg-cream/10 transition-colors w-full disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-inset"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span className="text-sm">{isLoading ? 'Cerrando...' : 'Cerrar Sesión'}</span>
        </button>
      </div>
    </aside>
  )
}
