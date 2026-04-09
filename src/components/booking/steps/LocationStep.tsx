'use client'

import { useEffect, useState } from 'react'
import { MapPin, ArrowLeft, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useBookingStore } from '@/lib/booking/store'
import type { MindbodyLocation } from '@/types/booking'

// Location specific info (can be moved to config)
const LOCATION_DETAILS: Record<number, { address: string; mapUrl?: string }> = {
  1: {
    address: 'Star Plaza, frente al Riba Smith',
    mapUrl: 'https://maps.google.com/?q=Costa+del+Este+Panama'
  },
  2: {
    address: 'Calle 74E, al lado de la Delta de Calle 50',
    mapUrl: 'https://maps.google.com/?q=San+Francisco+Panama'
  }
}

export function LocationStep() {
  const {
    locations,
    setLocations,
    selectedLocation,
    setLocation,
    nextStep,
    prevStep,
    setLoading,
    setError,
    isLoading,
    error
  } = useBookingStore()
  
  const [localLocations, setLocalLocations] = useState<MindbodyLocation[]>([])
  
  // Fetch locations on mount
  useEffect(() => {
    async function fetchLocations() {
      if (locations.length > 0) {
        setLocalLocations(locations)
        return
      }
      
      setLoading(true)
      try {
        const response = await fetch('/api/mindbody/locations')
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Error al cargar ubicaciones')
        }
        
        setLocations(data.locations)
        setLocalLocations(data.locations)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error de conexión')
      } finally {
        setLoading(false)
      }
    }
    
    fetchLocations()
  }, [locations, setLocations, setLoading, setError])
  
  const handleSelectLocation = (location: MindbodyLocation) => {
    setLocation(location)
    nextStep()
  }
  
  return (
    <div className="location-step flex flex-col h-full">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-4">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold/60 rounded-full
                      flex items-center justify-center mx-auto mb-2 shadow-md">
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg font-bold text-dark mb-0.5">
          Selecciona tu Ubicación
        </h2>
        <p className="text-xs text-warm-gray">
          Elige el spa donde deseas recibir tu tratamiento
        </p>
      </div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-10 h-10 text-gold animate-spin mb-4" />
          <p className="text-warm-gray">Cargando ubicaciones...</p>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-6">
          {error}
        </div>
      )}
      
      {/* Location Cards */}
      {!isLoading && (
        <div className="grid gap-4 md:grid-cols-2">
          {localLocations.map((location, index) => {
            const details = LOCATION_DETAILS[location.Id] || { address: location.Address }
            const isSelected = selectedLocation?.Id === location.Id
            
            return (
              <motion.button
                key={location.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSelectLocation(location)}
                className={`
                  p-6 border-2 rounded-2xl text-left transition-all duration-300
                  hover:shadow-lg hover:border-gold hover:-translate-y-1
                  ${isSelected 
                    ? 'border-gold bg-gold/5 shadow-md' 
                    : 'border-beige-200 bg-white hover:bg-gold/5'
                  }
                `}
              >
                {/* Location Icon */}
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center mb-4
                  ${isSelected 
                    ? 'bg-gold text-dark' 
                    : 'bg-beige-100 text-warm-gray'
                  }
                `}>
                  <MapPin className="w-6 h-6" />
                </div>
                
                {/* Location Name */}
                <h3 className="text-xl font-bold text-dark mb-2">
                  {location.Name}
                </h3>
                
                {/* Address */}
                <p className="text-warm-gray text-sm mb-4">
                  {details.address}
                </p>
                
                {/* Phone */}
                {location.Phone && (
                  <p className="text-sm text-warm-gray flex items-center gap-2">
                    <span className="text-gold">📞</span>
                    {location.Phone}
                  </p>
                )}
                
                {/* Selection Indicator */}
                <div className={`
                  mt-4 py-2 px-4 rounded-full text-center text-sm font-medium
                  transition-all
                  ${isSelected 
                    ? 'bg-gold text-dark' 
                    : 'bg-beige-100 text-warm-gray group-hover:bg-gold/20'
                  }
                `}>
                  {isSelected ? '✓ Seleccionado' : 'Seleccionar'}
                </div>
              </motion.button>
            )
          })}
        </div>
      )}
      
      {/* Back Button - Hidden on mobile (using MobileBookingNav), shown on desktop */}
      <div className="hidden md:block mt-6 pt-2 border-t border-beige-200">
        <button
          onClick={prevStep}
          className="flex items-center gap-1 text-sm text-warm-gray hover:text-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
      </div>
      </div>
    </div>
  )
}
