'use client'

import { useEffect, useState } from 'react'
import { Sparkles, Loader2, ChevronDown, ChevronUp, Clock, Check, Star, Info, X, Tag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBookingStore, selectHasServices } from '@/lib/booking/store'
import type { MindbodyService, PromotionWithServices } from '@/types/booking'
import type { Promotion } from '@/types'
import { LocationPills } from '../shared/LocationPills'

// Description Modal Component
function DescriptionModal({
  service,
  onClose,
  discountPercent = 0,
  showDiscount = false,
}: {
  service: MindbodyService
  onClose: () => void
  discountPercent?: number
  showDiscount?: boolean
}) {
  const discountedPrice = showDiscount && discountPercent > 0
    ? Math.round(service.Price * (1 - discountPercent / 100) * 100) / 100
    : null
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-beige-200 bg-gradient-to-r from-gold-50 to-beige-50">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-dark text-lg leading-snug">
                {service.Name}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                {service.Price > 0 ? (
                  discountedPrice !== null ? (
                    <span className="flex items-center gap-1.5">
                      <span className="text-sm line-through text-warm-gray">${service.Price.toFixed(0)}</span>
                      <span className="font-bold text-green-600">${discountedPrice.toFixed(0)}</span>
                    </span>
                  ) : (
                    <span className="text-gold-600 font-bold">${service.Price.toFixed(0)}</span>
                  )
                ) : (
                  <span className="text-gold-600 font-bold">Consultar</span>
                )}
                {service.Duration > 0 && (
                  <span className="flex items-center gap-1 text-xs text-warm-gray bg-white/80 px-2 py-0.5 rounded-full">
                    <Clock className="w-3 h-3" />
                    {service.Duration} min
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/80 transition-colors"
            >
              <X className="w-5 h-5 text-warm-gray" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-4 overflow-y-auto max-h-[50vh]">
          {service.Description ? (
            <div
              className="text-sm text-warm-gray-600 leading-relaxed prose prose-sm [&_p]:mb-2 [&_br]:hidden"
              dangerouslySetInnerHTML={{ __html: service.Description }}
            />
          ) : (
            <p className="text-sm text-warm-gray italic">
              No hay descripción disponible para este tratamiento.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  )
}

interface TreatmentSetting {
  mindbody_service_id: number
  is_visible: boolean
  show_in_booking: boolean // Show in booking widget for direct selection
  show_booking_button: boolean
  is_top_pick: boolean
}

// Promotion Tile Component - Shows only final price, with expandable services list
function PromotionTile({
  promotion,
  isSelected,
  isLoading,
  onSelect,
  allServices
}: {
  promotion: Promotion
  isSelected: boolean
  isLoading: boolean
  onSelect: () => void
  allServices: MindbodyService[]
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Get service names from the allServices list
  // Check both Id (SessionTypeId) and ProductId since promotions might store either
  const includedServices = promotion.mindbody_service_ids
    ? allServices.filter(s =>
        promotion.mindbody_service_ids!.includes(s.Id) ||
        (s.ProductId && promotion.mindbody_service_ids!.includes(s.ProductId))
      )
    : []

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  return (
    <div
      className={`
        relative rounded-xl border-2 transition-all duration-200 overflow-hidden text-left w-full
        ${isSelected
          ? 'border-gold bg-gradient-to-br from-gold/20 to-gold/5 shadow-lg ring-2 ring-gold/30'
          : 'border-gold/30 bg-gradient-to-br from-gold/10 to-beige-50 hover:border-gold/60 hover:shadow-md'
        }
        ${isLoading ? 'opacity-70 cursor-wait' : ''}
      `}
    >
      {/* Main content - clickable to select */}
      <button
        type="button"
        onClick={onSelect}
        disabled={isLoading}
        className="w-full text-left p-4"
      >
        {/* Selected Badge */}
        {isSelected && (
          <div className="absolute top-2 right-2 z-10">
            <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center shadow-sm">
              <Check className="w-4 h-4 text-dark" />
            </div>
          </div>
        )}

        {/* Content */}
        <div>
          <div className="flex items-start gap-2 mb-2">
            <Tag className="w-4 h-4 text-gold-600 mt-0.5 flex-shrink-0" />
            <h4 className="font-semibold text-dark text-sm sm:text-base leading-snug pr-8">
              {promotion.title_es}
            </h4>
          </div>

          {/* Price Row - Only final price, no original price */}
          <div className="flex items-center gap-3 ml-6">
            <span className="text-lg font-bold text-gold-700">
              ${promotion.price.toFixed(0)}
            </span>
            {promotion.duration_minutes && (
              <span className="flex items-center gap-1 text-xs text-warm-gray bg-white/60 px-2 py-0.5 rounded-full">
                <Clock className="w-3 h-3" />
                {promotion.duration_minutes} min
              </span>
            )}
          </div>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-xl">
            <Loader2 className="w-6 h-6 text-gold animate-spin" />
          </div>
        )}
      </button>

      {/* Expandable services section */}
      {includedServices.length > 0 && (
        <>
          <button
            type="button"
            onClick={handleToggleExpand}
            className="w-full px-4 py-2 border-t border-gold/20 flex items-center justify-between text-xs text-gold-700 hover:bg-gold/5 transition-colors"
          >
            <span>
              Ver {includedServices.length} servicio{includedServices.length !== 1 ? 's' : ''} incluido{includedServices.length !== 1 ? 's' : ''}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-3 pt-1 space-y-1.5 bg-white/50">
                  {includedServices.map((service) => (
                    <div key={service.Id} className="flex items-start gap-2">
                      <span className="text-gold-600 text-xs mt-0.5">✓</span>
                      <div>
                        <p className="text-sm text-dark">{service.Name}</p>
                        {service.Duration > 0 && (
                          <p className="text-xs text-warm-gray">{service.Duration} min</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}

// Category configuration with icons and colors
const CATEGORY_CONFIG: Record<string, { icon: string; color: string; gradient: string }> = {
  'Tratamientos Corporales': { icon: '💆', color: 'bg-amber-100', gradient: 'from-amber-500/20 to-amber-600/5' },
  'Tratamientos Faciales': { icon: '✨', color: 'bg-pink-100', gradient: 'from-pink-500/20 to-pink-600/5' },
  'Paquetes Deluxe': { icon: '👑', color: 'bg-purple-100', gradient: 'from-purple-500/20 to-purple-600/5' },
  'Paquetes de Masajes': { icon: '🌿', color: 'bg-green-100', gradient: 'from-green-500/20 to-green-600/5' },
  'Tratamientos Parejas': { icon: '💕', color: 'bg-red-100', gradient: 'from-red-500/20 to-red-600/5' },
  'TAI': { icon: '🧘', color: 'bg-blue-100', gradient: 'from-blue-500/20 to-blue-600/5' },
  'Eventos': { icon: '🎉', color: 'bg-yellow-100', gradient: 'from-yellow-500/20 to-yellow-600/5' },
}

const DEFAULT_CONFIG = { icon: '🌸', color: 'bg-beige-100', gradient: 'from-gold/20 to-gold/5' }

// Service Tile Component - Clickable anywhere
function ServiceTile({
  service,
  isSelected,
  onToggle,
  onShowDescription,
  discountPercent = 0,
  showDiscount = false,
}: {
  service: MindbodyService
  isSelected: boolean
  onToggle: () => void
  onShowDescription: () => void
  discountPercent?: number
  showDiscount?: boolean
}) {
  const discountedPrice = showDiscount && discountPercent > 0
    ? Math.round(service.Price * (1 - discountPercent / 100) * 100) / 100
    : null

  return (
    <div
      className={`
        relative rounded-xl border-2 transition-all duration-200 overflow-hidden text-left w-full
        ${isSelected
          ? 'border-gold bg-gold/5 shadow-md ring-2 ring-gold/20'
          : 'border-beige-200 bg-white hover:border-gold/50 hover:shadow-sm'
        }
      `}
    >
      {/* Main clickable area */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left p-3"
      >
        {/* Selected Badge */}
        {isSelected && (
          <div className="absolute top-2 right-2 z-10">
            <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center shadow-sm">
              <Check className="w-4 h-4 text-dark" />
            </div>
          </div>
        )}

        {/* Tile Content */}
        {/* Service Name */}
        <div className="pr-8 mb-2">
          <h4 className="font-semibold text-dark text-sm sm:text-base leading-snug">
            {service.Name}
          </h4>
        </div>

        {/* Price & Duration Row */}
        <div className="flex items-center gap-2">
          {service.Price > 0 ? (
            discountedPrice !== null ? (
              <span className="flex items-center gap-1.5">
                <span className="text-sm line-through text-warm-gray">${service.Price.toFixed(0)}</span>
                <span className="text-lg font-bold text-green-600">${discountedPrice.toFixed(0)}</span>
              </span>
            ) : (
              <span className={`text-lg font-bold ${isSelected ? 'text-gold-600' : 'text-dark'}`}>
                ${service.Price.toFixed(0)}
              </span>
            )
          ) : (
            <span className={`text-lg font-bold ${isSelected ? 'text-gold-600' : 'text-dark'}`}>
              Consultar
            </span>
          )}
          {service.Duration > 0 && (
            <span className="flex items-center gap-1 text-xs text-warm-gray bg-beige-100 px-2 py-0.5 rounded-full">
              <Clock className="w-3 h-3" />
              {service.Duration} min
            </span>
          )}
        </div>
      </button>

      {/* Info Icon - positioned at bottom right */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onShowDescription()
        }}
        className="absolute bottom-2 right-2 p-1.5 rounded-full bg-gold/10 hover:bg-gold/20 transition-colors"
        title="Ver descripción"
      >
        <Info className="w-4 h-4 text-gold-600" />
      </button>
    </div>
  )
}

export function ServiceStep() {
  const {
    selectedLocation,
    services,
    setServices,
    selectedServices,
    addService,
    removeService,
    activePromotion,
    loadPromotion,
    clearPromotion,
    setStep,
    globalDiscountPercent,
    globalDiscountActive,
  } = useBookingStore()

  const showGlobalDiscount = globalDiscountActive && globalDiscountPercent > 0

  const hasServices = useBookingStore(selectHasServices)
  const [groupedServices, setGroupedServices] = useState<Record<string, MindbodyService[]>>({})
  const [topPickServices, setTopPickServices] = useState<MindbodyService[]>([])
  const [treatmentSettings, setTreatmentSettings] = useState<Map<number, TreatmentSetting>>(new Map())
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [isRecommendationsExpanded, setIsRecommendationsExpanded] = useState(true)
  const [isPromotionsExpanded, setIsPromotionsExpanded] = useState(true)
  const [isLoadingServices, setIsLoadingServices] = useState(false)
  const [servicesError, setServicesError] = useState<string | null>(null)
  const [descriptionService, setDescriptionService] = useState<MindbodyService | null>(null)

  // Promotion state
  const [activePromotions, setActivePromotions] = useState<Promotion[]>([])
  const [loadingPromotionId, setLoadingPromotionId] = useState<string | null>(null)

  // Fetch services, treatment settings, and active promotions on mount
  // State for all online services (for promotion lookups - no session type filter)
  const [allOnlineServices, setAllOnlineServices] = useState<MindbodyService[]>([])

  useEffect(() => {
    async function fetchServicesAndPromotions() {
      if (!selectedLocation) return

      setIsLoadingServices(true)
      setServicesError(null)
      try {
        // Fetch services twice:
        // 1. Regular services (with session type filter) for direct booking
        // 2. All online services (no session type filter) for promotion display
        // Also fetch treatment settings and active promotions
        const [servicesResponse, allServicesResponse, settingsResponse, promotionsResponse] = await Promise.all([
          fetch(`/api/mindbody/services?locationId=${selectedLocation.Id}&type=main`),
          fetch(`/api/mindbody/services?locationId=${selectedLocation.Id}&type=main&forPromotions=true`),
          fetch('/api/treatments/settings'),
          fetch('/api/promotions?active=true')
        ])

        const servicesData = await servicesResponse.json()
        const allServicesData = await allServicesResponse.json()
        const settingsData = await settingsResponse.json()
        const promotionsData = await promotionsResponse.json()

        if (!servicesResponse.ok) {
          throw new Error(servicesData.error || 'Error al cargar servicios')
        }

        // Create a map of settings by mindbody_service_id
        const settingsMap = new Map<number, TreatmentSetting>()
        if (settingsData.settings) {
          for (const setting of settingsData.settings) {
            settingsMap.set(setting.mindbody_service_id, setting)
          }
        }
        setTreatmentSettings(settingsMap)

        // Helper to check if service should be shown in booking widget
        // Default to true if no setting exists (allow services without explicit settings)
        const shouldShowInBooking = (serviceId: number) => {
          const setting = settingsMap.get(serviceId)
          return setting?.show_in_booking !== false // Show if not explicitly hidden
        }

        // Filter top pick services (must be top pick AND show_in_booking)
        const topPicks = servicesData.services.filter((service: MindbodyService) => {
          const setting = settingsMap.get(service.Id)
          return setting?.is_top_pick === true && shouldShowInBooking(service.Id)
        })

        // Filter grouped services to only show those with show_in_booking: true
        const filteredGrouped: Record<string, MindbodyService[]> = {}
        for (const [category, categoryServices] of Object.entries(servicesData.grouped as Record<string, MindbodyService[]>)) {
          const filtered = categoryServices.filter((service: MindbodyService) => shouldShowInBooking(service.Id))
          // Only include categories that have at least one visible service
          if (filtered.length > 0) {
            filteredGrouped[category] = filtered
          }
        }

        setServices(servicesData.services) // Services with session type filter for direct booking
        setAllOnlineServices(allServicesData.services || []) // ALL online services for promotion lookups
        setGroupedServices(filteredGrouped)
        setTopPickServices(topPicks)

        // Set active promotions (filter only those with mindbody_service_ids)
        if (promotionsData.data) {
          const promotionsWithServices = promotionsData.data.filter(
            (p: Promotion) => p.mindbody_service_ids && p.mindbody_service_ids.length > 0
          )
          setActivePromotions(promotionsWithServices)
        }

        // P2: categories expanded by default — a hidden service used to cost
        // 2 extra taps
        setExpandedCategories(new Set(Object.keys(filteredGrouped)))
      } catch (err) {
        setServicesError(err instanceof Error ? err.message : 'Error de conexión')
      } finally {
        setIsLoadingServices(false)
      }
    }

    fetchServicesAndPromotions()
  }, [selectedLocation, setServices])

  // Handle selecting a promotion
  const handleSelectPromotion = async (promotion: Promotion) => {
    // If clicking the already selected promotion, deselect it
    if (activePromotion?.id === promotion.id) {
      clearPromotion()
      return
    }

    setLoadingPromotionId(promotion.id)
    try {
      // Fetch promotion with full Mindbody services
      const response = await fetch(`/api/promotions/${promotion.id}/with-services`)

      if (!response.ok) {
        console.error('Failed to fetch promotion services')
        return
      }

      const { data: promotionWithServices } = await response.json() as { data: PromotionWithServices }

      // loadPromotion replaces the whole cart — never silently discard
      // services the client already picked by hand.
      if (
        selectedServices.length > 0 &&
        !window.confirm(
          'Elegir esta promoción reemplaza los servicios que ya seleccionaste. ¿Continuar?'
        )
      ) {
        return
      }

      // Load promotion into cart (this will set selectedServices and activePromotion)
      loadPromotion(promotionWithServices)

      // loadPromotion sets step to 'addons', but we want to stay on services
      // so user can see what was added and continue browsing
      setStep('services')

    } catch (error) {
      console.error('Error loading promotion:', error)
    } finally {
      setLoadingPromotionId(null)
    }
  }
  
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }
  
  const isServiceSelected = (serviceId: number) => {
    return selectedServices.some(s => s.Id === serviceId)
  }
  
  const handleToggleService = (service: MindbodyService) => {
    // Use the current state from the check to avoid race conditions
    const currentlySelected = isServiceSelected(service.Id)
    if (currentlySelected) {
      removeService(service.Id)
    } else {
      addService(service)
    }
  }
  
  const getCategoryConfig = (category: string) => {
    return CATEGORY_CONFIG[category] || DEFAULT_CONFIG
  }
  
  return (
    <div className="service-step flex flex-col h-full">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-4">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold/60 rounded-full
                      flex items-center justify-center mx-auto mb-2 shadow-md">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg font-bold text-dark mb-0.5">
          Selecciona tus Tratamientos
        </h2>
        <p className="text-xs text-warm-gray">
          Explora las categorías y agrega servicios a tu carrito
        </p>
      </div>

      {/* Location pill selector (P2 — no separate location screen) */}
      <LocationPills />

      {/* Global Discount Banner */}
      {showGlobalDiscount && (
        <div className="mb-4 flex items-center gap-2.5 px-3 py-2.5 bg-green-50 border border-green-200 rounded-xl">
          <Tag className="w-4 h-4 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-700">
            <span className="font-semibold">{globalDiscountPercent}% de descuento</span>
            {' '}en todas las reservas online
          </p>
        </div>
      )}
      
      {/* Loading State */}
      {isLoadingServices && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-10 h-10 text-gold animate-spin mb-4" />
          <p className="text-warm-gray">Cargando servicios...</p>
        </div>
      )}

      {/* Error State */}
      {servicesError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-6">
          {servicesError}
        </div>
      )}

      {/* Active Promotions Section */}
      {!isLoadingServices && activePromotions.length > 0 && (
        <div className="mb-4 rounded-2xl border-2 border-gold/40 overflow-hidden bg-gradient-to-br from-gold/15 via-gold/5 to-beige-50 shadow-sm">
          {/* Promotions Header */}
          <button
            onClick={() => setIsPromotionsExpanded(!isPromotionsExpanded)}
            className="w-full px-4 py-4 flex items-center justify-between hover:brightness-[0.98] transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold/70 rounded-full flex items-center justify-center shadow-md">
                <Tag className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-dark">Promociones Activas</h3>
                <p className="text-xs text-warm-gray">
                  {activePromotions.length} oferta{activePromotions.length !== 1 ? 's' : ''} especial{activePromotions.length !== 1 ? 'es' : ''}
                  {activePromotion && (
                    <span className="ml-2 text-gold-600 font-medium">• 1 seleccionada</span>
                  )}
                </p>
              </div>
            </div>

            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center
              ${isPromotionsExpanded ? 'bg-gold/20' : 'bg-white/50'}
              transition-colors
            `}>
              {isPromotionsExpanded ? (
                <ChevronUp className="w-5 h-5 text-dark" />
              ) : (
                <ChevronDown className="w-5 h-5 text-warm-gray" />
              )}
            </div>
          </button>

          {/* Promotions List */}
          <AnimatePresence>
            {isPromotionsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 pt-0 space-y-3">
                  {activePromotions.map((promotion) => (
                    <PromotionTile
                      key={promotion.id}
                      promotion={promotion}
                      isSelected={activePromotion?.id === promotion.id}
                      isLoading={loadingPromotionId === promotion.id}
                      onSelect={() => handleSelectPromotion(promotion)}
                      allServices={allOnlineServices}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Recommendations Section (Top Picks) */}
      {!isLoadingServices && topPickServices.length > 0 && (
        <div className="mb-4 rounded-2xl border border-gold-300 overflow-hidden bg-gradient-to-r from-gold-50 to-beige-50 shadow-sm">
          {/* Recommendations Header */}
          <button
            onClick={() => setIsRecommendationsExpanded(!isRecommendationsExpanded)}
            className="w-full px-4 py-4 flex items-center justify-between hover:brightness-[0.98] transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 text-gold-500 fill-gold-500" />
              <div className="text-left">
                <h3 className="font-semibold text-dark">Nuestras Recomendaciones</h3>
                <p className="text-xs text-warm-gray">
                  {topPickServices.length} tratamiento{topPickServices.length !== 1 ? 's' : ''} destacado{topPickServices.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center
              ${isRecommendationsExpanded ? 'bg-gold/20' : 'bg-white/50'}
              transition-colors
            `}>
              {isRecommendationsExpanded ? (
                <ChevronUp className="w-5 h-5 text-dark" />
              ) : (
                <ChevronDown className="w-5 h-5 text-warm-gray" />
              )}
            </div>
          </button>

          {/* Recommendations Services */}
          <AnimatePresence>
            {isRecommendationsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {topPickServices.map((service) => (
                      <ServiceTile
                        key={service.Id}
                        service={service}
                        isSelected={isServiceSelected(service.Id)}
                        onToggle={() => handleToggleService(service)}
                        onShowDescription={() => setDescriptionService(service)}
                        discountPercent={globalDiscountPercent}
                        showDiscount={showGlobalDiscount}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Category Tiles */}
      {!isLoadingServices && (
        <div className="space-y-4">
          {Object.entries(groupedServices).map(([category, categoryServices]) => {
            const config = getCategoryConfig(category)
            const isExpanded = expandedCategories.has(category)
            const selectedInCategory = categoryServices.filter(s => isServiceSelected(s.Id)).length
            
            return (
              <div 
                key={category}
                className="rounded-2xl border border-beige-200 overflow-hidden bg-white shadow-sm"
              >
                {/* Category Header Tile */}
                <button
                  onClick={() => toggleCategory(category)}
                  className={`
                    w-full px-4 py-4 flex items-center justify-between
                    bg-gradient-to-r ${config.gradient}
                    hover:brightness-[0.98] transition-all duration-200
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" role="img" aria-hidden="true">
                      {config.icon}
                    </span>
                    <div className="text-left">
                      <h3 className="font-semibold text-dark">{category}</h3>
                      <p className="text-xs text-warm-gray">
                        {categoryServices.length} tratamiento{categoryServices.length !== 1 ? 's' : ''}
                        {selectedInCategory > 0 && (
                          <span className="ml-2 text-gold-600 font-medium">
                            • {selectedInCategory} en carrito
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {selectedInCategory > 0 && (
                      <span className="w-6 h-6 bg-gold text-dark text-xs font-bold 
                                     rounded-full flex items-center justify-center">
                        {selectedInCategory}
                      </span>
                    )}
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${isExpanded ? 'bg-gold/20' : 'bg-white/50'}
                      transition-colors
                    `}>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-dark" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-warm-gray" />
                      )}
                    </div>
                  </div>
                </button>
                
                {/* Services Grid */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 bg-beige-50/30">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {categoryServices.map((service) => (
                            <ServiceTile
                              key={service.Id}
                              service={service}
                              isSelected={isServiceSelected(service.Id)}
                              onToggle={() => handleToggleService(service)}
                              onShowDescription={() => setDescriptionService(service)}
                              discountPercent={globalDiscountPercent}
                              showDiscount={showGlobalDiscount}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      )}
      
      {/* Empty State */}
      {!isLoadingServices && selectedLocation && Object.keys(groupedServices).length === 0 && (
        <div className="text-center py-12 bg-beige-50 rounded-xl">
          <Sparkles className="w-12 h-12 text-beige-300 mx-auto mb-3" />
          <p className="text-warm-gray">No hay servicios disponibles</p>
        </div>
      )}

      </div>

      {/* Description Modal */}
      <AnimatePresence>
        {descriptionService && (
          <DescriptionModal
            service={descriptionService}
            onClose={() => setDescriptionService(null)}
            discountPercent={globalDiscountPercent}
            showDiscount={showGlobalDiscount}
          />
        )}
      </AnimatePresence>

    </div>
  )
}
