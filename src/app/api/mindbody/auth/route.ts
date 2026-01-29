import { NextRequest, NextResponse } from 'next/server'
import { searchClients, addClient } from '@/lib/booking/mindbody'
import {
  phoneNumbersMatch,
  sanitizeError,
  ERROR_MESSAGES,
  validateRequired
} from '@/lib/booking/constants'
import {
  checkRateLimit,
  getClientIdentifier,
  createRateLimitHeaders,
  RATE_LIMIT_AUTH
} from '@/lib/booking/rate-limit'

// POST /api/mindbody/auth - Client lookup
export async function POST(request: NextRequest) {
  // Apply rate limiting
  const clientIdentifier = getClientIdentifier(request)
  const rateLimitResult = checkRateLimit(`auth:${clientIdentifier}`, RATE_LIMIT_AUTH)

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Por favor espera un momento.' },
      {
        status: 429,
        headers: createRateLimitHeaders(rateLimitResult)
      }
    )
  }

  try {
    // Check if Mindbody is configured
    if (!process.env.MINDBODY_API_KEY || !process.env.MINDBODY_SITE_ID) {
      console.error('Mindbody configuration missing:', {
        hasApiKey: !!process.env.MINDBODY_API_KEY,
        hasSiteId: !!process.env.MINDBODY_SITE_ID,
      })
      return NextResponse.json(
        { error: ERROR_MESSAGES.GENERIC_ERROR },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { searchText, searchType, action } = body

    if (!searchText) {
      return NextResponse.json(
        { error: 'Ingresa tu correo o teléfono' },
        { status: 400 }
      )
    }

    // Handle registration
    if (action === 'register') {
      const { firstName, lastName, email, phone, birthDate, gender } = body

      // Validate required fields
      const validation = validateRequired(
        { firstName, lastName, email, phone },
        ['firstName', 'lastName', 'email', 'phone']
      )

      if (!validation.valid) {
        return NextResponse.json(
          { error: 'Por favor completa todos los campos requeridos' },
          { status: 400 }
        )
      }

      // Basic email validation
      if (!email.includes('@') || !email.includes('.')) {
        return NextResponse.json(
          { error: ERROR_MESSAGES.INVALID_EMAIL },
          { status: 400 }
        )
      }

      // Basic phone validation (at least 8 digits)
      const phoneDigits = phone.replace(/\D/g, '')
      if (phoneDigits.length < 8) {
        return NextResponse.json(
          { error: ERROR_MESSAGES.INVALID_PHONE },
          { status: 400 }
        )
      }

      try {
        console.log('Attempting to register client:', {
          FirstName: firstName,
          LastName: lastName,
          Email: email,
          MobilePhone: phone,
          BirthDate: birthDate,
          Gender: gender,
        })

        const client = await addClient({
          FirstName: firstName,
          LastName: lastName,
          Email: email,
          MobilePhone: phone,
          BirthDate: birthDate,
          Gender: gender,
        })

        console.log('Client registered successfully:', client)

        return NextResponse.json({
          success: true,
          client: {
            Id: client.Id,
            FirstName: client.FirstName,
            LastName: client.LastName,
            Email: client.Email,
            MobilePhone: client.MobilePhone,
          }
        })
      } catch (regError) {
        const errorMessage = regError instanceof Error ? regError.message : String(regError)
        console.error('Registration error details:', {
          message: errorMessage,
          firstName,
          lastName,
          email,
          phone,
          stack: regError instanceof Error ? regError.stack : undefined
        })
        return NextResponse.json(
          { error: ERROR_MESSAGES.REGISTRATION_FAILED, details: errorMessage },
          { status: 500 }
        )
      }
    }

    // Search for clients
    const clients = await searchClients(searchText)

    // Filter based on search type for accuracy
    let filteredClients = clients

    if (searchType === 'email') {
      // Exact email match (case-insensitive)
      filteredClients = clients.filter(c =>
        c.Email?.toLowerCase() === searchText.toLowerCase()
      )
    } else if (searchType === 'phone') {
      // Use improved phone matching from constants
      filteredClients = clients.filter(c => {
        const mobileMatch = c.MobilePhone && phoneNumbersMatch(c.MobilePhone, searchText)
        const homeMatch = c.HomePhone && phoneNumbersMatch(c.HomePhone, searchText)
        return mobileMatch || homeMatch
      })
    }

    return NextResponse.json({
      clients: filteredClients.map(c => ({
        Id: c.Id,
        FirstName: c.FirstName,
        LastName: c.LastName,
        Email: c.Email,
        MobilePhone: c.MobilePhone,
      })),
      count: filteredClients.length
    })

  } catch (error) {
    console.error('Client lookup error:', error)
    // Use sanitized error - never expose stack traces
    return NextResponse.json(
      { error: sanitizeError(error) },
      { status: 500 }
    )
  }
}
