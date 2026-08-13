'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Loader2, MessageCircle } from 'lucide-react'

interface MembershipTier {
  name: string
  price: number
  value: number
  validity_months: number
  guests_per_visit: number
  benefit_percent: number
}

interface MembershipSettings {
  id?: string
  title_es: string
  title_en: string
  subtitle_es: string
  subtitle_en: string
  intro_es: string
  intro_en: string
  image_url: string
  what_is_title_es: string
  what_is_title_en: string
  what_is_content_es: string
  what_is_content_en: string
  benefits_title_es: string
  benefits_title_en: string
  benefits_es: string[]
  benefits_en: string[]
  who_is_for_title_es: string
  who_is_for_title_en: string
  who_is_for_es: string[]
  who_is_for_en: string[]
  group_use_title_es: string
  group_use_title_en: string
  group_use_es: string[]
  group_use_en: string[]
  options_title_es: string
  options_title_en: string
  options_es: string[]
  options_en: string[]
  tiers: MembershipTier[]
  cta_es: string
  cta_en: string
  table_note_es: string
  table_note_en: string
  is_active: boolean
}

const defaultImage = 'https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=800'

export default function MembresiaPage() {
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('menuPages.membresia')
  const tCommon = useTranslations('common')

  const [settings, setSettings] = useState<MembershipSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [whatsappNumber, setWhatsappNumber] = useState('50764049464')

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch membership settings and site settings in parallel
        const [membershipRes, settingsRes] = await Promise.all([
          fetch('/api/membership'),
          fetch('/api/settings')
        ])

        const membershipData = await membershipRes.json()
        if (membershipData.data) {
          setSettings(membershipData.data)
        }

        const settingsData = await settingsRes.json()
        if (settingsData.data?.whatsapp_number) {
          setWhatsappNumber(settingsData.data.whatsapp_number)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
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
            <h1 className="title-decorated">{t('title').toUpperCase()}</h1>
          </div>
        </section>
        <section className="section">
          <div className="container-spa text-center">
            <p className="text-warm-gray">Membership information is not available at this time.</p>
          </div>
        </section>
      </div>
    )
  }

  const title = locale === 'en' ? settings.title_en : settings.title_es
  const subtitle = locale === 'en' ? settings.subtitle_en : settings.subtitle_es
  const intro = locale === 'en' ? settings.intro_en : settings.intro_es
  const whatIsTitle = locale === 'en' ? settings.what_is_title_en : settings.what_is_title_es
  const whatIsContent = locale === 'en' ? settings.what_is_content_en : settings.what_is_content_es
  const benefitsTitle = locale === 'en' ? settings.benefits_title_en : settings.benefits_title_es
  const benefits = locale === 'en' ? settings.benefits_en : settings.benefits_es
  const whoIsForTitle = locale === 'en' ? settings.who_is_for_title_en : settings.who_is_for_title_es
  const whoIsFor = locale === 'en' ? settings.who_is_for_en : settings.who_is_for_es
  const groupUseTitle = locale === 'en' ? settings.group_use_title_en : settings.group_use_title_es
  const groupUse = locale === 'en' ? settings.group_use_en : settings.group_use_es
  const optionsTitle = locale === 'en' ? settings.options_title_en : settings.options_title_es
  const options = locale === 'en' ? settings.options_en : settings.options_es
  const cta = locale === 'en' ? settings.cta_en : settings.cta_es
  const tableNote = locale === 'en' ? settings.table_note_en : settings.table_note_es
  const imageUrl = settings.image_url || defaultImage

  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
    locale === 'en'
      ? 'Hi, I would like information about Mimosa Privilege membership.'
      : 'Hola, me gustaría información sobre la membresía Mimosa Privilege.'
  )}`

  return (
    <div className="min-h-screen bg-cream">
      {/* Page Header */}
      <section className="py-16 bg-beige text-center">
        <div className="container-spa">
          <h1 className="title-decorated">{title.toUpperCase()}</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="section">
        <div className="container-spa">
          <div className="max-w-3xl mx-auto">
            {/* Image below title */}
            <div className="relative w-48 h-48 mx-auto mb-8 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="192px"
              />
            </div>

            {/* Decorative line */}
            <div className="flex justify-center mb-8">
              <div className="w-32 border-t-2 border-dark" />
            </div>

            {/* Subtitle with sparkles */}
            <p className="text-center text-xl text-gold-600 mb-6">
              ✨ {subtitle} ✨
            </p>

            {/* Intro text */}
            <div className="text-center mb-12 whitespace-pre-line text-warm-gray-700">
              {intro}
            </div>

            {/* What is Mimosa Privilege */}
            <div className="text-center mb-10">
              <p className="text-lg mb-4">
                <span className="text-purple-600">💎</span> {whatIsTitle}
              </p>
              <div className="whitespace-pre-line text-warm-gray-700">
                {whatIsContent}
              </div>
            </div>

            {/* Benefits */}
            <div className="text-center mb-10">
              <p className="text-lg mb-4">
                <span>💳</span> {benefitsTitle}
              </p>
              <ul className="space-y-2">
                {benefits?.map((benefit, index) => (
                  <li key={index} className="text-warm-gray-700">
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Who is it for */}
            <div className="text-center mb-10">
              <p className="text-lg mb-4">
                <span>👥</span> {whoIsForTitle}
              </p>
              <ul className="space-y-2">
                {whoIsFor?.map((item, index) => (
                  <li key={index} className="text-warm-gray-700">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Group use */}
            <div className="text-center mb-10">
              <p className="text-lg mb-4">
                <span>👫</span> {groupUseTitle}
              </p>
              <ul className="space-y-2">
                {groupUse?.map((item, index) => (
                  <li key={index} className="text-warm-gray-700">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Options */}
            <div className="text-center mb-10">
              <p className="text-lg mb-4">
                <span>💰</span> {optionsTitle}
              </p>
              <ul className="space-y-2">
                {options?.map((option, index) => (
                  <li key={index} className="text-warm-gray-700">
                    {option}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <p className="text-center text-warm-gray-700 mb-8">
              ✍️ {cta}
            </p>

            {/* More benefits tagline */}
            <p className="text-center text-gold-600 mb-10">
              📝 {locale === 'en'
                ? 'More visits, more benefits, more Mimosa.'
                : 'Más visitas, más beneficios, más Mimosa.'}
            </p>

            {/* Pricing Table */}
            {settings.tiers && settings.tiers.length > 0 && (
              <div className="mb-10 overflow-x-auto">
                <table className="w-full border-collapse border-2 border-dark text-sm md:text-base">
                  <thead>
                    <tr className="bg-white">
                      <th className="border-2 border-dark p-3 font-bold text-dark">
                        {t('tableHeaders.card')}
                      </th>
                      <th className="border-2 border-dark p-3 font-bold text-dark">
                        {t('tableHeaders.validity')}
                      </th>
                      <th className="border-2 border-dark p-3 font-bold text-dark">
                        {t('tableHeaders.guests')}
                      </th>
                      <th className="border-2 border-dark p-3 font-bold text-dark">
                        {t('tableHeaders.value')}
                      </th>
                      <th className="border-2 border-dark p-3 font-bold text-dark">
                        {t('tableHeaders.benefit')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {settings.tiers.map((tier, index) => (
                      <tr key={index} className="bg-white">
                        <td className="border-2 border-dark p-3 font-semibold">
                          {tier.name} *
                        </td>
                        <td className="border-2 border-dark p-3 text-center">
                          {tier.validity_months} {t('months')}
                        </td>
                        <td className="border-2 border-dark p-3 text-center">
                          {tier.guests_per_visit}
                        </td>
                        <td className="border-2 border-dark p-3 text-center">
                          ${tier.value.toLocaleString()} *
                        </td>
                        <td className="border-2 border-dark p-3 text-center font-bold">
                          {tier.benefit_percent}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-sm text-warm-gray mt-2">
                  {tableNote}
                </p>
              </div>
            )}

            {/* WhatsApp CTA Button */}
            <div className="text-center mb-12">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                {locale === 'en' ? 'Contact us on WhatsApp' : 'Contáctanos por WhatsApp'}
              </a>
            </div>
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
            {tCommon('backToMenu')}
          </Link>
        </div>
      </section>
    </div>
  )
}
