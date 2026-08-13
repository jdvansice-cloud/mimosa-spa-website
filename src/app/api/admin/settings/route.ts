import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { revalidateTag } from 'next/cache'
import { requireAdmin } from '@/lib/auth/require-admin'
import { SETTINGS_TAG } from '@/lib/settings'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export interface SiteSettings {
  id?: string
  phone_costa_del_este: string
  phone_san_francisco: string
  email: string
  whatsapp_number: string
  whatsapp_message: string
  weekday_open: string
  weekday_close: string
  weekend_open: string
  weekend_close: string
  instagram_url: string
  facebook_url: string
  whatsapp_dual_channel: boolean
  online_discount_active: boolean
  online_discount_percent: number
  google_rating?: number
  google_review_count?: number
  google_reviews_url?: string
  google_rating_cde?: number | null
  google_review_count_cde?: number | null
  google_reviews_url_cde?: string | null
  google_rating_sfc?: number | null
  google_review_count_sfc?: number | null
  google_reviews_url_sfc?: string | null
  updated_at?: string
}

// GET - Fetch site settings
export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the first row (we only need one row for settings)
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)

    if (error) {
      console.error('Error fetching site settings:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // If no settings exist yet, return defaults
    if (!data || data.length === 0) {
      return NextResponse.json({
        data: {
          phone_costa_del_este: '+507 6000-0001',
          phone_san_francisco: '+507 6000-0002',
          email: 'info@mimosaretreat.com',
          whatsapp_number: '50764049464',
          whatsapp_message: 'Hola, me gustaría obtener información sobre sus servicios.',
          weekday_open: '09:00',
          weekday_close: '20:00',
          weekend_open: '09:00',
          weekend_close: '18:00',
          instagram_url: 'https://instagram.com/mimosaretreat',
          facebook_url: 'https://facebook.com/mimosaretreat',
          whatsapp_dual_channel: true,
          online_discount_active: false,
          online_discount_percent: 0,
        }
      })
    }

    return NextResponse.json({ data: data[0] })
  } catch (error) {
    console.error('Error in site settings API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update site settings
export async function PUT(request: NextRequest) {
  try {
    const denied = await requireAdmin()
    if (denied) return denied

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const body: SiteSettings = await request.json()

    console.log('PUT /api/admin/settings - body:', body)

    // Get the first row to update
    const { data: existing, error: fetchError } = await supabase
      .from('site_settings')
      .select('id')
      .limit(1)

    if (fetchError) {
      console.error('Error fetching existing settings:', fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    console.log('Existing settings row:', existing)

    const updateData = {
      phone_costa_del_este: body.phone_costa_del_este,
      phone_san_francisco: body.phone_san_francisco,
      email: body.email,
      whatsapp_number: body.whatsapp_number,
      whatsapp_message: body.whatsapp_message,
      weekday_open: body.weekday_open,
      weekday_close: body.weekday_close,
      weekend_open: body.weekend_open,
      weekend_close: body.weekend_close,
      instagram_url: body.instagram_url,
      facebook_url: body.facebook_url,
      whatsapp_dual_channel: body.whatsapp_dual_channel ?? true,
      online_discount_active: body.online_discount_active ?? false,
      online_discount_percent: body.online_discount_percent ?? 0,
      google_rating: body.google_rating ?? 4.8,
      google_review_count: body.google_review_count ?? 96,
      google_reviews_url: body.google_reviews_url ?? '',
      google_rating_cde: body.google_rating_cde ?? null,
      google_review_count_cde: body.google_review_count_cde ?? null,
      google_reviews_url_cde: body.google_reviews_url_cde ?? null,
      google_rating_sfc: body.google_rating_sfc ?? null,
      google_review_count_sfc: body.google_review_count_sfc ?? null,
      google_reviews_url_sfc: body.google_reviews_url_sfc ?? null,
      updated_at: new Date().toISOString(),
    }

    let result
    if (existing && existing.length > 0) {
      console.log('Updating row with id:', existing[0].id)
      // Update the first row
      result = await supabase
        .from('site_settings')
        .update(updateData)
        .eq('id', existing[0].id)
        .select()
        .single()
    } else {
      console.log('Inserting new row')
      // Insert new settings
      result = await supabase
        .from('site_settings')
        .insert(updateData)
        .select()
        .single()
    }

    console.log('Supabase result:', result)

    if (result.error) {
      console.error('Error saving site settings:', result.error)
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    revalidateTag(SETTINGS_TAG, 'max')
    return NextResponse.json({ data: result.data })
  } catch (error) {
    console.error('Error in site settings API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
