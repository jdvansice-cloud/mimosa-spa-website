'use client'

import { useEffect, useState } from 'react'
import { Plus, ArrowLeft, ArrowRight, Loader2, Clock, Check, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useBookingStore } from '@/lib/booking/store'
import type { MindbodyService } from '@/types/booking'

export function AddonsStep() {
  const {
    selectedLocation,
    addons,
    setAddons,
    selectedAddons,
    addAddon,
    removeAddon,
    nextStep,
    prevStep,
    setLoading,
    setError,
    isLoading,
    error
  } = useBookingStore()
  
  const [localAddons, setLocalAddons] = useState<MindbodyService[]>([])
  
  // Fetch addons on mount
  useEffect(() => {
    async function fetchAddons() {
      if (!selectedLocation) return
      
      if (addons.length > 0) {
        setLocalAddons(addons)
        return
      }
      
      setLoading(true)
      try {
        const response = await fetch(
          `/api/mindbody/services?locationId=${selectedLocation.Id}&type=addons`
        )
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Error al cargar adicionales')
        }
        
        setAddons(data.services)
        setLocalAddons(data.services)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error de conexión')
      } finally {
        setLoading(false)
      }
    }
    
    fetchAddons()
  }, [selectedLocation, addons, setAddons, setLoading, setError])
  
  const isAddonSelected = (addonId: number) => {
    return selectedAddons.some(a => a.Id === addonId)
  }
  
  const handleToggleAddon = (addon: MindbodyService) => {
    if (isAddonSelected(addon.Id)) {
      removeAddon(addon.Id)
    } else {
      addAddon(addon)
    }
  }
  
  return (
    <div className="addons-step">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold/60 rounded-full 
                      flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Plus className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-dark mb-2">
          ¿Deseas agregar algo más?
        </h2>
        <p className="text-warm-gray">
          Mejora tu experiencia con servicios adicionales
        </p>
      </div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-10 h-10 text-gold animate-spin mb-4" />
          <p className="text-warm-gray">Cargando adicionales...</p>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-6">
          {error}
        </div>
      )}
      
      {/* No Addons Available */}
      {!isLoading && localAddons.length === 0 && (
        <div className="text-center py-12 bg-beige-50 rounded-xl">
          <p className="text-warm-gray mb-4">No hay adicionales disponibles</p>
          <button
            onClick={nextStep}
            className="text-gold font-medium hover:underline"
          >
            Continuar sin adicionales →
          </button>
        </div>
      )}
      
      {/* Addon Cards */}
      {!isLoading && localAddons.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {localAddons.map((addon, index) => {
            const selected = isAddonSelected(addon.Id)
            
            return (
              <motion.button
                key={addon.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleToggleAddon(addon)}
                className={`
                  p-5 border-2 rounded-xl text-left transition-all duration-200
                  ${selected 
                    ? 'border-gold bg-gold/10 shadow-md' 
                    : 'border-beige-200 bg-white hover:border-gold/50 hover:bg-beige-50'
                  }
                `}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-dark mb-1">
                      {addon.Name}
                    </h4>
                    {addon.Description && (
                      <p className="text-sm text-warm-gray line-clamp-2 mb-3">
                        {addon.Description}
                      </p>
                    )}
                    <div className="flex items-center gap-4">
                      {addon.Duration > 0 && (
                        <span className="text-xs text-warm-gray flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          +{addon.Duration} min
                        </span>
                      )}
                      {addon.Price > 0 ? (
                        <span className="text-lg font-bold text-gold-600">
                          +${addon.Price.toFixed(0)}
                        </span>
                      ) : (
                        <span className="text-sm text-warm-gray">
                          Consultar
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Selection Icon */}
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                    transition-all
                    ${selected 
                      ? 'bg-gold text-dark' 
                      : 'border-2 border-beige-300'
                    }
                  `}>
                    {selected ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5 text-beige-400" />
                    )}
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      )}
      
      {/* Selected Addons Summary */}
      {selectedAddons.length > 0 && (
        <div className="mt-6 p-4 bg-gold/10 border border-gold/30 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-dark">Adicionales seleccionados:</span>
            <span className="text-gold-600 font-bold">
              +${selectedAddons.reduce((sum, a) => sum + a.Price, 0).toFixed(2)}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedAddons.map((addon) => (
              <span 
                key={addon.Id}
                className="inline-flex items-center gap-1 px-3 py-1 bg-white 
                         rounded-full text-sm text-dark border border-gold/30"
              >
                {addon.Name}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeAddon(addon.Id)
                  }}
                  className="text-warm-gray hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
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
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold to-gold/90 
                   text-dark font-semibold rounded-xl hover:shadow-lg transition-all"
        >
          {selectedAddons.length > 0 ? 'Continuar' : 'Saltar'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
