import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Service role client bypasses RLS for profile operations
function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createServiceClient(supabaseUrl, supabaseServiceKey)
}

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
      // Save Mindbody client ID to Supabase profiles table using service role (bypasses RLS)
      if (clientId) {
        const clientIdNum = parseInt(clientId, 10)
        console.log('Parsed clientId:', clientIdNum, 'from', clientId)

        if (!isNaN(clientIdNum) && clientIdNum > 0) {
          try {
            // Use service role client to bypass RLS policies
            const serviceClient = getServiceClient()

            // UPSERT the user's profile with the Mindbody client ID
            const { error: upsertError } = await serviceClient
              .from('profiles')
              .upsert({
                id: data.user.id,
                email: data.user.email,
                mindbody_client_id: clientIdNum,
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'id'
              })

            if (upsertError) {
              console.error('Failed to upsert profile:', upsertError)
            } else {
              console.log('Successfully saved Mindbody client ID to profile:', clientIdNum)
            }
          } catch (err) {
            console.error('Error saving profile:', err)
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
