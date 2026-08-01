'use client'

import { useEffect, useMemo, useState } from 'react'
import { Plus, Loader2, Clock, Check, Sparkles, Tag, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useBookingStore } from '@/lib/booking/store'
import type { MindbodyService } from '@/types/booking'

// Data-driven second-treatment pairing rules, ordered by evidence strength
// from 6 months of real visits (Feb–Jul 2026):
//   425× Mimosa Relax 60 + Oriental de Pies 30 · 186× Liberador 45 + Pies camilla 30
//   118× Mimosa Profundo 60 + Pies 30 · 71× Facial Limpieza Profundo + Liberador 30
// Each rule: if a selected service matches `when`, suggest first catalog service
// matching one of `suggest` (skipped if already selected).
const PAIRING_RULES: Array<{ when: RegExp; suggest: RegExp[] }> = [
  { when: /facial/i, suggest: [/Liberador de Tension 30/i, /Masaje Oriental de Pies.*30/i] },
  { when: /oriental de pies/i, suggest: [/Mimosa Relax - 60/i] },
  { when: /liberador/i, suggest: [/Masaje Oriental de Pies en camilla - 30/i, /Masaje Oriental de Pies - 30/i] },
  { when: /relax|profundo|detox|aromaterapia|piedras|calma|drenaje/i, suggest: [/Masaje Oriental de Pies - 30/i, /Facial de Limpieza Express/i] },
]

// Addon Tile Component - Clickable anywhere
function AddonTile({
  addon,
  isSelected,
  onToggle,
  discountPercent = 0,
  showDiscount = false,
}: {
  addon: MindbodyService
  isSelected: boolean
  onToggle: () => void
  discountPercent?: number
  showDiscount?: boolean
}) {
  const discountedPrice = showDiscount && discountPercent > 0
    ? Math.round(addon.Price * (1 - discountPercent / 100) * 100) / 100
    : null

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
          {addon.Price > 0 ? (
            discountedPrice !== null ? (
              <span className="flex items-center gap-1.5">
                <span className="text-sm line-through text-warm-gray">+${addon.Price.toFixed(0)}</span>
                <span className="text-lg font-bold text-green-600">+${discountedPrice.toFixed(0)}</span>
              </span>
            ) : (
              <span className={`text-lg font-bold ${isSelected ? 'text-gold-600' : 'text-dark'}`}>
                +${addon.Price.toFixed(0)}
              </span>
            )
          ) : (
            <span className={`text-lg font-bold ${isSelected ? 'text-gold-600' : 'text-dark'}`}>
              Consultar
            </span>
          )}
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
    activePromotion,
    globalDiscountPercent,
    globalDiscountActive,
    selectedServices,
    services,
    addService,
  } = useBookingStore()

  const showGlobalDiscount = globalDiscountActive && globalDiscountPercent > 0

  const [localAddons, setLocalAddons] = useState<MindbodyService[]>([])
  const [isLoadingAddons, setIsLoadingAddons] = useState(false)
  const [addonsError, setAddonsError] = useState<string | null>(null)
  const [mainCatalog, setMainCatalog] = useState<MindbodyService[]>(services)
  const [suggestionDismissed, setSuggestionDismissed] = useState(false)

  // Ensure we have the main-services catalog for the pairing suggestion
  // (store.services can be empty when the flow skipped ServiceStep, e.g. promos)
  useEffect(() => {
    if (mainCatalog.length > 0 || !selectedLocation || activePromotion) return
    fetch(`/api/mindbody/services?locationId=${selectedLocation.Id}&type=main`)
      .then(r => r.json())
      .then(d => { if (d.services) setMainCatalog(d.services) })
      .catch(() => { /* suggestion simply won't render */ })
  }, [mainCatalog.length, selectedLocation, activePromotion])

  // Second-treatment suggestion: only for single-service, non-promo bookings
  const suggestedService = useMemo(() => {
    if (activePromotion || suggestionDismissed) return null
    if (selectedServices.length !== 1 || mainCatalog.length === 0) return null
    const current = selectedServices[0]
    for (const rule of PAIRING_RULES) {
      if (!rule.when.test(current.Name)) continue
      for (const target of rule.suggest) {
        const match = mainCatalog.find(s =>
          target.test(s.Name) && s.Id !== current.Id && s.OnlineBooking !== false
        )
        if (match) return match
      }
    }
    return null
  }, [activePromotion, suggestionDismissed, selectedServices, mainCatalog])

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

      {/* Second-treatment suggestion (data-driven pairing) */}
      {suggestedService && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3.5 bg-gold/5 border-2 border-gold/40 rounded-xl"
        >
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 bg-gold/15 rounded-full flex items-center justify-center flex-shrink-0">
              <Heart className="w-4 h-4 text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-dark">
                Completa tu experiencia
              </p>
              <p className="text-xs text-warm-gray mb-2.5">
                Quienes reservan {selectedServices[0]?.Name} suelen acompañarlo con:
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3">
                <span className="font-semibold text-dark text-sm">{suggestedService.Name}</span>
                <span className="text-sm font-bold text-gold-600">+${suggestedService.Price.toFixed(0)}</span>
                {suggestedService.Duration > 0 && (
                  <span className="flex items-center gap-1 text-xs text-warm-gray bg-beige-100 px-2 py-0.5 rounded-full">
                    <Clock className="w-3 h-3" />
                    +{suggestedService.Duration} min
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    addService(suggestedService)
                    setSuggestionDismissed(true)
                  }}
                  className="flex-1 py-2 bg-gradient-to-r from-gold to-gold/90 text-dark
                           text-sm font-semibold rounded-lg hover:shadow-md transition-all
                           flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Agregar a mi reserva
                </button>
                <button
                  type="button"
                  onClick={() => setSuggestionDismissed(true)}
                  className="px-3 py-2 text-sm text-warm-gray hover:text-dark transition-colors"
                >
                  Ahora no
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
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
              discountPercent={globalDiscountPercent}
              showDiscount={showGlobalDiscount}
            />
          ))}
        </div>
      )}
      </div>

    </div>
  )
}
