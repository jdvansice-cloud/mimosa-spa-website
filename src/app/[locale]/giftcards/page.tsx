import { redirect } from 'next/navigation'
import { FEATURES } from '@/lib/nav'
import { getTranslations } from 'next-intl/server'
import { buildPageMetadata } from '@/lib/seo'
import { GiftShopClient } from '@/components/giftshop/GiftShopClient'
import { MarketingHero } from '@/components/marketing/MarketingHero'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'giftShop' })
  return buildPageMetadata({
    locale,
    path: '/giftcards',
    title: t('title'),
    description: t('subtitle'),
  })
}

export default async function GiftShopPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!FEATURES.giftShop) redirect(`/${locale}/menu/giftcards`)
  const t = await getTranslations({ locale, namespace: 'giftShop' })

  return (
    <div className="min-h-screen bg-cream">
      <MarketingHero
        imageKey="giftcards_banner"
        title={t('title')}
        subtitle={t('subtitle')}
        size="compact"
      />
      <section className="section">
        <div className="container-spa max-w-3xl">
          <GiftShopClient locale={locale} />
        </div>
      </section>
    </div>
  )
}
