import { redirect } from 'next/navigation'
import { FEATURES } from '@/lib/nav'
import { CheckoutClient } from '@/components/checkout/CheckoutClient'

export const metadata = { robots: { index: false, follow: false } }

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!FEATURES.bag) redirect(`/${locale}/reservar`)

  return (
    <div className="min-h-[70vh] bg-cream px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-center text-3xl font-display font-semibold text-dark">
          {locale === 'en' ? 'Checkout' : 'Pagar'}
        </h1>
        <CheckoutClient locale={locale} />
      </div>
    </div>
  )
}
