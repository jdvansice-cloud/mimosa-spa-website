'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'
import { useBookingStore } from '@/lib/booking/store'
import { BookingWidget } from './BookingWidget'
import { AnimatePresence, motion } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import type { MindbodyClient, PromotionWithServices } from '@/types/booking'

function BookingPageInner() {
  const searchParams = useSearchParams()
  const tBooking = useTranslations('booking')
  const tCommon = useTranslations('common')
  const currentStep = useBookingStore(state => state.currentStep)
  const clientInfo = useBookingStore(state => state.clientInfo)
  const setClientInfo = useBookingStore(state => state.setClientInfo)
  const setStep = useBookingStore(state => state.setStep)
  const loadPromotion = useBookingStore(state => state.loadPromotion)
  const addService = useBookingStore(state => state.addService)
  const setReplaceAppointmentId = useBookingStore(state => state.setReplaceAppointmentId)
  const replaceAppointmentId = useBookingStore(state => state.replaceAppointmentId)
  const setReplaceBookingDetails = useBookingStore(state => state.setReplaceBookingDetails)
  const setGlobalDiscount = useBookingStore(state => state.setGlobalDiscount)

  const [isInitializing, setIsInitializing] = useState(true)
  const initRef = useRef(false)

  // Check auth on mount and skip auth step if already logged in
  useEffect(() => {
    // Prevent double initialization in strict mode
    if (initRef.current) return
    initRef.current = true

    const checkAuthAndInitialize = async () => {
      // Capture ?replace=APPOINTMENT_ID for appointment replacement flow
      const replaceId = searchParams.get('replace')
      if (replaceId) {
        setReplaceAppointmentId(replaceId)
        fetch(`/api/booking/by-appointment?id=${replaceId}`)
          .then(res => res.ok ? res.json() : null)
          .then(data => { if (data?.booking) setReplaceBookingDetails(data.booking) })
          .catch(() => {})
      }

      // Deep-link preselection runs for EVERYONE — browsing no longer requires
      // an account (auth moved to the step before confirmation).
      const promotionId = searchParams.get('promotionId')
      const serviceId = searchParams.get('serviceId')
      if (promotionId) {
        try {
          const response = await fetch(`/api/promotions/${promotionId}/with-services`)
          if (response.ok) {
            const { data } = await response.json()
            if (data?.services?.length > 0) {
              loadPromotion(data as PromotionWithServices)
            }
          }
        } catch (err) {
          console.error('Error loading promotion:', err)
        }
      } else if (serviceId) {
        try {
          const response = await fetch('/api/mindbody/services?type=all&includeOffline=true')
          const data = await response.json()
          if (data.services) {
            const service = data.services.find((s: { Id: number }) => s.Id === parseInt(serviceId, 10))
            if (service) addService(service)
          }
        } catch (err) {
          console.error('Error loading service:', err)
        }
      }

      // Old persisted sessions may still sit on the retired auth-first step.
      if (currentStep === 'auth') {
        setStep('location')
      }

      // Show the widget now — everything below runs in the background.
      setIsInitializing(false)

      // Global online discount (non-blocking, non-critical)
      fetch('/api/admin/settings')
        .then(res => (res.ok ? res.json() : null))
        .then(body => {
          if (body?.data) {
            setGlobalDiscount(
              body.data.online_discount_percent ?? 0,
              body.data.online_discount_active ?? false
            )
          }
        })
        .catch(() => {})

      // Session restore: only hydrates clientInfo so the auth step later
      // auto-skips for returning clients. Never changes the current step.
      if (!clientInfo) {
        try {
          const { getClient } = await import('@/lib/supabase/client')
          const supabase = getClient()
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user) {
            let mindbodyClientId: number | null = null
            const urlClientId = searchParams.get('clientId')
            if (urlClientId && !isNaN(parseInt(urlClientId, 10))) {
              mindbodyClientId = parseInt(urlClientId, 10)
            }
            if (!mindbodyClientId) {
              try {
                const response = await fetch('/api/portal/client-id')
                if (response.ok) {
                  const data = await response.json()
                  if (data.clientId) mindbodyClientId = data.clientId
                }
              } catch (err) {
                console.error('Error fetching client ID:', err)
              }
            }
            if (!mindbodyClientId && session.user.user_metadata?.mindbody_client_id) {
              mindbodyClientId = session.user.user_metadata.mindbody_client_id
            }
            if (mindbodyClientId) {
              const response = await fetch(`/api/portal/profile?clientId=${mindbodyClientId}`)
              if (response.ok) {
                const data = await response.json()
                setClientInfo(data.client as MindbodyClient)
              }
            }
          }
        } catch (err) {
          console.error('Error checking auth:', err)
        }
      }
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
          <p className="text-warm-gray">{tCommon('loading')}</p>
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
                {tBooking('pageTitle')}
              </h1>
              <p className="text-sm text-warm-gray">{tBooking('pageSubtitle')}</p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Replacement banner */}
      {replaceAppointmentId && currentStep !== 'success' && (
        <div className="bg-blue-50 border-b border-blue-200 py-2.5 px-4">
          <div className="container-spa max-w-4xl flex items-center gap-2 text-sm text-blue-800">
            <RefreshCw className="w-4 h-4 flex-shrink-0" />
            <span>
              Estás modificando una cita existente. Selecciona nueva fecha y hora — la cita anterior se cancelará automáticamente al confirmar.
            </span>
          </div>
        </div>
      )}

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
  const tCommon = useTranslations('common')
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold mx-auto mb-4" />
        <p className="text-warm-gray">{tCommon('loading')}</p>
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
