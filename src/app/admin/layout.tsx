import { Cormorant_Garamond, Lato } from 'next/font/google'
import '@/app/globals.css'
import { AdminLayoutClient } from './AdminLayoutClient'
import { createClient } from '@/lib/supabase/server'

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

/** Resolve the logged-in user's admin scope (location-restricted or Mobile-Manager-only). */
async function fetchAdminScope(): Promise<{
  isLocationRestricted: boolean
  locationName: string | null
  isMobileManager: boolean
}> {
  const none = { isLocationRestricted: false, locationName: null, isMobileManager: false }
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return none

    const { data: roleRow } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single<{ role: string }>()

    if (roleRow?.role === 'mobile_manager') {
      return { ...none, isMobileManager: true }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('gift_card_location_config_id')
      .eq('id', user.id)
      .single<{ gift_card_location_config_id: string | null }>()

    if (!profile?.gift_card_location_config_id) {
      return none
    }

    const { data: config } = await supabase
      .from('gift_card_serial_config')
      .select('location_name')
      .eq('id', profile.gift_card_location_config_id)
      .single<{ location_name: string }>()

    return {
      isLocationRestricted: true,
      locationName: config?.location_name ?? null,
      isMobileManager: false,
    }
  } catch {
    return none
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const scope = await fetchAdminScope()

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
