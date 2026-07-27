import type { Metadata } from 'next'
import { AsistenciaClient } from './AsistenciaClient'

export const metadata: Metadata = {
  title: 'Asistencia | Mobile Manager | Mimosa Admin',
  robots: { index: false, follow: false },
}

// Protected by the /admin middleware (admin or mobile_manager role).
export default function AsistenciaPage() {
  return <AsistenciaClient />
}
