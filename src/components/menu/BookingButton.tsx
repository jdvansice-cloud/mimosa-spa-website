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
    // Auth happens at the end of the flow now — pre-select the service and
    // go straight to the widget for everyone.
    reset()
    addService(service)
    setStep('location')
    router.push(`/${locale}/reservar?serviceId=${service.Id}`)
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
