import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendPhoneVerification, isWatiConfigured } from '@/lib/booking/wati'
import { randomBytes } from 'crypto'

// Supabase admin client for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

function getSupabaseAdmin() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

// Generate a secure random token
function generateToken(): string {
  return randomBytes(32).toString('hex')
}

/**
 * POST /api/portal/auth/whatsapp
 * Send a WhatsApp verification link to the client's phone
 */
export async function POST(request: NextRequest) {
  try {
    // Check if WATI is configured
    if (!isWatiConfigured()) {
      return NextResponse.json(
        { error: 'WhatsApp verification is not configured' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { phone, clientName, clientId, email, redirectUrl } = body

    if (!phone || !clientName || !clientId) {
      return NextResponse.json(
        { error: 'Phone, clientName, and clientId are required' },
        { status: 400 }
      )
    }

    // Generate verification token
    const token = generateToken()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    // Store token in Supabase
    const supabase = getSupabaseAdmin()

    // First, invalidate any existing tokens for this phone
    await supabase
      .from('phone_verifications')
      .update({ used: true })
      .eq('phone', phone)
      .eq('used', false)

    // Insert new verification token
    const { error: insertError } = await supabase
      .from('phone_verifications')
      .insert({
        token,
        phone,
        client_id: clientId,
        client_name: clientName,
        email,
        redirect_url: redirectUrl,
        expires_at: expiresAt.toISOString(),
        used: false,
      })

    if (insertError) {
      console.error('Failed to store verification token:', insertError)
      return NextResponse.json(
        { error: 'Failed to create verification' },
        { status: 500 }
      )
    }

    // Build verification URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mimosa-spa-website.vercel.app'
    const verificationUrl = `${baseUrl}/es/portal/auth/verify-phone?token=${token}`

    // Send WhatsApp message
    const result = await sendPhoneVerification({
      clientName,
      clientPhone: phone,
      verificationUrl,
    })

    if (!result.result) {
      console.error('Failed to send WhatsApp verification:', result.error)
      return NextResponse.json(
        { error: 'Failed to send WhatsApp message', details: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Verification link sent via WhatsApp',
    })

  } catch (error) {
    console.error('WhatsApp verification error:', error)
    return NextResponse.json(
      { error: 'Failed to send verification' },
      { status: 500 }
    )
  }
}
