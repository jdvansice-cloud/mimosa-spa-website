import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export interface GiftCardSettings {
  id?: string
  title_es: string
  title_en: string
  description_es: string
  description_en: string
  image_url: string
  conditions_es: string[]
  conditions_en: string[]
  is_active: boolean
  updated_at?: string
}

const defaultSettings: GiftCardSettings = {
  title_es: 'Tarjetas de Regalo',
  title_en: 'Gift Cards',
  description_es: 'Adquiere nuestras Giftcards y regala momentos inolvidables de bienestar y relajación. Elige entre una variedad de tratamientos lujosos, desde masajes rejuvenecedores hasta tratamientos faciales revitalizantes. Nuestros Giftcards son el regalo perfecto para consentir a tus seres queridos, donde podrán sumergirse en un oasis de calma y renovación. ¡Haz que cada detalle cuente y comparte el regalo de la tranquilidad y el cuidado personal con nuestros exclusivos Giftcards!',
  description_en: 'Purchase our Gift Cards and give unforgettable moments of wellness and relaxation. Choose from a variety of luxurious treatments, from rejuvenating massages to revitalizing facial treatments. Our Gift Cards are the perfect gift to pamper your loved ones, where they can immerse themselves in an oasis of calm and renewal. Make every detail count and share the gift of tranquility and self-care with our exclusive Gift Cards!',
  image_url: '',
  conditions_es: [
    'Presentar la Gift Card el día al momento del canje.',
    'Validez de 12 meses a partir de la fecha de compra.',
    'Gift Card no canjeable por dinero.'
  ],
  conditions_en: [
    'Present the Gift Card on the day of redemption.',
    'Valid for 12 months from the date of purchase.',
    'Gift Card is not redeemable for cash.'
  ],
  is_active: true,
}

// GET - Fetch gift card settings
export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('giftcard_settings')
      .select('*')
      .limit(1)

    if (error || !data || data.length === 0) {
      return NextResponse.json({ data: defaultSettings })
    }

    return NextResponse.json({ data: data[0] })
  } catch {
    return NextResponse.json({ data: defaultSettings })
  }
}

// PUT - Update gift card settings
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const body: GiftCardSettings = await request.json()

    // Get existing record
    const { data: existing } = await supabase
      .from('giftcard_settings')
      .select('id')
      .limit(1)

    const updateData = {
      title_es: body.title_es,
      title_en: body.title_en,
      description_es: body.description_es,
      description_en: body.description_en,
      image_url: body.image_url,
      conditions_es: body.conditions_es,
      conditions_en: body.conditions_en,
      is_active: body.is_active,
      updated_at: new Date().toISOString(),
    }

    let result
    if (existing && existing.length > 0) {
      result = await supabase
        .from('giftcard_settings')
        .update(updateData)
        .eq('id', existing[0].id)
        .select()
        .single()
    } else {
      result = await supabase
        .from('giftcard_settings')
        .insert(updateData)
        .select()
        .single()
    }

    if (result.error) {
      console.error('Error saving gift card settings:', result.error)
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    return NextResponse.json({ data: result.data })
  } catch (error) {
    console.error('Error in gift card settings API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
