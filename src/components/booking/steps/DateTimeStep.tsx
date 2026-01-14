'use client'

import { useEffect, useState, useRef } from 'react'
import { Calendar, ArrowLeft, ArrowRight, Loader2, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBookingStore, selectTotalDuration } from '@/lib/booking/store'

interface TimeSlot {
  time: string
  displayTime: string
  available: boolean
  availableStaffIds: number[]
}

interface AvailableDate {
  date: string
  displayDate: string
  hasAvailability: boolean
  slotsCount: number
  slots: TimeSlot[]
}

export function DateTimeStep() {
  const {
    selectedLocation,
    selectedServices,
    selectedAddons,
    selectedDate,
    selectedTime,
    setDate,
    setTime,
    setAvailableDates,
    setAvailableSlots,
    nextStep,
    prevStep,
  } = useBookingStore()

  const totalDuration = useBookingStore(selectTotalDuration)

  // Local state for this step
  const [availableDatesData, setAvailableDatesData] = useState<AvailableDate[]>([])
  const [selectedDateSlots, setSelectedDateSlots] = useState<TimeSlot[]>([])
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false)
  const [availabilityError, setAvailabilityError] = useState<string | null>(null)

  // Ref for horizontal scroll
  const dateScrollRef = useRef<HTMLDivElement>(null)

  // Fetch availability when step loads or services change
  useEffect(() => {
    async function fetchAvailability() {
      if (!selectedLocation || selectedServices.length === 0) return

      setIsLoadingAvailability(true)
      setAvailabilityError(null)
      try {
        // Get date range (next 30 days)
        const startDate = new Date()
        const endDate = new Date()
        endDate.setDate(endDate.getDate() + 30)

        // Build service IDs (session type IDs)
        const serviceIds = [
          ...selectedServices.map(s => s.Id),
          ...selectedAddons.map(a => a.Id)
        ].join(',')

        const params = new URLSearchParams({
          locationId: selectedLocation.Id.toString(),
          serviceIds,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          duration: totalDuration.toString()
        })

        console.log('Fetching availability with params:', {
          locationId: selectedLocation.Id,
          serviceIds: serviceIds,
          services: selectedServices.map(s => ({ id: s.Id, name: s.Name })),
          addons: selectedAddons.map(a => ({ id: a.Id, name: a.Name })),
          duration: totalDuration
        })

        const response = await fetch(`/api/mindbody/availability?${params}`)
        const data = await response.json()

        console.log('Availability response:', data)

        if (!response.ok) {
          throw new Error(data.error || 'Error al cargar disponibilidad')
        }

        setAvailableDatesData(data.availableDates)
        setAvailableDates(data.availableDates)

        // Auto-select first available date if none selected
        if (!selectedDate && data.availableDates.length > 0) {
          setDate(data.availableDates[0].date)
        }
      } catch (err) {
        setAvailabilityError(err instanceof Error ? err.message : 'Error de conexión')
      } finally {
        setIsLoadingAvailability(false)
      }
    }

    fetchAvailability()
  }, [selectedLocation, selectedServices, selectedAddons, totalDuration, setAvailableDates])

  // Update time slots when date is selected
  useEffect(() => {
    if (selectedDate) {
      const dateData = availableDatesData.find(d => d.date === selectedDate)
      const slots = dateData?.slots || []
      setSelectedDateSlots(slots)
      setAvailableSlots(slots)
    } else {
      setSelectedDateSlots([])
      setAvailableSlots([])
    }
  }, [selectedDate, availableDatesData, setAvailableSlots])

  const handleDateSelect = (dateString: string) => {
    setDate(dateString)
    // Note: setDate in store already resets selectedTime to null
  }

  const handleTimeSelect = (time: string) => {
    setTime(time)
  }

  // Scroll dates left/right
  const scrollDates = (direction: 'left' | 'right') => {
    if (dateScrollRef.current) {
      const scrollAmount = 200
      dateScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  // Parse display date to get day name and date number
  const parseDisplayDate = (displayDate: string, dateStr: string) => {
    // displayDate format: "Miércoles, 14 de Enero"
    const parts = displayDate.split(',')
    const dayName = parts[0]?.trim() || ''
    const date = new Date(dateStr + 'T12:00:00')
    const dayNum = date.getDate()
    const monthShort = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][date.getMonth()]

    return { dayName, dayNum, monthShort }
  }

  // Get selected slot info for display
  const selectedSlot = selectedDateSlots.find(s => s.time === selectedTime)
  const selectedDateInfo = availableDatesData.find(d => d.date === selectedDate)

  return (
    <div className="datetime-step flex flex-col h-full">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-4">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold/60 rounded-full
                        flex items-center justify-center mx-auto mb-2 shadow-md">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-dark mb-0.5">
            Fecha y Hora
          </h2>
          <p className="text-xs text-warm-gray">
            Selecciona cuándo deseas tu cita ({totalDuration} min)
          </p>
        </div>

        {/* Loading State */}
        {isLoadingAvailability && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-10 h-10 text-gold animate-spin mb-4" />
            <p className="text-warm-gray">Cargando disponibilidad...</p>
          </div>
        )}

        {/* Error State */}
        {availabilityError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-6">
            {availabilityError}
          </div>
        )}

        {!isLoadingAvailability && !availabilityError && (
          <div className="space-y-6">
            {/* Date Selection - Horizontal Scrollable */}
            <div className="bg-white border border-beige-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-dark flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gold" />
                  Selecciona Fecha
                </h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => scrollDates('left')}
                    className="p-1.5 hover:bg-beige-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-warm-gray" />
                  </button>
                  <button
                    onClick={() => scrollDates('right')}
                    className="p-1.5 hover:bg-beige-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-warm-gray" />
                  </button>
                </div>
              </div>

              {availableDatesData.length === 0 ? (
                <div className="text-center py-8 text-warm-gray">
                  <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No hay fechas disponibles</p>
                </div>
              ) : (
                <div
                  ref={dateScrollRef}
                  className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {availableDatesData.map((dateItem) => {
                    const { dayName, dayNum, monthShort } = parseDisplayDate(dateItem.displayDate, dateItem.date)
                    const isSelected = selectedDate === dateItem.date

                    return (
                      <button
                        key={dateItem.date}
                        onClick={() => handleDateSelect(dateItem.date)}
                        className={`
                          flex-shrink-0 flex flex-col items-center justify-center
                          w-16 h-20 rounded-xl transition-all
                          ${isSelected
                            ? 'bg-gold text-dark shadow-lg scale-105'
                            : 'bg-beige-50 text-dark hover:bg-gold/20 hover:scale-102'
                          }
                        `}
                      >
                        <span className={`text-[10px] font-medium uppercase tracking-wide ${isSelected ? 'text-dark/70' : 'text-warm-gray'}`}>
                          {dayName.slice(0, 3)}
                        </span>
                        <span className="text-xl font-bold">{dayNum}</span>
                        <span className={`text-[10px] ${isSelected ? 'text-dark/70' : 'text-warm-gray'}`}>
                          {monthShort}
                        </span>
                        <span className={`text-[9px] mt-0.5 ${isSelected ? 'text-dark/60' : 'text-gold'}`}>
                          {dateItem.slotsCount} slots
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Time Slots - Grid Tiles */}
            <div className="bg-white border border-beige-200 rounded-xl p-4">
              <h3 className="font-semibold text-dark mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold" />
                Horarios Disponibles
                {selectedDateInfo && (
                  <span className="text-xs font-normal text-warm-gray ml-auto">
                    {selectedDateInfo.displayDate}
                  </span>
                )}
              </h3>

              {!selectedDate ? (
                <div className="text-center py-8 text-warm-gray">
                  <Clock className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Selecciona una fecha para ver los horarios</p>
                </div>
              ) : selectedDateSlots.length === 0 ? (
                <div className="text-center py-8 text-warm-gray">
                  <Clock className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No hay horarios disponibles</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                  <AnimatePresence>
                    {selectedDateSlots.map((slot, index) => (
                      <motion.button
                        key={slot.time}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        onClick={() => handleTimeSelect(slot.time)}
                        disabled={!slot.available}
                        className={`
                          py-2.5 px-1 rounded-lg text-sm font-medium transition-all
                          ${selectedTime === slot.time
                            ? 'bg-gold text-dark shadow-md ring-2 ring-gold/50'
                            : slot.available
                              ? 'bg-beige-50 text-dark hover:bg-gold/20'
                              : 'bg-beige-100 text-beige-300 cursor-not-allowed'
                          }
                        `}
                      >
                        {slot.displayTime}
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Selected Summary */}
            {selectedDate && selectedTime && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gold/10 border border-gold/30 rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-dark font-semibold text-sm">
                        {selectedDateInfo?.displayDate}
                      </p>
                      <p className="text-warm-gray text-xs">
                        {selectedSlot?.displayTime}
                        {selectedSlot && (
                          <span className="ml-2">
                            • {selectedSlot.availableStaffIds.length} terapeuta{selectedSlot.availableStaffIds.length !== 1 ? 's' : ''} disponible{selectedSlot.availableStaffIds.length !== 1 ? 's' : ''}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <Clock className="w-5 h-5 text-gold" />
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Navigation - Sticky at bottom */}
      <div className="sticky bottom-0 bg-white border-t border-beige-200 py-2 -mx-6 px-6 mt-auto">
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
            disabled={!selectedDate || !selectedTime}
            className="flex items-center gap-1 px-4 py-2 bg-gold text-dark text-sm font-semibold rounded-lg
                     hover:bg-gold/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuar
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
