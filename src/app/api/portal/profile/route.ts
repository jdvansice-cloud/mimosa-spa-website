import { NextRequest, NextResponse } from 'next/server'
import {
  getClientWithCustomFields,
  searchClients,
  updateClient,
  getCustomClientFields,
  type UpdateClientData
} from '@/lib/booking/mindbody'
import { sanitizeError } from '@/lib/booking/constants'

// GET /api/portal/profile - Get client profile information with custom fields
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const clientId = searchParams.get('clientId')
    const includeCustomFields = searchParams.get('includeCustomFields') === 'true'

    if (!clientId) {
      return NextResponse.json(
        { error: 'Se requiere el ID del cliente' },
        { status: 400 }
      )
    }

    // Get client with custom fields
    const client = await getClientWithCustomFields(clientId)

    if (!client) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    // Optionally get custom field definitions
    let customFieldDefinitions = null
    if (includeCustomFields) {
      customFieldDefinitions = await getCustomClientFields()
    }

    // Ensure Id is a number for consistency with MindbodyClient type
    // Mindbody API returns Id as string, but our types expect number
    const normalizedClient = {
      ...client,
      Id: typeof client.Id === 'string' ? parseInt(client.Id, 10) : client.Id
    }

    return NextResponse.json({
      client: normalizedClient,
      customFieldDefinitions
    })

  } catch (error) {
    console.error('Portal profile error:', error)
    return NextResponse.json(
      { error: sanitizeError(error) },
      { status: 500 }
    )
  }
}

// PUT /api/portal/profile - Update client profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { clientId, updates } = body

    if (!clientId) {
      return NextResponse.json(
        { error: 'Se requiere el ID del cliente' },
        { status: 400 }
      )
    }

    if (!updates || Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No se proporcionaron datos para actualizar' },
        { status: 400 }
      )
    }

    // Build update data
    const updateData: UpdateClientData = {
      Id: clientId,
      ...updates
    }

    // Update client in Mindbody
    const updatedClient = await updateClient(updateData)

    return NextResponse.json({
      success: true,
      client: updatedClient
    })

  } catch (error) {
    console.error('Portal profile update error:', error)
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
