'use client'

import { Check, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'
import { useBookingStore } from '@/lib/booking/store'

interface StepProgressProps {
  currentStep: number
  totalSteps: number
}

const stepLabels: Record<number, string> = {
  1: 'Servicios',
  2: 'Fecha y Hora',
  3: 'Tu Cuenta',
  4: 'Confirmar'
}

export function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  const { selectedServices, selectedAddons, toggleCart } = useBookingStore()
  const itemCount = selectedServices.length + selectedAddons.length
  
  return (
    <div className="step-progress">
      {/* Desktop View — compact centered cluster, cart pinned right */}
      <div className="hidden sm:flex items-center relative">
        <div className="flex-1 flex items-center justify-center">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    font-semibold text-xs transition-all duration-300
                    ${step < currentStep
                      ? 'bg-gold text-dark'
                      : step === currentStep
                        ? 'bg-dark text-white ring-[3px] ring-gold/30'
                        : 'bg-beige-200 text-warm-gray'
                    }
                  `}
                >
                  {step < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step
                  )}
                </div>
                <span className={`
                  mt-1 text-[11px] font-medium whitespace-nowrap
                  ${step === currentStep ? 'text-dark' : 'text-warm-gray'}
                `}>
                  {stepLabels[step]}
                </span>
              </div>

              {/* Short fixed connector keeps the cluster tight on wide screens */}
              {step < totalSteps && (
                <div
                  className={`w-10 h-px mx-2 mb-4 transition-all duration-500 ${
                    step < currentStep ? 'bg-gold' : 'bg-beige-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Cart pinned to the right edge */}
        <button
          onClick={toggleCart}
          className="absolute right-0 top-1/2 -translate-y-1/2 group"
          aria-label={`Carrito: ${itemCount} items`}
        >
          <div className={`
            relative w-10 h-10 rounded-xl flex items-center justify-center
            transition-all duration-300 border-2
            ${itemCount > 0
              ? 'bg-gold/10 border-gold text-gold hover:bg-gold/20'
              : 'bg-beige-100 border-beige-200 text-warm-gray hover:border-gold/50'
            }
          `}>
            <ShoppingBag className="w-4 h-4" />
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gold text-dark text-xs
                         font-bold rounded-full flex items-center justify-center shadow-md"
              >
                {itemCount}
              </motion.span>
            )}
          </div>
        </button>
      </div>
      
      {/* Mobile View - Simplified with Cart */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-dark">
            Paso {currentStep} de {totalSteps}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-sm text-warm-gray">
              {stepLabels[currentStep]}
            </span>
            {/* Mobile Cart Button */}
            <button
              onClick={toggleCart}
              className={`
                relative p-2 rounded-lg transition-all
                ${itemCount > 0 
                  ? 'bg-gold/10 text-gold' 
                  : 'bg-beige-100 text-warm-gray'
                }
              `}
              aria-label={`Carrito: ${itemCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-dark text-[10px] 
                           font-bold rounded-full flex items-center justify-center"
                >
                  {itemCount}
                </motion.span>
              )}
            </button>
          </div>
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
