'use client'

import { useEffect, useState } from 'react'
import { Sparkles, ArrowLeft, ArrowRight, Loader2, ChevronDown, ChevronUp, Clock, Check, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBookingStore, selectHasServices } from '@/lib/booking/store'
import type { MindbodyService } from '@/types/booking'

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
        
        // Expand first category by default
        if (Object.keys(data.grouped).length > 0) {
          setExpandedCategories(new Set([Object.keys(data.grouped)[0]]))
        }
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
  
  return (
    <div className="service-step">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold/60 rounded-full 
                      flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-dark mb-2">
          Selecciona tus Tratamientos
        </h2>
        <p className="text-warm-gray">
          Elige uno o más servicios para tu visita
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
      
      {/* Service Categories */}
      {!isLoading && (
        <div className="space-y-4">
          {Object.entries(groupedServices).map(([category, categoryServices]) => (
            <div 
              key={category}
              className="border border-beige-200 rounded-xl overflow-hidden"
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full px-5 py-4 bg-beige-50 flex items-center justify-between
                         hover:bg-beige-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold text-dark">{category}</span>
                  <span className="text-sm text-warm-gray bg-white px-2 py-0.5 rounded-full">
                    {categoryServices.length} servicios
                  </span>
                </div>
                {expandedCategories.has(category) ? (
                  <ChevronUp className="w-5 h-5 text-warm-gray" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-warm-gray" />
                )}
              </button>
              
              {/* Category Services */}
              <AnimatePresence>
                {expandedCategories.has(category) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="divide-y divide-beige-100">
                      {categoryServices.map((service) => {
                        const selected = isServiceSelected(service.Id)
                        
                        return (
                          <button
                            key={service.Id}
                            onClick={() => handleToggleService(service)}
                            className={`
                              w-full p-4 flex items-center gap-4 text-left
                              transition-all duration-200
                              ${selected 
                                ? 'bg-gold/10' 
                                : 'hover:bg-beige-50'
                              }
                            `}
                          >
                            {/* Selection Indicator */}
                            <div className={`
                              w-8 h-8 rounded-full flex items-center justify-center
                              flex-shrink-0 transition-all
                              ${selected 
                                ? 'bg-gold text-dark' 
                                : 'border-2 border-beige-300 text-transparent'
                              }
                            `}>
                              {selected ? (
                                <Check className="w-5 h-5" />
                              ) : (
                                <Plus className="w-5 h-5 text-beige-300" />
                              )}
                            </div>
                            
                            {/* Service Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-medium ${selected ? 'text-dark' : 'text-dark'}`}>
                                {service.Name}
                              </h4>
                              {service.Description && (
                                <p className="text-sm text-warm-gray line-clamp-2 mt-1">
                                  {service.Description}
                                </p>
                              )}
                              {service.Duration > 0 && (
                                <div className="flex items-center gap-3 mt-2">
                                  <span className="text-xs text-warm-gray flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {service.Duration} min
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {/* Price */}
                            <div className="text-right flex-shrink-0">
                              {service.Price > 0 ? (
                                <span className={`
                                  text-lg font-bold
                                  ${selected ? 'text-gold-600' : 'text-dark'}
                                `}>
                                  ${service.Price.toFixed(0)}
                                </span>
                              ) : (
                                <span className="text-sm text-warm-gray">
                                  Consultar
                                </span>
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
      
      {/* Selected Count */}
      {selectedServices.length > 0 && (
        <div className="mt-6 p-4 bg-gold/10 border border-gold/30 rounded-xl">
          <p className="text-dark font-medium">
            {selectedServices.length} servicio{selectedServices.length !== 1 ? 's' : ''} seleccionado{selectedServices.length !== 1 ? 's' : ''}
          </p>
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
