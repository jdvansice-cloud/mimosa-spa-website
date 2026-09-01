import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getGiftCardAdminContext } from '@/lib/giftcards/auth'

/**
 * GET /api/admin/clients?q=… — typeahead over the local Mindbody client
 * mirror (mb_clients, kept fresh by the lifecycle cron + KPI sync).
 *
 * Local on purpose: the Mindbody search API is far too slow for keystroke
 * lookups, and 26k rows with trigram-friendly ilike come back instantly.
 */

/** PostgREST `or` values are comma-separated; a comma would split the filter. */
const esc = (v: string) => v.replace(/[,()]/g, ' ')

export async function GET(request: NextRequest) {
  const ctx = await getGiftCardAdminContext()
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const q = (request.nextUrl.searchParams.get('q') || '').trim()
  if (q.length < 2) return NextResponse.json({ data: [] })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Every word must match somewhere: "ana rodri" finds Ana Rodríguez without
  // requiring the words to sit in the same column.
  let query = supabase
    .from('mb_clients')
    .select('id, first_name, last_name, email, phone')
  for (const word of q.split(/\s+/).slice(0, 4)) {
    const needle = `%${esc(word)}%`
    query = query.or(
      `first_name.ilike.${needle},last_name.ilike.${needle},email.ilike.${needle},phone.ilike.${needle}`
    )
  }

  const { data, error } = await query.order('first_appointment_date', { ascending: false, nullsFirst: false }).limit(20)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data: data ?? [] })
}
