'use client'

import { useEffect, useState } from 'react'
import { Plus, ArrowLeft, ArrowRight, Loader2, Clock, Check, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBookingStore } from '@/lib/booking/store'
import type { MindbodyService } from '@/types/booking'

// Addon Tile Component with expandable description
function AddonTile({ 
  addon, 
  isSelected, 
  onToggle 
}: { 
  addon: MindbodyService
  isSelected: boolean
  onToggle: () => void 
}) {
  const [showDetails, setShowDetails] = useState(false)
  
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onToggle()
  }
  
  const handleInfoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowDetails(!showDetails)
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
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
      
      <div className="p-4">
        {/* Name - LARGER FONT */}
        <h4 className="font-semibold text-dark text-base sm:text-lg leading-snug mb-3 pr-8">
          {addon.Name}
        </h4>
        
        {/* Price & Duration Row */}
        <div className="flex items-center gap-3 mb-4">
          <span className={`
            text-xl font-bold
            ${isSelected ? 'text-gold-600' : 'text-dark'}
          `}>
            {addon.Price > 0 ? `+$${addon.Price.toFixed(0)}` : 'Consultar'}
          </span>
          {addon.Duration > 0 && (
            <span className="flex items-center gap-1 text-sm text-warm-gray bg-beige-100 px-2 py-0.5 rounded-full">
              <Clock className="w-3.5 h-3.5" />
              +{addon.Duration} min
            </span>
          )}
        </div>
        
        {/* Brief Description Preview */}
        {addon.Description && !showDetails && (
          <p className="text-sm text-warm-gray mb-3 line-clamp-2">
            {addon.Description}
          </p>
        )}
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggle}
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
          
          {addon.Description && (
            <button
              type="button"
              onClick={handleInfoClick}
              className={`
                p-2.5 rounded-lg transition-all duration-200
                ${showDetails 
                  ? 'bg-gold/20 text-gold-600' 
                  : 'bg-beige-100 text-warm-gray hover:bg-beige-200'
                }
              `}
              aria-label="Ver detalles"
            >
              {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
      
      {/* Expandable Full Description */}
      <AnimatePresence>
        {showDetails && addon.Description && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-beige-100 bg-beige-50/50">
              <p className="text-sm text-warm-gray leading-relaxed">
                {addon.Description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

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
    // Prevent stalling with setTimeout
    setTimeout(() => {
      if (isAddonSelected(addon.Id)) {
        removeAddon(addon.Id)
      } else {
        addAddon(addon)
      }
    }, 0)
  }
  
  return (
    <div className="addons-step">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-gradient-to-br from-gold to-gold/60 rounded-full 
                      flex items-center justify-center mx-auto mb-3 shadow-lg">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-xl font-bold text-dark mb-1">
          ¿Deseas agregar algo más?
        </h2>
        <p className="text-sm text-warm-gray">
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
          <Plus className="w-12 h-12 text-beige-300 mx-auto mb-3" />
          <p className="text-warm-gray mb-4">No hay adicionales disponibles</p>
          <button
            onClick={nextStep}
            className="text-gold font-medium hover:underline"
          >
            Continuar sin adicionales →
          </button>
        </div>
      )}
      
      {/* Addon Tiles Grid */}
      {!isLoading && localAddons.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {localAddons.map((addon) => (
            <AddonTile
              key={addon.Id}
              addon={addon}
              isSelected={isAddonSelected(addon.Id)}
              onToggle={() => handleToggleAddon(addon)}
            />
          ))}
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
