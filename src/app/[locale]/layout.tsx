import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Cormorant_Garamond, Lato } from 'next/font/google'
import { Header, Footer, MobileBottomNav } from '@/components/layout'
import { GoogleTagManager, GoogleTagManagerNoScript } from '@/components/analytics'
import '@/app/globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-lato',
  display: 'swap',
})

const locales = ['es', 'en']

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages({ locale })
  const meta = (messages as Record<string, Record<string, string>>).metadata

  return {
    title: {
      default: meta?.title || 'Mimosa Spa Retreat',
      template: '%s | Mimosa Spa Retreat',
    },
    description: meta?.description || 'Tu refugio de paz y bienestar en Panamá',
    keywords: meta?.keywords || 'spa, masajes, bienestar, Panamá',
    icons: {
      icon: '/favicon.png',
      apple: '/favicon.png',
    },
    openGraph: {
      title: meta?.title || 'Mimosa Spa Retreat',
      description: meta?.description || 'Tu refugio de paz y bienestar',
      url: 'https://mimosaretreat.com',
      siteName: 'Mimosa Spa Retreat',
      locale: locale === 'es' ? 'es_PA' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta?.title || 'Mimosa Spa Retreat',
      description: meta?.description || 'Tu refugio de paz y bienestar',
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  if (!locales.includes(locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} className={`${cormorant.variable} ${lato.variable}`}>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FCCF08" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-screen bg-cream font-body antialiased">
        <GoogleTagManager />
        <GoogleTagManagerNoScript />
        <NextIntlClientProvider messages={messages}>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 pt-20 pb-20 lg:pb-0">
              {children}
            </main>
            <Footer />
            <MobileBottomNav />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
