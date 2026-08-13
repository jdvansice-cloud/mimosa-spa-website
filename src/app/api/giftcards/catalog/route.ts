import { NextResponse } from 'next/server'
import { getActiveCatalog, getShopSettings, itbmsCentsFor } from '@/lib/giftshop/data'
import { isTilopayConfigured } from '@/lib/payments/tilopay'

// Public: active catalog + shop state.
export async function GET() {
  const [settings, catalog] = await Promise.all([getShopSettings(), getActiveCatalog()])
  return NextResponse.json({
    shopEnabled: settings.shop_enabled && isTilopayConfigured(),
    occasion: settings.occasion_slug,
    items: catalog.map((i) => ({
      id: i.id,
      kind: i.kind,
      name_es: i.name_es,
      name_en: i.name_en,
      description_es: i.description_es,
      description_en: i.description_en,
      amount_cents: i.amount_cents,
      itbms_cents: itbmsCentsFor(i),
      image_url: i.image_url,
      badge_es: i.badge_es,
      badge_en: i.badge_en,
      default_design_slug: i.default_design_slug,
    })),
  })
}
