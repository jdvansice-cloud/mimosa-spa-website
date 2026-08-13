import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { revalidateTag } from 'next/cache'
import { requireAdmin } from '@/lib/auth/require-admin'
import { SITE_IMAGES_TAG } from '@/lib/site-images'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('site_images')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const denied = await requireAdmin()
    if (denied) return denied

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const body = await request.json()
    const { id, image_url } = body

    if (!id || !image_url) {
      return NextResponse.json(
        { error: 'Missing id or image_url' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('site_images')
      .update({ image_url })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    revalidateTag(SITE_IMAGES_TAG, 'max')
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
