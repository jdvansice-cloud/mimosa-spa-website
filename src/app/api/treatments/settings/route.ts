import { NextResponse } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy-initialized Supabase client to avoid build-time errors
let supabaseAdmin: SupabaseClient | null = null

function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }
  return supabaseAdmin
}

export interface PublicTreatmentSetting {
  mindbody_service_id: number
  is_visible: boolean
  show_booking_button: boolean
  is_top_pick: boolean
}

// GET - Fetch public treatment settings (visibility, booking button status, and top picks)
export async function GET() {
  try {
    const { data: settings, error } = await getSupabaseAdmin()
      .from('treatment_settings')
      .select('mindbody_service_id, is_visible, show_booking_button, is_top_pick')

    if (error) {
      console.error('Error fetching treatment settings:', error)
      // Return empty settings on error - will show all treatments by default
      return NextResponse.json({ settings: [] })
    }

    return NextResponse.json({ settings: settings || [] })
  } catch (error) {
    console.error('Error in treatment settings API:', error)
    return NextResponse.json({ settings: [] })
  }
}
