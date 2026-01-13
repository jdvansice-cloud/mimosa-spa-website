'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { ShoppingBag, X, Trash2, Clock, Tag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBookingStore } from '@/lib/booking/store'

// Tax rate constant - ITBM is 7% in Panama
const ITBM_RATE = 0.07

export function FloatingCart() {
  const [isOpen, setIsOpen] = useState(false)
  
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
    let promotionDiscount = 0
    
    if (hasPromotion && activePromotion) {
      finalServicesPrice = activePromotion.price
      promotionDiscount = servicesSubtotal - activePromotion.price
    }
    
    const subtotalBeforeTax = finalServicesPrice + addonsSubtotal
    const itbmAmount = Math.round(subtotalBeforeTax * ITBM_RATE * 100) / 100
    const totalWithTax = Math.round((subtotalBeforeTax + itbmAmount) * 100) / 100
    
    const totalDuration = selectedServices.reduce((sum, s) => sum + (s.Duration || 0), 0) +
                          selectedAddons.reduce((sum, a) => sum + (a.Duration || 0), 0)
    
    return {
      servicesSubtotal,
      addonsSubtotal,
      promotionDiscount,
      subtotalBeforeTax,
      itbmRate: ITBM_RATE,
      itbmAmount,
      totalWithTax,
      totalDuration,
      hasPromotion,
    }
  }, [selectedServices, selectedAddons, activePromotion])
  
  // Close sidebar handler
  const closeSidebar = useCallback(() => {
    setIsOpen(false)
  }, [])
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeSidebar()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeSidebar])
  
  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])
  
  return (
    <>
      {/* Fixed Cart Toggle Button - Right Edge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-40
                 flex items-center justify-center w-14 h-14 
                 bg-white border-2 border-gold rounded-full shadow-xl
                 hover:bg-gold/10 hover:scale-105 transition-all duration-200"
        aria-label={`Carrito: ${itemCount} items`}
      >
        <ShoppingBag className="w-6 h-6 text-gold" />
        
        {/* Item Count Badge */}
        {itemCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-gold text-dark text-xs 
                     font-bold rounded-full flex items-center justify-center shadow-md"
          >
            {itemCount}
          </motion.span>
        )}
      </button>
      
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeSidebar}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              aria-hidden="true"
            />
            
            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full sm:w-96 
                       bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between px-5 py-4 
                            bg-gradient-to-r from-beige-50 to-white border-b border-beige-200">
                <h2 className="text-lg font-semibold text-dark flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-gold" />
                  Tu Carrito
                  {itemCount > 0 && (
                    <span className="text-sm font-normal text-warm-gray">
                      ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                    </span>
                  )}
                </h2>
                <button
                  onClick={closeSidebar}
                  className="p-2 hover:bg-beige-100 rounded-full transition-colors"
                  aria-label="Cerrar carrito"
                >
                  <X className="w-5 h-5 text-warm-gray" />
                </button>
              </div>
              
              {/* Sidebar Content - Scrollable */}
              <div className="flex-1 overflow-y-auto">
                {itemCount === 0 ? (
                  <div className="py-16 px-6 text-center">
                    <div className="w-20 h-20 bg-beige-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="w-10 h-10 text-beige-300" />
                    </div>
                    <p className="text-lg text-dark font-medium">Tu carrito está vacío</p>
                    <p className="text-sm text-warm-gray mt-2">
                      Agrega tratamientos para comenzar tu reserva
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-beige-100">
                    {/* Services Section */}
                    {selectedServices.length > 0 && (
                      <div className="p-4">
                        <p className="text-xs text-warm-gray uppercase tracking-wider mb-3 font-medium">
                          Tratamientos
                        </p>
                        <div className="space-y-3">
                          {selectedServices.map((service) => (
                            <motion.div
                              key={service.Id}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="flex items-start justify-between gap-3 p-3 
                                       bg-beige-50 rounded-xl group"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-dark leading-tight">
                                  {service.Name}
                                </p>
                                {service.Duration > 0 && (
                                  <p className="text-xs text-warm-gray flex items-center gap-1 mt-1">
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
                                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 
                                           rounded-full transition-all opacity-60 group-hover:opacity-100"
                                  aria-label="Eliminar"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Addons Section */}
                    {selectedAddons.length > 0 && (
                      <div className="p-4">
                        <p className="text-xs text-warm-gray uppercase tracking-wider mb-3 font-medium">
                          Adicionales
                        </p>
                        <div className="space-y-3">
                          {selectedAddons.map((addon) => (
                            <motion.div
                              key={addon.Id}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="flex items-start justify-between gap-3 p-3 
                                       bg-gold/5 border border-gold/20 rounded-xl group"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-dark leading-tight">
                                  {addon.Name}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-dark whitespace-nowrap">
                                  ${addon.Price.toFixed(0)}
                                </span>
                                <button
                                  onClick={() => removeAddon(addon.Id)}
                                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 
                                           rounded-full transition-all opacity-60 group-hover:opacity-100"
                                  aria-label="Eliminar"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Sidebar Footer - Pricing Summary */}
              {itemCount > 0 && pricing && (
                <div className="border-t-2 border-beige-200 bg-gradient-to-b from-beige-50 to-white p-5">
                  <div className="space-y-2">
                    {/* Services subtotal */}
                    <div className="flex justify-between text-sm text-warm-gray">
                      <span>Tratamientos</span>
                      <span>${pricing.servicesSubtotal.toFixed(2)}</span>
                    </div>
                    
                    {/* Addons subtotal (if any) */}
                    {pricing.addonsSubtotal > 0 && (
                      <div className="flex justify-between text-sm text-warm-gray">
                        <span>Adicionales</span>
                        <span>${pricing.addonsSubtotal.toFixed(2)}</span>
                      </div>
                    )}
                    
                    {/* Promotion discount (if any) */}
                    {pricing.hasPromotion && pricing.promotionDiscount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          Promoción
                        </span>
                        <span>-${pricing.promotionDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    {/* Subtotal */}
                    <div className="flex justify-between text-sm text-dark pt-2 border-t border-beige-200">
                      <span>Subtotal</span>
                      <span>${pricing.subtotalBeforeTax.toFixed(2)}</span>
                    </div>
                    
                    {/* ITBM Tax */}
                    <div className="flex justify-between text-sm text-warm-gray">
                      <span>ITBM ({(pricing.itbmRate * 100).toFixed(0)}%)</span>
                      <span>${pricing.itbmAmount.toFixed(2)}</span>
                    </div>
                    
                    {/* Total */}
                    <div className="flex justify-between font-bold text-lg text-dark pt-3 
                                  border-t-2 border-gold/30">
                      <span>Total</span>
                      <span className="text-gold-600">${pricing.totalWithTax.toFixed(2)}</span>
                    </div>
                    
                    {/* Duration estimate */}
                    {pricing.totalDuration > 0 && (
                      <p className="text-xs text-warm-gray text-center pt-2 flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3" />
                        Duración estimada: {pricing.totalDuration} min
                      </p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
