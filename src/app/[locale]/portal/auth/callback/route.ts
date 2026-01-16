import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const clientId = searchParams.get('clientId')
  const next = searchParams.get('next') ?? `/${locale}/portal`

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Successfully authenticated
      // Save Mindbody client ID to Supabase profiles table
      if (clientId) {
        const clientIdNum = parseInt(clientId, 10)
        if (!isNaN(clientIdNum) && clientIdNum > 0) {
          // Update the user's profile with the Mindbody client ID
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { error: updateError } = await (supabase as any)
            .from('profiles')
            .update({ mindbody_client_id: clientIdNum })
            .eq('id', data.user.id)

          if (updateError) {
            console.error('Failed to save Mindbody client ID to profile:', updateError)
          } else {
            console.log('Saved Mindbody client ID to profile:', clientIdNum)
          }
        }
      }

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
    `${origin}/${locale}/portal/login?error=${encodeURIComponent('Error al verificar el enlace. Por favor intenta de nuevo.')}`
  )
}
