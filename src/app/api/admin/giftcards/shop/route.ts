import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { requireAdmin } from '@/lib/auth/require-admin'
import { giftshopAdminClient, GIFTSHOP_TAG } from '@/lib/giftshop/data'

// Admin: shop settings + catalog management.
export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied

  const supabase = giftshopAdminClient()
  const [{ data: settings }, { data: catalog }] = await Promise.all([
    supabase.from('gc_shop_settings').select('*').eq('id', 1).single(),
    supabase.from('gc_catalog_items').select('*').order('sort_order', { ascending: true }),
  ])
  return NextResponse.json({ settings, catalog })
}

// PUT { settings?: {...}, item?: { id, ...fields } }
export async function PUT(request: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  const body = await request.json().catch(() => ({}))
  const supabase = giftshopAdminClient()

  if (body.settings) {
    const s = body.settings
    const { error } = await supabase
      .from('gc_shop_settings')
      .update({
        shop_enabled: !!s.shop_enabled,
        hero_banner_es: s.hero_banner_es ?? null,
        hero_banner_en: s.hero_banner_en ?? null,
        occasion_slug: s.occasion_slug ?? null,
        default_mindbody_location_id: Number(s.default_mindbody_location_id ?? 1),
        whatsapp_delivery_enabled: !!s.whatsapp_delivery_enabled,
        notify_email: s.notify_email ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (body.item?.id) {
    const i = body.item
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
    for (const f of [
      'name_es', 'name_en', 'description_es', 'description_en', 'amount_cents',
      'treatment_names', 'image_url', 'default_design_slug', 'mindbody_giftcard_id',
      'mindbody_layout_id', 'badge_es', 'badge_en', 'sort_order', 'is_active',
    ]) {
      if (f in i) patch[f] = i[f]
    }
    const { error } = await supabase.from('gc_catalog_items').update(patch).eq('id', i.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  revalidateTag(GIFTSHOP_TAG, 'max')
  return NextResponse.json({ ok: true })
}
