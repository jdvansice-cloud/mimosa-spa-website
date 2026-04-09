import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { sendOtpCode } from '@/lib/booking/wati'

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * POST /api/portal/auth/send-otp
 * Sends a WhatsApp OTP code to the given phone number.
 * Email OTP is sent client-side via supabase.auth.signInWithOtp.
 *
 * Body: { phone: string, clientId: number, clientName: string }
 * Returns: { success: true }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, clientId, clientName } = body

    if (!phone || !clientId || !clientName) {
      return NextResponse.json(
        { error: 'phone, clientId y clientName son requeridos' },
        { status: 400 }
      )
    }

    const normalizedPhone = String(phone).replace(/\D/g, '')
    if (normalizedPhone.length < 8) {
      return NextResponse.json(
        { error: 'Número de teléfono inválido' },
        { status: 400 }
      )
    }

    const serviceClient = getServiceClient()

    // Rate limit: reject if a valid (unused, unexpired) code was sent in the last 60 seconds
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString()
    const { data: recentCode } = await serviceClient
      .from('phone_verifications')
      .select('id')
      .eq('phone', normalizedPhone)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .gt('created_at', oneMinuteAgo)
      .limit(1)
      .single()

    if (recentCode) {
      return NextResponse.json(
        { error: 'Ya se envió un código recientemente. Espera un momento antes de intentar de nuevo.' },
        { status: 429 }
      )
    }

    // Invalidate any existing unused codes for this phone
    await serviceClient
      .from('phone_verifications')
      .update({ used: true })
      .eq('phone', normalizedPhone)
      .eq('used', false)

    const otpCode = generateOtpCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    // Store the OTP code
    const { error: insertError } = await serviceClient
      .from('phone_verifications')
      .insert({
        token: `otp_${normalizedPhone}_${Date.now()}`,
        phone: normalizedPhone,
        client_id: String(clientId),
        client_name: clientName,
        otp_code: otpCode,
        expires_at: expiresAt,
        used: false,
      })

    if (insertError) {
      console.error('Failed to store OTP:', insertError)
      return NextResponse.json(
        { error: 'Error al generar código' },
        { status: 500 }
      )
    }

    // Send via WhatsApp (Authentication template only takes the code — no client name)
    const watiResult = await sendOtpCode(normalizedPhone, otpCode)

    if (!watiResult.result) {
      const watiError = watiResult.error || 'unknown'
      console.error('Failed to send WhatsApp OTP:', { phone: normalizedPhone, error: watiError })

      // Invalidate the stored code so the user can retry immediately
      await serviceClient
        .from('phone_verifications')
        .update({ used: true })
        .eq('phone', normalizedPhone)
        .eq('otp_code', otpCode)

      if (watiError === 'WATI not configured') {
        return NextResponse.json(
          { error: 'WhatsApp no está configurado en el servidor. Contacta al administrador.' },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { error: `Error al enviar código por WhatsApp: ${watiError}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'Error interno al enviar código' },
      { status: 500 }
    )
  }
}
