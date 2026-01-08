import { Tag, Image, Calendar, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'

const stats = [
  { label: 'Promociones Activas', value: '3', icon: Tag, color: 'text-gold' },
  { label: 'Imágenes en Galería', value: '24', icon: Image, color: 'text-spa-green' },
  { label: 'Reservas Este Mes', value: '156', icon: Calendar, color: 'text-blue-500' },
  { label: 'Clientes Nuevos', value: '42', icon: Users, color: 'text-purple-500' },
]

export default function AdminDashboard() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-semibold text-dark">Dashboard</h1>
        <p className="text-warm-gray mt-1">Bienvenido al panel de administración</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} variant="default" padding="md">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-beige ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-dark">{stat.value}</p>
                  <p className="text-sm text-warm-gray">{stat.label}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="default" padding="md">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <a
                href="/admin/promociones"
                className="block p-4 rounded-lg bg-beige hover:bg-beige-300 transition-colors"
              >
                <p className="font-medium text-dark">Gestionar Promociones</p>
                <p className="text-sm text-warm-gray">Crear, editar o eliminar promociones</p>
              </a>
              <a
                href="/admin/galeria"
                className="block p-4 rounded-lg bg-beige hover:bg-beige-300 transition-colors"
              >
                <p className="font-medium text-dark">Gestionar Galería</p>
                <p className="text-sm text-warm-gray">Subir y organizar imágenes</p>
              </a>
              <a
                href="/admin/configuracion"
                className="block p-4 rounded-lg bg-beige hover:bg-beige-300 transition-colors"
              >
                <p className="font-medium text-dark">Configuración</p>
                <p className="text-sm text-warm-gray">Ajustes del sitio</p>
              </a>
            </div>
          </CardContent>
        </Card>

        <Card variant="default" padding="md">
          <CardHeader>
            <CardTitle>Promociones Actuales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-beige">
                <div>
                  <p className="font-medium text-dark">Esencia de Paz</p>
                  <p className="text-sm text-warm-gray">$79 - Válida hasta 31 Ene</p>
                </div>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Activa</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-beige">
                <div>
                  <p className="font-medium text-dark">Suspiro de Serenidad</p>
                  <p className="text-sm text-warm-gray">$99 - Válida hasta 31 Ene</p>
                </div>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Activa</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-beige">
                <div>
                  <p className="font-medium text-dark">Calma Total</p>
                  <p className="text-sm text-warm-gray">$129 - Válida hasta 31 Ene</p>
                </div>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Activa</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
