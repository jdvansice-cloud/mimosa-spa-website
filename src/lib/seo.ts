import type { Metadata } from 'next'
import { LOCALES, SITE_URL } from './nav'

interface PageMetadataInput {
  locale: string
  /** Locale-relative path, e.g. '/menu/corporales' ('' for home) */
  path: string
  title: string
  description: string
  ogImage?: string
  /** Set false for pages that should not be indexed */
  index?: boolean
}

/**
 * Canonical + hreflang + OG/Twitter metadata for a public page.
 * Usage in generateMetadata: return buildPageMetadata({ locale, path, title, description })
 */
export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  ogImage = '/og-default.jpg',
  index = true,
}: PageMetadataInput): Metadata {
  const canonical = `${SITE_URL}/${locale}${path}`
  const languages: Record<string, string> = {}
  for (const l of LOCALES) {
    languages[l] = `${SITE_URL}/${l}${path}`
  }
  languages['x-default'] = `${SITE_URL}/es${path}`

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Mimosa Spa Retreat',
      locale: locale === 'es' ? 'es_PA' : 'en_US',
      type: 'website',
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: index ? { index: true, follow: true } : { index: false, follow: false },
  }
}
