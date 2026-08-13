import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { PROGRAM_IDS } from '@/lib/booking/constants'
import { getGiftCardAdminContext } from '@/lib/giftcards/auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export interface TreatmentRow {
  mindbody_service_id: number
  service_name: string
  price: number
  duration: number | null
  program_id: number | null
  category: string | null
  is_visible: boolean
}

export type TreatmentGroup = 'body' | 'facial' | 'addon'

function groupOf(program_id: number | null): TreatmentGroup {
  if (program_id === PROGRAM_IDS.ADICIONALES || program_id === PROGRAM_IDS.ADICIONALES_EN_CABINA) {
    return 'addon'
  }
  if (program_id === PROGRAM_IDS.TRATAMIENTOS_FACIALES) return 'facial'
  return 'body'
}

/**
 * Reads treatments from the same Supabase table used by the public menu
 * and the booking app (treatment_settings), so the gift card issuance flow
 * stays consistent and doesn't hit Mindbody on every load.
 *
 * Query params:
 *   - includeHidden=true  → return rows where is_visible=false too
 *                           (defaults to visible-only)
 */
export async function GET(request: NextRequest) {
  const ctx = await getGiftCardAdminContext()
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const includeHidden = searchParams.get('includeHidden') === 'true'

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  let query = supabase
    .from('treatment_settings')
    .select('mindbody_service_id, service_name, price, duration, program_id, category, is_visible')
    .order('service_name', { ascending: true })

  if (!includeHidden) {
    query = query.eq('is_visible', true)
  }

  const { data, error } = await query
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const rows = (data ?? []) as TreatmentRow[]
  const grouped: Record<TreatmentGroup, TreatmentRow[]> = {
    body: [],
    facial: [],
    addon: [],
  }
  for (const row of rows) {
    grouped[groupOf(row.program_id)].push(row)
  }

  return NextResponse.json({ data: rows, grouped, count: rows.length })
}
