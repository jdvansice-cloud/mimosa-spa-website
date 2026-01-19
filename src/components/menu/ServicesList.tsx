'use client'

import { useEffect, useState } from 'react'
import { Clock, Loader2, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import type { MindbodyService } from '@/types/booking'
import { useTranslations } from 'next-intl'
import { BookingButton } from './BookingButton'
import { ExpandableDescription } from './ExpandableDescription'

interface TreatmentSetting {
  mindbody_service_id: number
  is_visible: boolean
  show_booking_button: boolean
  is_top_pick: boolean
}

interface ServiceWithSettings extends MindbodyService {
  showBookingButton?: boolean
  isOnlineBookable?: boolean
  isTopPick?: boolean
}

interface ServicesListProps {
  programIds: number[]
  locale: string
}

export function ServicesList({ programIds, locale }: ServicesListProps) {
  const [services, setServices] = useState<ServiceWithSettings[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const t = useTranslations('menu')

  useEffect(() => {
    async function fetchServices() {
      setIsLoading(true)
      setError(null)

      try {
        // Fetch services (including offline) and treatment settings in parallel
        // includeOffline=true ensures we get all services from Mindbody, not just online bookable ones
        const [servicesResponse, settingsResponse] = await Promise.all([
          fetch('/api/mindbody/services?type=all&includeOffline=true'),
          fetch('/api/treatments/settings')
        ])

        const servicesData = await servicesResponse.json()
        const settingsData = await settingsResponse.json()

        if (!servicesResponse.ok) {
          throw new Error(servicesData.error || 'Error al cargar servicios')
        }

        // Create a map of settings by mindbody_service_id
        const settingsMap = new Map<number, TreatmentSetting>()
        if (settingsData.settings) {
          for (const setting of settingsData.settings) {
            settingsMap.set(setting.mindbody_service_id, setting)
          }
        }

        // Filter services by programIds
        const filteredServices = servicesData.services.filter(
          (service: MindbodyService) => programIds.includes(service.ProgramId)
        )

        // Remove duplicates by name and apply visibility settings
        const uniqueServices = filteredServices.reduce((acc: ServiceWithSettings[], service: MindbodyService) => {
          if (!acc.find(s => s.Name === service.Name)) {
            const setting = settingsMap.get(service.Id)

            // Only show services that have a setting with is_visible = true
            // New services (no setting) are hidden by default until admin enables them
            if (!setting || !setting.is_visible) {
              return acc
            }

            // showBookingButton: Only true if service is online bookable AND admin hasn't disabled it
            // For booking widget to work, service must be online bookable in Mindbody
            const isOnlineBookable = service.OnlineBooking === true
            const showBookingButton = isOnlineBookable && setting.show_booking_button
            const isTopPick = setting.is_top_pick === true

            acc.push({
              ...service,
              showBookingButton,
              isOnlineBookable,
              isTopPick
            })
          }
          return acc
        }, [])

        // Sort by price ascending
        uniqueServices.sort((a: MindbodyService, b: MindbodyService) => a.Price - b.Price)

        setServices(uniqueServices)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error de conexión')
      } finally {
        setIsLoading(false)
      }
    }

    fetchServices()
  }, [programIds])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-10 h-10 text-gold animate-spin mb-4" />
        <p className="text-warm-gray">{t('loading')}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center">
        {error}
      </div>
    )
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-16 bg-beige-50 rounded-xl">
        <p className="text-warm-gray">{t('noServices')}</p>
      </div>
    )
  }

  // Separate top picks from regular services
  const topPicks = services.filter(s => s.isTopPick)
  const regularServices = services.filter(s => !s.isTopPick)

  // Render a single service card - optimized for mobile
  const renderServiceCard = (service: ServiceWithSettings, index: number, isTopPick: boolean = false) => (
    <motion.div
      key={service.Id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className={`bg-white rounded-lg md:rounded-xl border p-3 md:p-6 shadow-sm hover:shadow-md transition-shadow ${
        isTopPick ? 'border-gold-300 ring-1 ring-gold-200' : 'border-beige-200'
      }`}
    >
      {/* Mobile Layout: Compact single column */}
      <div className="md:hidden">
        {/* Header row: Title + Duration + Price */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            {isTopPick && (
              <Star className="w-4 h-4 text-gold-500 fill-gold-500 flex-shrink-0" />
            )}
            <h3 className="text-sm font-semibold text-dark truncate">
              {service.Name}
            </h3>
            {service.Duration > 0 && (
              <span className="text-xs text-warm-gray flex-shrink-0">
                - {service.Duration} {t('duration')}
              </span>
            )}
          </div>
        </div>

        {/* Description - expandable on mobile */}
        {service.Description && (
          <ExpandableDescription
            html={service.Description}
            maxLines={2}
            seeMoreText={t('seeMore')}
            seeLessText={t('seeLess')}
            className="mb-2"
          />
        )}

        {/* Price and Book button row */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gold-600">
            {service.Price > 0 ? `$${service.Price.toFixed(0)}` : 'Consultar'}
          </span>
          {service.showBookingButton && (
            <BookingButton
              service={service}
              locale={locale}
              label={t('bookNow')}
              className="inline-flex items-center px-3 py-1.5 bg-gold text-dark text-xs font-semibold rounded-lg hover:bg-gold/90 transition-colors"
            />
          )}
        </div>
      </div>

      {/* Desktop Layout: Original side-by-side */}
      <div className="hidden md:flex md:flex-row md:items-center md:justify-between gap-4">
        {/* Service Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {isTopPick && (
              <Star className="w-5 h-5 text-gold-500 fill-gold-500 flex-shrink-0" />
            )}
            <h3 className="text-lg font-semibold text-dark">
              {service.Name}
            </h3>
          </div>
          {service.Description && (
            <div
              className="text-sm text-warm-gray-600 leading-relaxed [&_p]:mb-2 [&_br]:hidden"
              dangerouslySetInnerHTML={{ __html: service.Description }}
            />
          )}
        </div>

        {/* Price and Duration */}
        <div className="flex items-center gap-4 md:flex-col md:items-end md:gap-2">
          <div className="flex items-center gap-2">
            {service.Duration > 0 && (
              <span className="flex items-center gap-1 text-sm text-warm-gray bg-beige-100 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4" />
                {service.Duration} {t('duration')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-gold-600">
              {service.Price > 0 ? `$${service.Price.toFixed(0)}` : 'Consultar'}
            </span>
            {service.showBookingButton && (
              <BookingButton
                service={service}
                locale={locale}
                label={t('bookNow')}
                className="inline-flex items-center px-4 py-2 bg-gold text-dark text-sm font-semibold rounded-lg hover:bg-gold/90 transition-colors"
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-4 md:space-y-8">
      {/* Recommendations Section (Top Picks) */}
      {topPicks.length > 0 && (
        <div className="bg-gradient-to-r from-gold-50 to-beige-50 rounded-xl p-4 md:p-6 border border-gold-200">
          <div className="flex items-center gap-2 mb-3 md:mb-5">
            <Star className="w-5 h-5 md:w-6 md:h-6 text-gold-500 fill-gold-500" />
            <h2 className="text-lg md:text-xl font-semibold text-dark">{t('topPicks')}</h2>
          </div>
          <div className="space-y-2 md:space-y-4">
            {topPicks.map((service, index) => renderServiceCard(service, index, true))}
          </div>
        </div>
      )}

      {/* Regular Services Section */}
      {regularServices.length > 0 && (
        <div>
          {topPicks.length > 0 && (
            <h2 className="text-lg md:text-xl font-semibold text-dark mb-2 md:mb-4">{t('allServices')}</h2>
          )}
          <div className="space-y-2 md:space-y-4">
            {regularServices.map((service, index) => renderServiceCard(service, index))}
          </div>
        </div>
      )}
    </div>
  )
}
