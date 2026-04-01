import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/**
 * POST /api/portal/auth/link-account
 * Saves a verified credential to linked_accounts after successful OTP verification.
 * Called by the frontend after email OTP success (WhatsApp OTP saves the link server-side in verify-otp).
 *
 * Requires an active Supabase session (user must be authenticated).
 *
 * Body: { credential: string, credentialType: 'email' | 'phone', clientId: number, clientName: string }
 * Returns: { success: true }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { credential, credentialType, clientId, clientName } = await request.json()

    if (!credential || !credentialType || !clientId || !clientName) {
      return NextResponse.json(
        { error: 'credential, credentialType, clientId y clientName son requeridos' },
        { status: 400 }
      )
    }

    if (!['email', 'phone'].includes(credentialType)) {
      return NextResponse.json(
        { error: 'credentialType debe ser "email" o "phone"' },
        { status: 400 }
      )
    }

    // Normalize credential
    const normalizedCredential = credentialType === 'email'
      ? String(credential).toLowerCase().trim()
      : String(credential).replace(/\D/g, '')

    const serviceClient = getServiceClient()

    const { error: upsertError } = await serviceClient
      .from('linked_accounts')
      .upsert({
        credential: normalizedCredential,
        credential_type: credentialType,
        mindbody_client_id: Number(clientId),
        client_name: String(clientName),
        verified_at: new Date().toISOString(),
      }, { onConflict: 'credential,credential_type,mindbody_client_id' })

    if (upsertError) {
      console.error('Failed to save linked account:', upsertError)
      return NextResponse.json(
        { error: 'Error al vincular cuenta' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Link account error:', error)
    return NextResponse.json(
      { error: 'Error interno' },
      { status: 500 }
    )
  }
}
