'use client'

import { useEffect } from 'react'
import { CheckCircle, Calendar, MapPin, Clock, User, Home, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { useBookingStore } from '@/lib/booking/store'
import { calculateCartPricing } from '@/lib/booking/pricing'
import Link from 'next/link'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function SuccessStep() {
  const {
    bookingConfirmation,
    selectedLocation,
    selectedServices,
    selectedAddons,
    selectedStaff,
    selectedDate,
    selectedTime,
    activePromotion,
    globalDiscountActive,
    globalDiscountPercent,
    replaceAppointmentId,
    resetForNewBooking
  } = useBookingStore()

  // Same pricing math as ConfirmStep/FloatingCart (the old store `pricing`
  // field was always null, so the total never rendered here).
  const pricing = calculateCartPricing({
    services: selectedServices,
    addons: selectedAddons,
    promotion: activePromotion,
    globalDiscountActive,
    globalDiscountPercent,
  })

  const isReplacement = !!replaceAppointmentId

  // Fire Google Ads conversion event on booking success
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-965602203/sZRACL3F-IccEJvXt8wD'
      })
    }
  }, [])

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
  
  const handleNewBooking = () => {
    resetForNewBooking()
  }
  
  return (
    <div className="success-step flex flex-col h-full">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-4">
        {/* Header - Compact */}
        <div className="text-center mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: 0.1
            }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full
                          flex items-center justify-center mx-auto mb-3 shadow-lg">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <CheckCircle className="w-8 h-8 text-white" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-bold text-dark mb-1">
              {isReplacement ? '¡Cita Actualizada!' : '¡Reserva Confirmada!'}
            </h2>
            <p className="text-xs text-warm-gray mb-2">
              {isReplacement
                ? 'Tu nueva cita fue confirmada y la anterior fue cancelada'
                : 'Tu cita ha sido registrada exitosamente'}
            </p>

            {/* Confirmation Number */}
            {bookingConfirmation?.confirmationNumber && (
              <div className="inline-block bg-beige-100 px-3 py-1.5 rounded-full">
                <span className="text-xs text-warm-gray">Número de confirmación: </span>
                <span className="font-bold text-dark text-sm">{bookingConfirmation.confirmationNumber}</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Booking Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white border border-beige-200 rounded-xl p-4 text-left mb-4"
        >
          {/* Promotion Badge */}
          {activePromotion && (
            <div className="flex items-center gap-2 mb-3 bg-gold/10 px-2 py-1.5 rounded-lg">
              <Star className="w-4 h-4 text-gold" />
              <span className="font-semibold text-dark text-sm">{activePromotion.title_es}</span>
            </div>
          )}

          {/* Location */}
          <div className="flex items-start gap-2 mb-3">
            <MapPin className="w-4 h-4 text-gold mt-0.5" />
            <div>
              <p className="font-medium text-dark text-sm">{selectedLocation?.Name}</p>
              <p className="text-xs text-warm-gray">{selectedLocation?.Address}</p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="flex items-start gap-2 mb-3">
            <Calendar className="w-4 h-4 text-gold mt-0.5" />
            <div>
              <p className="font-medium text-dark text-sm">
                {selectedDate && formatDate(selectedDate)}
              </p>
              <p className="text-xs text-warm-gray flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {selectedTime && formatTime(selectedTime)}
              </p>
            </div>
          </div>

          {/* Therapist */}
          <div className="flex items-start gap-2 mb-3">
            <User className="w-4 h-4 text-gold mt-0.5" />
            <p className="font-medium text-dark text-sm">
              {selectedStaff
                ? selectedStaff.DisplayName || `${selectedStaff.FirstName} ${selectedStaff.LastName}`
                : 'Terapeuta Asignado'
              }
            </p>
          </div>

          {/* Services */}
          <div className="border-t border-beige-200 pt-3 mt-3">
            <p className="text-xs font-semibold text-warm-gray mb-1.5">SERVICIOS:</p>
            <ul className="space-y-1">
              {selectedServices.map(service => (
                <li key={service.Id} className="text-xs text-dark flex justify-between">
                  <span>{service.Name}</span>
                  <span className="text-warm-gray">{service.Duration} min</span>
                </li>
              ))}
              {selectedAddons.map(addon => (
                <li key={addon.Id} className="text-xs text-gold-600 flex justify-between">
                  <span>+ {addon.Name}</span>
                  <span>{addon.Duration} min</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Total */}
          {pricing.totalWithTax > 0 && (
            <div className="border-t border-beige-200 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-dark text-sm">Total a pagar:</span>
                <span className="text-lg font-bold text-gold-600">
                  ${pricing.totalWithTax.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-warm-gray mt-0.5">
                Incluye ITBM (7%)
              </p>
            </div>
          )}
        </motion.div>

        {/* Important Notes - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-left"
        >
          <h4 className="font-semibold text-amber-800 text-sm mb-1.5">Información Importante:</h4>
          <ul className="text-xs text-amber-700 space-y-0.5">
            <li>• Llega 10 minutos antes de tu cita</li>
            <li>• El pago se realiza en el spa</li>
            <li>• Cancelaciones: 24 horas de anticipación</li>
          </ul>
        </motion.div>

        {/* Actions - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2.5 bg-beige-100 text-dark
                     font-medium rounded-xl hover:bg-beige-200 transition-all text-sm"
          >
            <Home className="w-4 h-4" />
            Volver al Inicio
          </Link>

          <button
            onClick={handleNewBooking}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gold to-gold/90
                     text-dark font-semibold rounded-xl hover:shadow-lg transition-all text-sm"
          >
            <Calendar className="w-4 h-4" />
            Nueva Reserva
          </button>
        </motion.div>

        {/* WhatsApp Contact - Compact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-4 text-center"
        >
          <p className="text-xs text-warm-gray mb-1">
            ¿Tienes alguna pregunta?
          </p>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '50760001234'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-green-600 hover:text-green-700 font-medium text-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contáctanos por WhatsApp
          </a>
        </motion.div>
      </div>
    </div>
  )
}
