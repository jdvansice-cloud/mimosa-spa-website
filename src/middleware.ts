import { NextResponse, type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { updateSession } from './lib/supabase/middleware'

// Create the intl middleware
const intlMiddleware = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for API routes, static files, and admin routes
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.startsWith('/admin') ||
    pathname.includes('.')
  ) {
    // Still refresh Supabase session for API routes that need auth
    if (pathname.startsWith('/api/portal')) {
      return await updateSession(request)
    }
    return NextResponse.next()
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
