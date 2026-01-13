import { NextRequest, NextResponse } from 'next/server'
import { searchClients, addClient } from '@/lib/booking/mindbody'

// POST /api/mindbody/auth - Client lookup
export async function POST(request: NextRequest) {
  try {
    // Check if Mindbody is configured
    if (!process.env.MINDBODY_API_KEY || !process.env.MINDBODY_SITE_ID) {
      console.error('Mindbody configuration missing:', {
        hasApiKey: !!process.env.MINDBODY_API_KEY,
        hasSiteId: !!process.env.MINDBODY_SITE_ID,
      })
      return NextResponse.json(
        { error: 'Mindbody API not configured. Please check environment variables.' },
        { status: 503 }
      )
    }
    
    const body = await request.json()
    const { searchText, searchType, action } = body
    
    if (!searchText) {
      return NextResponse.json(
        { error: 'Search text is required' },
        { status: 400 }
      )
    }
    
    // Handle registration
    if (action === 'register') {
      const { firstName, lastName, email, phone, birthDate, gender } = body
      
      if (!firstName || !lastName || !email || !phone) {
        return NextResponse.json(
          { error: 'First name, last name, email, and phone are required' },
          { status: 400 }
        )
      }
      
      const client = await addClient({
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        MobilePhone: phone,
        BirthDate: birthDate,
        Gender: gender,
      })
      
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
    }
    
    // Search for clients
    const clients = await searchClients(searchText)
    
    // Filter based on search type for accuracy
    let filteredClients = clients
    
    if (searchType === 'email') {
      filteredClients = clients.filter(c => 
        c.Email?.toLowerCase() === searchText.toLowerCase()
      )
    } else if (searchType === 'phone') {
      // Normalize phone numbers for comparison
      const normalizedSearch = searchText.replace(/\D/g, '')
      filteredClients = clients.filter(c => {
        const normalizedMobile = c.MobilePhone?.replace(/\D/g, '') || ''
        const normalizedHome = c.HomePhone?.replace(/\D/g, '') || ''
        return normalizedMobile.includes(normalizedSearch) || 
               normalizedHome.includes(normalizedSearch)
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
    // Return more specific error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to search clients', details: errorMessage, stack: error instanceof Error ? error.stack : undefined },
      { status: 500 }
    )
  }
}
