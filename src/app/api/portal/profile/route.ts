import { NextRequest, NextResponse } from 'next/server'
import { getClientCompleteInfo, searchClients } from '@/lib/booking/mindbody'
import { sanitizeError } from '@/lib/booking/constants'

// GET /api/portal/profile - Get client profile information
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const clientId = searchParams.get('clientId')

    if (!clientId) {
      return NextResponse.json(
        { error: 'Se requiere el ID del cliente' },
        { status: 400 }
      )
    }

    const client = await getClientCompleteInfo(clientId)

    if (!client) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ client })

  } catch (error) {
    console.error('Portal profile error:', error)
    return NextResponse.json(
      { error: sanitizeError(error) },
      { status: 500 }
    )
  }
}

// POST /api/portal/profile - Login/authenticate client by email or phone
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { identifier } = body // email or phone

    if (!identifier) {
      return NextResponse.json(
        { error: 'Se requiere correo electrónico o teléfono' },
        { status: 400 }
      )
    }

    // Determine if it's email or phone
    const isEmail = identifier.includes('@')

    // Search for client
    const clients = await searchClients(identifier)

    if (clients.length === 0) {
      return NextResponse.json(
        { error: 'No se encontró ningún cliente con esta información' },
        { status: 404 }
      )
    }

    // If multiple clients found, let the user select
    if (clients.length > 1) {
      return NextResponse.json({
        multiple: true,
        clients: clients.map(c => ({
          Id: c.Id,
          FirstName: c.FirstName,
          LastName: c.LastName,
          Email: c.Email ? `${c.Email.slice(0, 3)}***${c.Email.slice(c.Email.indexOf('@'))}` : null,
          MobilePhone: c.MobilePhone ? `***${c.MobilePhone.slice(-4)}` : null
        }))
      })
    }

    // Single client found - return full info
    const client = clients[0]

    return NextResponse.json({
      success: true,
      client: {
        Id: client.Id,
        FirstName: client.FirstName,
        LastName: client.LastName,
        Email: client.Email,
        MobilePhone: client.MobilePhone
      }
    })

  } catch (error) {
    console.error('Portal login error:', error)
    return NextResponse.json(
      { error: sanitizeError(error) },
      { status: 500 }
    )
  }
}
