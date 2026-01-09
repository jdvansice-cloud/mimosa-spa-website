import Link from 'next/link'
import { Button } from '@/components/ui'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <html lang="es">
      <body className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-8xl font-display font-bold text-gold mb-4">404</h1>
          <h2 className="text-2xl font-display font-semibold text-dark mb-4">
            Página no encontrada
          </h2>
          <p className="text-warm-gray mb-8 max-w-md mx-auto">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
          <Link href="/es">
            <Button leftIcon={<Home className="h-5 w-5" />}>
              Volver al Inicio
            </Button>
          </Link>
        </div>
      </body>
    </html>
  )
}
