import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Basic email format check — must contain "@" and a "." in the domain part
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * POST /api/portal/auth/lookup
 * Looks up an account in linked_accounts by phone or email.
 * Only users who have previously booked through the app can log in.
 *
 * Body: { credential: string }
 * Returns: { clients: ClientResult[], notFound?: boolean, credentialType?: 'email' | 'phone' }
 */
export async function POST(request: NextRequest) {
  try {
    const { credential } = await request.json()

    if (!credential || typeof credential !== 'string' || !credential.trim()) {
      return NextResponse.json(
        { error: 'Ingresa tu correo o número de teléfono' },
        { status: 400 }
      )
    }

    const trimmed = credential.trim()
    const isEmail = trimmed.includes('@')

    const serviceClient = getServiceClient()

    if (isEmail) {
      const normalizedEmail = trimmed.toLowerCase()

      if (!EMAIL_REGEX.test(normalizedEmail)) {
        return NextResponse.json(
          { error: 'Correo electrónico inválido' },
          { status: 400 }
        )
      }

      const { data: emailLinks } = await serviceClient
        .from('linked_accounts')
        .select('mindbody_client_id, client_name')
        .eq('credential', normalizedEmail)
        .eq('credential_type', 'email')

      if (!emailLinks || emailLinks.length === 0) {
        return NextResponse.json({
          clients: [],
          notFound: true,
          credentialType: 'email',
        })
      }

      // For each matched client, also look up their phone in linked_accounts
      const clientIds = emailLinks.map(l => l.mindbody_client_id)
      const { data: phoneLinks } = await serviceClient
        .from('linked_accounts')
        .select('mindbody_client_id, credential')
        .in('mindbody_client_id', clientIds)
        .eq('credential_type', 'phone')

      const phoneByClientId = new Map<number, string>()
      if (phoneLinks) {
        for (const p of phoneLinks) {
          phoneByClientId.set(p.mindbody_client_id, p.credential)
        }
      }

      return NextResponse.json({
        credentialType: 'email',
        clients: emailLinks.map(l => ({
          Id: l.mindbody_client_id,
          FirstName: l.client_name.split(' ')[0] || l.client_name,
          LastName: l.client_name.split(' ').slice(1).join(' ') || '',
          displayName: l.client_name,
          Email: normalizedEmail,
          MobilePhone: phoneByClientId.get(l.mindbody_client_id) ?? null,
        })),
      })
    }

    // Phone branch — keep only digits
    const normalizedPhone = trimmed.replace(/\D/g, '')

    if (normalizedPhone.length < 10) {
      return NextResponse.json(
        { error: 'Escribe el número completo con código de país sin el + (ej: Panamá 50766124546 · EE.UU. 12125551234)' },
        { status: 400 }
      )
    }

    const { data: links } = await serviceClient
      .from('linked_accounts')
      .select('mindbody_client_id, client_name, credential_type')
      .eq('credential', normalizedPhone)
      .eq('credential_type', 'phone')

    if (!links || links.length === 0) {
      return NextResponse.json({
        clients: [],
        notFound: true,
        credentialType: 'phone',
      })
    }

    // For each matched client, also look up their email in linked_accounts
    const clientIds = links.map(l => l.mindbody_client_id)
    const { data: emailLinks } = await serviceClient
      .from('linked_accounts')
      .select('mindbody_client_id, credential')
      .in('mindbody_client_id', clientIds)
      .eq('credential_type', 'email')

    const emailByClientId = new Map<number, string>()
    if (emailLinks) {
      for (const e of emailLinks) {
        emailByClientId.set(e.mindbody_client_id, e.credential)
      }
    }

    return NextResponse.json({
      credentialType: 'phone',
      clients: links.map(l => ({
        Id: l.mindbody_client_id,
        FirstName: l.client_name.split(' ')[0] || l.client_name,
        LastName: l.client_name.split(' ').slice(1).join(' ') || '',
        displayName: l.client_name,
        Email: emailByClientId.get(l.mindbody_client_id) ?? null,
        MobilePhone: normalizedPhone,
      })),
    })

  } catch (error) {
    console.error('Lookup error:', error)
    return NextResponse.json(
      { error: 'Error al buscar cuenta' },
      { status: 500 }
    )
  }
}
