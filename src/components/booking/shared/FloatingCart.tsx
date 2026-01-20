'use client'

import { useEffect, useMemo, useCallback } from 'react'
import { ShoppingBag, X, Trash2, Clock, Tag, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBookingStore } from '@/lib/booking/store'

// Tax rate constant - ITBM is 7% in Panama
const ITBM_RATE = 0.07

export function FloatingCart() {
  const {
    selectedServices,
    selectedAddons,
    removeService,
    removeAddon,
    activePromotion,
    isCartOpen,
    closeCart,
  } = useBookingStore()

  const itemCount = selectedServices.length + selectedAddons.length

  // Separate promotion services from regular services
  const { promotionServices, regularServices } = useMemo(() => {
    if (!activePromotion || !activePromotion.services) {
      return { promotionServices: [], regularServices: selectedServices }
    }

    // Get IDs of services included in the promotion
    const promotionServiceIds = new Set(activePromotion.services.map(s => s.Id))

    // Separate services
    const promoServices = selectedServices.filter(s => promotionServiceIds.has(s.Id))
    const extraServices = selectedServices.filter(s => !promotionServiceIds.has(s.Id))

    return { promotionServices: promoServices, regularServices: extraServices }
  }, [selectedServices, activePromotion])

  // Calculate pricing with useMemo - now handling separate sections
  const pricing = useMemo(() => {
    const hasPromotion = activePromotion !== null && promotionServices.length > 0

    // Promotion pricing
    const promotionServicesSubtotal = promotionServices.reduce((sum, s) => sum + s.Price, 0)
    const promotionPrice = hasPromotion ? activePromotion!.price : 0
    const promotionDiscount = hasPromotion ? promotionServicesSubtotal - promotionPrice : 0

    // Regular items pricing (extra services + addons)
    const regularServicesSubtotal = regularServices.reduce((sum, s) => sum + s.Price, 0)
    const addonsSubtotal = selectedAddons.reduce((sum, a) => sum + a.Price, 0)
    const regularItemsTotal = regularServicesSubtotal + addonsSubtotal

    // Combined subtotal before tax
    const subtotalBeforeTax = promotionPrice + regularItemsTotal

    const itbmAmount = Math.round(subtotalBeforeTax * ITBM_RATE * 100) / 100
    const totalWithTax = Math.round((subtotalBeforeTax + itbmAmount) * 100) / 100

    const totalDuration = selectedServices.reduce((sum, s) => sum + (s.Duration || 0), 0) +
                          selectedAddons.reduce((sum, a) => sum + (a.Duration || 0), 0)

    return {
      hasPromotion,
      promotionName: activePromotion?.title_es || null,
      promotionServicesSubtotal,
      promotionPrice,
      promotionDiscount,
      regularServicesSubtotal,
      addonsSubtotal,
      regularItemsTotal,
      subtotalBeforeTax,
      itbmRate: ITBM_RATE,
      itbmAmount,
      totalWithTax,
      totalDuration,
    }
  }, [selectedServices, selectedAddons, activePromotion, promotionServices, regularServices])

  const hasRegularItems = regularServices.length > 0 || selectedAddons.length > 0
  
  // Close sidebar handler - use store action
  const closeSidebar = useCallback(() => {
    closeCart()
  }, [closeCart])
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeSidebar()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isCartOpen, closeSidebar])
  
  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isCartOpen])
  
  return (
    <>
      {/* Sidebar Overlay - Controlled by store */}
      <AnimatePresence>
        {isCartOpen && (
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
              className="fixed inset-y-0 right-0 w-full sm:w-96
                       bg-white shadow-2xl z-50 flex flex-col max-h-[100dvh]"
            >
              {/* Sidebar Header (Fixed at top) */}
              <div className="flex-shrink-0 flex items-center justify-between px-5 py-4
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
              <div
                className="flex-1 overflow-y-scroll overflow-x-hidden min-h-0 overscroll-contain"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
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
                  <div>
                    {/* ============================================ */}
                    {/* PROMOTION SECTION - Gold themed */}
                    {/* ============================================ */}
                    {pricing.hasPromotion && promotionServices.length > 0 && (
                      <div className="border-b-2 border-gold bg-gradient-to-b from-gold/10 to-gold/5">
                        {/* Promotion Header */}
                        <div className="bg-gradient-to-r from-gold to-gold/80 text-dark px-4 py-2.5">
                          <span className="flex items-center gap-2 font-semibold text-sm">
                            <Star className="h-4 w-4" />
                            PROMOCIÓN: {pricing.promotionName}
                          </span>
                        </div>

                        {/* Promotion Services with slashed prices */}
                        <div className="p-4 space-y-2">
                          <p className="text-xs font-semibold text-gold-700 uppercase tracking-wider mb-2">
                            Servicios Incluidos
                          </p>

                          {promotionServices.map((service) => (
                            <div
                              key={service.Id}
                              className="flex items-start justify-between py-1.5"
                            >
                              <div className="flex items-start gap-2">
                                <span className="text-gold-600">✓</span>
                                <div>
                                  <p className="text-sm font-medium text-dark">{service.Name}</p>
                                  <p className="text-xs text-warm-gray">{service.Duration} min</p>
                                </div>
                              </div>
                              <span className="text-sm text-warm-gray line-through">
                                ${service.Price.toFixed(2)}
                              </span>
                            </div>
                          ))}

                          {/* Promotion Pricing Summary */}
                          <div className="mt-3 pt-3 border-t border-gold/30 space-y-1.5">
                            <div className="flex justify-between text-sm text-warm-gray">
                              <span>Subtotal servicios:</span>
                              <span className="line-through">${pricing.promotionServicesSubtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-green-600">
                              <span>Descuento:</span>
                              <span>-${pricing.promotionDiscount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-gold-700 pt-1">
                              <span>Precio Promoción:</span>
                              <span>${pricing.promotionPrice.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ============================================ */}
                    {/* REGULAR ITEMS SECTION - Normal theme */}
                    {/* ============================================ */}
                    {hasRegularItems && (
                      <div className="divide-y divide-beige-100">
                        {/* Extra Services (beyond promotion) */}
                        {regularServices.length > 0 && (
                          <div className="p-4">
                            <p className="text-xs text-warm-gray uppercase tracking-wider mb-3 font-medium">
                              {pricing.hasPromotion ? 'Servicios Adicionales' : 'Tratamientos'}
                            </p>
                            <div className="space-y-3">
                              {regularServices.map((service) => (
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
                )}
              </div>
              
              {/* Sidebar Footer - Pricing Summary (Fixed at bottom) */}
              {itemCount > 0 && pricing && (
                <div className="flex-shrink-0 border-t-2 border-beige-200 bg-gradient-to-b from-beige-50 to-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                  <div className="space-y-2">
                    {/* Duration */}
                    {pricing.totalDuration > 0 && (
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-warm-gray flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Duración total:
                        </span>
                        <span className="font-medium text-dark">{pricing.totalDuration} min</span>
                      </div>
                    )}

                    {/* Price Breakdown */}
                    <div className="border-t border-beige-200 pt-3 space-y-2">
                      {/* Show breakdown when there's a promotion */}
                      {pricing.hasPromotion && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-warm-gray">Promoción:</span>
                            <span className="text-gold-600 font-medium">${pricing.promotionPrice.toFixed(2)}</span>
                          </div>
                          {pricing.regularItemsTotal > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-warm-gray">Adicionales:</span>
                              <span className="text-dark">${pricing.regularItemsTotal.toFixed(2)}</span>
                            </div>
                          )}
                        </>
                      )}

                      <div className="flex justify-between text-sm">
                        <span className="text-warm-gray">Subtotal:</span>
                        <span className="text-dark">${pricing.subtotalBeforeTax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-warm-gray">ITBM ({(pricing.itbmRate * 100).toFixed(0)}%):</span>
                        <span className="text-dark">${pricing.itbmAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t border-beige-300">
                        <span className="text-dark">TOTAL:</span>
                        <span className={pricing.hasPromotion ? 'text-gold-600' : 'text-dark'}>
                          ${pricing.totalWithTax.toFixed(2)}
                        </span>
                      </div>
                    </div>
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
