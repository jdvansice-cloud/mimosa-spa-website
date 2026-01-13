'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import {
  ShoppingBag,
  X,
  ChevronRight,
  Trash2,
  Star,
  Clock,
  ArrowRight,
} from 'lucide-react'
import { useBookingStore, ITBM_RATE, calculatePricing } from '@/lib/booking/store'

interface CartSidebarProps {
  alwaysShowToggle?: boolean
  onContinue?: () => void
}

export function CartSidebar({ alwaysShowToggle = false, onContinue }: CartSidebarProps) {
  const t = useTranslations('cart')
  const [isOpen, setIsOpen] = useState(false)
  
  const {
    selectedServices,
    selectedAddons,
    activePromotion,
    removeService,
    removeAddon,
  } = useBookingStore()
  
  // Calculate pricing with useMemo - pure computation, no state updates
  const pricing = useMemo(() => {
    return calculatePricing(selectedServices, selectedAddons, activePromotion)
  }, [selectedServices, selectedAddons, activePromotion])
  
  const itemCount = selectedServices.length + selectedAddons.length
  const hasItems = itemCount > 0
  const hasPromotion = pricing.hasPromotion
  
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen])
  
  // Don't show toggle if no items and not always showing
  if (!hasItems && !alwaysShowToggle) {
    return null
  }
  
  return (
    <>
      {/* Cart Toggle Button - Fixed on right side */}
      <button
        onClick={() => setIsOpen(true)}
        className={`
          fixed right-0 top-1/2 -translate-y-1/2 z-40
          flex items-center gap-2 
          py-3 pl-3 pr-2 rounded-l-xl
          shadow-lg transition-all duration-300
          ${hasItems 
            ? 'bg-gold hover:bg-gold-500 text-dark' 
            : 'bg-white hover:bg-beige-50 text-warm-gray border border-r-0 border-beige-200'
          }
          ${isOpen ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
        `}
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {hasItems && (
            <span className="absolute -top-2 -right-2 bg-dark text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {itemCount}
            </span>
          )}
        </div>
        {hasItems && (
          <span className="text-sm font-semibold whitespace-nowrap">
            ${pricing.totalWithTax.toFixed(0)}
          </span>
        )}
        <ChevronRight className="w-4 h-4 rotate-180" />
      </button>
      
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="cart-overlay"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Sliding Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="cart-sidebar"
          >
            {/* Header */}
            <div className={`
              flex items-center justify-between px-4 py-4 border-b
              ${hasPromotion 
                ? 'bg-gradient-to-r from-gold to-gold-400 text-dark border-gold' 
                : 'bg-beige-50 border-beige-200'
              }
            `}>
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5" />
                <h2 className="font-semibold text-lg">
                  {hasPromotion ? (
                    <span className="flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      {activePromotion?.title_es}
                    </span>
                  ) : (
                    t('title')
                  )}
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className={`
                  p-2 rounded-full transition-colors
                  ${hasPromotion 
                    ? 'hover:bg-black/10' 
                    : 'hover:bg-beige-100'
                  }
                `}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {!hasItems ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-beige-100 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-beige-400" />
                  </div>
                  <p className="text-lg font-medium text-dark mb-2">{t('empty')}</p>
                  <p className="text-sm text-warm-gray">{t('emptyMessage')}</p>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {/* Services */}
                  {selectedServices.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-warm-gray uppercase tracking-wide mb-3">
                        {t('services')}
                      </h3>
                      <div className="space-y-2">
                        {selectedServices.map((service) => (
                          <CartItem
                            key={service.Id}
                            name={service.Name}
                            price={service.Price}
                            duration={service.Duration}
                            onRemove={() => removeService(service.Id)}
                            hasPromotion={hasPromotion}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Addons */}
                  {selectedAddons.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-warm-gray uppercase tracking-wide mb-3">
                        {t('addons')}
                      </h3>
                      <div className="space-y-2">
                        {selectedAddons.map((addon) => (
                          <CartItem
                            key={addon.Id}
                            name={addon.Name}
                            price={addon.Price}
                            duration={addon.Duration}
                            onRemove={() => removeAddon(addon.Id)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Footer with pricing */}
            {hasItems && (
              <div className="border-t border-beige-200 bg-white p-4 space-y-3">
                {/* Duration */}
                <div className="flex items-center justify-center gap-2 text-sm text-warm-gray pb-2 border-b border-beige-100">
                  <Clock className="w-4 h-4" />
                  <span>Duración total: {pricing.totalDuration} min</span>
                </div>
                
                {/* Pricing breakdown */}
                <div className="space-y-2 text-sm">
                  {/* Services subtotal */}
                  <div className="flex justify-between">
                    <span className="text-warm-gray">{t('services')}</span>
                    <span className={hasPromotion ? 'line-through text-warm-gray-300' : ''}>
                      ${pricing.servicesSubtotal.toFixed(0)}
                    </span>
                  </div>
                  
                  {/* Promotion discount */}
                  {hasPromotion && (
                    <div className="flex justify-between text-gold-600">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {t('promotion')}
                      </span>
                      <span>-${pricing.promotionDiscount.toFixed(0)}</span>
                    </div>
                  )}
                  
                  {/* Addons subtotal */}
                  {selectedAddons.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-warm-gray">{t('addons')}</span>
                      <span>${pricing.addonsSubtotal.toFixed(0)}</span>
                    </div>
                  )}
                  
                  {/* Subtotal */}
                  <div className="flex justify-between pt-2 border-t border-beige-100">
                    <span className="text-warm-gray">{t('subtotal')}</span>
                    <span>${pricing.subtotalBeforeTax.toFixed(2)}</span>
                  </div>
                  
                  {/* ITBM */}
                  <div className="flex justify-between">
                    <span className="text-warm-gray">{t('tax')}</span>
                    <span>${pricing.itbmAmount.toFixed(2)}</span>
                  </div>
                  
                  {/* Total */}
                  <div className="flex justify-between pt-2 border-t border-beige-200 text-lg font-bold">
                    <span>{t('total')}</span>
                    <span className="text-gold-600">${pricing.totalWithTax.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Continue button */}
                {onContinue && (
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      onContinue()
                    }}
                    className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
                  >
                    <span>{t('continueToCheckout')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

interface CartItemProps {
  name: string
  price: number
  duration?: number
  onRemove: () => void
  hasPromotion?: boolean
}

function CartItem({ name, price, duration, onRemove, hasPromotion }: CartItemProps) {
  return (
    <div className="flex items-start justify-between p-3 bg-beige-50 rounded-lg group">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-dark text-sm truncate">{name}</p>
        {duration && (
          <p className="text-xs text-warm-gray mt-0.5 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {duration} min
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 ml-3">
        <span className={`text-sm font-semibold ${hasPromotion ? 'line-through text-warm-gray-300' : 'text-dark'}`}>
          ${price.toFixed(0)}
        </span>
        <button
          onClick={onRemove}
          className="p-1.5 rounded-full text-warm-gray hover:text-red-500 hover:bg-red-50 
                     opacity-0 group-hover:opacity-100 transition-all duration-200"
          aria-label={`Remove ${name}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
