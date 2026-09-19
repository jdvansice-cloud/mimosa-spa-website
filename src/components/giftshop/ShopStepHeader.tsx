'use client'

import { useTranslations } from 'next-intl'

export function ShopStepHeader({ step }: { step: 1 | 2 | 3 }) {
  const t = useTranslations('giftShop')
  const labels: Record<1 | 2 | 3, string> = { 1: t('step1'), 2: t('step2'), 3: t('step3') }
  return (
    <div className="mb-6" role="group" aria-label={t('stepOf', { step })}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-dark">{t('stepOf', { step })}</span>
        <span className="text-sm text-warm-gray">{labels[step]}</span>
      </div>
      <div className="h-2 bg-beige rounded-full overflow-hidden">
        <div className="h-full bg-gold transition-all duration-500 rounded-full" style={{ width: `${(step / 3) * 100}%` }} />
      </div>
    </div>
  )
}
