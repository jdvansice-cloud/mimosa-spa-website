'use client'

import { useEffect, useState } from 'react'
import { Plus, ArrowLeft, ArrowRight, Loader2, Clock, Check, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useBookingStore } from '@/lib/booking/store'
import type { MindbodyService } from '@/types/booking'

// Addon Tile Component - Clickable anywhere
function AddonTile({
  addon,
  isSelected,
  onToggle
}: {
  addon: MindbodyService
  isSelected: boolean
  onToggle: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
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

      <div className="p-3">
        {/* Name */}
        <h4 className="font-semibold text-dark text-sm sm:text-base leading-snug mb-2 pr-8">
          {addon.Name}
        </h4>

        {/* Price & Duration Row */}
        <div className="flex items-center gap-2">
          <span className={`
            text-lg font-bold
            ${isSelected ? 'text-gold-600' : 'text-dark'}
          `}>
            {addon.Price > 0 ? `+$${addon.Price.toFixed(0)}` : 'Consultar'}
          </span>
          {addon.Duration > 0 && (
            <span className="flex items-center gap-1 text-xs text-warm-gray bg-beige-100 px-2 py-0.5 rounded-full">
              <Clock className="w-3 h-3" />
              +{addon.Duration} min
            </span>
          )}
        </div>
      </div>
    </motion.button>
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
  } = useBookingStore()

  const [localAddons, setLocalAddons] = useState<MindbodyService[]>([])
  const [isLoadingAddons, setIsLoadingAddons] = useState(false)
  const [addonsError, setAddonsError] = useState<string | null>(null)

  // Fetch addons on mount
  useEffect(() => {
    async function fetchAddons() {
      if (!selectedLocation) return

      if (addons.length > 0) {
        setLocalAddons(addons)
        return
      }

      setIsLoadingAddons(true)
      setAddonsError(null)
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
        setAddonsError(err instanceof Error ? err.message : 'Error de conexión')
      } finally {
        setIsLoadingAddons(false)
      }
    }

    fetchAddons()
  }, [selectedLocation, addons, setAddons])
  
  const isAddonSelected = (addonId: number) => {
    return selectedAddons.some(a => a.Id === addonId)
  }
  
  const handleToggleAddon = (addon: MindbodyService) => {
    // Use the current state from the check to avoid race conditions
    const currentlySelected = isAddonSelected(addon.Id)
    if (currentlySelected) {
      removeAddon(addon.Id)
    } else {
      addAddon(addon)
    }
  }
  
  return (
    <div className="addons-step flex flex-col h-full">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-4">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold/60 rounded-full
                      flex items-center justify-center mx-auto mb-2 shadow-md">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg font-bold text-dark mb-0.5">
          ¿Deseas agregar algo más?
        </h2>
        <p className="text-xs text-warm-gray">
          Mejora tu experiencia con servicios adicionales
        </p>
      </div>
      
      {/* Loading State */}
      {isLoadingAddons && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-10 h-10 text-gold animate-spin mb-4" />
          <p className="text-warm-gray">Cargando adicionales...</p>
        </div>
      )}

      {/* Error State */}
      {addonsError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-6">
          {addonsError}
        </div>
      )}

      {/* No Addons Available */}
      {!isLoadingAddons && localAddons.length === 0 && (
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
      {!isLoadingAddons && localAddons.length > 0 && (
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
      </div>

      {/* Navigation - Hidden on mobile (using MobileBookingNav), shown on desktop */}
      <div className="hidden md:block sticky bottom-0 bg-white border-t border-beige-200 py-2 -mx-6 px-6 mt-auto">
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            className="flex items-center gap-1 text-sm text-warm-gray hover:text-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>

          <button
            onClick={nextStep}
            className="flex items-center gap-1 px-4 py-2 bg-gold text-dark text-sm font-semibold rounded-lg
                     hover:bg-gold/90 transition-all"
          >
            {selectedAddons.length > 0 ? 'Continuar' : 'Saltar'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
