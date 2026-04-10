import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/**
 * POST /api/portal/auth/lookup
 * Looks up a phone number in linked_accounts (Supabase only).
 * Only users who have previously booked through the app can log in.
 *
 * Body: { credential: string }
 * Returns: { clients: ClientResult[] }
 */
export async function POST(request: NextRequest) {
  try {
    const { credential } = await request.json()

    if (!credential || typeof credential !== 'string' || !credential.trim()) {
      return NextResponse.json(
        { error: 'Ingresa tu número de teléfono' },
        { status: 400 }
      )
    }

    // Keep only digits
    const normalizedPhone = credential.trim().replace(/\D/g, '')

    if (normalizedPhone.length < 10) {
      return NextResponse.json(
        { error: 'Escribe el número completo con código de país sin el + (ej: Panamá 50766124546 · EE.UU. 12125551234)' },
        { status: 400 }
      )
    }

    const serviceClient = getServiceClient()

    const { data: links } = await serviceClient
      .from('linked_accounts')
      .select('mindbody_client_id, client_name, credential_type')
      .eq('credential', normalizedPhone)
      .eq('credential_type', 'phone')

    if (!links || links.length === 0) {
      return NextResponse.json({
        clients: [],
        notFound: true,
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
