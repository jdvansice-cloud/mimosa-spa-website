'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2, Clock, Check, Sparkles, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBookingStore } from '@/lib/booking/store'
import type { MindbodyService } from '@/types/booking'

// "Mejora tu ritual" carousel popup: shown once when the customer leaves the
// services step. They add one or more extras — or skip — and continue to
// date/time either way.

function AddonCard({
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
    <button
      type="button"
      onClick={onToggle}
      className={`
        relative flex-shrink-0 w-56 snap-start rounded-2xl border-2 text-left
        transition-all duration-200 overflow-hidden
        ${isSelected
          ? 'border-gold bg-gold/5 shadow-md ring-2 ring-gold/20'
          : 'border-beige-200 bg-white hover:border-gold/50 hover:shadow-sm'
        }
      `}
    >
      {isSelected && (
        <div className="absolute top-2.5 right-2.5 z-10">
          <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center shadow-sm">
            <Check className="w-4 h-4 text-dark" />
          </div>
        </div>
      )}

      <div className="p-4">
        <h4 className="font-semibold text-dark text-sm leading-snug mb-3 pr-8 min-h-[2.5rem]">
          {addon.Name}
        </h4>
        <div className="flex items-center gap-2 flex-wrap">
          {addon.Price > 0 ? (
            discountedPrice !== null ? (
              <span className="flex items-center gap-1.5">
                <span className="text-sm line-through text-warm-gray">+${addon.Price.toFixed(0)}</span>
                <span className="text-xl font-bold text-green-600">+${discountedPrice.toFixed(0)}</span>
              </span>
            ) : (
              <span className={`text-xl font-bold ${isSelected ? 'text-gold-600' : 'text-dark'}`}>
                +${addon.Price.toFixed(0)}
              </span>
            )
          ) : (
            <span className={`text-xl font-bold ${isSelected ? 'text-gold-600' : 'text-dark'}`}>
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
    </button>
  )
}

export function AddonsPrompt() {
  const {
    addonsPromptOpen,
    closeAddonsPrompt,
    nextStep,
    selectedLocation,
    addons,
    setAddons,
    selectedAddons,
    addAddon,
    removeAddon,
    globalDiscountPercent,
    globalDiscountActive,
  } = useBookingStore()

  const showGlobalDiscount = globalDiscountActive && globalDiscountPercent > 0
  const [localAddons, setLocalAddons] = useState<MindbodyService[]>([])
  const [isLoadingAddons, setIsLoadingAddons] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Fetch when the popup opens; if there's nothing to offer, continue
  // silently so the customer never sees an empty modal.
  useEffect(() => {
    if (!addonsPromptOpen) return

    async function fetchAddons() {
      if (addons.length > 0) {
        setLocalAddons(addons)
        return
      }
      if (!selectedLocation) {
        closeAddonsPrompt()
        nextStep()
        return
      }
      setIsLoadingAddons(true)
      try {
        const response = await fetch(
          `/api/mindbody/services?locationId=${selectedLocation.Id}&type=addons`
        )
        const data = await response.json()
        if (response.ok && data.services?.length > 0) {
          setAddons(data.services)
          setLocalAddons(data.services)
        } else {
          closeAddonsPrompt()
          nextStep()
        }
      } catch {
        closeAddonsPrompt()
        nextStep()
      } finally {
        setIsLoadingAddons(false)
      }
    }
    fetchAddons()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addonsPromptOpen])

  const isAddonSelected = (addonId: number) =>
    selectedAddons.some(a => a.Id === addonId)

  const handleToggleAddon = (addon: MindbodyService) => {
    if (isAddonSelected(addon.Id)) {
      removeAddon(addon.Id)
    } else {
      addAddon(addon)
    }
  }

  const handleContinue = () => {
    closeAddonsPrompt()
    nextStep()
  }

  const handleSkip = () => {
    // Skip means none: drop anything toggled inside the popup
    selectedAddons.forEach(a => removeAddon(a.Id))
    closeAddonsPrompt()
    nextStep()
  }

  const scrollBy = (direction: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: direction === 'left' ? -240 : 240,
      behavior: 'smooth',
    })
  }

  return (
    <AnimatePresence>
      {addonsPromptOpen && (
        <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleContinue}
            className="absolute inset-0 bg-dark/50 backdrop-blur-sm"
          />

          {/* Sheet / modal */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full sm:max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl
                     p-5 sm:p-7 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
          >
            <button
              onClick={handleContinue}
              className="absolute top-4 right-4 p-2 rounded-full text-warm-gray hover:bg-beige-100 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4 pr-10">
              <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold/60 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-dark text-lg leading-tight">Mejora tu ritual</h3>
                <p className="text-xs text-warm-gray">
                  Agrega un extra a tu visita — o continúa sin adicionales
                </p>
              </div>
            </div>

            {isLoadingAddons ? (
              <div className="flex items-center justify-center gap-2 py-12 text-warm-gray text-sm">
                <Loader2 className="w-5 h-5 animate-spin text-gold" />
                Cargando adicionales...
              </div>
            ) : (
              <div className="relative">
                {/* Desktop arrows */}
                <button
                  onClick={() => scrollBy('left')}
                  className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8
                           bg-white border border-beige-200 rounded-full shadow-md items-center justify-center
                           text-warm-gray hover:text-dark hover:border-gold/50 transition-colors"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollBy('right')}
                  className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8
                           bg-white border border-beige-200 rounded-full shadow-md items-center justify-center
                           text-warm-gray hover:text-dark hover:border-gold/50 transition-colors"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Carousel */}
                <div
                  ref={scrollRef}
                  className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1 scrollbar-hide"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {localAddons.map((addon) => (
                    <AddonCard
                      key={addon.Id}
                      addon={addon}
                      isSelected={isAddonSelected(addon.Id)}
                      onToggle={() => handleToggleAddon(addon)}
                      discountPercent={globalDiscountPercent}
                      showDiscount={showGlobalDiscount}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Footer actions */}
            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={handleSkip}
                className="flex-1 py-3 border-2 border-beige-200 text-warm-gray font-medium rounded-xl
                         hover:border-gold/40 hover:text-dark transition-all text-sm"
              >
                Omitir
              </button>
              <button
                onClick={handleContinue}
                className="flex-[2] py-3 bg-gradient-to-r from-gold to-gold/90 text-dark font-semibold
                         rounded-xl hover:shadow-lg transition-all text-sm"
              >
                {selectedAddons.length > 0
                  ? `Agregar ${selectedAddons.length} y continuar`
                  : 'Continuar'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
