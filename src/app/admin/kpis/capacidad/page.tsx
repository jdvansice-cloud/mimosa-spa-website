import type { Metadata } from 'next'
import { CapacidadClient } from './CapacidadClient'

export const metadata: Metadata = {
  title: 'Capacidad | Mobile Manager | Mimosa Admin',
  robots: { index: false, follow: false },
}

// Protected by the /admin middleware (admin or mobile_manager role).
export default function CapacidadPage() {
  return <CapacidadClient />
}
