import { NextResponse } from 'next/server'

// GET /api/mindbody/test - Test Mindbody API connection
export async function GET() {
  const MINDBODY_API_KEY = process.env.MINDBODY_API_KEY
  const MINDBODY_SITE_ID = process.env.MINDBODY_SITE_ID
  const MINDBODY_API_URL = process.env.MINDBODY_API_URL || 'https://api.mindbodyonline.com/public/v6'
  const MINDBODY_USERNAME = process.env.MINDBODY_USERNAME || '_mindbody_api'
  const MINDBODY_PASSWORD = process.env.MINDBODY_PASSWORD || '_mindbody_api'
  
  const results: Record<string, unknown> = {
    config: {
      apiKeyPrefix: MINDBODY_API_KEY?.substring(0, 8),
      apiKeyLength: MINDBODY_API_KEY?.length,
      siteId: MINDBODY_SITE_ID,
      apiUrl: MINDBODY_API_URL,
    },
    tests: {}
  }
  
  // Test 1: Get token
  try {
    const tokenResponse = await fetch(`${MINDBODY_API_URL}/usertoken/issue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': MINDBODY_API_KEY!,
        'SiteId': MINDBODY_SITE_ID!,
      },
      body: JSON.stringify({
        Username: MINDBODY_USERNAME,
        Password: MINDBODY_PASSWORD,
      }),
    })
    
    const tokenText = await tokenResponse.text()
    let tokenData
    try {
      tokenData = JSON.parse(tokenText)
    } catch {
      tokenData = tokenText
    }
    
    results.tests = {
      ...results.tests as object,
      token: {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        ok: tokenResponse.ok,
        hasToken: !!tokenData.AccessToken,
      }
    }
    
    // Test 2: If token succeeded, try to get locations
    if (tokenResponse.ok && tokenData.AccessToken) {
      const locationsResponse = await fetch(`${MINDBODY_API_URL}/site/locations`, {
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': MINDBODY_API_KEY!,
          'SiteId': MINDBODY_SITE_ID!,
          'Authorization': `Bearer ${tokenData.AccessToken}`,
        },
      })
      
      const locationsData = await locationsResponse.json()
      
      results.tests = {
        ...results.tests as object,
        locations: {
          status: locationsResponse.status,
          ok: locationsResponse.ok,
          count: locationsData.Locations?.length || 0,
          data: locationsData.Locations?.map((l: { Id: number; Name: string }) => ({ Id: l.Id, Name: l.Name }))
        }
      }
      
      // Test 3: Get session types (services)
      const servicesResponse = await fetch(`${MINDBODY_API_URL}/site/sessiontypes?limit=200`, {
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': MINDBODY_API_KEY!,
          'SiteId': MINDBODY_SITE_ID!,
          'Authorization': `Bearer ${tokenData.AccessToken}`,
        },
      })
      
      const servicesData = await servicesResponse.json()
      const sessionTypes = servicesData.SessionTypes || []
      
      results.tests = {
        ...results.tests as object,
        sessionTypes: {
          status: servicesResponse.status,
          ok: servicesResponse.ok,
          totalCount: sessionTypes.length,
          bookableCount: sessionTypes.filter((s: { Bookable: boolean; Active: boolean }) => s.Bookable && s.Active).length,
          categories: [...new Set(sessionTypes.map((s: { Category: string }) => s.Category))],
          sample: sessionTypes.slice(0, 3).map((s: { Id: number; Name: string; Category: string; Bookable: boolean; Active: boolean }) => ({
            Id: s.Id,
            Name: s.Name,
            Category: s.Category,
            Bookable: s.Bookable,
            Active: s.Active
          }))
        }
      }
    }
    
  } catch (error) {
    results.tests = {
      ...results.tests as object,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      }
    }
  }
  
  return NextResponse.json(results)
}
