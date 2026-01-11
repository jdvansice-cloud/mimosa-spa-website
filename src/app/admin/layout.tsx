import { Cormorant_Garamond, Lato } from 'next/font/google'
import '@/app/globals.css'
import { AdminLayoutClient } from './AdminLayoutClient'

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
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${cormorant.variable} ${lato.variable}`}>
      <body className="min-h-screen bg-beige-100 font-body antialiased">
        <AdminLayoutClient>{children}</AdminLayoutClient>
      </body>
    </html>
  )
}
