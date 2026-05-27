import { createClient as createServerSupabaseClient } from '@/lib/supabase/server'

export interface GiftCardAdminContext {
  userId: string
  email: string | null
  /** null = super admin. Otherwise the UUID of the gift_card_serial_config row this user is locked to. */
  locationConfigId: string | null
}

/**
 * Resolve the calling user's gift-card admin context from the session cookie.
 * Returns null if there's no session, no profile, or the profile isn't an admin.
 */
export async function getGiftCardAdminContext(): Promise<GiftCardAdminContext | null> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, gift_card_location_config_id')
    .eq('id', user.id)
    .single<{ role: string; gift_card_location_config_id: string | null }>()

  if (!profile || profile.role !== 'admin') return null

  return {
    userId: user.id,
    email: user.email ?? null,
    locationConfigId: profile.gift_card_location_config_id ?? null,
  }
}
