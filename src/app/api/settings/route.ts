import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export interface PublicSiteSettings {
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
}

const defaultSettings: PublicSiteSettings = {
  phone_costa_del_este: '398-5295',
  phone_san_francisco: '398-5295',
  email: 'info@mimosaretreat.com',
  whatsapp_number: '50764049464',
  whatsapp_message: 'Hola, me gustaría obtener información sobre sus servicios.',
  weekday_open: '09:00',
  weekday_close: '20:00',
  weekend_open: '09:00',
  weekend_close: '18:00',
  instagram_url: 'https://instagram.com/mimosaretreat',
  facebook_url: 'https://facebook.com/mimosaretreat',
}

// GET - Fetch public site settings (cached)
export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('site_settings')
      .select('phone_costa_del_este, phone_san_francisco, email, whatsapp_number, whatsapp_message, weekday_open, weekday_close, weekend_open, weekend_close, instagram_url, facebook_url')
      .limit(1)

    if (error || !data || data.length === 0) {
      return NextResponse.json({ data: defaultSettings })
    }

    return NextResponse.json({ data: data[0] })
  } catch {
    return NextResponse.json({ data: defaultSettings })
  }
}
