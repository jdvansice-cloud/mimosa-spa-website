'use client'

import { useEffect, useState } from 'react'
import { User, ArrowLeft, ArrowRight, Loader2, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { useBookingStore } from '@/lib/booking/store'
import type { MindbodyStaff } from '@/types/booking'

export function StaffStep() {
  const {
    selectedLocation,
    selectedServices,
    selectedAddons,
    staff,
    setStaffList,
    selectedStaff,
    setStaff,
    nextStep,
    prevStep,
  } = useBookingStore()

  const [localStaff, setLocalStaff] = useState<MindbodyStaff[]>([])
  const [isLoadingStaff, setIsLoadingStaff] = useState(false)
  const [staffError, setStaffError] = useState<string | null>(null)

  // Fetch staff on mount or when location/services change
  useEffect(() => {
    async function fetchStaff() {
      if (!selectedLocation) return

      // Use cached staff if available for this location
      if (staff.length > 0) {
        setLocalStaff(staff)
        return
      }

      setIsLoadingStaff(true)
      setStaffError(null)
      try {
        // Build URL with location and session type IDs for the selected services
        const allServices = [...selectedServices, ...selectedAddons]
        const sessionTypeIds = allServices.map(s => s.Id).join(',')

        let url = `/api/mindbody/staff?locationId=${selectedLocation.Id}`
        if (sessionTypeIds) {
          url += `&sessionTypeIds=${sessionTypeIds}`
        }

        const response = await fetch(url)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Error al cargar terapeutas')
        }

        setStaffList(data.staff)
        setLocalStaff(data.staff)
      } catch (err) {
        setStaffError(err instanceof Error ? err.message : 'Error de conexión')
      } finally {
        setIsLoadingStaff(false)
      }
    }

    fetchStaff()
  }, [selectedLocation, selectedServices, selectedAddons, staff, setStaffList])
  
  const handleSelectStaff = (staffMember: MindbodyStaff | null) => {
    setStaff(staffMember)
    nextStep()
  }
  
  return (
    <div className="staff-step">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold/60 rounded-full 
                      flex items-center justify-center mx-auto mb-4 shadow-lg">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-dark mb-2">
          Selecciona tu Terapeuta
        </h2>
        <p className="text-warm-gray">
          Elige quién te atenderá o deja que asignemos al mejor disponible
        </p>
      </div>
      
      {/* Loading State */}
      {isLoadingStaff && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-10 h-10 text-gold animate-spin mb-4" />
          <p className="text-warm-gray">Cargando terapeutas...</p>
        </div>
      )}

      {/* Error State */}
      {staffError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-6">
          {staffError}
        </div>
      )}

      {/* Staff Selection */}
      {!isLoadingStaff && (
        <div className="space-y-4">
          {/* Any Therapist Option */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => handleSelectStaff(null)}
            className={`
              w-full p-5 border-2 rounded-xl text-left transition-all duration-200
              hover:shadow-lg hover:border-gold hover:-translate-y-0.5
              ${selectedStaff === null 
                ? 'border-gold bg-gold/10 shadow-md' 
                : 'border-beige-200 bg-white hover:bg-gold/5'
              }
            `}
          >
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className={`
                w-14 h-14 rounded-full flex items-center justify-center
                ${selectedStaff === null 
                  ? 'bg-gold text-dark' 
                  : 'bg-gradient-to-br from-beige-200 to-beige-100 text-warm-gray'
                }
              `}>
                <Users className="w-7 h-7" />
              </div>
              
              {/* Info */}
              <div className="flex-1">
                <h4 className="font-semibold text-dark text-lg">
                  Cualquier Terapeuta
                </h4>
                <p className="text-sm text-warm-gray">
                  Te asignaremos al mejor profesional disponible
                </p>
              </div>
              
              {/* Status */}
              <div className={`
                px-4 py-2 rounded-full text-sm font-medium
                ${selectedStaff === null 
                  ? 'bg-gold text-dark' 
                  : 'bg-beige-100 text-warm-gray'
                }
              `}>
                {selectedStaff === null ? '✓ Seleccionado' : 'Disponible'}
              </div>
            </div>
          </motion.button>
          
          {/* Individual Staff Members */}
          <div className="grid gap-4 md:grid-cols-2">
            {localStaff.map((staffMember, index) => {
              const isSelected = selectedStaff?.Id === staffMember.Id
              const initials = `${staffMember.FirstName?.[0] || ''}${staffMember.LastName?.[0] || ''}`
              
              return (
                <motion.button
                  key={staffMember.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index + 1) * 0.05 }}
                  onClick={() => handleSelectStaff(staffMember)}
                  className={`
                    p-5 border-2 rounded-xl text-left transition-all duration-200
                    hover:shadow-lg hover:border-gold hover:-translate-y-0.5
                    ${isSelected 
                      ? 'border-gold bg-gold/10 shadow-md' 
                      : 'border-beige-200 bg-white hover:bg-gold/5'
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    {staffMember.ImageUrl ? (
                      <img
                        src={staffMember.ImageUrl}
                        alt={staffMember.DisplayName}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className={`
                        w-14 h-14 rounded-full flex items-center justify-center
                        text-lg font-bold
                        ${isSelected 
                          ? 'bg-gold text-dark' 
                          : 'bg-gradient-to-br from-beige-200 to-beige-100 text-warm-gray'
                        }
                      `}>
                        {initials}
                      </div>
                    )}
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-dark truncate">
                        {staffMember.DisplayName || `${staffMember.FirstName} ${staffMember.LastName}`}
                      </h4>
                      {staffMember.Bio && (
                        <p className="text-sm text-warm-gray line-clamp-1">
                          {staffMember.Bio}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Selection Status */}
                  <div className={`
                    mt-3 py-2 text-center rounded-full text-sm font-medium
                    ${isSelected 
                      ? 'bg-gold text-dark' 
                      : 'bg-beige-100 text-warm-gray'
                    }
                  `}>
                    {isSelected ? '✓ Seleccionado' : 'Seleccionar'}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
      )}
      
      {/* Navigation */}
      <div className="mt-6 pt-2 border-t border-beige-200 flex items-center justify-between">
        <button
          onClick={prevStep}
          className="flex items-center gap-1 text-sm text-warm-gray hover:text-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>

        {/* Continue button only if staff not yet selected (auto-advances on selection) */}
        {selectedStaff !== undefined && (
          <button
            onClick={nextStep}
            className="flex items-center gap-1 px-4 py-2 bg-gold text-dark text-sm font-semibold rounded-lg
                     hover:bg-gold/90 transition-all"
          >
            Continuar
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
