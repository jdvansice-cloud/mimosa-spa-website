'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/auth/store'
import { Spinner } from '@/components/ui'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading, isInitialized } = useAuthStore()

  useEffect(() => {
    if (isInitialized && !isLoading && !user && pathname !== '/admin/login') {
      router.replace('/admin/login')
    }
  }, [user, isLoading, isInitialized, router, pathname])

  // Show loading while initializing
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige-100">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-warm-gray">Cargando...</p>
        </div>
      </div>
    )
  }

  // If on login page, show it regardless of auth state
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // If not authenticated, show nothing (will redirect)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige-100">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-warm-gray">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  // Authenticated, show children
  return <>{children}</>
}
