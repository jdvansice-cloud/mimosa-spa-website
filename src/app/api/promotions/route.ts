import { NextRequest, NextResponse } from 'next/server'
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

// GET /api/promotions - Fetch all promotions
// Query params:
//   active=false - Include inactive/expired promotions
//   id=<uuid> - Fetch a single promotion by ID
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active') !== 'false'
    const promotionId = searchParams.get('id')

    // Fetch single promotion by ID
    if (promotionId) {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('id', promotionId)
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ data })
    }

    // Auto-deactivate expired promotions
    const today = new Date().toISOString().split('T')[0]
    await supabase
      .from('promotions')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('is_active', true)
      .lt('valid_until', today)

    // Fetch all promotions
    let query = supabase
      .from('promotions')
      .select('*')
      .order('sort_order', { ascending: true })

    if (activeOnly) {
      query = query
        .eq('is_active', true)
        .gte('valid_until', today)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err) {
    console.error('GET /api/promotions error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/promotions - Create new promotion
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()

    // Check authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Ensure mindbody_service_ids is an array of integers
    if (body.mindbody_service_ids) {
      body.mindbody_service_ids = body.mindbody_service_ids.map((id: string | number) =>
        typeof id === 'string' ? parseInt(id, 10) : id
      ).filter((id: number) => !isNaN(id))
    }

    const { data, error } = await supabase
      .from('promotions')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('POST /api/promotions error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (err) {
    console.error('POST /api/promotions error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/promotions - Update existing promotion
export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()

    // Check authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Promotion ID is required' }, { status: 400 })
    }

    // Ensure mindbody_service_ids is an array of integers
    if (updateData.mindbody_service_ids) {
      updateData.mindbody_service_ids = updateData.mindbody_service_ids.map((serviceId: string | number) =>
        typeof serviceId === 'string' ? parseInt(serviceId, 10) : serviceId
      ).filter((serviceId: number) => !isNaN(serviceId))
    }

    // Set updated_at
    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('promotions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('PUT /api/promotions error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err) {
    console.error('PUT /api/promotions error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/promotions - Delete promotion
export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()

    // Check authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Promotion ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('promotions')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('DELETE /api/promotions error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/promotions error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
