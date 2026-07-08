import type { Metadata } from 'next'
import { KpisClient } from './KpisClient'

export const metadata: Metadata = {
  title: 'KPIs | Mobile Manager | Mimosa Admin',
  robots: { index: false, follow: false },
}

// Protected by the /admin middleware (admin role required).
export default function KpisPage() {
  return <KpisClient />
}
