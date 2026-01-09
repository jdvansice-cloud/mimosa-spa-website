'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui'
import { PromotionCard } from '@/components/promotions/PromotionCard'
import type { Promotion } from '@/types'

interface PromotionsPreviewProps {
  locale: string
}

// Sample promotions data - will be replaced with Supabase data
const samplePromotions: Promotion[] = [
  {
    id: '1',
    title_es: 'Esencia de Paz',
    title_en: 'Essence of Peace',
    description_es: 'Masaje de Piernas Cansadas + Masaje Craneo-Facial',
    description_en: 'Tired Legs Massage + Cranio-Facial Massage',
    services: ['Masaje de Piernas Cansadas', 'Masaje Craneo-Facial'],
    price: 79,
    duration_minutes: 65,
    image_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800',
    valid_from: '2026-01-01',
    valid_until: '2026-01-31',
    is_active: true,
    sort_order: 1,
  },
  {
    id: '2',
    title_es: 'Suspiro de Serenidad',
    title_en: 'Sigh of Serenity',
    description_es: 'Masaje Liberador de Tensión + Masaje de Pies + Masaje Craneofacial',
    description_en: 'Tension Release Massage + Foot Massage + Craniofacial Massage',
    services: ['Masaje Liberador de Tensión', 'Masaje de Pies', 'Masaje Craneofacial'],
    price: 99,
    duration_minutes: 85,
    image_url: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=800',
    valid_from: '2026-01-01',
    valid_until: '2026-01-31',
    is_active: true,
    sort_order: 2,
  },
  {
    id: '3',
    title_es: 'Calma Total',
    title_en: 'Total Calm',
    description_es: 'Masaje Relajante + Exfoliación Corporal + Masaje de Piedras Calientes + Mascarilla',
    description_en: 'Relaxing Massage + Body Scrub + Hot Stone Massage + Face Mask',
    services: ['Masaje Relajante', 'Exfoliación Corporal', 'Masaje de Piedras Calientes', 'Mascarilla Hidratante'],
    price: 129,
    duration_minutes: 110,
    image_url: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=800',
    valid_from: '2026-01-01',
    valid_until: '2026-01-31',
    is_active: true,
    sort_order: 3,
  },
]

export function PromotionsPreview({ locale }: PromotionsPreviewProps) {
  const t = useTranslations('home.promotions')

  return (
    <div>
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
        <div>
          <h2 className="title-decorated">{t('title').toUpperCase()}</h2>
          <p className="text-warm-gray mt-2">Enero 2026</p>
        </div>
        <Link href={`/${locale}/promociones`}>
          <Button variant="ghost" rightIcon={<ArrowRight className="h-4 w-4" />}>
            {t('viewAll')}
          </Button>
        </Link>
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {samplePromotions.map((promotion) => (
          <PromotionCard
            key={promotion.id}
            promotion={promotion}
            locale={locale}
          />
        ))}
      </div>
    </div>
  )
}
