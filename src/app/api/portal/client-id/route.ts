import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/portal/client-id
 * Get the Mindbody client ID for the authenticated user from Supabase
 * This is the authoritative source for the client ID during bookings
 */
export async function GET() {
  try {
    const supabase = await createClient()

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    // Get the user's profile with Mindbody client ID
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile, error: profileError } = await (supabase as any)
      .from('profiles')
      .select('mindbody_client_id')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return NextResponse.json(
        { error: 'Error al obtener perfil' },
        { status: 500 }
      )
    }

    const mindbodyClientId = profile?.mindbody_client_id as number | null
    if (!profile || !mindbodyClientId) {
      return NextResponse.json(
        { error: 'No se encontró ID de cliente Mindbody vinculado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      clientId: mindbodyClientId,
      userId: user.id
    })

  } catch (error) {
    console.error('Portal client-id error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
