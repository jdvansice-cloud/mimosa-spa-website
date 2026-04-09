import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export interface MembershipTier {
  name: string
  price: number
  value: number
  validity_months: number
  guests_per_visit: number
  benefit_percent: number
}

export interface MembershipSettings {
  id?: string
  title_es: string
  title_en: string
  subtitle_es: string
  subtitle_en: string
  intro_es: string
  intro_en: string
  image_url: string
  what_is_title_es: string
  what_is_title_en: string
  what_is_content_es: string
  what_is_content_en: string
  benefits_title_es: string
  benefits_title_en: string
  benefits_es: string[]
  benefits_en: string[]
  who_is_for_title_es: string
  who_is_for_title_en: string
  who_is_for_es: string[]
  who_is_for_en: string[]
  group_use_title_es: string
  group_use_title_en: string
  group_use_es: string[]
  group_use_en: string[]
  options_title_es: string
  options_title_en: string
  options_es: string[]
  options_en: string[]
  tiers: MembershipTier[]
  cta_es: string
  cta_en: string
  table_note_es: string
  table_note_en: string
  is_active: boolean
  updated_at?: string
}

const defaultSettings: MembershipSettings = {
  title_es: 'Membresía Privilege',
  title_en: 'Privilege Membership',
  subtitle_es: 'Mimosa Privilege Membership',
  subtitle_en: 'Mimosa Privilege Membership',
  intro_es: 'Más bienestar. Más ventajas. Mejor valor.\n\nSi amas Mimosa Spa y nos visitas con frecuencia, Mimosa Privilege es para ti.\nDisfruta tus masajes, faciales y tus tratamientos favoritos.',
  intro_en: 'More wellness. More benefits. Better value.\n\nIf you love Mimosa Spa and visit us frequently, Mimosa Privilege is for you.\nEnjoy your massages, facials, and your favorite treatments.',
  image_url: '',
  what_is_title_es: '¿Qué es Mimosa Privilege?',
  what_is_title_en: 'What is Mimosa Privilege?',
  what_is_content_es: 'Una membresía exclusiva que te regala más valor por tu dinero y te permite usarla en:\n\nMasajes\nTratamientos faciales\nTratamientos especiales',
  what_is_content_en: 'An exclusive membership that gives you more value for your money and allows you to use it on:\n\nMassages\nFacial treatments\nSpecial treatments',
  benefits_title_es: 'Beneficios que te encantarán',
  benefits_title_en: 'Benefits you will love',
  benefits_es: [
    'Obtienes crédito adicional desde el primer día',
    'Tarjeta elegante, práctica y fácil de llevar',
    'No necesitas efectivo: solo presenta tu tarjeta',
    'Compartible con tu familia',
    'Ideal para disfrutar sola(o), en pareja, con amigos o en grupo',
    'Perfecta también para beneficios corporativos, incentivos y atención a clientes'
  ],
  benefits_en: [
    'Get additional credit from day one',
    'Elegant, practical and easy to carry card',
    'No cash needed: just present your card',
    'Shareable with your family',
    'Ideal to enjoy alone, as a couple, with friends or in a group',
    'Also perfect for corporate benefits, incentives and customer service'
  ],
  who_is_for_title_es: '¿Para quién es?',
  who_is_for_title_en: 'Who is it for?',
  who_is_for_es: [
    'Residentes o visitantes frecuentes',
    'Uso personal',
    'Familias',
    'Empresas (staff, clientes, proveedores o eventos)'
  ],
  who_is_for_en: [
    'Residents or frequent visitors',
    'Personal use',
    'Families',
    'Companies (staff, clients, suppliers or events)'
  ],
  group_use_title_es: 'Uso en grupo',
  group_use_title_en: 'Group use',
  group_use_es: [
    'Tarjetas de 18 meses: hasta 6 personas',
    'Tarjetas de 12 meses: hasta 4 personas'
  ],
  group_use_en: [
    '18-month cards: up to 6 people',
    '12-month cards: up to 4 people'
  ],
  options_title_es: 'Opciones de Membresía',
  options_title_en: 'Membership Options',
  options_es: [
    'Paga $500 y recibe $625',
    'Paga $1,000 y recibe $1,350'
  ],
  options_en: [
    'Pay $500 and receive $625',
    'Pay $1,000 and receive $1,350'
  ],
  tiers: [
    {
      name: 'Mimosa Privilege $500',
      price: 500,
      value: 625,
      validity_months: 12,
      guests_per_visit: 4,
      benefit_percent: 25
    },
    {
      name: 'Mimosa Privilege $1,000',
      price: 1000,
      value: 1350,
      validity_months: 18,
      guests_per_visit: 6,
      benefit_percent: 35
    }
  ],
  cta_es: 'Escríbenos y pregunta hoy mismo por Mimosa Privilege.',
  cta_en: 'Contact us and ask about Mimosa Privilege today.',
  table_note_es: '* Precios no incluyen ITBMS',
  table_note_en: '* Prices do not include ITBMS',
  is_active: true,
}

// GET - Fetch membership settings
export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('membership_settings')
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

// PUT - Update membership settings
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const body: MembershipSettings = await request.json()

    // Get existing record
    const { data: existing } = await supabase
      .from('membership_settings')
      .select('id')
      .limit(1)

    const updateData = {
      title_es: body.title_es,
      title_en: body.title_en,
      subtitle_es: body.subtitle_es,
      subtitle_en: body.subtitle_en,
      intro_es: body.intro_es,
      intro_en: body.intro_en,
      image_url: body.image_url,
      what_is_title_es: body.what_is_title_es,
      what_is_title_en: body.what_is_title_en,
      what_is_content_es: body.what_is_content_es,
      what_is_content_en: body.what_is_content_en,
      benefits_title_es: body.benefits_title_es,
      benefits_title_en: body.benefits_title_en,
      benefits_es: body.benefits_es,
      benefits_en: body.benefits_en,
      who_is_for_title_es: body.who_is_for_title_es,
      who_is_for_title_en: body.who_is_for_title_en,
      who_is_for_es: body.who_is_for_es,
      who_is_for_en: body.who_is_for_en,
      group_use_title_es: body.group_use_title_es,
      group_use_title_en: body.group_use_title_en,
      group_use_es: body.group_use_es,
      group_use_en: body.group_use_en,
      options_title_es: body.options_title_es,
      options_title_en: body.options_title_en,
      options_es: body.options_es,
      options_en: body.options_en,
      tiers: body.tiers,
      cta_es: body.cta_es,
      cta_en: body.cta_en,
      table_note_es: body.table_note_es,
      table_note_en: body.table_note_en,
      is_active: body.is_active,
      updated_at: new Date().toISOString(),
    }

    let result
    if (existing && existing.length > 0) {
      result = await supabase
        .from('membership_settings')
        .update(updateData)
        .eq('id', existing[0].id)
        .select()
        .single()
    } else {
      result = await supabase
        .from('membership_settings')
        .insert(updateData)
        .select()
        .single()
    }

    if (result.error) {
      console.error('Error saving membership settings:', result.error)
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    return NextResponse.json({ data: result.data })
  } catch (error) {
    console.error('Error in membership settings API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
