import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mi Portal | Mimosa Spa Retreat',
  description: 'Accede a tu historial de citas, compras y reserva nuevos tratamientos',
}

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 to-white">
      {children}
    </div>
  )
}
