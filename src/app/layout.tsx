import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getLocale } from 'next-intl/server'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mimosa Spa Retreat | Tu santuario de paz',
  description: 'Mimosa Spa Retreat es un lugar único para descansar, relajarse y rejuvenecer. Ofrecemos una amplia variedad de servicios de spa en Panamá.',
  keywords: ['spa', 'masajes', 'tratamientos faciales', 'panamá', 'relajación', 'bienestar'],
  authors: [{ name: 'Mimosa Spa Retreat' }],
  creator: 'Mimosa Spa Retreat',
  openGraph: {
    title: 'Mimosa Spa Retreat | Tu santuario de paz',
    description: 'Tu santuario de paz y renovación en Panamá. Reserva tu experiencia de spa hoy.',
    url: 'https://mimosaretreat.com',
    siteName: 'Mimosa Spa Retreat',
    locale: 'es_PA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mimosa Spa Retreat',
    description: 'Tu santuario de paz y renovación en Panamá.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#FCCF08',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
