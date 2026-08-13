import type { MetadataRoute } from 'next'
import { LOCALES, PUBLIC_ROUTES, SITE_URL } from '@/lib/nav'

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const route of PUBLIC_ROUTES) {
    if (!route.sitemap) continue
    for (const locale of LOCALES) {
      const languages: Record<string, string> = {}
      for (const l of LOCALES) {
        languages[l] = `${SITE_URL}/${l}${route.path}`
      }
      entries.push({
        url: `${SITE_URL}/${locale}${route.path}`,
        priority: route.priority,
        changeFrequency: 'weekly',
        alternates: { languages },
      })
    }
  }

  return entries
}
