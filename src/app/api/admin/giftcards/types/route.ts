import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const activeOnly = searchParams.get('activeOnly') === 'true'

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  let query = supabase
    .from('gift_card_types')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true })

  if (category) query = query.eq('category', category)
  if (activeOnly) query = query.eq('is_active', true)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ data })
}
