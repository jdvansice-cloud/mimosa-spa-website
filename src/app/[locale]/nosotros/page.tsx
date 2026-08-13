import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { Sparkles, Award, Heart } from 'lucide-react'
import { LocationsSection } from '@/components/home/LocationsSection'
import { getSiteImages } from '@/lib/site-images'
import { getServerSettings, aggregateRating } from '@/lib/settings'

// Revalidate hourly; tagged caches (site-images/settings/treatments) refresh sooner on admin edits.
export const revalidate = 3600


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  return {
    title: t('title'),
    description: t('intro').slice(0, 160),
  }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  await params // Ensure params are resolved

  // Fetch managed images
  const images = await getSiteImages([
    'about_image_1',
    'about_image_2',
    'location_costa_del_este',
    'location_san_francisco',
  ])
  const agg = aggregateRating(await getServerSettings())

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="container-spa">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Images */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                    <Image
                      src={images.about_image_1}
                      alt="Mimosa Spa Interior"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                    <Image
                      src={images.about_image_2}
                      alt="Spa Treatment"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                </div>
              </div>

              {/* Decorative Element */}
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-beige rounded-full -z-10" />
            </div>

            {/* Content */}
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-semibold mb-6">
                <AboutTitle />
              </h1>
              <div className="w-16 h-1 bg-dark mb-8" />
              <AboutContent />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section bg-beige">
        <div className="container-spa">
          <ValuesSection />
        </div>
      </section>

      {/* Locations Section */}
      <section className="section bg-cream">
        <div className="container-spa">
          <LocationsSection
            images={{
              costaDelEste: images.location_costa_del_este,
              sanFrancisco: images.location_san_francisco,
            }}
            ratings={{
              costaDelEste: agg.cde,
              sanFrancisco: agg.sfc,
            }}
          />
        </div>
      </section>
    </div>
  )
}

function AboutTitle() {
  const t = useTranslations('about')
  return <>{t('title')}</>
}

function AboutContent() {
  const t = useTranslations('about')
  return (
    <div className="space-y-6 text-lg text-dark/80">
      <p>{t('intro')}</p>
      <p>{t('mission')}</p>
      <p className="font-medium text-dark">{t('subscribe')}</p>
    </div>
  )
}

function ValuesSection() {
  const t = useTranslations('about.values')

  const values = [
    {
      icon: Award,
      titleKey: 'quality',
      descKey: 'qualityDesc',
    },
    {
      icon: Sparkles,
      titleKey: 'experience',
      descKey: 'experienceDesc',
    },
    {
      icon: Heart,
      titleKey: 'relaxation',
      descKey: 'relaxationDesc',
    },
  ]

  return (
    <div>
      <h2 className="text-3xl font-display font-semibold text-center mb-12">
        {t('title')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {values.map((value) => {
          const Icon = value.icon
          return (
            <div key={value.titleKey} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 text-gold mb-6">
                <Icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">
                {t(value.titleKey)}
              </h3>
              <p className="text-warm-gray">{t(value.descKey)}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
