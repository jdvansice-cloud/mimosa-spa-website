import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui'
import { Home } from 'lucide-react'

// Localized 404 for routes under /[locale]/*.
export default async function LocaleNotFound() {
  const locale = await getLocale()
  const t = await getTranslations('notFound')

  return (
    <div className="min-h-[60vh] bg-cream flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-8xl font-display font-bold text-gold mb-4">404</h1>
        <h2 className="text-2xl font-display font-semibold text-dark mb-4">
          {t('title')}
        </h2>
        <p className="text-warm-gray mb-8 max-w-md mx-auto">{t('description')}</p>
        <Link href={`/${locale}`}>
          <Button leftIcon={<Home className="h-5 w-5" />}>{t('backHome')}</Button>
        </Link>
      </div>
    </div>
  )
}
