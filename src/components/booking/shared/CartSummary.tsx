'use client'

import { useMemo } from 'react'
import { Star, Clock, X, ShoppingBag, ChevronRight, MapPin } from 'lucide-react'
import { useBookingStore } from '@/lib/booking/store'
import { ITBM_TAX_RATE } from '@/lib/booking/constants'

// Use shared tax rate constant
const ITBM_RATE = ITBM_TAX_RATE

interface CartSummaryProps {
  compact?: boolean
  showRemoveButtons?: boolean
  showCloseButton?: boolean
}

export function CartSummary({ compact = false, showRemoveButtons = true, showCloseButton = false }: CartSummaryProps) {
  const {
    selectedServices,
    selectedAddons,
    activePromotion,
    selectedLocation,
    removeService,
    removeAddon,
    closeCart,
    globalDiscountPercent,
    globalDiscountActive,
  } = useBookingStore()

  // Global discount applies only when no promotion is active
  const showGlobalDiscount = globalDiscountActive && globalDiscountPercent > 0 && !activePromotion

  // Separate promotion services from extra regular services
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

    // Calculate ITBM (7%)
    const itbmAmount = Math.round(subtotalBeforeTax * ITBM_RATE * 100) / 100

    // Calculate total with tax
    const totalWithTax = Math.round((subtotalBeforeTax + itbmAmount) * 100) / 100

    // Duration
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

  const hasItems = selectedServices.length > 0 || selectedAddons.length > 0
  const hasRegularItems = regularServices.length > 0 || selectedAddons.length > 0

  if (!hasItems) {
    return (
      <div className="text-center py-8 text-warm-gray">
        <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="text-sm">Tu carrito está vacío</p>
      </div>
    )
  }

  const hasPromotion = pricing.hasPromotion

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
    <div className="cart-summary rounded-xl border border-beige-200 overflow-hidden bg-white">
      {/* Cart Title */}
      <div className="px-4 py-3 border-b border-beige-200 flex items-center justify-between bg-beige-50">
        <div>
          <h3 className="font-semibold text-dark">Tu Reserva</h3>
          {selectedLocation && (
            <p className="text-xs text-warm-gray flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" />
              {selectedLocation.Name}
            </p>
          )}
        </div>
        {showCloseButton && (
          <button
            onClick={closeCart}
            className="p-1.5 rounded-lg hover:bg-beige-100 text-warm-gray hover:text-dark transition-colors"
            aria-label="Cerrar carrito"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* ============================================ */}
      {/* PROMOTION SECTION - Gold themed */}
      {/* ============================================ */}
      {hasPromotion && promotionServices.length > 0 && (
        <div className="border-b-2 border-gold bg-gradient-to-b from-gold/10 to-gold/5">
          {/* Promotion Header */}
          <div className="bg-gradient-to-r from-gold to-gold/80 text-dark px-4 py-2.5">
            <span className="flex items-center gap-2 font-semibold text-sm">
              <Star className="h-4 w-4" />
              PROMOCIÓN: {activePromotion?.title_es}
            </span>
          </div>

          {/* Promotion Services with slashed prices */}
          <div className="p-4 space-y-2">
            <h4 className="text-xs font-semibold text-gold-700 uppercase tracking-wider mb-2">
              Servicios Incluidos
            </h4>

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
        <div className="p-4">
          {/* Extra Services (beyond promotion) */}
          {regularServices.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-warm-gray uppercase tracking-wider mb-2">
                {hasPromotion ? 'Servicios Adicionales' : 'Tratamientos'}
              </h4>

              {regularServices.map((service) => (
                <div
                  key={service.Id}
                  className="flex items-start justify-between py-2 border-b border-beige-100 last:border-0"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-warm-gray">•</span>
                    <div>
                      <p className="text-sm font-medium text-dark">{service.Name}</p>
                      <p className="text-xs text-warm-gray">{service.Duration} min</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {showGlobalDiscount && service.Price > 0 ? (
                      <span className="flex flex-col items-end">
                        <span className="text-xs line-through text-warm-gray leading-tight">${service.Price.toFixed(2)}</span>
                        <span className="text-sm font-medium text-green-600 leading-tight">${(Math.round(service.Price * (1 - globalDiscountPercent / 100) * 100) / 100).toFixed(2)}</span>
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-dark">
                        ${service.Price.toFixed(2)}
                      </span>
                    )}
                    {showRemoveButtons && (
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
            </div>
          )}

          {/* Addons Section */}
          {selectedAddons.length > 0 && (
            <div className={regularServices.length > 0 ? 'pt-3 border-t border-beige-200' : ''}>
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
                      <p className="text-xs text-warm-gray">{addon.Duration} min</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {showGlobalDiscount && addon.Price > 0 ? (
                      <span className="flex flex-col items-end">
                        <span className="text-xs line-through text-warm-gray leading-tight">${addon.Price.toFixed(2)}</span>
                        <span className="text-sm font-medium text-green-600 leading-tight">${(Math.round(addon.Price * (1 - globalDiscountPercent / 100) * 100) / 100).toFixed(2)}</span>
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-dark">
                        ${addon.Price.toFixed(2)}
                      </span>
                    )}
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

          {/* Regular Items Subtotal (only show if there's also a promotion) */}
          {hasPromotion && pricing.regularItemsTotal > 0 && (
            <div className="mt-3 pt-3 border-t border-beige-200">
              <div className="flex justify-between text-sm font-medium text-dark">
                <span>Subtotal adicionales:</span>
                <span>${pricing.regularItemsTotal.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================ */}
      {/* FINAL TOTALS */}
      {/* ============================================ */}
      <div className="border-t-2 border-beige-300 p-4 bg-beige-50">
        {/* Duration */}
        <div className="flex justify-between text-sm mb-3">
          <span className="text-warm-gray flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Duración total:
          </span>
          <span className="font-medium text-dark">{pricing.totalDuration} min</span>
        </div>

        {/* Price Breakdown */}
        <div className="border-t border-beige-200 pt-3 space-y-2">
          {/* Show breakdown when there's a promotion */}
          {hasPromotion && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-warm-gray">Promoción:</span>
                <span className="text-gold-600 font-medium">${pricing.promotionPrice.toFixed(2)}</span>
              </div>
              {pricing.regularServicesSubtotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-warm-gray">Servicios adicionales:</span>
                  <span className="text-dark">${pricing.regularServicesSubtotal.toFixed(2)}</span>
                </div>
              )}
              {pricing.addonsSubtotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-warm-gray">Adicionales:</span>
                  <span className="text-dark">${pricing.addonsSubtotal.toFixed(2)}</span>
                </div>
              )}
            </>
          )}

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
    </div>
  )
}
