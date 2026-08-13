'use client'

import { Check, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'
import { useBookingStore } from '@/lib/booking/store'

interface StepProgressProps {
  currentStep: number
  totalSteps: number
}

const stepLabels: Record<number, string> = {
  1: 'Ubicación',
  2: 'Servicios',
  3: 'Adicionales',
  4: 'Fecha y Hora',
  5: 'Terapeuta',
  6: 'Tu Cuenta',
  7: 'Confirmar'
}

export function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  const { selectedServices, selectedAddons, toggleCart } = useBookingStore()
  const itemCount = selectedServices.length + selectedAddons.length
  
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
        
        {/* Cart Icon - After last step */}
        <div className="flex items-center ml-4">
          <div className="w-full h-0.5 mx-2 flex-1 min-w-[20px]">
            <div className="h-full bg-beige-200" />
          </div>
          <button
            onClick={toggleCart}
            className="relative flex flex-col items-center group"
            aria-label={`Carrito: ${itemCount} items`}
          >
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center
              transition-all duration-300 border-2
              ${itemCount > 0 
                ? 'bg-gold/10 border-gold text-gold hover:bg-gold/20' 
                : 'bg-beige-100 border-beige-200 text-warm-gray hover:border-gold/50'
              }
            `}>
              <ShoppingBag className="w-5 h-5" />
              
              {/* Item Count Badge */}
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-dark text-xs 
                           font-bold rounded-full flex items-center justify-center shadow-md"
                >
                  {itemCount}
                </motion.span>
              )}
            </div>
            <span className="mt-2 text-xs font-medium text-warm-gray group-hover:text-gold transition-colors">
              Carrito
            </span>
          </button>
        </div>
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
