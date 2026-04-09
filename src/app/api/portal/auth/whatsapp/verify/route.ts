import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase admin client for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

function getSupabaseAdmin() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

/**
 * POST /api/portal/auth/whatsapp/verify
 * Verify a WhatsApp verification token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { error: 'Token es requerido' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdmin()

    // Look up the token
    const { data: verification, error: lookupError } = await supabase
      .from('phone_verifications')
      .select('*')
      .eq('token', token)
      .single()

    if (lookupError || !verification) {
      console.error('Token lookup failed:', lookupError)
      return NextResponse.json(
        { error: 'Token inválido o no encontrado' },
        { status: 404 }
      )
    }

    // Check if already used
    if (verification.used) {
      return NextResponse.json(
        { error: 'Este enlace ya fue utilizado' },
        { status: 400 }
      )
    }

    // Check if expired
    const expiresAt = new Date(verification.expires_at)
    if (new Date() > expiresAt) {
      return NextResponse.json(
        { error: 'Este enlace ha expirado' },
        { status: 400 }
      )
    }

    // Mark token as used
    const { error: updateError } = await supabase
      .from('phone_verifications')
      .update({
        used: true,
        verified_at: new Date().toISOString(),
      })
      .eq('token', token)

    if (updateError) {
      console.error('Failed to mark token as used:', updateError)
    }

    // Update the client's phone verification status in profiles table
    // This is optional - depends on your data model
    if (verification.email) {
      await supabase
        .from('profiles')
        .update({ phone_verified: true })
        .eq('email', verification.email)
    }

    return NextResponse.json({
      success: true,
      clientId: verification.client_id,
      clientName: verification.client_name,
      phone: verification.phone,
      redirectUrl: verification.redirect_url || '/es/portal',
    })

  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { error: 'Error al verificar el token' },
      { status: 500 }
    )
  }
}
