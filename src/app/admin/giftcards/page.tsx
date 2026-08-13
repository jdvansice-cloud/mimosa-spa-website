import Link from 'next/link'
import { Gift, Plus, List, Settings, LayoutTemplate, Hash, ShoppingBag, Store } from 'lucide-react'
import { Card, CardContent } from '@/components/ui'

const tiles = [
  {
    href: '/admin/giftcards/orders',
    icon: ShoppingBag,
    title: 'Pedidos Online',
    description: 'Ventas de la tienda en línea: estado de pago, entrega y registro en Mindbody.',
  },
  {
    href: '/admin/giftcards/shop',
    icon: Store,
    title: 'Tienda Online',
    description: 'Catálogo, precios, campañas de temporada y ajustes de la tienda.',
  },
  {
    href: '/admin/giftcards/issue',
    icon: Plus,
    title: 'Emitir Nueva',
    description: 'Genera un serial e imprime la etiqueta de una nueva Gift Card.',
  },
  {
    href: '/admin/giftcards/issued',
    icon: List,
    title: 'Gift Cards Emitidas',
    description: 'Historial de Gift Cards emitidas, con su serial y estado.',
  },
  {
    href: '/admin/giftcards/templates',
    icon: LayoutTemplate,
    title: 'Plantilla de Etiqueta',
    description: 'Vista previa de la plantilla de impresión 3" × 2" con datos de muestra.',
  },
  {
    href: '/admin/giftcards/config',
    icon: Hash,
    title: 'Configuración de Serial',
    description: 'Prefijo y longitud del número correlativo de las Gift Cards.',
  },
  {
    href: '/admin/giftcards/settings',
    icon: Settings,
    title: 'Contenido de la Página',
    description: 'Edita el contenido público de la sección Gift Cards del sitio.',
  },
]

export default function AdminGiftCardsHubPage() {
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gold/10 rounded-lg">
            <Gift className="h-6 w-6 text-gold" />
          </div>
          <h1 className="text-3xl font-display font-semibold text-dark">Gift Cards</h1>
        </div>
        <p className="text-warm-gray">Emisión, historial, plantilla de impresión y contenido público.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tiles.map(({ href, icon: Icon, title, description }) => (
          <Link key={href} href={href} className="block group">
            <Card variant="default" padding="md" className="h-full transition-colors group-hover:border-gold">
              <CardContent>
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-gold/10 rounded-lg">
                    <Icon className="h-5 w-5 text-gold" />
                  </div>
                  <h2 className="text-lg font-semibold text-dark mt-1">{title}</h2>
                </div>
                <p className="text-sm text-warm-gray">{description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
