import { ITBM_TAX_RATE } from './constants'
import type { MindbodyService } from '@/types/booking'
import type { PromotionWithServices } from '@/types/booking'

// THE cart pricing implementation. ConfirmStep, FloatingCart and SuccessStep
// all call this — previously three divergent copies (and the success screen's
// total never rendered at all).

const r2 = (n: number) => Math.round(n * 100) / 100

export interface CartPricingInput {
  services: MindbodyService[]
  addons: MindbodyService[]
  promotion: PromotionWithServices | null
  globalDiscountActive: boolean
  globalDiscountPercent: number
}

export interface CartPricing {
  services: MindbodyService[]
  addons: MindbodyService[]
  // Promotion split (ConfirmStep semantics: without a promotion, promoServices
  // holds ALL services)
  promoServices: MindbodyService[]
  extraServices: MindbodyService[]
  promoServicesSubtotal: number
  extraServicesSubtotal: number
  servicesSubtotal: number
  addonsSubtotal: number
  hasPromotion: boolean
  promotionName: string | null
  /** 0 when no promotion */
  promotionPrice: number
  promotionDiscount: number
  // FloatingCart-style aliases (0 / all-services when no promotion)
  promotionServicesSubtotal: number
  regularServicesSubtotal: number
  regularItemsTotal: number
  // Discounts + totals
  hasGlobalDiscount: boolean
  globalDiscountPercent: number
  globalDiscountAmount: number
  subtotalBeforeTax: number
  itbmRate: number
  itbmAmount: number
  totalWithTax: number
  totalDuration: number
}

export function calculateCartPricing({
  services,
  addons,
  promotion,
  globalDiscountActive,
  globalDiscountPercent,
}: CartPricingInput): CartPricing {
  const hasPromotion = promotion !== null

  const promoServiceIds = new Set((promotion?.services || []).map((s) => s.Id))
  const promoServices = hasPromotion
    ? services.filter((s) => promoServiceIds.has(s.Id))
    : services
  const extraServices = hasPromotion
    ? services.filter((s) => !promoServiceIds.has(s.Id))
    : []

  const promoServicesSubtotal = promoServices.reduce((sum, s) => sum + s.Price, 0)
  const extraServicesSubtotal = extraServices.reduce((sum, s) => sum + s.Price, 0)
  const addonsSubtotal = addons.reduce((sum, a) => sum + a.Price, 0)

  let finalServicesPrice = promoServicesSubtotal + extraServicesSubtotal
  let promotionDiscount = 0
  if (hasPromotion && promotion) {
    // Promotion covers its included services at a flat price; extras full price
    finalServicesPrice = promotion.price + extraServicesSubtotal
    promotionDiscount = promoServicesSubtotal - promotion.price
  }

  const hasGlobalDiscount = globalDiscountActive && globalDiscountPercent > 0
  let globalDiscountAmount = 0
  const effectiveAddonsSubtotal = hasGlobalDiscount
    ? r2(addonsSubtotal * (1 - globalDiscountPercent / 100))
    : addonsSubtotal
  if (hasGlobalDiscount) {
    if (hasPromotion && promotion) {
      // Only discount extra services (never the promotion price)
      const discountedExtra = r2(extraServicesSubtotal * (1 - globalDiscountPercent / 100))
      globalDiscountAmount =
        extraServicesSubtotal - discountedExtra + (addonsSubtotal - effectiveAddonsSubtotal)
      finalServicesPrice = promotion.price + discountedExtra
    } else {
      globalDiscountAmount = r2(finalServicesPrice * (globalDiscountPercent / 100))
      finalServicesPrice = r2(finalServicesPrice - globalDiscountAmount)
      globalDiscountAmount += addonsSubtotal - effectiveAddonsSubtotal
    }
  }

  const subtotalBeforeTax = finalServicesPrice + effectiveAddonsSubtotal
  const itbmAmount = r2(subtotalBeforeTax * ITBM_TAX_RATE)
  const totalWithTax = r2(subtotalBeforeTax + itbmAmount)

  const totalDuration =
    services.reduce((sum, s) => sum + (s.Duration || 0), 0) +
    addons.reduce((sum, a) => sum + (a.Duration || 0), 0)

  return {
    services,
    addons,
    promoServices,
    extraServices,
    promoServicesSubtotal,
    extraServicesSubtotal,
    servicesSubtotal: promoServicesSubtotal + extraServicesSubtotal,
    addonsSubtotal,
    hasPromotion,
    promotionName: promotion?.title_es || null,
    promotionPrice: promotion?.price ?? 0,
    promotionDiscount,
    promotionServicesSubtotal: hasPromotion ? promoServicesSubtotal : 0,
    regularServicesSubtotal: hasPromotion
      ? extraServicesSubtotal
      : promoServicesSubtotal + extraServicesSubtotal,
    regularItemsTotal: r2(
      subtotalBeforeTax - (hasPromotion && promotion ? promotion.price : 0)
    ),
    hasGlobalDiscount,
    globalDiscountPercent,
    globalDiscountAmount,
    subtotalBeforeTax,
    itbmRate: ITBM_TAX_RATE,
    itbmAmount,
    totalWithTax,
    totalDuration,
  }
}
