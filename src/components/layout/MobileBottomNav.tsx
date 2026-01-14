'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { Home, BookOpen, Tag, Calendar, User, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBookingStore } from '@/lib/booking/store'

export function MobileBottomNav() {
  const t = useTranslations('navigation')
  const pathname = usePathname()
  const params = useParams()
  const locale = params.locale as string

  // Get cart state from booking store
  const { selectedServices, selectedAddons, activePromotion, openCart } = useBookingStore()
  const cartItemCount = selectedServices.length + selectedAddons.length
  const hasCartItems = cartItemCount > 0 || activePromotion !== null

  // Check if we're on the booking page
  const isOnBookingPage = pathname.includes('/reservar')

  const navItems = [
    { href: `/${locale}`, label: t('home'), icon: Home },
    { href: `/${locale}/menu`, label: t('menu'), icon: BookOpen },
    { href: `/${locale}/reservar`, label: t('book'), icon: Calendar, primary: true },
    { href: `/${locale}/promociones`, label: t('promotions'), icon: Tag },
    { href: `/${locale}/nosotros`, label: t('about'), icon: User, isAbout: true },
  ]

  const isActive = (href: string) => {
    if (href === `/${locale}`) {
      return pathname === `/${locale}` || pathname === `/${locale}/`
    }
    return pathname.startsWith(href)
  }

  return (
    <nav
      className={cn(
        'lg:hidden fixed bottom-0 left-0 right-0 z-40',
        'bg-cream/95 backdrop-blur-md border-t border-beige-300',
        'safe-bottom'
      )}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon

          if (item.primary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center',
                  '-mt-6 relative'
                )}
              >
                <div
                  className={cn(
                    'flex items-center justify-center w-14 h-14 rounded-full',
                    'bg-gold shadow-lg',
                    'transition-transform hover:scale-105 active:scale-95'
                  )}
                >
                  <Icon className="h-6 w-6 text-dark" />
                </div>
                <span className="text-xs mt-1 font-medium text-dark">
                  {item.label}
                </span>
              </Link>
            )
          }

          // Replace "Nosotros" with cart button when on booking page with items
          if (item.isAbout && isOnBookingPage && hasCartItems) {
            return (
              <button
                key="cart-button"
                onClick={openCart}
                className={cn(
                  'flex flex-col items-center justify-center py-2 px-3 rounded-lg',
                  'transition-colors relative',
                  'text-gold'
                )}
              >
                <div className="relative">
                  <ShoppingBag className="h-5 w-5 stroke-[2.5]" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gold text-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </div>
                <span className="text-xs mt-1 font-medium">
                  Carrito
                </span>
              </button>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-2 px-3 rounded-lg',
                'transition-colors',
                active
                  ? 'text-gold'
                  : 'text-warm-gray hover:text-dark'
              )}
            >
              <Icon className={cn('h-5 w-5', active && 'stroke-[2.5]')} />
              <span className={cn('text-xs mt-1', active && 'font-medium')}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
