'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useBookingStore } from '@/lib/booking/store'
import { BookingWidget } from './BookingWidget'
import { AnimatePresence, motion } from 'framer-motion'
import type { MindbodyClient, PromotionWithServices } from '@/types/booking'

function BookingPageInner() {
  const searchParams = useSearchParams()
  const currentStep = useBookingStore(state => state.currentStep)
  const clientInfo = useBookingStore(state => state.clientInfo)
  const setClientInfo = useBookingStore(state => state.setClientInfo)
  const setStep = useBookingStore(state => state.setStep)
  const loadPromotion = useBookingStore(state => state.loadPromotion)
  const addService = useBookingStore(state => state.addService)

  const [isInitializing, setIsInitializing] = useState(true)
  const initRef = useRef(false)

  // Check auth on mount and skip auth step if already logged in
  useEffect(() => {
    // Prevent double initialization in strict mode
    if (initRef.current) return
    initRef.current = true

    const checkAuthAndInitialize = async () => {
      // If we already have client info in the store, user is authenticated
      if (clientInfo) {
        // Handle URL params for pre-selected items
        const promotionId = searchParams.get('promotionId')
        const serviceId = searchParams.get('serviceId')

        if (promotionId) {
          try {
            const response = await fetch(`/api/promotions/${promotionId}/with-services`)
            if (response.ok) {
              const { data } = await response.json()
              if (data?.services?.length > 0) {
                loadPromotion(data as PromotionWithServices)
                setStep('location')
                setIsInitializing(false)
                return
              }
            }
          } catch (err) {
            console.error('Error loading promotion:', err)
          }
        }

        if (serviceId) {
          try {
            const response = await fetch('/api/mindbody/services?type=all&includeOffline=true')
            const data = await response.json()
            if (data.services) {
              const service = data.services.find((s: { Id: number }) => s.Id === parseInt(serviceId, 10))
              if (service) {
                addService(service)
                setStep('location')
                setIsInitializing(false)
                return
              }
            }
          } catch (err) {
            console.error('Error loading service:', err)
          }
        }

        // Already authenticated, skip to location
        if (currentStep === 'auth') {
          setStep('location')
        }
        setIsInitializing(false)
        return
      }

      // Check Supabase session
      try {
        const { getClient } = await import('@/lib/supabase/client')
        const supabase = getClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          // User has Supabase session, try to get Mindbody client
          let mindbodyClientId: number | null = null

          // Check URL for clientId (from magic link callback)
          const urlClientId = searchParams.get('clientId')
          if (urlClientId) {
            const parsed = parseInt(urlClientId, 10)
            if (!isNaN(parsed)) {
              mindbodyClientId = parsed
            }
          }

          // Fetch from profile if not in URL
          if (!mindbodyClientId) {
            try {
              const response = await fetch('/api/portal/client-id')
              if (response.ok) {
                const data = await response.json()
                if (data.clientId) {
                  mindbodyClientId = data.clientId
                }
              }
            } catch (err) {
              console.error('Error fetching client ID:', err)
            }
          }

          // Try user metadata
          if (!mindbodyClientId && session.user.user_metadata?.mindbody_client_id) {
            mindbodyClientId = session.user.user_metadata.mindbody_client_id
          }

          if (mindbodyClientId) {
            // Fetch client profile
            try {
              const response = await fetch(`/api/portal/profile?clientId=${mindbodyClientId}`)
              if (response.ok) {
                const data = await response.json()
                setClientInfo(data.client as MindbodyClient)

                // Handle pre-selected items
                const promotionId = searchParams.get('promotionId')
                const serviceId = searchParams.get('serviceId')

                if (promotionId) {
                  try {
                    const promoResponse = await fetch(`/api/promotions/${promotionId}/with-services`)
                    if (promoResponse.ok) {
                      const promoData = await promoResponse.json()
                      if (promoData.data?.services?.length > 0) {
                        loadPromotion(promoData.data as PromotionWithServices)
                        setStep('location')
                        setIsInitializing(false)
                        return
                      }
                    }
                  } catch (err) {
                    console.error('Error loading promotion:', err)
                  }
                }

                if (serviceId) {
                  try {
                    const servicesResponse = await fetch('/api/mindbody/services?type=all&includeOffline=true')
                    const servicesData = await servicesResponse.json()
                    if (servicesData.services) {
                      const service = servicesData.services.find((s: { Id: number }) => s.Id === parseInt(serviceId, 10))
                      if (service) {
                        addService(service)
                        setStep('location')
                        setIsInitializing(false)
                        return
                      }
                    }
                  } catch (err) {
                    console.error('Error loading service:', err)
                  }
                }

                // Skip to location step
                setStep('location')
                setIsInitializing(false)
                return
              }
            } catch (err) {
              console.error('Error fetching client profile:', err)
            }
          }
        }
      } catch (err) {
        console.error('Error checking auth:', err)
      }

      // Not authenticated or couldn't verify - show auth step
      setIsInitializing(false)
    }

    checkAuthAndInitialize()
  }, []) // Empty deps - only run once on mount

  // Show header only on auth step (before booking process starts)
  const showHeader = currentStep === 'auth' && !isInitializing

  // Show loading while checking auth
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold mx-auto mb-4" />
          <p className="text-warm-gray">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Page Header - Only shown before booking starts */}
      <AnimatePresence>
        {showHeader && (
          <motion.section
            initial={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="py-4 md:py-6 bg-beige text-center overflow-hidden"
          >
            <div className="container-spa">
              <h1 className="text-2xl md:text-3xl font-display font-semibold mb-1">
                Reservar Cita
              </h1>
              <p className="text-sm text-warm-gray">Agenda tu próxima visita</p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Booking Widget */}
      <section className="py-4 md:py-6">
        <div className="container-spa max-w-4xl">
          <BookingWidget />
        </div>
      </section>
    </div>
  )
}

// Loading fallback for Suspense
function BookingPageLoading() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold mx-auto mb-4" />
        <p className="text-warm-gray">Cargando...</p>
      </div>
    </div>
  )
}

// Export with Suspense wrapper for useSearchParams
export function BookingPageContent() {
  return (
    <Suspense fallback={<BookingPageLoading />}>
      <BookingPageInner />
    </Suspense>
  )
}
