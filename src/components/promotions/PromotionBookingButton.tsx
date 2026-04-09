'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { usePortalStore, selectIsAuthenticated } from '@/lib/portal/store'
import { useBookingStore } from '@/lib/booking/store'
import type { Promotion } from '@/types'
import type { PromotionWithServices } from '@/types/booking'
import { Button } from '@/components/ui'

interface PromotionBookingButtonProps {
  promotion: Promotion
  locale: string
  label: string
  className?: string
}

export function PromotionBookingButton({ promotion, locale, label, className }: PromotionBookingButtonProps) {
  const router = useRouter()
  const isAuthenticated = usePortalStore(selectIsAuthenticated)
  const mindbodyClientId = usePortalStore(state => state.mindbodyClientId)
  const { loadPromotion, reset, setStep } = useBookingStore()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = useCallback(async () => {
    setIsLoading(true)

    try {
      // Fetch promotion with Mindbody services
      const response = await fetch(`/api/promotions/${promotion.id}/with-services`)

      if (!response.ok) {
        console.error('Failed to fetch promotion services')
        // Fallback: just navigate to booking page
        if (isAuthenticated && mindbodyClientId) {
          router.push(`/${locale}/reservar`)
        } else {
          const redirectUrl = encodeURIComponent(`/${locale}/reservar`)
          router.push(`/${locale}/portal/login?redirect=${redirectUrl}`)
        }
        return
      }

      const { data: promotionWithServices } = await response.json() as { data: PromotionWithServices }

      if (isAuthenticated && mindbodyClientId) {
        // User is logged in - reset booking state, load promotion, and go to location step
        reset()
        loadPromotion(promotionWithServices)
        // loadPromotion sets step to 'addons', but we need location first if services are loaded
        // The services are loaded from the promotion, so user needs to select location next
        setStep('location')
        router.push(`/${locale}/reservar?promotionId=${promotion.id}`)
      } else {
        // User is not logged in - store promotion ID in redirect and go to login
        const redirectUrl = encodeURIComponent(`/${locale}/reservar?promotionId=${promotion.id}`)
        router.push(`/${locale}/portal/login?redirect=${redirectUrl}`)
      }
    } catch (error) {
      console.error('Error loading promotion:', error)
      // Fallback: just navigate to booking page
      if (isAuthenticated && mindbodyClientId) {
        router.push(`/${locale}/reservar`)
      } else {
        const redirectUrl = encodeURIComponent(`/${locale}/reservar`)
        router.push(`/${locale}/portal/login?redirect=${redirectUrl}`)
      }
    } finally {
      setIsLoading(false)
    }
  }, [promotion.id, isAuthenticated, mindbodyClientId, locale, router, reset, loadPromotion, setStep])

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      className={className}
      size="sm"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          Cargando...
        </>
      ) : (
        label
      )}
    </Button>
  )
}
