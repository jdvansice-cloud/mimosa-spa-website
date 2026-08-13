import { SITE_URL } from './nav'
import type { ServerSiteSettings } from './settings'

// JSON-LD builders. Policy note: LocalBusiness nodes stay strictly factual —
// NO aggregateRating / review sourced from Google (self-serving review markup
// is unsupported by Google and risks a manual action). Proof renders on-page.

function formatTel(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return digits.startsWith('507') ? `+${digits}` : `+507${digits}`
}

interface LocationInput {
  idSlug: string
  name: string
  streetAddress: string
  phone: string
  latitude: number
  longitude: number
  image?: string
}

function daySpaNode(loc: LocationInput, settings: ServerSiteSettings) {
  return {
    '@type': ['DaySpa', 'LocalBusiness'],
    '@id': `${SITE_URL}/#${loc.idSlug}`,
    name: `Mimosa Spa Retreat — ${loc.name}`,
    url: SITE_URL,
    telephone: formatTel(loc.phone),
    email: settings.email,
    priceRange: '$$',
    currenciesAccepted: 'USD',
    image: loc.image || `${SITE_URL}/og-default.jpg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: loc.streetAddress,
      addressLocality: 'Ciudad de Panamá',
      addressCountry: 'PA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: loc.latitude,
      longitude: loc.longitude,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: settings.weekday_open?.slice(0, 5) || '09:00',
        closes: settings.weekday_close?.slice(0, 5) || '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: settings.weekend_open?.slice(0, 5) || '09:00',
        closes: settings.weekend_close?.slice(0, 5) || '18:00',
      },
    ],
    sameAs: [settings.instagram_url, settings.facebook_url].filter(Boolean),
  }
}

interface NapAddresses {
  costaDelEste: string
  sanFrancisco: string
}

/** The two location nodes, mounted on the homepage. */
export function daySpaNodes(settings: ServerSiteSettings, addresses: NapAddresses) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      daySpaNode(
        {
          idSlug: 'costa-del-este',
          name: 'Costa del Este',
          streetAddress: addresses.costaDelEste,
          phone: settings.phone_costa_del_este,
          latitude: 9.022731,
          longitude: -79.46174,
        },
        settings
      ),
      daySpaNode(
        {
          idSlug: 'san-francisco',
          name: 'San Francisco',
          streetAddress: addresses.sanFrancisco,
          phone: settings.phone_san_francisco,
          latitude: 8.9932791,
          longitude: -79.5054466,
        },
        settings
      ),
    ],
  }
}

export interface SchemaService {
  name: string
  description?: string | null
  price?: number | null
}

/** ItemList of Service offers for a menu/landing page. */
export function serviceListSchema(services: SchemaService[], pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    url: pageUrl,
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: s.name,
        ...(s.description
          ? { description: s.description.replace(/<[^>]*>/g, '').slice(0, 300) }
          : {}),
        provider: [
          { '@id': `${SITE_URL}/#costa-del-este` },
          { '@id': `${SITE_URL}/#san-francisco` },
        ],
        ...(s.price && s.price > 0
          ? {
              offers: {
                '@type': 'Offer',
                price: s.price.toFixed(2),
                priceCurrency: 'USD',
              },
            }
          : {}),
      },
    })),
  }
}
