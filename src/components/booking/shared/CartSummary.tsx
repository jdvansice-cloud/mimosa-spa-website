'use client'

import { useEffect } from 'react'
import { Star, Clock, X, ShoppingBag } from 'lucide-react'
import { useBookingStore } from '@/lib/booking/store'

interface CartSummaryProps {
  compact?: boolean
  showRemoveButtons?: boolean
}

export function CartSummary({ compact = false, showRemoveButtons = true }: CartSummaryProps) {
  const {
    selectedServices,
    selectedAddons,
    activePromotion,
    pricing,
    calculatePricing,
    removeService,
    removeAddon,
  } = useBookingStore()
  
  // Calculate pricing when services/addons change
  useEffect(() => {
    if (selectedServices.length > 0 || selectedAddons.length > 0) {
      calculatePricing()
    }
  }, [selectedServices, selectedAddons, activePromotion, calculatePricing])
  
  const hasItems = selectedServices.length > 0 || selectedAddons.length > 0
  
  if (!hasItems) {
    return (
      <div className="text-center py-8 text-warm-gray">
        <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="text-sm">Tu carrito está vacío</p>
      </div>
    )
  }
  
  const hasPromotion = activePromotion !== null
  
  // Compact view for mobile
  if (compact) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {hasPromotion && (
            <span className="bg-gold text-dark text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" />
              PROMO
            </span>
          )}
          <div>
            <p className="text-sm font-medium text-dark">
              {selectedServices.length + selectedAddons.length} servicio{selectedServices.length + selectedAddons.length !== 1 ? 's' : ''}
            </p>
            <p className="text-xs text-warm-gray flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {pricing?.totalDuration || 0} min
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-dark">
            ${pricing?.totalWithTax.toFixed(2) || '0.00'}
          </p>
          <p className="text-xs text-warm-gray">Total con ITBM</p>
        </div>
      </div>
    )
  }
  
  // Full view
  return (
    <div className={`
      cart-summary rounded-xl border overflow-hidden
      ${hasPromotion 
        ? 'border-gold border-2 bg-gradient-to-b from-gold/5 to-transparent' 
        : 'border-beige-200 bg-white'
      }
    `}>
      {/* Promotion Header */}
      {hasPromotion && (
        <div className="bg-gradient-to-r from-gold to-gold/80 text-dark px-4 py-3">
          <span className="flex items-center gap-2 font-semibold">
            <Star className="h-5 w-5" />
            PROMOCIÓN: {activePromotion?.title_es}
          </span>
        </div>
      )}
      
      {/* Cart Title */}
      <div className="px-4 py-3 border-b border-beige-200">
        <h3 className="font-semibold text-dark">Tu Reserva</h3>
      </div>
      
      {/* Services List */}
      <div className="p-4 space-y-3">
        {/* Main Services */}
        {selectedServices.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-warm-gray uppercase tracking-wider mb-2">
              {hasPromotion ? 'Servicios Incluidos' : 'Tratamientos'}
            </h4>
            
            {selectedServices.map((service) => (
              <div 
                key={service.Id} 
                className="flex items-start justify-between py-2 border-b border-beige-100 last:border-0"
              >
                <div className="flex items-start gap-2">
                  <span className={hasPromotion ? 'text-gold' : 'text-warm-gray'}>
                    {hasPromotion ? '✓' : '•'}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-dark">{service.Name}</p>
                    <p className="text-xs text-warm-gray">{service.Duration} minutos</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${hasPromotion ? 'text-warm-gray line-through' : 'font-medium text-dark'}`}>
                    ${service.Price.toFixed(2)}
                  </span>
                  {showRemoveButtons && !hasPromotion && (
                    <button
                      onClick={() => removeService(service.Id)}
                      className="text-warm-gray hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {/* Promotion Pricing Summary */}
            {hasPromotion && pricing && (
              <div className="mt-3 pt-3 border-t border-gold/30 space-y-1">
                <div className="flex justify-between text-sm text-warm-gray">
                  <span>Subtotal servicios:</span>
                  <span className="line-through">${pricing.servicesSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Descuento promoción:</span>
                  <span>-${pricing.promotionDiscount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-gold-600">
                  <span>Precio promocional:</span>
                  <span>${pricing.promotionPrice?.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Addons Section */}
        {selectedAddons.length > 0 && (
          <div className="pt-3 border-t border-beige-200">
            <h4 className="text-xs font-semibold text-warm-gray uppercase tracking-wider mb-2">
              Adicionales
            </h4>
            
            {selectedAddons.map((addon) => (
              <div 
                key={addon.Id} 
                className="flex items-start justify-between py-2 border-b border-beige-100 last:border-0"
              >
                <div className="flex items-start gap-2">
                  <span className="text-gold">+</span>
                  <div>
                    <p className="text-sm font-medium text-dark">{addon.Name}</p>
                    <p className="text-xs text-warm-gray">{addon.Duration} minutos</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-dark">
                    ${addon.Price.toFixed(2)}
                  </span>
                  {showRemoveButtons && (
                    <button
                      onClick={() => removeAddon(addon.Id)}
                      className="text-warm-gray hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Totals */}
      {pricing && (
        <div className="border-t border-beige-200 p-4 bg-beige-50/80">
          {/* Duration */}
          <div className="flex justify-between text-sm mb-3">
            <span className="text-warm-gray flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Duración total:
            </span>
            <span className="font-medium text-dark">{pricing.totalDuration} minutos</span>
          </div>
          
          {/* Price Breakdown */}
          <div className="border-t border-beige-200 pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-warm-gray">Subtotal:</span>
              <span className="text-dark">${pricing.subtotalBeforeTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-warm-gray">ITBM (7%):</span>
              <span className="text-dark">${pricing.itbmAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-beige-300">
              <span className="text-dark">TOTAL:</span>
              <span className={hasPromotion ? 'text-gold-600' : 'text-dark'}>
                ${pricing.totalWithTax.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
