'use client'

import { useTranslations } from 'next-intl'
import { PromotionCard } from './PromotionCard'

interface PromotionsListProps {
  locale: string
}

// Sample promotions - will be replaced with Supabase data
const promotions = [
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
    mindbody_service_id: null,
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
  },
  {
    id: '2',
    title_es: 'Suspiro de Serenidad',
    title_en: 'Sigh of Serenity',
    description_es: 'Masaje Liberador de Tensión + Masaje de Pies en Camilla + Masaje Craneofacial',
    description_en: 'Tension Release Massage + Table Foot Massage + Craniofacial Massage',
    services: ['Masaje Liberador de Tensión', 'Masaje de Pies en Camilla', 'Masaje Craneofacial'],
    price: 99,
    duration_minutes: 85,
    image_url: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=800',
    valid_from: '2026-01-01',
    valid_until: '2026-01-31',
    is_active: true,
    sort_order: 2,
    mindbody_service_id: null,
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
  },
  {
    id: '3',
    title_es: 'Calma Total',
    title_en: 'Total Calm',
    description_es: 'Masaje Relajante + Exfoliación Corporal + Masaje de Piedras Calientes + Mascarilla Hidratante',
    description_en: 'Relaxing Massage + Body Exfoliation + Hot Stone Massage + Hydrating Mask',
    services: ['Masaje Relajante', 'Exfoliación Corporal', 'Masaje de Piedras Calientes', 'Mascarilla Hidratante'],
    price: 129,
    duration_minutes: 110,
    image_url: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=800',
    valid_from: '2026-01-01',
    valid_until: '2026-01-31',
    is_active: true,
    sort_order: 3,
    mindbody_service_id: null,
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
  },
]

export function PromotionsList({ locale }: PromotionsListProps) {
  const t = useTranslations('promotions')

  if (promotions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-warm-gray">{t('noPromotions')}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {promotions.map((promotion) => (
        <PromotionCard
          key={promotion.id}
          promotion={promotion}
          locale={locale}
        />
      ))}
    </div>
  )
}
