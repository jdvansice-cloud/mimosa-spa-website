'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useBookingStore, selectCurrentStepNumber } from '@/lib/booking/store'
import { StepProgress } from './shared/StepProgress'
import { CartSummary } from './shared/CartSummary'
import { FloatingCart } from './shared/FloatingCart'
import { ClientSelector } from './shared/ClientSelector'
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
    selectedServices,
    selectedAddons,
    activePromotion,
    isCartOpen
  } = useBookingStore()
  
  const stepNumber = useBookingStore(selectCurrentStepNumber)
  
  // Has items in cart
  const hasCartItems = selectedServices.length > 0 || selectedAddons.length > 0 || activePromotion !== null
  
  // Show desktop cart sidebar when items exist AND cart is open
  const showDesktopCart = hasCartItems && isCartOpen && currentStep !== 'success'
  
  // Show floating cart on steps where user is selecting items
  const showFloatingCart = hasCartItems && 
    currentStep !== 'success' && 
    currentStep !== 'confirm' && 
    currentStep !== 'auth' && 
    currentStep !== 'location'
  
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
    <div className="booking-widget bg-white rounded-2xl shadow-elevated overflow-hidden relative">
      {/* Header with Progress */}
      {currentStep !== 'success' && (
        <div className="bg-gradient-to-r from-gold/10 to-gold/5 px-6 py-4 border-b border-beige-200">
          <div className="flex items-center justify-between">
            <StepProgress currentStep={stepNumber} totalSteps={7} />
            
            {/* Floating Cart - positioned in header on mobile */}
            {showFloatingCart && (
              <div className="lg:hidden">
                <FloatingCart />
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row max-h-[calc(100vh-200px)] lg:max-h-[calc(100vh-180px)]">
        {/* Step Content */}
        <div className={`flex-1 p-6 overflow-y-auto ${showDesktopCart ? 'lg:pr-4' : ''}`}>
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
        
        {/* Cart Sidebar - Desktop */}
        <AnimatePresence>
          {showDesktopCart && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="hidden lg:block border-l border-beige-200 bg-beige-50/50 p-4 overflow-hidden"
            >
              <CartSummary showCloseButton={true} />
            </motion.div>
          )}
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
    </div>
  )
}
