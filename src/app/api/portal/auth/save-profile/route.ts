import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { clientId } = await request.json()

    if (!clientId || typeof clientId !== 'number') {
      return NextResponse.json({ error: 'clientId es requerido' }, { status: 400 })
    }

    const serviceClient = getServiceClient()

    const { error: upsertError } = await serviceClient
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        mindbody_client_id: clientId,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' })

    if (upsertError) {
      console.error('Failed to save profile:', upsertError)
      return NextResponse.json({ error: 'Error al guardar perfil' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Save profile error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
