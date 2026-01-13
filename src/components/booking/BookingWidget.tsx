'use client'

import { useState, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, MapPin, ArrowLeft, ArrowRight } from 'lucide-react'
import { useBookingStore, calculatePricing } from '@/lib/booking/store'
import { CartSidebar } from './CartSidebar'
import { CategoryAccordion } from './CategoryAccordion'
import { AddonCard } from './ServiceCard'
import type { ServiceCategory, MindbodyService, MindbodyLocation } from '@/types/booking'

export function BookingWidget() {
  const t = useTranslations('booking')
  const {
    currentStep,
    setStep,
    selectedLocation,
    setLocation,
    selectedServices,
    selectedAddons,
    addService,
    removeService,
    addAddon,
    removeAddon,
    activePromotion,
  } = useBookingStore()

  const [locations, setLocations] = useState<MindbodyLocation[]>([])
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [addons, setAddons] = useState<MindbodyService[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Selected service IDs for quick lookup
  const selectedServiceIds = useMemo(
    () => new Set(selectedServices.map(s => s.Id)),
    [selectedServices]
  )

  const selectedAddonIds = useMemo(
    () => new Set(selectedAddons.map(a => a.Id)),
    [selectedAddons]
  )

  // Calculate pricing
  const pricing = useMemo(
    () => calculatePricing(selectedServices, selectedAddons, activePromotion),
    [selectedServices, selectedAddons, activePromotion]
  )

  // Fetch locations on mount
  useEffect(() => {
    fetchLocations()
  }, [])

  // Fetch services when location changes
  useEffect(() => {
    if (selectedLocation) {
      fetchServices(selectedLocation.Id)
      fetchAddons(selectedLocation.Id)
    }
  }, [selectedLocation])

  const fetchLocations = async () => {
    try {
      const res = await fetch('/api/mindbody/locations')
      const data = await res.json()
      setLocations(data.locations || [])
    } catch (err) {
      console.error('Error fetching locations:', err)
      setError('Error cargando ubicaciones')
    }
  }

  const fetchServices = async (locationId: number) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/mindbody/services?locationId=${locationId}&grouped=true`)
      const data = await res.json()
      setCategories(data.categories || [])
    } catch (err) {
      console.error('Error fetching services:', err)
      setError('Error cargando servicios')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAddons = async (locationId: number) => {
    try {
      const res = await fetch(`/api/mindbody/addons?locationId=${locationId}`)
      const data = await res.json()
      setAddons(data.addons || [])
    } catch (err) {
      console.error('Error fetching addons:', err)
    }
  }

  const handleLocationSelect = (location: MindbodyLocation) => {
    setLocation(location)
    setStep('services')
  }

  const handleContinueFromServices = () => {
    if (selectedServices.length > 0) {
      setStep('addons')
    }
  }

  const handleContinueFromAddons = () => {
    setStep('staff')
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'login':
      case 'location':
        return (
          <LocationStep
            locations={locations}
            onSelect={handleLocationSelect}
          />
        )
      
      case 'services':
        return (
          <ServicesStep
            categories={categories}
            selectedServiceIds={selectedServiceIds}
            onServiceSelect={addService}
            onServiceDeselect={removeService}
            isLoading={isLoading}
            onContinue={handleContinueFromServices}
            canContinue={selectedServices.length > 0}
          />
        )
      
      case 'addons':
        return (
          <AddonsStep
            addons={addons}
            selectedAddonIds={selectedAddonIds}
            onAddonSelect={addAddon}
            onAddonDeselect={removeAddon}
            onContinue={handleContinueFromAddons}
            onBack={() => setStep('services')}
          />
        )
      
      default:
        return (
          <div className="text-center py-20">
            <p className="text-warm-gray">Paso en desarrollo...</p>
          </div>
        )
    }
  }

  const canGoBack = currentStep !== 'location' && currentStep !== 'login'

  return (
    <div className="min-h-screen bg-beige-50">
      {/* Progress header */}
      <div className="bg-white border-b border-beige-200 sticky top-20 z-30">
        <div className="container-spa py-4">
          <div className="flex items-center justify-between">
            {canGoBack && (
              <button
                onClick={() => {
                  const steps = ['location', 'services', 'addons', 'staff', 'datetime', 'confirm']
                  const currentIndex = steps.indexOf(currentStep)
                  if (currentIndex > 0) {
                    setStep(steps[currentIndex - 1] as any)
                  }
                }}
                className="flex items-center gap-2 text-warm-gray hover:text-dark transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Atrás</span>
              </button>
            )}
            
            <h1 className="font-serif text-xl font-semibold text-dark flex-1 text-center">
              {t('title')}
            </h1>
            
            {/* Spacer for alignment */}
            <div className="w-20" />
          </div>
          
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {['location', 'services', 'addons', 'staff', 'datetime', 'confirm'].map((step, i) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-colors ${
                  step === currentStep
                    ? 'bg-gold w-8'
                    : currentStep > step
                    ? 'bg-gold-300'
                    : 'bg-beige-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container-spa py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Cart sidebar - shows when there are items */}
      <CartSidebar alwaysShowToggle={currentStep === 'services' || currentStep === 'addons'} />
    </div>
  )
}

// Location Step Component
function LocationStep({
  locations,
  onSelect,
}: {
  locations: MindbodyLocation[]
  onSelect: (location: MindbodyLocation) => void
}) {
  const t = useTranslations('booking')

  // Hardcoded locations for better display
  const displayLocations = [
    {
      id: 1,
      name: 'Costa del Este',
      address: 'Star Plaza, frente al Riba Smith',
    },
    {
      id: 2,
      name: 'San Francisco',
      address: 'Calle 74E, al lado de la Delta de Calle 50',
    },
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="section-title">{t('selectLocation')}</h2>
        <div className="section-divider mx-auto" />
      </div>

      <div className="grid gap-4">
        {displayLocations.map((loc) => {
          // Find matching Mindbody location
          const mbLocation = locations.find(l => l.Id === loc.id)
          
          return (
            <motion.button
              key={loc.id}
              onClick={() => mbLocation && onSelect(mbLocation)}
              className="w-full p-6 bg-white rounded-xl border-2 border-beige-200 
                         hover:border-gold hover:shadow-soft
                         transition-all duration-200 text-left group"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={!mbLocation}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center 
                                group-hover:bg-gold transition-colors">
                  <MapPin className="w-6 h-6 text-gold-600 group-hover:text-dark" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-xl font-semibold text-dark mb-1">
                    {loc.name}
                  </h3>
                  <p className="text-warm-gray">{loc.address}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-beige-400 group-hover:text-gold transition-colors" />
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

// Services Step Component
function ServicesStep({
  categories,
  selectedServiceIds,
  onServiceSelect,
  onServiceDeselect,
  isLoading,
  onContinue,
  canContinue,
}: {
  categories: ServiceCategory[]
  selectedServiceIds: Set<string>
  onServiceSelect: (service: MindbodyService) => void
  onServiceDeselect: (serviceId: string) => void
  isLoading: boolean
  onContinue: () => void
  canContinue: boolean
}) {
  const t = useTranslations('booking')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="section-title">{t('selectServices')}</h2>
        <div className="section-divider mx-auto" />
      </div>

      <div className="space-y-4">
        {categories.map((category, index) => (
          <CategoryAccordion
            key={category.id}
            category={category}
            selectedServiceIds={selectedServiceIds}
            onServiceSelect={onServiceSelect}
            onServiceDeselect={onServiceDeselect}
            defaultOpen={index === 0}
          />
        ))}
      </div>

      {canContinue && (
        <div className="mt-8 flex justify-center">
          <button onClick={onContinue} className="btn-primary flex items-center gap-2">
            Continuar
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}

// Addons Step Component
function AddonsStep({
  addons,
  selectedAddonIds,
  onAddonSelect,
  onAddonDeselect,
  onContinue,
  onBack,
}: {
  addons: MindbodyService[]
  selectedAddonIds: Set<string>
  onAddonSelect: (addon: MindbodyService) => void
  onAddonDeselect: (addonId: string) => void
  onContinue: () => void
  onBack: () => void
}) {
  const t = useTranslations('booking')

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="section-title">{t('selectAddons')}</h2>
        <div className="section-divider mx-auto" />
        <p className="text-warm-gray mt-2">Opcional - puedes saltar este paso</p>
      </div>

      {addons.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {addons.map((addon) => (
            <AddonCard
              key={addon.Id}
              service={addon}
              isSelected={selectedAddonIds.has(addon.Id)}
              onSelect={() => onAddonSelect(addon)}
              onDeselect={() => onAddonDeselect(addon.Id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-warm-gray">
          No hay adicionales disponibles en este momento.
        </div>
      )}

      <div className="mt-8 flex justify-center gap-4">
        <button onClick={onContinue} className="btn-primary flex items-center gap-2">
          Continuar
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
