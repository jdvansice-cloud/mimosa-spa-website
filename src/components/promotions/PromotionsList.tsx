'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'
import { PromotionCard } from './PromotionCard'
import type { Promotion } from '@/types'

export function PromotionsList() {
  const t = useTranslations('promotions')
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPromotions() {
      try {
        const response = await fetch('/api/promotions?active=true')
        const data = await response.json()
        if (response.ok && data.data) {
          setPromotions(data.data)
        }
      } catch (error) {
        console.error('Error fetching promotions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPromotions()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 text-gold animate-spin" />
      </div>
    )
  }

  if (promotions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-warm-gray">{t('noPromotions')}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
      {promotions.map((promotion) => (
        <PromotionCard
          key={promotion.id}
          promotion={promotion}
        />
      ))}
    </div>
  )
}
