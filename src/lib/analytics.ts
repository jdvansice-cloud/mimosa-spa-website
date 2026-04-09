/**
 * Analytics utility functions for Google Tag Manager
 *
 * Usage:
 *   import { trackEvent, trackPageView, trackEcommerce } from '@/lib/analytics'
 *
 *   // Track a custom event
 *   trackEvent('button_click', { button_name: 'Book Now', page: 'home' })
 *
 *   // Track booking events
 *   trackBookingStep('service_selected', { service_name: 'Masaje Relajante', price: 85 })
 */

// Type definitions for dataLayer
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]
  }
}

/**
 * Push an event to the GTM dataLayer
 */
export function pushToDataLayer(data: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push(data)
  }
}

/**
 * Track a custom event
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, unknown>
) {
  pushToDataLayer({
    event: eventName,
    ...eventParams,
  })
}

/**
 * Track a virtual page view (for SPAs)
 */
export function trackPageView(url: string, title?: string) {
  pushToDataLayer({
    event: 'page_view',
    page_path: url,
    page_title: title,
  })
}

/**
 * Track booking funnel steps
 */
export function trackBookingStep(
  step: 'location_selected' | 'service_selected' | 'datetime_selected' | 'booking_started' | 'booking_completed' | 'booking_failed',
  params?: {
    location_name?: string
    service_name?: string
    service_id?: string
    price?: number
    date?: string
    time?: string
    error_message?: string
  }
) {
  pushToDataLayer({
    event: `booking_${step}`,
    booking_step: step,
    ...params,
  })
}

/**
 * Track promotion interactions
 */
export function trackPromotion(
  action: 'view' | 'click' | 'book',
  promotion: {
    id: string
    name: string
    price?: number
  }
) {
  pushToDataLayer({
    event: `promotion_${action}`,
    promotion_id: promotion.id,
    promotion_name: promotion.name,
    promotion_price: promotion.price,
  })
}

/**
 * Track service/treatment views
 */
export function trackServiceView(service: {
  id: string
  name: string
  category: string
  price: number
  duration?: number
}) {
  pushToDataLayer({
    event: 'view_item',
    ecommerce: {
      items: [{
        item_id: service.id,
        item_name: service.name,
        item_category: service.category,
        price: service.price,
        quantity: 1,
      }],
    },
  })
}

/**
 * Track form submissions
 */
export function trackFormSubmission(
  formName: string,
  success: boolean,
  additionalData?: Record<string, unknown>
) {
  pushToDataLayer({
    event: 'form_submission',
    form_name: formName,
    form_success: success,
    ...additionalData,
  })
}

/**
 * Track outbound link clicks
 */
export function trackOutboundLink(url: string, linkText?: string) {
  pushToDataLayer({
    event: 'outbound_click',
    outbound_url: url,
    link_text: linkText,
  })
}

/**
 * Track phone/WhatsApp clicks
 */
export function trackContactClick(
  type: 'phone' | 'whatsapp' | 'email',
  value: string
) {
  pushToDataLayer({
    event: 'contact_click',
    contact_type: type,
    contact_value: value,
  })
}

/**
 * Track locale/language changes
 */
export function trackLocaleChange(fromLocale: string, toLocale: string) {
  pushToDataLayer({
    event: 'locale_change',
    from_locale: fromLocale,
    to_locale: toLocale,
  })
}

/**
 * Set user properties (for logged-in portal users)
 */
export function setUserProperties(properties: {
  user_id?: string
  client_id?: string
  is_returning_customer?: boolean
}) {
  pushToDataLayer({
    event: 'set_user_properties',
    user_properties: properties,
  })
}
