'use client'

import { useEffect, useState, useMemo } from 'react'
import { User, Loader2, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { useBookingStore } from '@/lib/booking/store'
import type { MindbodyStaff } from '@/types/booking'

export function StaffStep() {
  const {
    selectedLocation,
    availableSlots,
    selectedTime,
    selectedDate,
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

  // Get the available staff IDs for the selected time slot
  const selectedSlot = useMemo(() => {
    return availableSlots.find(slot => slot.time === selectedTime)
  }, [availableSlots, selectedTime])

  const availableStaffIds = useMemo(() => {
    return selectedSlot?.availableStaffIds || []
  }, [selectedSlot])

  // Fetch staff details for the available staff IDs
  useEffect(() => {
    async function fetchStaff() {
      if (!selectedLocation) return

      // If no time selected or no available staff, don't fetch. Only clear the
      // local list — resetting the store cache here creates a fresh [] every
      // pass and, with `staff` as an effect dep, loops the effect forever.
      if (availableStaffIds.length === 0) {
        setLocalStaff([])
        return
      }

      // Use cached staff if available and matches the available IDs
      if (staff.length > 0) {
        // Filter cached staff to only those available for this slot
        const filteredStaff = staff.filter(s => availableStaffIds.includes(s.Id))
        if (filteredStaff.length > 0) {
          setLocalStaff(filteredStaff)
          return
        }
      }

      setIsLoadingStaff(true)
      setStaffError(null)
      try {
        // Fetch all staff for the location
        const response = await fetch(`/api/mindbody/staff?locationId=${selectedLocation.Id}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Error al cargar terapeutas')
        }

        // Filter to only staff available for the selected time slot
        const availableStaff = (data.staff as MindbodyStaff[]).filter(
          s => availableStaffIds.includes(s.Id)
        )

        setStaffList(data.staff) // Cache all staff
        setLocalStaff(availableStaff) // Show only available ones
      } catch (err) {
        setStaffError(err instanceof Error ? err.message : 'Error de conexión')
      } finally {
        setIsLoadingStaff(false)
      }
    }

    fetchStaff()
  }, [selectedLocation, availableStaffIds, staff, setStaffList])

  const handleSelectStaff = (staffMember: MindbodyStaff | null) => {
    setStaff(staffMember)
    nextStep()
  }

  // Format selected date for display
  const formattedDate = useMemo(() => {
    if (!selectedDate) return ''
    const date = new Date(selectedDate + 'T12:00:00')
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`
  }, [selectedDate])

  return (
    <div className="staff-step flex flex-col h-full">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-4">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold/60 rounded-full
                      flex items-center justify-center mx-auto mb-2 shadow-md">
          <User className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg font-bold text-dark mb-0.5">
          Selecciona tu Terapeuta
        </h2>
        <p className="text-xs text-warm-gray">
          {selectedDate && selectedTime && (
            <span className="block text-xs text-gold-600 font-medium mb-1">
              {formattedDate} a las {selectedSlot?.displayTime || selectedTime}
            </span>
          )}
          Elige quién te atenderá o deja que asignemos al mejor disponible
        </p>
      </div>

      {/* Loading State */}
      {isLoadingStaff && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-10 h-10 text-gold animate-spin mb-4" />
          <p className="text-warm-gray">Cargando terapeutas disponibles...</p>
        </div>
      )}

      {/* Error State */}
      {staffError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-6">
          {staffError}
        </div>
      )}

      {/* No Staff Available */}
      {!isLoadingStaff && localStaff.length === 0 && availableStaffIds.length === 0 && (
        <div className="text-center py-12 bg-beige-50 rounded-xl">
          <User className="w-12 h-12 text-beige-300 mx-auto mb-3" />
          <p className="text-warm-gray mb-2">No hay terapeutas disponibles para este horario</p>
          <button
            onClick={prevStep}
            className="text-gold font-medium hover:underline"
          >
            ← Seleccionar otro horario
          </button>
        </div>
      )}

      {/* Staff Selection */}
      {!isLoadingStaff && (availableStaffIds.length > 0 || localStaff.length > 0) && (
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
                  {availableStaffIds.length > 0 && (
                    <span className="ml-1">({availableStaffIds.length} disponible{availableStaffIds.length !== 1 ? 's' : ''})</span>
                  )}
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
      </div>
    </div>
  )
}
