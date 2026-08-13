import { Cormorant_Garamond, Lato } from 'next/font/google'
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

// Standalone layout for the non-localized gift-card view (like /cita, no
// site chrome — the page is the shareable card itself).
export default function GiftLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${cormorant.variable} ${lato.variable}`}>
      <body className="min-h-screen bg-cream font-body antialiased">{children}</body>
    </html>
  )
}
