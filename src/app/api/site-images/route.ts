import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// GET /api/site-images?key=menu_corporales_banner
// GET /api/site-images?keys=menu_corporales_banner,menu_faciales_banner
// Returns site image(s) by key
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    const keys = searchParams.get('keys')

    if (!key && !keys) {
      return NextResponse.json(
        { error: 'Missing key or keys parameter' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Single key lookup
    if (key) {
      const { data, error } = await supabase
        .from('site_images')
        .select('key, image_url')
        .eq('key', key)
        .eq('is_active', true)
        .single()

      if (error) {
        // Return null if not found (allows fallback to default)
        if (error.code === 'PGRST116') {
          return NextResponse.json({ data: null })
        }
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ data })
    }

    // Multiple keys lookup
    if (keys) {
      const keyList = keys.split(',').map(k => k.trim())

      const { data, error } = await supabase
        .from('site_images')
        .select('key, image_url')
        .in('key', keyList)
        .eq('is_active', true)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // Convert to a map for easy lookup
      const imageMap = (data || []).reduce((acc, img) => {
        acc[img.key] = img.image_url
        return acc
      }, {} as Record<string, string>)

      return NextResponse.json({ data: imageMap })
    }

    return NextResponse.json({ data: null })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
