'use client'

import { useEffect, useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useBookingStore, selectCurrentStepNumber } from '@/lib/booking/store'
import { StepProgress } from './shared/StepProgress'
import { FloatingCart } from './shared/FloatingCart'
import { ClientSelector } from './shared/ClientSelector'
import { BookingNav } from './shared/BookingNav'
import { AuthStep } from './steps/AuthStep'
import { LocationStep } from './steps/LocationStep'
import { ServiceStep } from './steps/ServiceStep'
import { AddonsStep } from './steps/AddonsStep'
import { StaffStep } from './steps/StaffStep'
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
      case 'location':
        return <LocationStep key="location" />
      case 'services':
        return <ServiceStep key="services" />
      case 'addons':
        return <AddonsStep key="addons" />
      case 'staff':
        return <StaffStep key="staff" />
      case 'datetime':
        return <DateTimeStep key="datetime" />
      case 'confirm':
        return <ConfirmStep key="confirm" />
      case 'success':
        return <SuccessStep key="success" />
      default:
        return <AuthStep key="auth" />
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
            <StepProgress currentStep={stepNumber} totalSteps={7} />
          </div>
        </div>
      )}

      <div className="booking-widget bg-white rounded-2xl shadow-elevated overflow-hidden relative">
        {/* Header with Progress - Normal position */}
        {currentStep !== 'success' && (
          <div className="bg-gradient-to-r from-gold/10 to-gold/5 px-4 py-3 border-b border-beige-200">
            <StepProgress currentStep={stepNumber} totalSteps={7} />
          </div>
        )}

        {/* Main Content Area */}
        <div className="p-4 sm:p-6 min-h-[400px] max-h-[calc(100vh-280px)] overflow-y-auto">
          <AnimatePresence mode="wait" custom={stepNumber}>
            <motion.div
              key={currentStep}
              custom={stepNumber}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="h-full"
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

      {/* Floating Cart Overlay - triggered by cart icon in StepProgress */}
      <FloatingCart />

      {/* Fixed Bottom Navigation */}
      <BookingNav />
    </>
  )
}
