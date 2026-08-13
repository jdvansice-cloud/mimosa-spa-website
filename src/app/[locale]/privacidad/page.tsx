import { LegalPage } from '@/components/legal/LegalPage'
import { LEGAL_PRIVACY } from '@/content/legal'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 86400

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const doc = LEGAL_PRIVACY[locale === 'en' ? 'en' : 'es']
  return buildPageMetadata({
    locale,
    path: '/privacidad',
    title: doc.title,
    description: doc.intro,
  })
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <LegalPage doc={LEGAL_PRIVACY[locale === 'en' ? 'en' : 'es']} />
}
