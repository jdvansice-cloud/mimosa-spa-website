'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { ShoppingBag, X, Trash2, Clock, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBookingStore } from '@/lib/booking/store'

// Tax rate constant
const ITBM_RATE = 0.07

export function FloatingCart() {
  const [isOpen, setIsOpen] = useState(false)
  const cartRef = useRef<HTMLDivElement>(null)
  
  const {
    selectedServices,
    selectedAddons,
    removeService,
    removeAddon,
    activePromotion,
  } = useBookingStore()
  
  const itemCount = selectedServices.length + selectedAddons.length
  
  // Calculate pricing with useMemo - no state updates during render
  const pricing = useMemo(() => {
    const servicesSubtotal = selectedServices.reduce((sum, s) => sum + s.Price, 0)
    const addonsSubtotal = selectedAddons.reduce((sum, a) => sum + a.Price, 0)
    
    const hasPromotion = activePromotion !== null
    let finalServicesPrice = servicesSubtotal
    
    if (hasPromotion && activePromotion) {
      finalServicesPrice = activePromotion.price
    }
    
    const subtotalBeforeTax = finalServicesPrice + addonsSubtotal
    const itbmAmount = Math.round(subtotalBeforeTax * ITBM_RATE * 100) / 100
    const totalWithTax = Math.round((subtotalBeforeTax + itbmAmount) * 100) / 100
    
    const totalDuration = selectedServices.reduce((sum, s) => sum + (s.Duration || 0), 0) +
                          selectedAddons.reduce((sum, a) => sum + (a.Duration || 0), 0)
    
    return {
      subtotalBeforeTax,
      itbmRate: ITBM_RATE,
      itbmAmount,
      totalWithTax,
      totalDuration,
    }
  }, [selectedServices, selectedAddons, activePromotion])
  
  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  return (
    <div ref={cartRef} className="relative">
      {/* Cart Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-12 h-12 
                 bg-white border-2 border-gold rounded-full shadow-lg
                 hover:bg-gold/10 transition-all duration-200"
        aria-label={`Carrito: ${itemCount} items`}
      >
        <ShoppingBag className="w-5 h-5 text-gold" />
        
        {/* Item Count Badge */}
        {itemCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-dark text-xs 
                     font-bold rounded-full flex items-center justify-center"
          >
            {itemCount}
          </motion.span>
        )}
      </button>
      
      {/* Cart Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-14 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl 
                     border border-beige-200 overflow-hidden z-50"
          >
            {/* Cart Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-beige-50 border-b border-beige-200">
              <h3 className="font-semibold text-dark flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Tu Carrito
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-beige-200 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-warm-gray" />
              </button>
            </div>
            
            {/* Cart Content */}
            <div className="max-h-80 overflow-y-auto">
              {itemCount === 0 ? (
                <div className="py-8 px-4 text-center">
                  <ShoppingBag className="w-12 h-12 text-beige-300 mx-auto mb-3" />
                  <p className="text-warm-gray">Tu carrito está vacío</p>
                  <p className="text-sm text-beige-400 mt-1">
                    Agrega tratamientos para comenzar
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-beige-100">
                  {/* Services */}
                  {selectedServices.length > 0 && (
                    <div className="p-3">
                      <p className="text-xs text-warm-gray uppercase tracking-wide mb-2 px-1">
                        Tratamientos
                      </p>
                      <div className="space-y-2">
                        {selectedServices.map((service) => (
                          <div
                            key={service.Id}
                            className="flex items-start justify-between gap-2 p-2 bg-beige-50 rounded-lg"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-dark truncate">
                                {service.Name}
                              </p>
                              {service.Duration > 0 && (
                                <p className="text-xs text-warm-gray flex items-center gap-1 mt-0.5">
                                  <Clock className="w-3 h-3" />
                                  {service.Duration} min
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-dark whitespace-nowrap">
                                ${service.Price.toFixed(0)}
                              </span>
                              <button
                                onClick={() => removeService(service.Id)}
                                className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 
                                         rounded-full transition-colors"
                                aria-label="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Addons */}
                  {selectedAddons.length > 0 && (
                    <div className="p-3">
                      <p className="text-xs text-warm-gray uppercase tracking-wide mb-2 px-1">
                        Adicionales
                      </p>
                      <div className="space-y-2">
                        {selectedAddons.map((addon) => (
                          <div
                            key={addon.Id}
                            className="flex items-start justify-between gap-2 p-2 bg-gold/5 rounded-lg"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-dark truncate">
                                {addon.Name}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-dark whitespace-nowrap">
                                ${addon.Price.toFixed(0)}
                              </span>
                              <button
                                onClick={() => removeAddon(addon.Id)}
                                className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 
                                         rounded-full transition-colors"
                                aria-label="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Cart Footer - Pricing Summary */}
            {itemCount > 0 && pricing && (
              <div className="border-t border-beige-200 bg-beige-50/50 p-4">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-warm-gray">
                    <span>Subtotal</span>
                    <span>${pricing.subtotalBeforeTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-warm-gray">
                    <span>ITBM ({(pricing.itbmRate * 100).toFixed(0)}%)</span>
                    <span>${pricing.itbmAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-dark text-base pt-2 border-t border-beige-200">
                    <span>Total</span>
                    <span className="text-gold-600">${pricing.totalWithTax.toFixed(2)}</span>
                  </div>
                  {pricing.totalDuration > 0 && (
                    <p className="text-xs text-warm-gray text-center pt-1">
                      Duración estimada: {pricing.totalDuration} min
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
