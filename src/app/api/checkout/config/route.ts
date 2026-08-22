import { NextResponse } from 'next/server'
import { ordersAdminClient } from '@/lib/orders/pipeline'

export const dynamic = 'force-dynamic'

/**
 * GET /api/checkout/config — public checkout policy for the widget + checkout
 * page: is online payment on, is "paga en el spa" allowed, which days force
 * prepay (rung 2), and the current prepay incentive.
 */
export async function GET() {
  const supabase = ordersAdminClient()
  const [{ data: settings }, { data: site }] = await Promise.all([
    supabase.from('checkout_settings').select('*').eq('id', 1).maybeSingle(),
    supabase.from('site_settings').select('online_discount_active, online_discount_percent').limit(1).maybeSingle(),
  ])
  return NextResponse.json({
    enabled: !!settings?.checkout_enabled,
    allowPayAtSpa: settings?.allow_pay_at_spa ?? true,
    peakPrepayRequired: settings?.peak_prepay_required ?? false,
    peakDays: settings?.peak_days ?? [5, 6, 0],
    peakProgramIds: settings?.peak_program_ids ?? [],
    onlineDiscountActive: !!site?.online_discount_active,
    onlineDiscountPercent: Number(site?.online_discount_percent) || 0,
  })
}
