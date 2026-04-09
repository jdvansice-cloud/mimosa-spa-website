import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { searchClients } from '@/lib/booking/mindbody'
import { phoneNumbersMatch } from '@/lib/booking/constants'

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function detectCredentialType(credential: string): 'email' | 'phone' {
  return credential.includes('@') ? 'email' : 'phone'
}

function normalizeCredential(credential: string, type: 'email' | 'phone'): string {
  if (type === 'email') {
    return credential.trim().toLowerCase()
  }
  // Phone: keep only digits
  return credential.replace(/\D/g, '')
}

/**
 * POST /api/portal/auth/lookup
 * Looks up a credential (email or phone) in linked_accounts first,
 * then falls back to Mindbody search if no links found.
 *
 * Body: { credential: string }
 * Returns: { linked: boolean, clients: ClientResult[], credentialType: 'email' | 'phone' }
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

    const credentialType = detectCredentialType(credential)
    const normalizedCredential = normalizeCredential(credential, credentialType)

    // For phone: minimum 8 digits
    if (credentialType === 'phone' && normalizedCredential.length < 8) {
      return NextResponse.json(
        { error: 'Número de teléfono inválido (mínimo 8 dígitos)' },
        { status: 400 }
      )
    }

    // For email: basic format check
    if (credentialType === 'email' && !credential.includes('.')) {
      return NextResponse.json(
        { error: 'Correo electrónico inválido' },
        { status: 400 }
      )
    }

    const serviceClient = getServiceClient()

    // 1. Check linked_accounts first
    const { data: links } = await serviceClient
      .from('linked_accounts')
      .select('mindbody_client_id, client_name, credential_type')
      .eq('credential', normalizedCredential)
      .eq('credential_type', credentialType)

    if (links && links.length > 0) {
      return NextResponse.json({
        linked: true,
        credentialType,
        clients: links.map(l => ({
          Id: l.mindbody_client_id,
          FirstName: l.client_name.split(' ')[0] || l.client_name,
          LastName: l.client_name.split(' ').slice(1).join(' ') || '',
          displayName: l.client_name,
          // Email and phone will be fetched from Mindbody only if needed (channel choice)
          Email: credentialType === 'email' ? normalizedCredential : null,
          MobilePhone: credentialType === 'phone' ? credential : null,
        })),
      })
    }

    // 2. No links found — search Mindbody
    const mbClients = await searchClients(credential)

    if (!mbClients || mbClients.length === 0) {
      return NextResponse.json({
        linked: false,
        credentialType,
        clients: [],
        notFound: true,
      })
    }

    // Filter by exact match
    let filtered = mbClients
    if (credentialType === 'email') {
      const emailLower = normalizedCredential
      filtered = mbClients.filter(c => c.Email?.toLowerCase() === emailLower)
    } else {
      filtered = mbClients.filter(c => {
        const mobileMatch = c.MobilePhone && phoneNumbersMatch(c.MobilePhone, credential)
        const homeMatch = c.HomePhone && phoneNumbersMatch(c.HomePhone, credential)
        return mobileMatch || homeMatch
      })
    }

    if (filtered.length === 0) {
      return NextResponse.json({
        linked: false,
        credentialType,
        clients: [],
        notFound: true,
      })
    }

    return NextResponse.json({
      linked: false,
      credentialType,
      clients: filtered.map(c => ({
        Id: c.Id,
        FirstName: c.FirstName,
        LastName: c.LastName,
        displayName: `${c.FirstName || ''} ${c.LastName || ''}`.trim(),
        Email: c.Email || null,
        MobilePhone: c.MobilePhone || null,
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
