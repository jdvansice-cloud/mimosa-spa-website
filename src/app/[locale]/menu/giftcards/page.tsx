'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'

interface GiftCardSettings {
  id?: string
  title_es: string
  title_en: string
  description_es: string
  description_en: string
  image_url: string
  conditions_es: string[]
  conditions_en: string[]
  is_active: boolean
}

const defaultImage = 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=800'

export default function GiftCardsPage() {
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('menuPages.giftcards')
  const tCommon = useTranslations('common')

  const [settings, setSettings] = useState<GiftCardSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/giftcards')
        const { data } = await response.json()
        if (data) {
          setSettings(data)
        }
      } catch (error) {
        console.error('Error fetching gift card settings:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSettings()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-gold animate-spin" />
      </div>
    )
  }

  if (!settings || !settings.is_active) {
    return (
      <div className="min-h-screen bg-cream">
        <section className="py-16 bg-beige text-center">
          <div className="container-spa">
            <h1 className="title-decorated">GIFTCARDS</h1>
          </div>
        </section>
        <section className="section">
          <div className="container-spa text-center">
            <p className="text-warm-gray">Gift cards are not available at this time.</p>
          </div>
        </section>
      </div>
    )
  }

  const title = locale === 'en' ? settings.title_en : settings.title_es
  const description = locale === 'en' ? settings.description_en : settings.description_es
  const conditions = locale === 'en' ? settings.conditions_en : settings.conditions_es
  const imageUrl = settings.image_url || defaultImage

  return (
    <div className="min-h-screen bg-cream">
      {/* Page Header */}
      <section className="py-16 bg-beige text-center">
        <div className="container-spa">
          <h1 className="title-decorated">GIFTCARDS</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="section">
        <div className="container-spa">
          <div className="max-w-4xl mx-auto">
            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-spa-brown text-center mb-8">
              {title}
            </h2>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
              {/* Description */}
              <div className="space-y-6">
                <p className="text-warm-gray-700 leading-relaxed text-justify">
                  {description}
                </p>
                {/* Online shop entry */}
                <Link
                  href={`/${locale}/giftcards`}
                  className="btn-primary inline-flex"
                >
                  {locale === 'en' ? 'Buy a Gift Card' : 'Comprar Gift Card'}
                </Link>
              </div>

              {/* Image */}
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Purchase Conditions */}
            {conditions && conditions.length > 0 && (
              <div className="mt-12 bg-beige rounded-lg p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-display font-semibold text-spa-brown mb-4">
                  {t('purchaseConditions')}
                </h3>
                <ul className="space-y-3">
                  {conditions.map((condition, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-gold mt-1">&#8226;</span>
                      <span className="text-warm-gray-700">{condition}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Back to Menu */}
      <section className="pb-12">
        <div className="container-spa text-center">
          <Link
            href={`/${locale}/menu`}
            className="inline-flex items-center text-gold-600 hover:text-gold-700 font-medium transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {tCommon('back')} {locale === 'en' ? 'to Menu' : 'al Menú'}
          </Link>
        </div>
      </section>
    </div>
  )
}
