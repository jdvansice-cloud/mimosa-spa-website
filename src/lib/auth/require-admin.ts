import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Validates that the current request is from an authenticated admin user.
 *
 * Reads the Supabase session from cookies (same mechanism the /admin
 * middleware uses) and checks that the user's profile has role = 'admin'.
 *
 * @returns `null` when authorized, or a `NextResponse` error (401/403) that
 *          the caller should return immediately when not authorized.
 *
 * Usage in a route handler:
 *   const denied = await requireAdmin()
 *   if (denied) return denied
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  return requireRole(['admin'])
}

/**
 * Access check for the Mobile Manager section (/admin/kpis*): full admins
 * and mobile_manager users are both allowed.
 */
export async function requireKpisAccess(): Promise<NextResponse | null> {
  return requireRole(['admin', 'mobile_manager'])
}

async function requireRole(roles: string[]): Promise<NextResponse | null> {
  let supabase
  try {
    supabase = await createClient()
  } catch {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single() as { data: { role: string } | null }

  if (!profile || !roles.includes(profile.role)) {
    return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
  }

  return null
}
