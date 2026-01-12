import { NextResponse } from 'next/server'

// GET /api/mindbody/test - Test Mindbody API connection
export async function GET() {
  const MINDBODY_API_KEY = process.env.MINDBODY_API_KEY
  const MINDBODY_SITE_ID = process.env.MINDBODY_SITE_ID
  const MINDBODY_API_URL = process.env.MINDBODY_API_URL || 'https://api.mindbodyonline.com/public/v6'
  
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
        Username: '_mindbody_api',
        Password: '_mindbody_api',
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
        data: tokenData,
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
      
      const locationsText = await locationsResponse.text()
      let locationsData
      try {
        locationsData = JSON.parse(locationsText)
      } catch {
        locationsData = locationsText
      }
      
      results.tests = {
        ...results.tests as object,
        locations: {
          status: locationsResponse.status,
          ok: locationsResponse.ok,
          data: locationsData,
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
