import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/**
 * POST /api/portal/auth/verify-otp
 * Verifies a WhatsApp OTP code and creates a Supabase session.
 * Returns a token_hash the client uses to establish the session via verifyOtp({ token_hash, type: 'magiclink' }).
 *
 * Body: { phone: string, otp_code: string, email?: string, clientId: number, clientName: string }
 * Returns: { success: true, token_hash: string, session_email: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, otp_code, email, clientId, clientName } = body

    if (!phone || !otp_code || !clientId || !clientName) {
      return NextResponse.json(
        { error: 'Parámetros incompletos' },
        { status: 400 }
      )
    }

    const normalizedPhone = String(phone).replace(/\D/g, '')

    if (!otp_code || otp_code.length !== 6 || !/^\d{6}$/.test(otp_code)) {
      return NextResponse.json(
        { error: 'Código inválido. Debe tener 6 dígitos.' },
        { status: 400 }
      )
    }

    const serviceClient = getServiceClient()

    // Look up the OTP record
    const { data: record, error: lookupError } = await serviceClient
      .from('phone_verifications')
      .select('id, expires_at, used, otp_code')
      .eq('phone', normalizedPhone)
      .eq('otp_code', otp_code)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (lookupError || !record) {
      return NextResponse.json(
        { error: 'Código incorrecto o expirado' },
        { status: 401 }
      )
    }

    // Mark as used
    await serviceClient
      .from('phone_verifications')
      .update({ used: true, verified_at: new Date().toISOString() })
      .eq('id', record.id)

    // Save to linked_accounts
    const clientNameStr = String(clientName)
    await serviceClient
      .from('linked_accounts')
      .upsert({
        credential: normalizedPhone,
        credential_type: 'phone',
        mindbody_client_id: Number(clientId),
        client_name: clientNameStr,
        verified_at: new Date().toISOString(),
      }, { onConflict: 'credential,credential_type,mindbody_client_id' })

    // Determine the email to use for the Supabase user
    // If client has a real email, use it. Otherwise derive one from the phone.
    const sessionEmail = email
      ? String(email).toLowerCase().trim()
      : `phone.${normalizedPhone}@auth.mimosaspa.app`

    // Get or create a Supabase user for this email
    const { data: existingUsers } = await serviceClient.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(
      u => u.email?.toLowerCase() === sessionEmail
    )

    let userId: string

    if (existingUser) {
      userId = existingUser.id
    } else {
      // Create the user with email confirmed
      const { data: newUser, error: createError } = await serviceClient.auth.admin.createUser({
        email: sessionEmail,
        email_confirm: true,
        user_metadata: {
          mindbody_client_id: Number(clientId),
        },
      })

      if (createError || !newUser?.user) {
        console.error('Failed to create Supabase user:', createError)
        return NextResponse.json(
          { error: 'Error al crear cuenta' },
          { status: 500 }
        )
      }

      userId = newUser.user.id
    }

    // Save/update the profile
    await serviceClient
      .from('profiles')
      .upsert({
        id: userId,
        email: sessionEmail,
        mindbody_client_id: Number(clientId),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' })

    // Generate a magic link to produce a token_hash the client can use
    const { data: linkData, error: linkError } = await serviceClient.auth.admin.generateLink({
      type: 'magiclink',
      email: sessionEmail,
    })

    if (linkError || !linkData?.properties?.hashed_token) {
      console.error('Failed to generate session link:', linkError)
      return NextResponse.json(
        { error: 'Error al crear sesión' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      token_hash: linkData.properties.hashed_token,
      session_email: sessionEmail,
    })

  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Error interno al verificar código' },
      { status: 500 }
    )
  }
}
