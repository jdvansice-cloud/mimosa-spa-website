import { NextRequest, NextResponse } from 'next/server'
import { searchClients } from '@/lib/booking/mindbody'

/**
 * POST /api/portal/auth/verify
 * Verify that an email exists in Mindbody before sending magic link
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      )
    }

    // Search for clients with this email in Mindbody
    const clients = await searchClients(email)

    if (!clients || clients.length === 0) {
      return NextResponse.json(
        { error: 'No encontramos una cuenta con este correo.', notFound: true },
        { status: 404 }
      )
    }

    // Filter to only clients with matching email (case-insensitive)
    const matchingClients = clients.filter(
      (c) => c.Email?.toLowerCase() === email.toLowerCase()
    )

    if (matchingClients.length === 0) {
      return NextResponse.json(
        { error: 'No encontramos una cuenta con este correo exacto.', notFound: true },
        { status: 404 }
      )
    }

    if (matchingClients.length > 1) {
      // Multiple clients found - return list for selection
      return NextResponse.json({
        multiple: true,
        clients: matchingClients.map((c) => ({
          Id: c.Id,
          FirstName: c.FirstName,
          LastName: c.LastName,
          Email: c.Email,
          MobilePhone: c.MobilePhone
        }))
      })
    }

    // Single client found
    const client = matchingClients[0]
    return NextResponse.json({
      success: true,
      clientId: client.Id,
      firstName: client.FirstName,
      lastName: client.LastName
    })

  } catch (error) {
    console.error('Portal auth verify error:', error)
    return NextResponse.json(
      { error: 'Error al verificar correo' },
      { status: 500 }
    )
  }
}
