'use client'

import { useBookingStore } from '@/lib/booking/store'
import { BookingWidget } from './BookingWidget'
import { AnimatePresence, motion } from 'framer-motion'

export function BookingPageContent() {
  const currentStep = useBookingStore(state => state.currentStep)

  // Show header only on auth step (before booking process starts)
  const showHeader = currentStep === 'auth'

  return (
    <div className="min-h-screen bg-cream">
      {/* Page Header - Only shown before booking starts */}
      <AnimatePresence>
        {showHeader && (
          <motion.section
            initial={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="py-4 md:py-6 bg-beige text-center overflow-hidden"
          >
            <div className="container-spa">
              <h1 className="text-2xl md:text-3xl font-display font-semibold mb-1">
                Reservar Cita
              </h1>
              <p className="text-sm text-warm-gray">Agenda tu próxima visita</p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Booking Widget */}
      <section className="py-4 md:py-6">
        <div className="container-spa max-w-4xl">
          <BookingWidget />
        </div>
      </section>
    </div>
  )
}
