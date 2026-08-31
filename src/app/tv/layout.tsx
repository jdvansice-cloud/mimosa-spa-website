import { Lato } from 'next/font/google'
import '@/app/globals.css'

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-lato',
  display: 'swap',
})

// Standalone layout for the non-localized TV displays (like /gift — no site
// chrome; the screen is the whole page).
export default function TvLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={lato.variable}>
      <body className="overflow-hidden font-body antialiased">{children}</body>
    </html>
  )
}
