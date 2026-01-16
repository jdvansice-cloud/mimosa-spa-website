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

  console.log('Auth callback received:', { code: !!code, clientId, next })

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      console.log('Auth successful for user:', data.user.id, data.user.email)

      // Successfully authenticated
      // Save Mindbody client ID to Supabase profiles table
      if (clientId) {
        const clientIdNum = parseInt(clientId, 10)
        console.log('Parsed clientId:', clientIdNum, 'from', clientId)

        if (!isNaN(clientIdNum) && clientIdNum > 0) {
          // UPSERT the user's profile with the Mindbody client ID
          // This ensures the profile exists and has the client ID
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { error: upsertError } = await (supabase as any)
            .from('profiles')
            .upsert({
              id: data.user.id,
              mindbody_client_id: clientIdNum,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'id'
            })

          if (upsertError) {
            console.error('Failed to save Mindbody client ID to profile:', upsertError)

            // Try a simple insert if upsert fails (profile might not exist)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error: insertError } = await (supabase as any)
              .from('profiles')
              .insert({
                id: data.user.id,
                mindbody_client_id: clientIdNum,
                updated_at: new Date().toISOString()
              })

            if (insertError && insertError.code !== '23505') { // Ignore duplicate key errors
              console.error('Failed to insert profile:', insertError)
            } else if (!insertError) {
              console.log('Inserted new profile with Mindbody client ID:', clientIdNum)
            }
          } else {
            console.log('Upserted Mindbody client ID to profile:', clientIdNum)
          }
        }
      } else {
        console.warn('No clientId provided in auth callback')
      }

      // Redirect to portal with client ID in the URL for the store to pick up
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      // Build redirect URL with clientId if present
      let redirectUrl = next
      if (clientId) {
        redirectUrl = `${next}?clientId=${clientId}`
      }

      console.log('Redirecting to:', redirectUrl)

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${redirectUrl}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${redirectUrl}`)
      } else {
        return NextResponse.redirect(`${origin}${redirectUrl}`)
      }
    } else {
      console.error('Auth exchange failed:', error)
    }
  }

  // Auth failed - redirect to login with error
  return NextResponse.redirect(
    `${origin}/${locale}/portal/login?error=${encodeURIComponent('Error al verificar el enlace. Por favor intenta de nuevo.')}`
  )
}
