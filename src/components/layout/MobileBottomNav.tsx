'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { Home, BookOpen, Tag, Calendar, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MobileBottomNav() {
  const t = useTranslations('navigation')
  const pathname = usePathname()
  const params = useParams()
  const locale = params.locale as string

  const navItems = [
    { href: `/${locale}`, label: t('home'), icon: Home },
    { href: `/${locale}/menu`, label: t('menu'), icon: BookOpen },
    { href: `/${locale}/reservar`, label: t('book'), icon: Calendar, primary: true },
    { href: `/${locale}/promociones`, label: t('promotions'), icon: Tag },
    { href: `/${locale}/nosotros`, label: t('about'), icon: User },
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
