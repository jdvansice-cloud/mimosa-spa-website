'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { AuthProvider, ProtectedRoute } from '@/components/auth'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

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

  // Close the drawer on navigation
  useEffect(() => { setMenuOpen(false) }, [pathname])

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
                onClick={() => setMenuOpen(true)}
                aria-label="Abrir menú"
                aria-expanded={menuOpen}
                className="p-2 -ml-2 rounded-lg hover:bg-cream/10"
              >
                <Menu className="h-6 w-6" />
              </button>
              <span className="font-display font-semibold text-lg tracking-wide">Mimosa Admin</span>
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

            <main className="flex-1 p-4 pt-[4.5rem] lg:p-8 lg:ml-64">
              {children}
            </main>
          </div>
        )}
      </ProtectedRoute>
    </AuthProvider>
  )
}
