'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePortalStore, selectIsAuthenticated } from '@/lib/portal/store'
import { useBookingStore } from '@/lib/booking/store'
import type { MindbodyService } from '@/types/booking'

interface BookingButtonProps {
  service: MindbodyService
  locale: string
  label: string
  className?: string
}

export function BookingButton({ service, locale, label, className }: BookingButtonProps) {
  const router = useRouter()
  const isAuthenticated = usePortalStore(selectIsAuthenticated)
  const mindbodyClientId = usePortalStore(state => state.mindbodyClientId)
  const { addService, setStep, reset } = useBookingStore()

  const handleClick = useCallback(() => {
    if (isAuthenticated && mindbodyClientId) {
      // User is logged in - reset booking state, pre-select service, and go to location step
      reset()
      addService(service)
      setStep('location')
      // Navigate to booking page (AuthStep will auto-skip since user is already authenticated)
      router.push(`/${locale}/reservar?serviceId=${service.Id}`)
    } else {
      // User is not logged in - redirect to login with redirect back to booking with service
      const redirectUrl = encodeURIComponent(`/${locale}/reservar?serviceId=${service.Id}`)
      router.push(`/${locale}/portal/login?redirect=${redirectUrl}`)
    }
  }, [isAuthenticated, mindbodyClientId, service, locale, router, addService, setStep, reset])

  return (
    <button
      onClick={handleClick}
      className={className}
    >
      {label}
    </button>
  )
}
