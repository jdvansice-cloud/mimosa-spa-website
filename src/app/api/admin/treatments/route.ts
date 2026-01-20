import { NextRequest, NextResponse } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { getAllServices } from '@/lib/booking/mindbody'

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

export interface TreatmentSetting {
  id?: string
  mindbody_service_id: number
  service_name: string
  program_id: number
  category: string
  price: number
  duration: number
  description: string
  is_visible: boolean
  show_booking_button: boolean
  is_top_pick: boolean
  sort_order: number
  is_online_bookable?: boolean // From Mindbody, not stored
}

// GET - Fetch all treatments with their settings
export async function GET() {
  try {
    // Fetch ALL services from Mindbody (including non-online bookable for admin view)
    const allServices = await getAllServices()

    // Fetch existing settings from Supabase
    const { data: settings, error: settingsError } = await getSupabaseAdmin()
      .from('treatment_settings')
      .select('*')

    if (settingsError) {
      console.error('Error fetching treatment settings:', settingsError)
      // Continue without settings - will use defaults
    }

    // Create a map of settings by mindbody_service_id
    const settingsMap = new Map<number, TreatmentSetting>()
    if (settings) {
      for (const setting of settings) {
        settingsMap.set(setting.mindbody_service_id, setting)
      }
    }

    // Get the set of valid Mindbody service IDs
    const validMindbodyIds = new Set(allServices.map(s => s.Id))

    // Find orphaned settings (in Supabase but not in Mindbody)
    const orphanedIds: number[] = []
    for (const [mindbodyId] of settingsMap) {
      if (!validMindbodyIds.has(mindbodyId)) {
        orphanedIds.push(mindbodyId)
      }
    }

    // Delete orphaned settings from Supabase
    if (orphanedIds.length > 0) {
      console.log(`Cleaning up ${orphanedIds.length} orphaned treatment settings:`, orphanedIds)
      const { error: deleteError } = await getSupabaseAdmin()
        .from('treatment_settings')
        .delete()
        .in('mindbody_service_id', orphanedIds)

      if (deleteError) {
        console.error('Error deleting orphaned settings:', deleteError)
        // Continue anyway - not a critical error
      } else {
        console.log(`Successfully removed ${orphanedIds.length} orphaned treatment settings`)
        // Remove from the map so they don't appear in the response
        for (const id of orphanedIds) {
          settingsMap.delete(id)
        }
      }
    }

    // Merge Mindbody services with settings
    const treatments: TreatmentSetting[] = allServices.map(service => {
      const existingSetting = settingsMap.get(service.Id)

      return {
        id: existingSetting?.id,
        mindbody_service_id: service.Id,
        service_name: service.Name,
        program_id: service.ProgramId,
        category: service.Category,
        price: service.Price,
        duration: service.Duration,
        description: service.Description || '',
        is_visible: existingSetting?.is_visible ?? false, // Default: hidden until admin enables
        show_booking_button: existingSetting?.show_booking_button ?? service.OnlineBooking,
        is_top_pick: existingSetting?.is_top_pick ?? false,
        sort_order: existingSetting?.sort_order ?? 0,
        is_online_bookable: service.OnlineBooking
      }
    })

    // Sort by category, then by sort_order, then by name
    treatments.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category)
      }
      if (a.sort_order !== b.sort_order) {
        return a.sort_order - b.sort_order
      }
      return a.service_name.localeCompare(b.service_name)
    })

    return NextResponse.json({ treatments })
  } catch (error) {
    console.error('Error fetching treatments:', error)
    return NextResponse.json(
      { error: 'Error al cargar tratamientos' },
      { status: 500 }
    )
  }
}

// POST - Update treatment settings
export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase environment variables')
      return NextResponse.json(
        { error: 'Server configuration error: Missing database credentials' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { treatments } = body as { treatments: TreatmentSetting[] }

    if (!treatments || !Array.isArray(treatments)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    console.log(`Processing ${treatments.length} treatment settings...`)

    // Deduplicate by mindbody_service_id (keep first occurrence)
    // This prevents "ON CONFLICT DO UPDATE command cannot affect row a second time" error
    const seenIds = new Set<number>()
    const uniqueTreatments = treatments.filter(t => {
      if (seenIds.has(t.mindbody_service_id)) {
        console.log(`Skipping duplicate mindbody_service_id: ${t.mindbody_service_id}`)
        return false
      }
      seenIds.add(t.mindbody_service_id)
      return true
    })

    console.log(`Upserting ${uniqueTreatments.length} unique treatment settings...`)

    // Upsert all treatment settings
    const upsertData = uniqueTreatments.map(t => ({
      mindbody_service_id: t.mindbody_service_id,
      service_name: t.service_name,
      program_id: t.program_id,
      category: t.category,
      price: t.price,
      duration: t.duration,
      description: t.description,
      is_visible: t.is_visible,
      show_booking_button: t.show_booking_button,
      is_top_pick: t.is_top_pick,
      sort_order: t.sort_order
    }))

    const { data, error } = await getSupabaseAdmin()
      .from('treatment_settings')
      .upsert(upsertData, {
        onConflict: 'mindbody_service_id',
        ignoreDuplicates: false
      })
      .select()

    if (error) {
      console.error('Error upserting treatment settings:', JSON.stringify(error, null, 2))
      return NextResponse.json(
        { error: `Error al guardar configuración: ${error.message || error.code || 'Unknown error'}`, details: error },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error updating treatments:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Error al actualizar tratamientos: ${errorMessage}` },
      { status: 500 }
    )
  }
}

// PATCH - Update a single treatment setting
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { mindbody_service_id, ...updates } = body

    if (!mindbody_service_id) {
      return NextResponse.json(
        { error: 'mindbody_service_id is required' },
        { status: 400 }
      )
    }

    // Check if setting exists
    const { data: existing } = await getSupabaseAdmin()
      .from('treatment_settings')
      .select('id')
      .eq('mindbody_service_id', mindbody_service_id)
      .single()

    let result
    if (existing) {
      // Update existing
      result = await getSupabaseAdmin()
        .from('treatment_settings')
        .update(updates)
        .eq('mindbody_service_id', mindbody_service_id)
        .select()
        .single()
    } else {
      // Insert new with all required fields
      result = await getSupabaseAdmin()
        .from('treatment_settings')
        .insert({
          mindbody_service_id,
          service_name: updates.service_name || '',
          program_id: updates.program_id || 0,
          category: updates.category || '',
          price: updates.price || 0,
          duration: updates.duration || 0,
          description: updates.description || '',
          is_visible: updates.is_visible ?? false, // Default: hidden until admin enables
          show_booking_button: updates.show_booking_button ?? true,
          is_top_pick: updates.is_top_pick ?? false,
          sort_order: updates.sort_order ?? 0
        })
        .select()
        .single()
    }

    if (result.error) {
      console.error('Error updating treatment setting:', result.error)
      return NextResponse.json(
        { error: 'Error al actualizar configuración' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    console.error('Error updating treatment:', error)
    return NextResponse.json(
      { error: 'Error al actualizar tratamiento' },
      { status: 500 }
    )
  }
}
