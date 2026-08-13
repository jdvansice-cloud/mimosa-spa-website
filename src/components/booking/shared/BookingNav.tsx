'use client'

import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from 'lucide-react'
import { useBookingStore, selectHasServices } from '@/lib/booking/store'

export function BookingNav() {
  const {
    currentStep,
    selectedLocation,
    selectedDate,
    selectedTime,
    nextStep,
    prevStep,
    isLoading,
  } = useBookingStore()

  const hasServices = useBookingStore(selectHasServices)

  // Don't show on auth step (first step) or success step (last step)
  if (currentStep === 'auth' || currentStep === 'success') {
    return null
  }

  // Determine if next/continue is enabled based on step requirements
  const canProceed = (): boolean => {
    switch (currentStep) {
      case 'services':
        return !!selectedLocation && hasServices
      case 'datetime':
        return !!selectedDate && !!selectedTime
      case 'confirm':
        return !isLoading
      default:
        return true
    }
  }

  const getButtonLabel = (): string => {
    return currentStep === 'confirm' ? 'Confirmar' : 'Continuar'
  }

  // Handle button click - for confirm step, trigger the hidden confirm button
  const handleNextClick = () => {
    // Leaving services: offer add-ons once via the carousel popup. The popup
    // itself advances the step (choose N or skip) and never re-prompts.
    if (currentStep === 'services') {
      const s = useBookingStore.getState()
      if (!s.addonsPromptDismissed && s.selectedAddons.length === 0) {
        s.openAddonsPrompt()
        return
      }
      nextStep()
      return
    }
    if (currentStep === 'confirm') {
      // Trigger the hidden confirm button in ConfirmStep
      const confirmBtn = document.getElementById('mobile-confirm-btn')
      if (confirmBtn) {
        confirmBtn.click()
      }
    } else {
      nextStep()
    }
  }

  const showNextButton = true
  // No previous screen before services
  const showBackButton = currentStep !== 'services'

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-beige-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
      <div className="max-w-4xl mx-auto px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between">
          {showBackButton ? (
            <button
              onClick={prevStep}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-warm-gray hover:text-dark transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-beige-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </button>
          ) : (
            <span />
          )}

          {showNextButton && (
            <button
              onClick={handleNextClick}
              disabled={!canProceed() || isLoading}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-gold text-dark text-sm font-semibold rounded-lg
                       hover:bg-gold/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Procesando...
                </>
              ) : currentStep === 'confirm' ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  {getButtonLabel()}
                </>
              ) : (
                <>
                  {getButtonLabel()}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
