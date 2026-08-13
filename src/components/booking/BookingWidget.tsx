'use client'

import { useEffect, useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useBookingStore, selectCurrentStepNumber } from '@/lib/booking/store'
import { track } from '@/lib/track'
import { StepProgress } from './shared/StepProgress'
import { FloatingCart } from './shared/FloatingCart'
import { ClientSelector } from './shared/ClientSelector'
import { BookingNav } from './shared/BookingNav'
import { AddonsPrompt } from './shared/AddonsPrompt'
import { AuthStep } from './steps/AuthStep'
import { ServiceStep } from './steps/ServiceStep'
import { DateTimeStep } from './steps/DateTimeStep'
import { ConfirmStep } from './steps/ConfirmStep'
import { SuccessStep } from './steps/SuccessStep'

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0
  })
}

export function BookingWidget() {
  const {
    currentStep,
    showClientSelector,
    availableClients,
    selectClient,
    showClientSelectorModal,
  } = useBookingStore()

  const stepNumber = useBookingStore(selectCurrentStepNumber)
  const [isSticky, setIsSticky] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Booking funnel: one first-party event per step reached (dedup per session
  // handled at query time via distinct session_id).
  const selectedLocation = useBookingStore(state => state.selectedLocation)
  const selectedServices = useBookingStore(state => state.selectedServices)
  const trackedSteps = useRef(new Set<string>())
  useEffect(() => {
    // Funnel top: fired once per widget mount, whatever the entry step is
    // (authenticated users skip the auth step, so booking_step_auth alone
    // undercounts starts and inflates conversion).
    if (!trackedSteps.current.has('__start')) {
      trackedSteps.current.add('__start')
      track('booking_start', { locationId: selectedLocation?.Id })
    }
    if (trackedSteps.current.has(currentStep)) return
    trackedSteps.current.add(currentStep)
    const event = currentStep === 'success' ? 'booking_completed' : `booking_step_${currentStep}`
    track(event, {
      locationId: selectedLocation?.Id,
      meta: {
        services: selectedServices.map(s => s.Name).slice(0, 5),
        service_count: selectedServices.length,
      },
    })
  }, [currentStep, selectedLocation, selectedServices])

  // Intersection Observer for sticky header
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting)
      },
      { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  const renderStep = () => {
    switch (currentStep) {
      case 'auth':
        return <AuthStep key="auth" />
      case 'datetime':
        return <DateTimeStep key="datetime" />
      case 'confirm':
        return <ConfirmStep key="confirm" />
      case 'success':
        return <SuccessStep key="success" />
      default:
        // 'services' plus normalized legacy names
        return <ServiceStep key="services" />
    }
  }

  return (
    <>
      {/* Sentinel for detecting scroll */}
      <div ref={sentinelRef} className="h-0" />

      {/* Sticky Steps Bar - Fixed below header when scrolling */}
      {currentStep !== 'success' && isSticky && (
        <div className="fixed top-20 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm shadow-md border-b border-beige-200">
          <div className="container-spa max-w-4xl px-4 py-2">
            <StepProgress currentStep={stepNumber} totalSteps={4} />
          </div>
        </div>
      )}

      <div className="booking-widget bg-white rounded-2xl shadow-elevated overflow-hidden relative">
        {/* Header with Progress - Normal position */}
        {currentStep !== 'success' && (
          <div className="bg-gradient-to-r from-gold/10 to-gold/5 px-4 py-3 border-b border-beige-200">
            <StepProgress currentStep={stepNumber} totalSteps={4} />
          </div>
        )}

        {/* Main Content Area - Fixed height container that fills to bottom nav */}
        <div className="p-4 sm:p-6 h-[calc(100vh-200px)] sm:h-[calc(100vh-220px)] flex flex-col">
          <AnimatePresence mode="wait" custom={stepNumber}>
            <motion.div
              key={currentStep}
              custom={stepNumber}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex-1 min-h-0 overflow-y-auto"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Client Selector Modal */}
        {showClientSelector && (
          <ClientSelector
            clients={availableClients}
            onSelect={selectClient}
            onCancel={() => showClientSelectorModal(false)}
          />
        )}

        {/* Bottom padding to account for fixed nav */}
        {currentStep !== 'auth' && currentStep !== 'success' && (
          <div className="h-20" />
        )}
      </div>

      {/* Add-ons carousel popup (shown when leaving the services step) */}
      <AddonsPrompt />

      {/* Floating Cart Overlay - triggered by cart icon in StepProgress */}
      <FloatingCart />

      {/* Fixed Bottom Navigation */}
      <BookingNav />
    </>
  )
}
