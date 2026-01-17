'use client'

import { useEffect, useState } from 'react'
import { Clock, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { MindbodyService } from '@/types/booking'
import { useTranslations } from 'next-intl'

interface ServicesListProps {
  programIds: number[]
  locale: string
}

export function ServicesList({ programIds, locale }: ServicesListProps) {
  const [services, setServices] = useState<MindbodyService[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const t = useTranslations('menu')

  useEffect(() => {
    async function fetchServices() {
      setIsLoading(true)
      setError(null)

      try {
        // Fetch services from both locations and merge
        const response = await fetch('/api/mindbody/services?type=all')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Error al cargar servicios')
        }

        // Filter services by programIds
        const filteredServices = data.services.filter(
          (service: MindbodyService) => programIds.includes(service.ProgramId)
        )

        // Remove duplicates by name (same service might exist at multiple locations)
        const uniqueServices = filteredServices.reduce((acc: MindbodyService[], service: MindbodyService) => {
          if (!acc.find(s => s.Name === service.Name)) {
            acc.push(service)
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

  return (
    <div className="space-y-4">
      {services.map((service, index) => (
        <motion.div
          key={service.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className="bg-white rounded-xl border border-beige-200 p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Service Info */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-dark mb-2">
                {service.Name}
              </h3>
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
                <Link
                  href={`/${locale}/reservar`}
                  className="inline-flex items-center px-4 py-2 bg-gold text-dark text-sm font-semibold rounded-lg hover:bg-gold/90 transition-colors"
                >
                  {t('bookNow')}
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
