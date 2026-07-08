import type { Metadata } from 'next'
import { VentasClient } from './VentasClient'

export const metadata: Metadata = {
  title: 'Reporte de Ventas | Mobile Manager | Mimosa Admin',
  robots: { index: false, follow: false },
}

// Protected by the /admin middleware (admin role required).
export default function VentasPage() {
  return <VentasClient />
}
