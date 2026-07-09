import type { Metadata } from 'next'
import { StaffClient } from './StaffClient'

export const metadata: Metadata = {
  title: 'Staff | Mobile Manager | Mimosa Admin',
  robots: { index: false, follow: false },
}

// Protected by the /admin middleware (admin role required).
export default function StaffPage() {
  return <StaffClient />
}
