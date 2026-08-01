import type { Metadata } from 'next'
import { NegocioClient } from './NegocioClient'

export const metadata: Metadata = {
  title: 'Negocio | Mobile Manager | Mimosa Admin',
  robots: { index: false, follow: false },
}

// Protected by the /admin middleware (admin or mobile_manager role).
export default function NegocioPage() {
  return <NegocioClient />
}
