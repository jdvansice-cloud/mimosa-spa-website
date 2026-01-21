import { NextRequest, NextResponse } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { getOnlineBookableServicesForPromotions } from '@/lib/booking/mindbody'

// Lazy-initialized Supabase client
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

// GET /api/promotions/[id]/with-services - Fetch promotion with Mindbody services populated
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = getSupabaseAdmin()

    // Fetch promotion from database
    const { data: promotion, error: promotionError } = await supabase
      .from('promotions')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (promotionError || !promotion) {
      return NextResponse.json(
        { error: 'Promotion not found' },
        { status: 404 }
      )
    }

    // Check if promotion is still valid
    const today = new Date().toISOString().split('T')[0]
    if (promotion.valid_until < today) {
      return NextResponse.json(
        { error: 'Promotion has expired' },
        { status: 410 }
      )
    }

    // If no Mindbody service IDs, return promotion as-is
    if (!promotion.mindbody_service_ids || promotion.mindbody_service_ids.length === 0) {
      return NextResponse.json({
        data: {
          id: promotion.id,
          title_es: promotion.title_es,
          title_en: promotion.title_en,
          description_es: promotion.description_es,
          description_en: promotion.description_en,
          price: promotion.price,
          originalPrice: promotion.original_price,
          duration_minutes: promotion.duration_minutes,
          image_url: promotion.image_url,
          valid_from: promotion.valid_from,
          valid_until: promotion.valid_until,
          is_active: promotion.is_active,
          mindbody_promotion_id: promotion.mindbody_service_id,
          mindbody_service_ids: [],
          services: []
        }
      })
    }

    // Fetch ALL online bookable services from Mindbody (including those without session type match)
    // This ensures promotion services are included even if they don't have exact name matches
    // The show_in_booking admin setting only controls visibility for direct selection, not promotions
    try {
      const onlineServices = await getOnlineBookableServicesForPromotions()

      // Filter services to only include those in the promotion that are online bookable
      const promotionServices = onlineServices.filter(service =>
        promotion.mindbody_service_ids.includes(service.Id)
      )

      // Map to our MindbodyService format
      const mappedServices = promotionServices.map(service => ({
        Id: service.Id,
        Name: service.Name,
        Description: service.Description || null,
        Duration: service.Duration || 0,
        Price: service.Price || 0,
        OnlineBooking: service.OnlineBooking ?? false,
        Category: service.Category || '',
        ProgramId: service.ProgramId || 0
      }))

      return NextResponse.json({
        data: {
          id: promotion.id,
          title_es: promotion.title_es,
          title_en: promotion.title_en,
          description_es: promotion.description_es,
          description_en: promotion.description_en,
          price: promotion.price,
          originalPrice: promotion.original_price,
          duration_minutes: promotion.duration_minutes,
          image_url: promotion.image_url,
          valid_from: promotion.valid_from,
          valid_until: promotion.valid_until,
          is_active: promotion.is_active,
          mindbody_promotion_id: promotion.mindbody_service_id,
          mindbody_service_ids: promotion.mindbody_service_ids.map(String),
          services: mappedServices
        }
      })
    } catch (mbError) {
      console.error('Failed to fetch Mindbody services:', mbError)
      // Return promotion without services if Mindbody fails
      return NextResponse.json({
        data: {
          id: promotion.id,
          title_es: promotion.title_es,
          title_en: promotion.title_en,
          description_es: promotion.description_es,
          description_en: promotion.description_en,
          price: promotion.price,
          originalPrice: promotion.original_price,
          duration_minutes: promotion.duration_minutes,
          image_url: promotion.image_url,
          valid_from: promotion.valid_from,
          valid_until: promotion.valid_until,
          is_active: promotion.is_active,
          mindbody_promotion_id: promotion.mindbody_service_id,
          mindbody_service_ids: promotion.mindbody_service_ids.map(String),
          services: []
        }
      })
    }
  } catch (err) {
    console.error('GET /api/promotions/[id]/with-services error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
