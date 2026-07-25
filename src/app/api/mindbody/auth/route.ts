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

      // 1. Search by email — exact match
      try {
        const byEmail = await searchClients(email)
        const emailMatch = byEmail.find(c =>
          c.Email?.toLowerCase() === email.toLowerCase()
        )
        if (emailMatch) {
          console.log('Found existing client by email:', emailMatch.Id, emailMatch.Email)
          return NextResponse.json({
            success: true,
            client: {
              Id: emailMatch.Id,
              FirstName: emailMatch.FirstName,
              LastName: emailMatch.LastName,
              Email: emailMatch.Email,
              MobilePhone: emailMatch.MobilePhone,
            },
            existingClient: true,
          })
        }
      } catch (lookupError) {
        console.error('Email lookup failed:', lookupError)
      }

      // 2. Search by phone — normalized match
      try {
        const byPhone = await searchClients(phone)
        const phoneMatch = byPhone.find(c => {
          const mobileMatch = c.MobilePhone && phoneNumbersMatch(c.MobilePhone, phone)
          const homeMatch = c.HomePhone && phoneNumbersMatch(c.HomePhone, phone)
          return mobileMatch || homeMatch
        })
        if (phoneMatch) {
          console.log('Found existing client by phone:', phoneMatch.Id, phoneMatch.MobilePhone)
          return NextResponse.json({
            success: true,
            client: {
              Id: phoneMatch.Id,
              FirstName: phoneMatch.FirstName,
              LastName: phoneMatch.LastName,
              Email: phoneMatch.Email,
              MobilePhone: phoneMatch.MobilePhone,
            },
            existingClient: true,
          })
        }
      } catch (lookupError) {
        console.error('Phone lookup failed:', lookupError)
      }

      // 3. No existing client found — create new
      try {
        console.log('No existing client found, creating:', { firstName, lastName, email, phone })
        const client = await addClient({
          FirstName: firstName,
          LastName: lastName,
          Email: email,
          MobilePhone: phone,
          BirthDate: birthDate,
          Gender: gender,
        })
        console.log('Client created:', client.Id)
        return NextResponse.json({
          success: true,
          client: {
            Id: client.Id,
            FirstName: client.FirstName,
            LastName: client.LastName,
            Email: client.Email,
            MobilePhone: client.MobilePhone,
          },
        })
      } catch (createError) {
        const errorMessage = createError instanceof Error ? createError.message : String(createError)
        console.error('Client creation failed:', { message: errorMessage, firstName, lastName, email, phone })

        // Mindbody says the client already exists. This happens when the
        // email/phone lookups above failed transiently (e.g. Mindbody 500s)
        // and we fell through to creation. Retry the lookups once — if we can
        // find the existing record now, log the user into it instead of erroring.
        if (/duplicate client/i.test(errorMessage)) {
          try {
            const byEmail = await searchClients(email)
            const emailMatch = byEmail.find(c =>
              c.Email?.toLowerCase() === email.toLowerCase()
            )
            const byPhone = emailMatch ? [] : await searchClients(phone)
            const phoneMatch = byPhone.find(c => {
              const mobileMatch = c.MobilePhone && phoneNumbersMatch(c.MobilePhone, phone)
              const homeMatch = c.HomePhone && phoneNumbersMatch(c.HomePhone, phone)
              return mobileMatch || homeMatch
            })
            const match = emailMatch || phoneMatch
            if (match) {
              console.log('Duplicate-client recovery: found existing client', match.Id)
              return NextResponse.json({
                success: true,
                client: {
                  Id: match.Id,
                  FirstName: match.FirstName,
                  LastName: match.LastName,
                  Email: match.Email,
                  MobilePhone: match.MobilePhone,
                },
                existingClient: true,
              })
            }
          } catch (retryError) {
            console.error('Duplicate-client recovery lookup failed:', retryError)
          }

          return NextResponse.json(
            {
              error: 'Ya existe una cuenta con estos datos. Intenta iniciar sesión con tu número de teléfono o correo, o contáctanos por WhatsApp.',
              duplicateClient: true,
            },
            { status: 409 }
          )
        }

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
