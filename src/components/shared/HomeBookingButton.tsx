'use client'

import { useCallback, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { usePortalStore, selectIsAuthenticated } from '@/lib/portal/store'

interface HomeBookingButtonProps {
  locale: string
  children: ReactNode
  className?: string
  onClick?: () => void
}

/**
 * A booking button for homepage/header that checks login status.
 * Unlike BookingButton (for menu), this does NOT pre-select any service.
 *
 * - If logged in: navigates directly to /reservar
 * - If not logged in: redirects to login with redirect back to /reservar
 */
export function HomeBookingButton({ locale, children, className, onClick }: HomeBookingButtonProps) {
  const router = useRouter()
  const isAuthenticated = usePortalStore(selectIsAuthenticated)
  const mindbodyClientId = usePortalStore(state => state.mindbodyClientId)

  const handleClick = useCallback(() => {
    // Call optional onClick handler (e.g., close mobile menu)
    onClick?.()

    // Auth happens at the end of the flow now — everyone goes straight to
    // the widget and browses availability first.
    router.push(`/${locale}/reservar`)
  }, [isAuthenticated, mindbodyClientId, locale, router, onClick])

  return (
    <button
      onClick={handleClick}
      className={className}
    >
      {children}
    </button>
  )
}
