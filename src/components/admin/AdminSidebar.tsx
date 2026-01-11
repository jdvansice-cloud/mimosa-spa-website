'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Tag, 
  Image, 
  Settings, 
  LogOut,
  ExternalLink 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/layout/Logo'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/promociones', label: 'Promociones', icon: Tag },
  { href: '/admin/galeria', label: 'Galería', icon: Image },
  { href: '/admin/configuracion', label: 'Configuración', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-dark text-cream flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-cream/10">
        <Logo className="[&_span]:text-cream [&_.text-dark]:text-cream [&_.text-warm-gray]:text-cream/70" />
        <p className="text-xs text-cream/50 mt-2">Panel de Administración</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                active
                  ? 'bg-gold text-dark'
                  : 'text-cream/70 hover:bg-cream/10 hover:text-cream'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-cream/10 space-y-2">
        <Link
          href="/es"
          target="_blank"
          className="flex items-center gap-3 px-4 py-2 text-cream/70 hover:text-cream transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          <span className="text-sm">Ver Sitio</span>
        </Link>
        <button
          onClick={() => {
            window.location.href = '/admin/login'
          }}
          className="flex items-center gap-3 px-4 py-2 text-cream/70 hover:text-red-400 transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  )
}
