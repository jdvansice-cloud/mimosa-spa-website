import type { Metadata } from 'next'
import WatiAgentClient from './WatiAgentClient'

export const metadata: Metadata = {
  title: 'Camila | Mimosa Admin',
  robots: { index: false, follow: false },
}

export default function WatiAgentPage() {
  return <WatiAgentClient />
}
