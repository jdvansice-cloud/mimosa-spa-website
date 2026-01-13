'use client'

import { Check } from 'lucide-react'

interface StepProgressProps {
  currentStep: number
  totalSteps: number
}

const stepLabels: Record<number, string> = {
  1: 'Identificación',
  2: 'Ubicación',
  3: 'Servicios',
  4: 'Adicionales',
  5: 'Terapeuta',
  6: 'Fecha y Hora',
  7: 'Confirmar'
}

export function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  return (
    <div className="step-progress">
      {/* Desktop View */}
      <div className="hidden sm:flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  font-semibold text-sm transition-all duration-300
                  ${step < currentStep 
                    ? 'bg-gold text-dark' 
                    : step === currentStep 
                      ? 'bg-dark text-white ring-4 ring-gold/30' 
                      : 'bg-beige-200 text-warm-gray'
                  }
                `}
              >
                {step < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step
                )}
              </div>
              <span className={`
                mt-2 text-xs font-medium whitespace-nowrap
                ${step === currentStep ? 'text-dark' : 'text-warm-gray'}
              `}>
                {stepLabels[step]}
              </span>
            </div>
            
            {/* Connector Line */}
            {step < totalSteps && (
              <div className="w-full h-0.5 mx-2 flex-1 min-w-[20px]">
                <div
                  className={`h-full transition-all duration-500 ${
                    step < currentStep ? 'bg-gold' : 'bg-beige-200'
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Mobile View - Simplified */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-dark">
            Paso {currentStep} de {totalSteps}
          </span>
          <span className="text-sm text-warm-gray">
            {stepLabels[currentStep]}
          </span>
        </div>
        <div className="h-2 bg-beige-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gold transition-all duration-500 rounded-full"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
