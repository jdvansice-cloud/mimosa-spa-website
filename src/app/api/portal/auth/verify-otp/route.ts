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
 * Verifies a WhatsApp OTP code and creates/updates a Supabase session.
 *
 * Handles three cases:
 * - New user (not in Supabase): creates account + profile + linked_account
 * - Existing user (already in Supabase): updates profile + linked_account, no re-creation
 * - Mindbody-only user: same as new user
 *
 * Body: { phone, otp_code, email?, clientId, clientName }
 * Returns: { success: true, token_hash, session_email }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, otp_code, email, clientId, clientName } = body

    if (!phone || !otp_code || !clientId || !clientName) {
      return NextResponse.json({ error: 'Parámetros incompletos' }, { status: 400 })
    }

    const normalizedPhone = String(phone).replace(/\D/g, '')

    if (otp_code.length !== 6 || !/^\d{6}$/.test(otp_code)) {
      return NextResponse.json(
        { error: 'Código inválido. Debe tener 6 dígitos.' },
        { status: 400 }
      )
    }

    const serviceClient = getServiceClient()

    // Verify OTP
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
      return NextResponse.json({ error: 'Código incorrecto o expirado' }, { status: 401 })
    }

    // Mark OTP as used
    await serviceClient
      .from('phone_verifications')
      .update({ used: true, verified_at: new Date().toISOString() })
      .eq('id', record.id)

    const mbClientId = Number(clientId)
    const clientNameStr = String(clientName)
    const sessionEmail = email
      ? String(email).toLowerCase().trim()
      : `phone.${normalizedPhone}@auth.mimosaspa.app`

    // --- Find or create Supabase user ---
    // 1. Check profiles table first (fast lookup by email)
    const { data: existingProfile } = await serviceClient
      .from('profiles')
      .select('id')
      .eq('email', sessionEmail)
      .maybeSingle()

    let userId: string

    if (existingProfile?.id) {
      // Existing user — just use their ID
      userId = existingProfile.id
    } else {
      // Create new Supabase user
      const { data: newUser, error: createError } = await serviceClient.auth.admin.createUser({
        email: sessionEmail,
        email_confirm: true,
        user_metadata: { mindbody_client_id: mbClientId },
      })

      if (createError) {
        if (createError.code === 'email_exists') {
          // Auth user exists but no profile yet — find via listUsers
          const { data: usersPage } = await serviceClient.auth.admin.listUsers({ perPage: 1000 })
          const found = usersPage?.users?.find(
            u => u.email?.toLowerCase() === sessionEmail.toLowerCase()
          )
          if (!found) {
            console.error('Could not locate existing auth user:', sessionEmail)
            return NextResponse.json({ error: 'Error al acceder a la cuenta' }, { status: 500 })
          }
          userId = found.id
        } else {
          console.error('Failed to create Supabase user:', createError)
          return NextResponse.json({ error: 'Error al crear cuenta' }, { status: 500 })
        }
      } else if (!newUser?.user) {
        return NextResponse.json({ error: 'Error al crear cuenta' }, { status: 500 })
      } else {
        userId = newUser.user.id
      }
    }

    // --- Update auth user metadata (display name + mindbody ID) ---
    await serviceClient.auth.admin.updateUserById(userId, {
      user_metadata: {
        full_name: clientNameStr,
        mindbody_client_id: mbClientId,
      },
    })

    // --- Update profile (upsert handles both new and existing) ---
    await serviceClient
      .from('profiles')
      .upsert({
        id: userId,
        email: sessionEmail,
        mindbody_client_id: mbClientId,
        full_name: clientNameStr,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' })

    // --- Update linked_accounts (upsert refreshes verified_at on re-login) ---
    // credential_type 'phone' indicates WhatsApp as preferred channel
    await serviceClient
      .from('linked_accounts')
      .upsert({
        credential: normalizedPhone,
        credential_type: 'phone',
        mindbody_client_id: mbClientId,
        client_name: clientNameStr,
        verified_at: new Date().toISOString(),
      }, { onConflict: 'credential,credential_type,mindbody_client_id' })

    // --- Generate magic link token for client-side session ---
    const { data: linkData, error: linkError } = await serviceClient.auth.admin.generateLink({
      type: 'magiclink',
      email: sessionEmail,
    })

    if (linkError || !linkData?.properties?.hashed_token) {
      console.error('Failed to generate session link:', linkError)
      return NextResponse.json({ error: 'Error al crear sesión' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      token_hash: linkData.properties.hashed_token,
      session_email: sessionEmail,
    })

  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json({ error: 'Error interno al verificar código' }, { status: 500 })
  }
}
