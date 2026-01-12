'use client'

import { useEffect, useState } from 'react'
import { Sparkles, ArrowLeft, ArrowRight, Loader2, ChevronDown, ChevronUp, Clock, Check, Plus, Info, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBookingStore, selectHasServices } from '@/lib/booking/store'
import type { MindbodyService } from '@/types/booking'

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

// Service Tile Component
function ServiceTile({ 
  service, 
  isSelected, 
  onToggle 
}: { 
  service: MindbodyService
  isSelected: boolean
  onToggle: () => void 
}) {
  const [showDetails, setShowDetails] = useState(false)
  
  return (
    <div className="relative">
      <div
        className={`
          relative rounded-xl border-2 transition-all duration-200 overflow-hidden
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
        <div className="p-4">
          {/* Name & Price */}
          <div className="flex items-start justify-between gap-2 mb-2 pr-8">
            <h4 className="font-medium text-dark text-sm leading-tight">
              {service.Name}
            </h4>
          </div>
          
          {/* Price Badge */}
          <div className="mb-3">
            <span className={`
              inline-block text-lg font-bold
              ${isSelected ? 'text-gold-600' : 'text-dark'}
            `}>
              {service.Price > 0 ? `$${service.Price.toFixed(0)}` : 'Consultar'}
            </span>
            {service.Duration > 0 && (
              <span className="ml-2 text-xs text-warm-gray">
                • {service.Duration} min
              </span>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggle}
              className={`
                flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg
                font-medium text-sm transition-all duration-200
                ${isSelected
                  ? 'bg-gold text-dark hover:bg-gold/90'
                  : 'bg-beige-100 text-dark hover:bg-beige-200'
                }
              `}
            >
              {isSelected ? (
                <>
                  <Check className="w-4 h-4" />
                  Agregado
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Agregar
                </>
              )}
            </button>
            
            {service.Description && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDetails(!showDetails)
                }}
                className={`
                  p-2.5 rounded-lg transition-all duration-200
                  ${showDetails 
                    ? 'bg-gold/20 text-gold-600' 
                    : 'bg-beige-100 text-warm-gray hover:bg-beige-200'
                  }
                `}
                aria-label="Ver detalles"
              >
                {showDetails ? <X className="w-4 h-4" /> : <Info className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
        
        {/* Expandable Description */}
        <AnimatePresence>
          {showDetails && service.Description && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-2 border-t border-beige-100 bg-beige-50/50">
                <p className="text-sm text-warm-gray leading-relaxed">
                  {service.Description}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
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
    nextStep,
    prevStep,
    setLoading,
    setError,
    isLoading,
    error
  } = useBookingStore()
  
  const hasServices = useBookingStore(selectHasServices)
  const [groupedServices, setGroupedServices] = useState<Record<string, MindbodyService[]>>({})
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  
  // Fetch services on mount
  useEffect(() => {
    async function fetchServices() {
      if (!selectedLocation) return
      
      setLoading(true)
      try {
        const response = await fetch(
          `/api/mindbody/services?locationId=${selectedLocation.Id}&type=main`
        )
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Error al cargar servicios')
        }
        
        setServices(data.services)
        setGroupedServices(data.grouped)
        
        // Expand all categories by default
        setExpandedCategories(new Set(Object.keys(data.grouped)))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error de conexión')
      } finally {
        setLoading(false)
      }
    }
    
    fetchServices()
  }, [selectedLocation, setServices, setLoading, setError])
  
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
    if (isServiceSelected(service.Id)) {
      removeService(service.Id)
    } else {
      addService(service)
    }
  }
  
  const getCategoryConfig = (category: string) => {
    return CATEGORY_CONFIG[category] || DEFAULT_CONFIG
  }
  
  return (
    <div className="service-step">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-gradient-to-br from-gold to-gold/60 rounded-full 
                      flex items-center justify-center mx-auto mb-3 shadow-lg">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-xl font-bold text-dark mb-1">
          Selecciona tus Tratamientos
        </h2>
        <p className="text-sm text-warm-gray">
          Explora las categorías y agrega servicios a tu carrito
        </p>
      </div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-10 h-10 text-gold animate-spin mb-4" />
          <p className="text-warm-gray">Cargando servicios...</p>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-6">
          {error}
        </div>
      )}
      
      {/* Category Tiles */}
      {!isLoading && (
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
      {!isLoading && Object.keys(groupedServices).length === 0 && (
        <div className="text-center py-12 bg-beige-50 rounded-xl">
          <Sparkles className="w-12 h-12 text-beige-300 mx-auto mb-3" />
          <p className="text-warm-gray">No hay servicios disponibles</p>
        </div>
      )}
      
      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={prevStep}
          className="flex items-center gap-2 text-warm-gray hover:text-dark transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>
        
        <button
          onClick={nextStep}
          disabled={!hasServices}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold to-gold/90 
                   text-dark font-semibold rounded-xl hover:shadow-lg transition-all
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continuar
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
