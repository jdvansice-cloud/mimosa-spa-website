'use client'

import { usePathname } from 'next/navigation'
import { AuthProvider, ProtectedRoute } from '@/components/auth'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

interface AdminLayoutClientProps {
  children: React.ReactNode
}

export function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  return (
    <AuthProvider>
      <ProtectedRoute>
        {isLoginPage ? (
          // Login page - no sidebar
          children
        ) : (
          // Admin pages - with sidebar
          <div className="flex min-h-screen">
            <AdminSidebar />
            <main className="flex-1 p-8 ml-64">
              {children}
            </main>
          </div>
        )}
      </ProtectedRoute>
    </AuthProvider>
  )
}
