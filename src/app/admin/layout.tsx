import { Cormorant_Garamond, Lato } from 'next/font/google'
import '@/app/globals.css'
import { AdminLayoutClient } from './AdminLayoutClient'
import { getAdminScope } from '@/lib/admin/scope'

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

export const metadata = {
  title: 'Admin | Mimosa Spa Retreat',
  description: 'Panel de administración',
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const scope = await getAdminScope()

  return (
    <html lang="es" className={`${cormorant.variable} ${lato.variable}`}>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#FCCF08" />
      </head>
      <body className="min-h-screen bg-beige-100 font-body antialiased">
        <AdminLayoutClient
          isLocationRestricted={scope.isLocationRestricted}
          locationName={scope.locationName}
          isMobileManager={scope.isMobileManager}
        >
          {children}
        </AdminLayoutClient>
      </body>
    </html>
  )
}
