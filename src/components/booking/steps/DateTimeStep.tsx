'use client'

import { useEffect, useState, useMemo } from 'react'
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
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDateSlots, setSelectedDateSlots] = useState<TimeSlot[]>([])
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false)
  const [availabilityError, setAvailabilityError] = useState<string | null>(null)

  // Generate calendar days for current month view
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPadding = firstDay.getDay()

    const days: { date: Date | null; dateString: string; isAvailable: boolean; slotsCount: number }[] = []

    // Add padding for days before first of month
    for (let i = 0; i < startPadding; i++) {
      days.push({ date: null, dateString: '', isAvailable: false, slotsCount: 0 })
    }

    // Add days of the month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d)
      const dateString = date.toISOString().split('T')[0]
      const availableDate = availableDatesData.find(ad => ad.date === dateString)

      days.push({
        date,
        dateString,
        isAvailable: availableDate?.hasAvailability || false,
        slotsCount: availableDate?.slotsCount || 0
      })
    }

    return days
  }, [currentMonth, availableDatesData])

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

  const handleDateSelect = (dateString: string, isAvailable: boolean) => {
    if (!isAvailable) return
    setDate(dateString)
  }

  const handleTimeSelect = (time: string) => {
    setTime(time)
  }

  const isToday = (date: Date | null) => {
    if (!date) return false
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isPast = (date: Date | null) => {
    if (!date) return true
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const goToPrevMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      newMonth.setMonth(newMonth.getMonth() - 1)
      return newMonth
    })
  }

  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      newMonth.setMonth(newMonth.getMonth() + 1)
      return newMonth
    })
  }

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

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

        {!isLoadingAvailability && (
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Calendar */}
            <div className="bg-white border border-beige-200 rounded-xl p-4">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={goToPrevMonth}
                  className="p-2 hover:bg-beige-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-warm-gray" />
                </button>
                <h3 className="font-semibold text-dark">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button
                  onClick={goToNextMonth}
                  className="p-2 hover:bg-beige-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-warm-gray" />
                </button>
              </div>

              {/* Day Names */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-xs font-medium text-warm-gray py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  if (!day.date) {
                    return <div key={`empty-${index}`} className="p-2" />
                  }

                  const isSelected = selectedDate === day.dateString
                  const past = isPast(day.date)
                  const today = isToday(day.date)

                  return (
                    <button
                      key={day.dateString}
                      onClick={() => handleDateSelect(day.dateString, day.isAvailable && !past)}
                      disabled={!day.isAvailable || past}
                      className={`
                        p-2 rounded-lg text-sm font-medium transition-all
                        ${isSelected
                          ? 'bg-gold text-dark shadow-md'
                          : day.isAvailable && !past
                            ? 'bg-gold/10 text-dark hover:bg-gold/20'
                            : 'text-beige-300 cursor-not-allowed'
                        }
                        ${today && !isSelected ? 'ring-2 ring-gold/50' : ''}
                      `}
                    >
                      <span>{day.date.getDate()}</span>
                      {day.isAvailable && !past && (
                        <span className="block text-[10px] text-gold-600 mt-0.5">
                          {day.slotsCount}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="mt-4 flex items-center gap-4 text-xs text-warm-gray">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-gold/10 rounded"></span>
                  Disponible
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-gold rounded"></span>
                  Seleccionado
                </span>
              </div>
            </div>

            {/* Time Slots */}
            <div className="bg-white border border-beige-200 rounded-xl p-4">
              <h3 className="font-semibold text-dark mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gold" />
                Horarios Disponibles
              </h3>

              {!selectedDate ? (
                <div className="text-center py-12 text-warm-gray">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Selecciona una fecha para ver los horarios</p>
                </div>
              ) : selectedDateSlots.length === 0 ? (
                <div className="text-center py-12 text-warm-gray">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No hay horarios disponibles para esta fecha</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-80 overflow-y-auto">
                  <AnimatePresence>
                    {selectedDateSlots.map((slot, index) => (
                      <motion.button
                        key={slot.time}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.02 }}
                        onClick={() => handleTimeSelect(slot.time)}
                        disabled={!slot.available}
                        className={`
                          py-3 px-2 rounded-lg text-sm font-medium transition-all
                          ${selectedTime === slot.time
                            ? 'bg-gold text-dark shadow-md'
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
          </div>
        )}

        {/* Selected Summary */}
        {selectedDate && selectedTime && (
          <div className="mt-4 p-3 bg-gold/10 border border-gold/30 rounded-xl">
            <p className="text-dark font-medium flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gold" />
              {selectedDateInfo?.displayDate}
              <span className="text-warm-gray mx-1">•</span>
              <Clock className="w-4 h-4 text-gold" />
              {selectedSlot?.displayTime}
              {selectedSlot && (
                <span className="text-warm-gray ml-2 text-xs">
                  ({selectedSlot.availableStaffIds.length} terapeuta{selectedSlot.availableStaffIds.length !== 1 ? 's' : ''})
                </span>
              )}
            </p>
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
