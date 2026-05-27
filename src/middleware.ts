import { NextResponse, type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { routing } from './i18n/routing'
import { updateSession } from './lib/supabase/middleware'

// Create the intl middleware
const intlMiddleware = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for API routes and static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.includes('.')
  ) {
    if (pathname.startsWith('/api/portal')) {
      return await updateSession(request)
    }
    return NextResponse.next()
  }

  // Admin login page: pass through without locale prefix or role check
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Appointment result page (linked from WhatsApp reminders): no locale prefix
  if (pathname.startsWith('/cita/')) {
    return NextResponse.next()
  }

  // Protect admin routes: require a valid session with role=admin
  if (pathname.startsWith('/admin')) {
    let response = NextResponse.next({ request })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) => {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            response = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Verify admin role using only the always-present `role` column,
    // so login keeps working even before later migrations are applied.
    const { data: roleRow } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single() as { data: { role: string } | null; error: unknown }

    if (!roleRow || roleRow.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Optionally load gift_card_location_config_id (introduced in 20260516).
    // Tolerate the column not existing — the location-restriction feature
    // simply stays inactive until the migration is applied.
    let locationConfigId: string | null = null
    const locResult = await supabase
      .from('profiles')
      .select('gift_card_location_config_id')
      .eq('id', user.id)
      .maybeSingle() as {
        data: { gift_card_location_config_id: string | null } | null
        error: unknown
      }
    if (locResult.data && !locResult.error) {
      locationConfigId = locResult.data.gift_card_location_config_id ?? null
    }

    // Location-restricted admins are locked to the gift-card area.
    // Allowed: /admin/giftcards/issue, /admin/giftcards/issued, /admin/giftcards/issued/[id]/print.
    // Anything else under /admin (including /admin itself and /admin/giftcards hub) → redirect to issue.
    if (locationConfigId) {
      const allowed =
        pathname === '/admin/giftcards/issue' ||
        pathname === '/admin/giftcards/issued' ||
        /^\/admin\/giftcards\/issued\/[^/]+\/print$/.test(pathname)

      if (!allowed) {
        return NextResponse.redirect(new URL('/admin/giftcards/issue', request.url))
      }
    }

    return response
  }

  // First, refresh Supabase session (this is critical for keeping users logged in)
  const supabaseResponse = await updateSession(request)

  // Then apply intl middleware
  const intlResponse = intlMiddleware(request)

  // Merge the cookies from supabase response into intl response
  if (supabaseResponse.cookies) {
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      intlResponse.cookies.set(cookie.name, cookie.value, {
        ...cookie,
      })
    })
  }

  return intlResponse
}

export const config = {
  // Match all pathnames
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
