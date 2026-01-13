import { NextResponse } from 'next/server'

// GET /api/health - Check if all required services are configured
export async function GET() {
  const config = {
    mindbody: {
      apiKey: !!process.env.MINDBODY_API_KEY,
      siteId: !!process.env.MINDBODY_SITE_ID,
      // Show partial key for debugging (first 8 chars)
      apiKeyPrefix: process.env.MINDBODY_API_KEY?.substring(0, 8) || 'NOT_SET',
      siteIdValue: process.env.MINDBODY_SITE_ID || 'NOT_SET',
    },
    supabase: {
      url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    wati: {
      apiUrl: !!process.env.WATI_API_URL,
      accessToken: !!process.env.WATI_ACCESS_TOKEN,
    },
  }
  
  const allMindbodyConfigured = config.mindbody.apiKey && config.mindbody.siteId
  
  return NextResponse.json({
    status: allMindbodyConfigured ? 'ok' : 'misconfigured',
    message: allMindbodyConfigured 
      ? 'All required services configured' 
      : 'Missing required environment variables',
    config,
    timestamp: new Date().toISOString(),
  })
}
