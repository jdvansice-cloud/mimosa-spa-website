import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const clientId = searchParams.get('clientId')
  const next = searchParams.get('next') ?? '/portal'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Successfully authenticated
      // Redirect to portal with client ID in the URL for the store to pick up
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      // Build redirect URL with clientId if present
      let redirectUrl = next
      if (clientId) {
        redirectUrl = `${next}?clientId=${clientId}`
      }

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${redirectUrl}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${redirectUrl}`)
      } else {
        return NextResponse.redirect(`${origin}${redirectUrl}`)
      }
    }
  }

  // Auth failed - redirect to login with error
  return NextResponse.redirect(
    `${origin}/portal/login?error=${encodeURIComponent('Error al verificar el enlace. Por favor intenta de nuevo.')}`
  )
}
