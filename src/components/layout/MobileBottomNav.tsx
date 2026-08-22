'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { Home, BookOpen, Gift, Tag, Calendar, User, ShoppingBag } from 'lucide-react'
import { GIFT_CARDS_PATH, FEATURES } from '@/lib/nav'
import { cn } from '@/lib/utils'
import { HomeBookingButton } from '@/components/shared/HomeBookingButton'
import { selectBagCount, useBagStore } from '@/lib/bag/store'

export function MobileBottomNav() {
  const t = useTranslations('navigation')
  const pathname = usePathname()
  const params = useParams()
  const locale = params.locale as string
  const { session, giftCards, openBag } = useBagStore()
  const bagCount = selectBagCount({ session, giftCards })

  // Check if we're on the booking page - hide bottom nav to give more screen space
  const isOnBookingPage = pathname.includes('/reservar')

  // Hide bottom nav on booking page to maximize screen space for booking widget
  if (isOnBookingPage) {
    return null
  }

  const navItems = [
    { href: `/${locale}`, label: t('home'), icon: Home },
    { href: `/${locale}/menu`, label: t('menu'), icon: BookOpen },
    { href: `/${locale}/reservar`, label: t('book'), icon: Calendar, primary: true },
    FEATURES.giftShop
      ? { href: `/${locale}${GIFT_CARDS_PATH}`, label: t('giftcards'), icon: Gift }
      : { href: `/${locale}/promociones`, label: t('promotions'), icon: Tag },
    FEATURES.bag
      ? { href: '#bag', label: locale === 'en' ? 'Bag' : 'Bolsa', icon: ShoppingBag, isBag: true }
      : { href: `/portal`, label: t('portal'), icon: User, isPortal: true },
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
        'lg:hidden fixed left-0 right-0 z-40',
        'bg-cream/95 backdrop-blur-md border-t border-beige-300'
      )}
      style={{ bottom: 0, paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="grid grid-cols-5 items-end px-2 py-2">
        {navItems.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon

          if (item.primary) {
            return (
              <HomeBookingButton
                key={item.href}
                locale={locale}
                className="flex flex-col items-center justify-center -mt-6 relative"
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
              </HomeBookingButton>
            )
          }

          if ('isBag' in item && item.isBag) {
            return (
              <button
                key="bag"
                onClick={openBag}
                className="relative flex flex-col items-center justify-center py-2 rounded-lg text-warm-gray transition-colors hover:text-dark"
                aria-label={locale === 'en' ? `Bag (${bagCount})` : `Bolsa (${bagCount})`}
              >
                <Icon className="h-5 w-5" />
                {bagCount > 0 && (
                  <span className="absolute right-3 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-dark">
                    {bagCount > 9 ? '9+' : bagCount}
                  </span>
                )}
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-2 rounded-lg',
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
