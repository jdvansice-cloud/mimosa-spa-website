import { getTranslations } from 'next-intl/server'
import { BookingPageContent } from '@/components/booking/BookingPageContent'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'booking' })
  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

export default async function BookingPage({ params }: { params: Promise<{ locale: string }> }) {
  await params // Resolve params even if not used directly

  return <BookingPageContent />
}
