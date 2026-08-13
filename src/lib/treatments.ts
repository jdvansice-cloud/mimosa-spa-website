import { createClient } from '@supabase/supabase-js'
import { unstable_cache } from 'next/cache'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const TREATMENTS_TAG = 'treatments'

export interface TreatmentRow {
  mindbody_service_id: number
  service_name: string
  program_id: number
  category: string | null
  price: number | null
  duration: number | null
  description: string | null
  show_booking_button: boolean
  is_top_pick: boolean
  sort_order: number
}

// Cached read of all publicly visible treatments. Source: treatment_settings,
// which the admin flow keeps in sync with Mindbody (names/prices/durations
// stored tax-stripped, exactly what the old client-side menu displayed).
const getAllVisibleTreatments = unstable_cache(
  async (): Promise<TreatmentRow[]> => {
    try {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      const { data, error } = await supabase
        .from('treatment_settings')
        .select(
          'mindbody_service_id, service_name, program_id, category, price, duration, description, show_booking_button, is_top_pick, sort_order'
        )
        .eq('is_visible', true)
        .order('sort_order', { ascending: true })
        .order('service_name', { ascending: true })
      if (error || !data) return []
      return data as TreatmentRow[]
    } catch {
      return []
    }
  },
  ['treatments-visible'],
  { tags: [TREATMENTS_TAG], revalidate: 3600 }
)

/** Visible treatments for the given Mindbody programs, de-duplicated by name. */
export async function getVisibleTreatments(programIds: number[]): Promise<TreatmentRow[]> {
  const all = await getAllVisibleTreatments()
  const seen = new Set<string>()
  const out: TreatmentRow[] = []
  for (const row of all) {
    if (!programIds.includes(row.program_id)) continue
    if (seen.has(row.service_name)) continue
    seen.add(row.service_name)
    out.push(row)
  }
  return out
}
