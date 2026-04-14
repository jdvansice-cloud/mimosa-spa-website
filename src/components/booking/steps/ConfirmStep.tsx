'use client'

import { useState, useMemo, useEffect } from 'react'
import { CheckCircle, MapPin, User, Calendar, Clock, Loader2, AlertTriangle, Star, ArrowDown } from 'lucide-react'
import { useBookingStore, selectTotalDuration } from '@/lib/booking/store'

// Tax rate constant
const ITBM_RATE = 0.07

export function ConfirmStep() {
  const {
    clientInfo,
    selectedLocation,
    selectedServices,
    selectedAddons,
    selectedStaff,
    selectedDate,
    selectedTime,
    activePromotion,
    availableSlots,
    replaceAppointmentId,
    replaceBookingDetails,
    globalDiscountPercent,
    globalDiscountActive,
    setBookingConfirmation,
    setClientInfo,
    setStep,
    setLoading,
    setError,
    isLoading,
    error
  } = useBookingStore()

  const totalDuration = useBookingStore(selectTotalDuration)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timeUnavailable, setTimeUnavailable] = useState(false)
  const [displayClientName, setDisplayClientName] = useState<string>('')

  // Fetch client name on mount if missing from store
  useEffect(() => {
    const fetchClientIfNeeded = async () => {
      // Build current name from store
      const currentName = `${clientInfo?.FirstName || ''} ${clientInfo?.LastName || ''}`.trim()

      if (currentName && currentName.length >= 2) {
        setDisplayClientName(currentName)
        return
      }

      // Name is missing - try to fetch from Supabase/Mindbody
      try {
        // First get the client ID from Supabase
        const clientIdResponse = await fetch('/api/portal/client-id')
        if (clientIdResponse.ok) {
          const clientIdData = await clientIdResponse.json()
          if (clientIdData.clientId) {
            // Fetch full client profile from Mindbody
            const profileResponse = await fetch(`/api/portal/profile?clientId=${clientIdData.clientId}`)
            if (profileResponse.ok) {
              const profileData = await profileResponse.json()
              if (profileData.client) {
                const fetchedName = `${profileData.client.FirstName || ''} ${profileData.client.LastName || ''}`.trim()
                setDisplayClientName(fetchedName || 'Cliente')

                // Also update the store so the booking uses the correct data
                if (profileData.client.FirstName || profileData.client.LastName) {
                  setClientInfo(profileData.client)
                }
              }
            }
          }
        }
      } catch (err) {
        console.warn('Could not fetch client name:', err)
        setDisplayClientName('Cliente')
      }
    }

    fetchClientIfNeeded()
  }, [clientInfo?.FirstName, clientInfo?.LastName, setClientInfo])

  // Calculate pricing with useMemo
  const pricing = useMemo(() => {
    const servicesSubtotal = selectedServices.reduce((sum, s) => sum + s.Price, 0)
    const addonsSubtotal = selectedAddons.reduce((sum, a) => sum + a.Price, 0)

    const hasPromotion = activePromotion !== null
    let finalServicesPrice = servicesSubtotal
    let promotionDiscount = 0

    if (hasPromotion && activePromotion) {
      finalServicesPrice = activePromotion.price
      promotionDiscount = servicesSubtotal - activePromotion.price
    }

    const hasGlobalDiscount = !hasPromotion && globalDiscountActive && globalDiscountPercent > 0
    let globalDiscountAmount = 0
    if (hasGlobalDiscount) {
      globalDiscountAmount = Math.round(finalServicesPrice * (globalDiscountPercent / 100) * 100) / 100
      finalServicesPrice = Math.round((finalServicesPrice - globalDiscountAmount) * 100) / 100
    }

    const subtotalBeforeTax = finalServicesPrice + addonsSubtotal
    const itbmAmount = Math.round(subtotalBeforeTax * ITBM_RATE * 100) / 100
    const totalWithTax = Math.round((subtotalBeforeTax + itbmAmount) * 100) / 100

    return {
      services: selectedServices,
      addons: selectedAddons,
      servicesSubtotal,
      addonsSubtotal,
      hasPromotion,
      promotionName: activePromotion?.title_es || null,
      promotionPrice: activePromotion?.price || null,
      promotionDiscount,
      hasGlobalDiscount,
      globalDiscountPercent,
      globalDiscountAmount,
      subtotalBeforeTax,
      itbmRate: ITBM_RATE,
      itbmAmount,
      totalWithTax,
      totalDuration,
    }
  }, [selectedServices, selectedAddons, activePromotion, totalDuration, globalDiscountPercent, globalDiscountActive])

  // Format date for display (shorter format)
  const formatDateShort = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00')
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`
  }

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
  }

  const handleConfirmBooking = async () => {
    // Prevent double-clicks
    if (isSubmitting) return

    if (!clientInfo || !selectedLocation || !selectedDate || !selectedTime) {
      setError('Información incompleta. Por favor vuelve a intentar.')
      return
    }

    setIsSubmitting(true)
    setLoading(true)
    setError(null)

    try {
      // CRITICAL: Always fetch the authoritative client ID from Supabase
      // This ensures we use the ID stored during authentication
      const clientIdResponse = await fetch('/api/portal/client-id')
      const clientIdData = await clientIdResponse.json()

      if (!clientIdResponse.ok || !clientIdData.clientId) {
        // Fallback to clientInfo.Id if Supabase doesn't have the ID
        // but still validate it
        if (!clientInfo.Id || typeof clientInfo.Id !== 'number' || clientInfo.Id <= 0) {
          throw new Error('No se encontró tu ID de cliente. Por favor inicia sesión nuevamente.')
        }
        console.warn('Using clientInfo.Id as fallback:', clientInfo.Id)
      }

      // Use Supabase client ID (authoritative) or fallback to clientInfo.Id
      const authorizedClientId = clientIdData.clientId || clientInfo.Id

      // Final validation
      if (!authorizedClientId || typeof authorizedClientId !== 'number' || authorizedClientId <= 0) {
        throw new Error('ID de cliente inválido. Por favor inicia sesión nuevamente.')
      }

      console.log('Using authorized client ID from Supabase:', authorizedClientId)
      console.log('Client info from store:', {
        Id: clientInfo.Id,
        FirstName: clientInfo.FirstName,
        LastName: clientInfo.LastName,
        Email: clientInfo.Email,
        MobilePhone: clientInfo.MobilePhone
      })

      // If client name or phone is missing, fetch it from Mindbody
      let finalClientName = `${clientInfo.FirstName || ''} ${clientInfo.LastName || ''}`.trim()
      let finalClientPhone = clientInfo.MobilePhone

      if (!finalClientName || finalClientName.length < 2 || !finalClientPhone) {
        console.log('Client name or phone missing, fetching from Mindbody...')
        try {
          const profileResponse = await fetch(`/api/portal/profile?clientId=${authorizedClientId}`)
          if (profileResponse.ok) {
            const profileData = await profileResponse.json()
            if (profileData.client) {
              finalClientName = `${profileData.client.FirstName || ''} ${profileData.client.LastName || ''}`.trim() || finalClientName
              finalClientPhone = profileData.client.MobilePhone || finalClientPhone
              console.log('Fetched client profile from Mindbody:', { finalClientName, finalClientPhone })
            }
          }
        } catch (profileErr) {
          console.warn('Could not fetch client profile:', profileErr)
        }
      }

      const services = [
        ...selectedServices.map(s => ({
          sessionTypeId: s.Id,
          duration: s.Duration,
          name: s.Name
        })),
        ...selectedAddons.map(a => ({
          sessionTypeId: a.Id,
          duration: a.Duration,
          name: a.Name
        }))
      ]

      const startDateTime = `${selectedDate}T${selectedTime}:00`

      // Get staff ID - use selected staff, or pick from available staff for the time slot
      let staffIdToUse = selectedStaff?.Id
      if (!staffIdToUse && selectedTime) {
        const selectedSlot = availableSlots.find(s => s.time === selectedTime)
        if (selectedSlot?.availableStaffIds?.length) {
          // Pick the first available staff for this slot
          staffIdToUse = selectedSlot.availableStaffIds[0]
        }
      }

      const response = await fetch('/api/mindbody/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: authorizedClientId, // Use the authoritative ID from Supabase
          locationId: selectedLocation.Id,
          services,
          staffId: staffIdToUse,
          startDateTime,
          promotionName: activePromotion?.title_es,
          globalDiscountPercent: pricing.hasGlobalDiscount ? pricing.globalDiscountPercent : 0,
          clientName: finalClientName, // Use fetched name if store had empty name
          clientPhone: finalClientPhone, // Use fetched phone if store had empty phone
          locationName: selectedLocation.Name,
          therapistName: selectedStaff
            ? selectedStaff.DisplayName || `${selectedStaff.FirstName} ${selectedStaff.LastName}`
            : undefined,
          totalDuration,
          staffRequested: selectedStaff !== null, // true when user chose a specific therapist
          // Pricing for Supabase record
          subtotalBeforeTax: pricing.subtotalBeforeTax,
          taxAmount: pricing.itbmAmount,
          totalWithTax: pricing.totalWithTax,
          // Appointment replacement: cancel old appointment after booking
          replaceAppointmentId: replaceAppointmentId || undefined,
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.timeUnavailable) {
          setTimeUnavailable(true)
          setError(data.error || 'El horario seleccionado no está disponible.')
        } else {
          throw new Error(data.error || 'Error al crear la reserva')
        }
        return
      }

      setBookingConfirmation({
        success: true,
        confirmationNumber: data.confirmationNumber,
        appointments: data.appointments,
        location: selectedLocation,
        client: clientInfo,
        pricing: pricing!,
        totalBooked: data.totalBooked,
        totalRequested: data.totalRequested,
      })

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setIsSubmitting(false)
      setLoading(false)
    }
  }

  const therapistName = selectedStaff
    ? selectedStaff.DisplayName || `${selectedStaff.FirstName} ${selectedStaff.LastName}`
    : 'Cualquier disponible'

  return (
    <div className="confirm-step flex flex-col h-full">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-4">
        {/* Header - Compact */}
        <div className="text-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold/60 rounded-full
                        flex items-center justify-center mx-auto mb-2 shadow-md">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-dark mb-0.5">
            Confirmar Reserva
          </h2>
          <p className="text-xs text-warm-gray">
            Revisa y confirma tu cita
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl mb-4">
            <div className="flex items-start gap-2 text-red-600">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
            {timeUnavailable && (
              <button
                onClick={() => {
                  setError(null)
                  setTimeUnavailable(false)
                  setStep('datetime')
                }}
                className="mt-3 w-full py-2.5 bg-gold/90 text-dark font-semibold rounded-lg
                         hover:bg-gold transition-colors text-sm flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-4 h-4" />
                Elegir otro horario
              </button>
            )}
          </div>
        )}


        {/* Appointment Card - Consolidated */}
        <div className="bg-white border border-beige-200 rounded-xl overflow-hidden mb-4">
          {/* Date/Time/Duration Row */}
          <div className="p-3 bg-beige-50 border-b border-beige-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold" />
                <span className="font-semibold text-dark text-sm">
                  {selectedDate && formatDateShort(selectedDate)}
                </span>
                <span className="text-warm-gray">•</span>
                <span className="text-dark text-sm">
                  {selectedTime && formatTime(selectedTime)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-warm-gray bg-white px-2 py-1 rounded-full">
                <Clock className="w-3 h-3" />
                {totalDuration} min
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-warm-gray mb-0.5">Ubicación</p>
              <p className="font-medium text-dark flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gold" />
                {selectedLocation?.Name}
              </p>
            </div>
            <div>
              <p className="text-xs text-warm-gray mb-0.5">Terapeuta</p>
              <p className="font-medium text-dark flex items-center gap-1">
                <User className="w-3 h-3 text-gold" />
                {therapistName}
              </p>
            </div>
          </div>
        </div>

        {/* Services Summary */}
        <div className="bg-white border border-beige-200 rounded-xl p-3 mb-4">
          <h3 className="text-xs font-semibold text-warm-gray uppercase tracking-wider mb-2">
            Servicios
          </h3>
          <div className="space-y-2">
            {pricing.hasPromotion ? (
              <>
                {/* Promo header line with original + discounted price */}
                <div className="flex items-start justify-between gap-2">
                  <span className="flex items-center gap-1.5 font-semibold text-dark text-sm">
                    <Star className="w-3.5 h-3.5 text-gold flex-shrink-0 mt-0.5" />
                    {pricing.promotionName}
                  </span>
                  <div className="flex items-center gap-1.5 text-sm whitespace-nowrap">
                    <span className="line-through text-warm-gray text-xs">${pricing.servicesSubtotal.toFixed(2)}</span>
                    <span className="font-semibold text-dark">${pricing.promotionPrice!.toFixed(2)}</span>
                  </div>
                </div>
                {/* Included services — no price */}
                <div className="pl-5 space-y-1">
                  {selectedServices.map((service) => (
                    <div key={service.Id} className="text-sm text-warm-gray">
                      {service.Name}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* No promotion — each service with its price, discounted if applicable */
              selectedServices.map((service) => {
                const discountedPrice = pricing.hasGlobalDiscount
                  ? Math.round(service.Price * (1 - pricing.globalDiscountPercent / 100) * 100) / 100
                  : null
                return (
                  <div key={service.Id} className="flex justify-between text-sm">
                    <span className="text-dark">{service.Name}</span>
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      {discountedPrice !== null && (
                        <span className="line-through text-warm-gray text-xs">${service.Price.toFixed(2)}</span>
                      )}
                      <span className="text-dark">${(discountedPrice ?? service.Price).toFixed(2)}</span>
                    </div>
                  </div>
                )
              })
            )}

            {/* Addons always shown with price */}
            {selectedAddons.map((addon) => (
              <div key={addon.Id} className="flex justify-between text-sm">
                <span className="text-dark">+ {addon.Name}</span>
                <span className="text-dark">${addon.Price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-3 pt-3 border-t border-beige-200 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-warm-gray">Subtotal</span>
              <span className="text-dark">${(pricing.subtotalBeforeTax - pricing.addonsSubtotal).toFixed(2)}</span>
            </div>
            {pricing.addonsSubtotal > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-warm-gray">Servicios adicionales</span>
                <span className="text-dark">${pricing.addonsSubtotal.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-warm-gray">ITBM (7%)</span>
              <span className="text-dark">${pricing.itbmAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-1 border-t border-beige-200">
              <span className="text-dark">Total</span>
              <span className="text-dark">${pricing.totalWithTax.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Client Info - Minimal */}
        <div className="text-xs text-warm-gray text-center">
          Reserva a nombre de <span className="font-medium text-dark">{displayClientName || 'Cargando...'}</span>
        </div>

        {/* Appointment change comparison */}
        {replaceAppointmentId && (
          <div className="mt-3">
            <h3 className="text-xs font-semibold text-warm-gray uppercase tracking-wider mb-2 text-center">
              Cambio de cita
            </h3>

            {/* Old appointment — will be cancelled */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-1">
              <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2">
                Cita actual · será cancelada
              </p>
              {replaceBookingDetails ? (
                <div className="space-y-1 text-sm text-red-800">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{replaceBookingDetails.date} · {replaceBookingDetails.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{replaceBookingDetails.locationName}</span>
                  </div>
                  {replaceBookingDetails.services.length > 0 && (
                    <p className="text-red-700 text-xs pl-5">
                      {replaceBookingDetails.services.join(', ')}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-red-600 italic">Cargando detalles...</p>
              )}
            </div>

            {/* Arrow */}
            <div className="flex justify-center my-1">
              <ArrowDown className="w-4 h-4 text-warm-gray" />
            </div>

            {/* New appointment — already shown in the card above */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-3">
              <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-2">
                Nueva cita · confirmada arriba
              </p>
              <div className="space-y-1 text-sm text-green-800">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>
                    {selectedDate && formatDateShort(selectedDate)}
                    {selectedTime && ` · ${formatTime(selectedTime)}`}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{selectedLocation?.Name}</span>
                </div>
                {selectedServices.length > 0 && (
                  <p className="text-green-700 text-xs pl-5">
                    {selectedServices.map(s => s.Name).join(', ')}
                  </p>
                )}
              </div>
            </div>

            <p className="text-xs text-warm-gray text-center mt-2">
              Al confirmar, recibirás un mensaje de cancelación para la cita anterior y una confirmación para la nueva.
            </p>
          </div>
        )}

        {/* Payment Notice - Compact */}
        <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800 text-xs text-center">
            El pago se realiza en el spa al momento de tu visita
          </p>
        </div>
      </div>

      {/* Hidden Confirm Button - Triggered by fixed bottom nav */}
      <button
        onClick={handleConfirmBooking}
        disabled={isSubmitting || isLoading}
        className="hidden"
        id="mobile-confirm-btn"
      />
    </div>
  )
}
