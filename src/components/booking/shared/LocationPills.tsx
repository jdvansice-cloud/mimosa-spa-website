'use client'

import { useEffect, useState } from 'react'
import { MapPin, Loader2 } from 'lucide-react'
import { useBookingStore } from '@/lib/booking/store'
import type { MindbodyLocation } from '@/types/booking'

// P2: location is a compact pill selector at the top of the services screen
// instead of a full first screen. Deliberately NOT preselected: choosing the
// spa is an explicit prerequisite before treatments appear (a silently
// remembered spa led to bookings at the wrong location).

export function LocationPills() {
  const {
    locations,
    setLocations,
    selectedLocation,
    setLocation,
  } = useBookingStore()

  const [isLoading, setIsLoading] = useState(false)

  // Fetch locations once (store-cached)
  useEffect(() => {
    async function fetchLocations() {
      if (locations.length > 0) return
      setIsLoading(true)
      try {
        const response = await fetch('/api/mindbody/locations')
        const data = await response.json()
        if (response.ok) setLocations(data.locations)
      } catch {
        // Pills simply stay empty; the step shows a retry via services error
      } finally {
        setIsLoading(false)
      }
    }
    fetchLocations()
  }, [locations.length, setLocations])

  const handleSelect = (location: MindbodyLocation) => {
    if (selectedLocation?.Id === location.Id) return
    setLocation(location)
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <span className="flex items-center gap-1 text-xs text-warm-gray mr-1">
          <MapPin className="w-3.5 h-3.5 text-gold" />
          Spa:
        </span>
        {isLoading && locations.length === 0 && (
          <Loader2 className="w-4 h-4 animate-spin text-gold" />
        )}
        {locations.map((location) => {
          const isSelected = selectedLocation?.Id === location.Id
          return (
            <button
              key={location.Id}
              onClick={() => handleSelect(location)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium border-2 transition-all
                ${isSelected
                  ? 'bg-gold text-dark border-gold shadow-sm'
                  : 'bg-white text-warm-gray border-beige-200 hover:border-gold/50 hover:text-dark'
                }
              `}
            >
              {location.Name}
            </button>
          )
        })}
      </div>
      {!selectedLocation && !isLoading && locations.length > 0 && (
        <p className="text-center text-xs text-gold-600 font-medium mt-2">
          Elige tu spa para ver los tratamientos
        </p>
      )}
    </div>
  )
}
