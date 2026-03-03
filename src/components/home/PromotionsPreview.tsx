'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui'
import { PromotionCard } from '@/components/promotions/PromotionCard'
import type { Promotion } from '@/types'

export function PromotionsPreview() {
  const t = useTranslations('home.promotions')
  const locale = useLocale()
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPromotions() {
      try {
        const response = await fetch('/api/promotions?active=true')
        const data = await response.json()
        if (response.ok && data.data) {
          // Show max 3 promotions on home page
          setPromotions(data.data.slice(0, 3))
        }
      } catch (error) {
        console.error('Error fetching promotions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPromotions()
  }, [])

  // Don't render the section if no promotions
  if (!isLoading && promotions.length === 0) {
    return null
  }

  return (
    <div>
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="title-decorated">{t('title').toUpperCase()}</h2>
      </div>

      {/* Promotions Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 text-gold animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {promotions.map((promotion) => (
            <PromotionCard
              key={promotion.id}
              promotion={promotion}
            />
          ))}
        </div>
      )}
    </div>
  )
}
