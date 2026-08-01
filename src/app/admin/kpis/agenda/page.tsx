import type { Metadata } from 'next'
import { AgendaClient } from './AgendaClient'

export const metadata: Metadata = {
  title: 'Agenda | Mobile Manager | Mimosa Admin',
  robots: { index: false, follow: false },
}

// Protected by the /admin middleware (admin role required).
export default function AgendaPage() {
  return <AgendaClient />
}
