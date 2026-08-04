import type { Metadata } from 'next'
import { DiccionarioClient } from './DiccionarioClient'

export const metadata: Metadata = {
  title: 'Diccionario | Mobile Manager | Mimosa Admin',
  robots: { index: false, follow: false },
}

// Protected by the /admin middleware (admin or mobile_manager role).
export default function DiccionarioPage() {
  return <DiccionarioClient />
}
