'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Spinner } from '@/components/ui'

const BOOKING_WIDGET_URL = process.env.NEXT_PUBLIC_BOOKING_WIDGET_URL || 'https://mimosa-spa-booking-widget.netlify.app'

export function BookingWidget() {
  const t = useTranslations('booking.widget')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Set a timeout to show error if iframe doesn't load
    const timeout = setTimeout(() => {
      if (isLoading) {
        setError('El sistema de reservas está tardando en cargar. Por favor, intenta recargar la página.')
      }
    }, 15000) // 15 second timeout

    return () => clearTimeout(timeout)
  }, [isLoading])

  const handleIframeLoad = () => {
    setIsLoading(false)
    setError(null)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setError('No se pudo cargar el sistema de reservas. Por favor, intenta de nuevo más tarde.')
  }

  return (
    <div className="booking-widget-container relative bg-white rounded-2xl shadow-elevated overflow-hidden">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-cream z-10">
          <Spinner size="lg" />
          <p className="mt-4 text-warm-gray">{t('loading')}</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-cream z-10 p-8 text-center">
          <div className="text-6xl mb-4">😔</div>
          <p className="text-dark mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Recargar Página
          </button>
        </div>
      )}

      {/* Iframe */}
      <iframe
        src={BOOKING_WIDGET_URL}
        title="Mimosa Spa Booking System"
        className="w-full border-0"
        style={{ minHeight: '850px', height: '100%' }}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        allow="payment"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
      />
    </div>
  )
}
