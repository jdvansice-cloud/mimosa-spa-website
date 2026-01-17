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

    if (isAuthenticated && mindbodyClientId) {
      // User is logged in - go directly to booking
      router.push(`/${locale}/reservar`)
    } else {
      // User is not logged in - redirect to login with redirect back to booking
      const redirectUrl = encodeURIComponent(`/${locale}/reservar`)
      router.push(`/${locale}/portal/login?redirect=${redirectUrl}`)
    }
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
