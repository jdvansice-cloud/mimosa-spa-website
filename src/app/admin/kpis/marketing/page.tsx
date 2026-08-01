import type { Metadata } from 'next'
import { MarketingClient } from './MarketingClient'

export const metadata: Metadata = {
  title: 'Marketing | Mobile Manager | Mimosa Admin',
  robots: { index: false, follow: false },
}

// Protected by the /admin middleware (admin or mobile_manager role).
export default function MarketingPage() {
  return <MarketingClient />
}
