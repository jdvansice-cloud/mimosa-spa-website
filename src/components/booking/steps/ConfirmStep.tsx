'use client'

import { useState, useMemo } from 'react'
import { CheckCircle, ArrowLeft, MapPin, User, Calendar, Clock, Loader2, AlertTriangle } from 'lucide-react'
import { useBookingStore, selectTotalDuration } from '@/lib/booking/store'
import { CartSummary } from '../shared/CartSummary'

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
    setBookingConfirmation,
    prevStep,
    setLoading,
    setError,
    isLoading,
    error
  } = useBookingStore()
  
  const totalDuration = useBookingStore(selectTotalDuration)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Calculate pricing with useMemo
  const pricing = useMemo(() => {
    const servicesSubtotal = selectedServices.reduce((sum, s) => sum + s.Price, 0)
    const addonsSubtotal = selectedAddons.reduce((sum, a) => sum + a.Price, 0)
    
    const hasPromotion = activePromotion !== null
    let finalServicesPrice = servicesSubtotal
    
    if (hasPromotion && activePromotion) {
      finalServicesPrice = activePromotion.price
    }
    
    const subtotalBeforeTax = finalServicesPrice + addonsSubtotal
    const itbmAmount = Math.round(subtotalBeforeTax * ITBM_RATE * 100) / 100
    const totalWithTax = Math.round((subtotalBeforeTax + itbmAmount) * 100) / 100
    
    return {
      subtotalBeforeTax,
      itbmRate: ITBM_RATE,
      itbmAmount,
      totalWithTax,
    }
  }, [selectedServices, selectedAddons, activePromotion])
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00')
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} ${date.getFullYear()}`
  }
  
  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
  }
  
  const handleConfirmBooking = async () => {
    if (!clientInfo || !selectedLocation || !selectedDate || !selectedTime) {
      setError('Información incompleta. Por favor vuelve a intentar.')
      return
    }
    
    setIsSubmitting(true)
    setLoading(true)
    setError(null)
    
    try {
      // Build services array with durations and names
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
      
      // Build start datetime
      const startDateTime = `${selectedDate}T${selectedTime}:00`
      
      const response = await fetch('/api/mindbody/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: clientInfo.Id,
          locationId: selectedLocation.Id,
          services,
          staffId: selectedStaff?.Id,
          startDateTime,
          promotionName: activePromotion?.title_es,
          // Additional data for WhatsApp notification
          clientName: `${clientInfo.FirstName} ${clientInfo.LastName}`,
          clientPhone: clientInfo.MobilePhone,
          locationName: selectedLocation.Name,
          therapistName: selectedStaff 
            ? selectedStaff.DisplayName || `${selectedStaff.FirstName} ${selectedStaff.LastName}`
            : undefined,
          totalDuration,
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la reserva')
      }
      
      // Set confirmation and go to success
      setBookingConfirmation({
        success: true,
        confirmationNumber: data.confirmationNumber,
        appointments: data.appointments,
        location: selectedLocation,
        client: clientInfo,
        pricing: pricing!
      })
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setIsSubmitting(false)
      setLoading(false)
    }
  }
  
  return (
    <div className="confirm-step">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold/60 rounded-full 
                      flex items-center justify-center mx-auto mb-4 shadow-lg">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-dark mb-2">
          Confirmar Reserva
        </h2>
        <p className="text-warm-gray">
          Revisa los detalles y confirma tu cita
        </p>
      </div>
      
      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Error al procesar la reserva</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}
      
      {/* Booking Details */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Details */}
        <div className="space-y-4">
          {/* Client Info */}
          <div className="bg-white border border-beige-200 rounded-xl p-4">
            <h3 className="font-semibold text-dark mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-gold" />
              Cliente
            </h3>
            <p className="text-dark font-medium">
              {clientInfo?.FirstName} {clientInfo?.LastName}
            </p>
            <p className="text-sm text-warm-gray">{clientInfo?.Email}</p>
            {clientInfo?.MobilePhone && (
              <p className="text-sm text-warm-gray">{clientInfo.MobilePhone}</p>
            )}
          </div>
          
          {/* Location */}
          <div className="bg-white border border-beige-200 rounded-xl p-4">
            <h3 className="font-semibold text-dark mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gold" />
              Ubicación
            </h3>
            <p className="text-dark font-medium">{selectedLocation?.Name}</p>
            <p className="text-sm text-warm-gray">{selectedLocation?.Address}</p>
          </div>
          
          {/* Therapist */}
          <div className="bg-white border border-beige-200 rounded-xl p-4">
            <h3 className="font-semibold text-dark mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-gold" />
              Terapeuta
            </h3>
            <p className="text-dark font-medium">
              {selectedStaff 
                ? selectedStaff.DisplayName || `${selectedStaff.FirstName} ${selectedStaff.LastName}`
                : 'Cualquier Terapeuta Disponible'
              }
            </p>
          </div>
          
          {/* Date & Time */}
          <div className="bg-white border border-beige-200 rounded-xl p-4">
            <h3 className="font-semibold text-dark mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gold" />
              Fecha y Hora
            </h3>
            <p className="text-dark font-medium">
              {selectedDate && formatDate(selectedDate)}
            </p>
            <p className="text-sm text-warm-gray flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {selectedTime && formatTime(selectedTime)}
              <span className="text-beige-300">•</span>
              {totalDuration} minutos de duración
            </p>
          </div>
        </div>
        
        {/* Right Column - Cart Summary */}
        <div>
          <CartSummary showRemoveButtons={false} />
        </div>
      </div>
      
      {/* Payment Notice */}
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-amber-800 text-sm flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Nota:</strong> Al confirmar, tu cita será registrada en nuestro sistema. 
            El pago se realizará directamente en el spa al momento de tu visita.
          </span>
        </p>
      </div>
      
      {/* Navigation */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={prevStep}
          disabled={isSubmitting}
          className="flex items-center gap-2 text-warm-gray hover:text-dark transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>
        
        <button
          onClick={handleConfirmBooking}
          disabled={isSubmitting || isLoading}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-gold to-gold/90 
                   text-dark font-bold text-lg rounded-xl hover:shadow-lg transition-all
                   disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Confirmar Reserva
            </>
          )}
        </button>
      </div>
    </div>
  )
}
