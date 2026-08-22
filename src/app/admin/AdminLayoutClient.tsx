'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { AuthProvider, ProtectedRoute } from '@/components/auth'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { findActiveItem, resolveNav } from '@/components/admin/adminNav'

interface AdminLayoutClientProps {
  children: React.ReactNode
  isLocationRestricted?: boolean
  locationName?: string | null
  isMobileManager?: boolean
}

export function AdminLayoutClient({
  children,
  isLocationRestricted = false,
  locationName = null,
  isMobileManager = false,
}: AdminLayoutClientProps) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  // Close the drawer on navigation
  useEffect(() => { setMenuOpen(false) }, [pathname])

  // Escape closes the drawer and hands focus back to the button that opened it.
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  // Stop the page behind the drawer from scrolling under your finger.
  useEffect(() => {
    if (!menuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [menuOpen])

  // Name the current screen in the mobile bar — the page's own <h1> scrolls away.
  const activeLabel = useMemo(() => {
    const nav = resolveNav({ isMobileManager, isLocationRestricted })
    return findActiveItem(pathname, nav)?.item.label ?? null
  }, [pathname, isMobileManager, isLocationRestricted])

  return (
    <AuthProvider>
      <ProtectedRoute>
        {isLoginPage ? (
          // Login page - no sidebar
          children
        ) : (
          // Admin pages - drawer on mobile, fixed sidebar on desktop
          <div className="flex min-h-screen">
            {/* Mobile top bar */}
            <header className="lg:hidden fixed top-0 inset-x-0 z-30 h-14 flex items-center gap-3 bg-dark text-cream px-4">
              <button
                ref={menuButtonRef}
                onClick={() => setMenuOpen(true)}
                aria-label="Abrir menú"
                aria-expanded={menuOpen}
                className="p-2 -ml-2 rounded-lg hover:bg-cream/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <Menu className="h-6 w-6" />
              </button>
              <span className="font-display font-semibold text-lg tracking-wide truncate">
                {activeLabel ?? 'Mimosa Admin'}
              </span>
            </header>

            {/* Backdrop for the mobile drawer */}
            {menuOpen && (
              <div
                className="lg:hidden fixed inset-0 z-30 bg-black/50"
                onClick={() => setMenuOpen(false)}
                aria-hidden="true"
              />
            )}

            <AdminSidebar
              isLocationRestricted={isLocationRestricted}
              locationName={locationName}
              isMobileManager={isMobileManager}
              isOpen={menuOpen}
              onClose={() => setMenuOpen(false)}
            />

            {/* min-w-0 is load-bearing: as a flex child, `main` defaults to
                min-width:auto, so a wide table's min-content width stretches
                the whole page instead of scrolling inside its own container. */}
            <main className="flex-1 min-w-0 p-4 pt-[4.5rem] lg:p-8 lg:ml-64">
              {children}
            </main>
          </div>
        )}
      </ProtectedRoute>
    </AuthProvider>
  )
}
