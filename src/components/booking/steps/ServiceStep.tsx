'use client'

import { useEffect, useState } from 'react'
import { Sparkles, Loader2, ChevronDown, ChevronUp, Clock, Check, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBookingStore, selectHasServices } from '@/lib/booking/store'
import type { MindbodyService } from '@/types/booking'

interface TreatmentSetting {
  mindbody_service_id: number
  is_visible: boolean
  show_booking_button: boolean
  is_top_pick: boolean
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
  onToggle
}: {
  service: MindbodyService
  isSelected: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        relative rounded-xl border-2 transition-all duration-200 overflow-hidden text-left w-full
        ${isSelected
          ? 'border-gold bg-gold/5 shadow-md ring-2 ring-gold/20'
          : 'border-beige-200 bg-white hover:border-gold/50 hover:shadow-sm'
        }
      `}
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
      <div className="p-3">
        {/* Service Name */}
        <div className="pr-8 mb-2">
          <h4 className="font-semibold text-dark text-sm sm:text-base leading-snug">
            {service.Name}
          </h4>
        </div>

        {/* Price & Duration Row */}
        <div className="flex items-center gap-2">
          <span className={`
            text-lg font-bold
            ${isSelected ? 'text-gold-600' : 'text-dark'}
          `}>
            {service.Price > 0 ? `$${service.Price.toFixed(0)}` : 'Consultar'}
          </span>
          {service.Duration > 0 && (
            <span className="flex items-center gap-1 text-xs text-warm-gray bg-beige-100 px-2 py-0.5 rounded-full">
              <Clock className="w-3 h-3" />
              {service.Duration} min
            </span>
          )}
        </div>
      </div>
    </button>
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
  } = useBookingStore()

  const hasServices = useBookingStore(selectHasServices)
  const [groupedServices, setGroupedServices] = useState<Record<string, MindbodyService[]>>({})
  const [topPickServices, setTopPickServices] = useState<MindbodyService[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [isRecommendationsExpanded, setIsRecommendationsExpanded] = useState(true)
  const [isLoadingServices, setIsLoadingServices] = useState(false)
  const [servicesError, setServicesError] = useState<string | null>(null)

  // Fetch services and treatment settings on mount
  useEffect(() => {
    async function fetchServices() {
      if (!selectedLocation) return

      setIsLoadingServices(true)
      setServicesError(null)
      try {
        // Fetch services and treatment settings in parallel
        const [servicesResponse, settingsResponse] = await Promise.all([
          fetch(`/api/mindbody/services?locationId=${selectedLocation.Id}&type=main`),
          fetch('/api/treatments/settings')
        ])

        const servicesData = await servicesResponse.json()
        const settingsData = await settingsResponse.json()

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

        // Filter top pick services
        const topPicks = servicesData.services.filter((service: MindbodyService) => {
          const setting = settingsMap.get(service.Id)
          return setting?.is_top_pick === true
        })

        setServices(servicesData.services)
        setGroupedServices(servicesData.grouped)
        setTopPickServices(topPicks)

        // Start with all categories collapsed (empty set)
        // Recommendations section starts expanded
        setExpandedCategories(new Set())
      } catch (err) {
        setServicesError(err instanceof Error ? err.message : 'Error de conexión')
      } finally {
        setIsLoadingServices(false)
      }
    }

    fetchServices()
  }, [selectedLocation, setServices])
  
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
      {!isLoadingServices && Object.keys(groupedServices).length === 0 && (
        <div className="text-center py-12 bg-beige-50 rounded-xl">
          <Sparkles className="w-12 h-12 text-beige-300 mx-auto mb-3" />
          <p className="text-warm-gray">No hay servicios disponibles</p>
        </div>
      )}
      </div>

    </div>
  )
}
