import { notFound } from 'next/navigation'
import { LANDINGS } from '@/content/landings'
import { LocalLandingPage } from '@/components/landing/LocalLandingPage'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 3600

const SLUG = 'masajes-costa-del-este'
const content = LANDINGS.find((c) => c.slug === SLUG)

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!content) return {}
  const l = locale === 'en' ? 'en' : 'es'
  return buildPageMetadata({
    locale,
    path: '/masajes-costa-del-este',
    title: content.title[l],
    description: content.metaDescription[l],
  })
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!content) notFound()
  return <LocalLandingPage content={content} locale={locale} />
}
