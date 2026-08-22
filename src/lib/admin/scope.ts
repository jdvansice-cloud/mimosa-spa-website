import { createClient } from '@/lib/supabase/server'

export interface AdminScope {
  isLocationRestricted: boolean
  locationName: string | null
  isMobileManager: boolean
}

const NO_SCOPE: AdminScope = {
  isLocationRestricted: false,
  locationName: null,
  isMobileManager: false,
}

/**
 * Resolve the logged-in user's admin scope (location-restricted or
 * Mobile-Manager-only) from the session cookie.
 *
 * Returns the unrestricted scope when there's no session — the client-side
 * ProtectedRoute is what actually gates access.
 */
export async function getAdminScope(): Promise<AdminScope> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NO_SCOPE

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, gift_card_location_config_id')
      .eq('id', user.id)
      .single<{ role: string; gift_card_location_config_id: string | null }>()

    if (profile?.role === 'mobile_manager') {
      return { ...NO_SCOPE, isMobileManager: true }
    }

    if (!profile?.gift_card_location_config_id) {
      return NO_SCOPE
    }

    const { data: config } = await supabase
      .from('gift_card_serial_config')
      .select('location_name')
      .eq('id', profile.gift_card_location_config_id)
      .single<{ location_name: string }>()

    return {
      isLocationRestricted: true,
      locationName: config?.location_name ?? null,
      isMobileManager: false,
    }
  } catch {
    return NO_SCOPE
  }
}
