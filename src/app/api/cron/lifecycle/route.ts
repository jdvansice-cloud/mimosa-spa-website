import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getClients, getClientVisits } from '@/lib/booking/mindbody'
import { sendWelcome, sendFirstVisitThanks, sendBirthday, isWatiConfigured } from '@/lib/booking/wati'
import { sendEmail, isEmailConfigured } from '@/lib/email/resend'
import { welcomeEmail, firstVisitEmail, birthdayEmail } from '@/lib/email/templates/lifecycle'

// Mindbody stores phones loosely; WATI wants country code + number, no '+'.
function normalizePhoneForWati(phone: string | null | undefined): string | null {
  const digits = (phone || '').replace(/\D/g, '')
  if (digits.length === 8) return `507${digits}`
  if (digits.length >= 10) return digits
  return null
}

const WELCOME_CAP = 30
const BIRTHDAY_CAP = 50
const FIRST_VISIT_CAP = 20
const BACKFILL_PAGES_PER_RUN = 5
const PAGE = 200

interface LedgerChannels { wa: boolean; email: boolean }

/**
 * GET /api/cron/lifecycle — daily relationship notifications.
 *
 * 1. Client sync: incremental (LastModifiedDate) + rolling full backfill so
 *    mb_clients mirrors Mindbody (needed because Mindbody can't filter by
 *    birthdate).
 * 2. Welcome: clients created in the last 3 days → bienvenida (WA + email).
 * 3. First-visit thanks: bookings completed in the last 3 days whose client
 *    has no earlier Mindbody visit → gracias + Google review ask.
 * 4. Birthday: mb_clients whose birth month/day is today (Panama) → felicitación.
 *
 * Every send is guarded by the lifecycle_notifications once-only ledger.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Insert-once claim: returns true only for the run that wins the row.
  const claimOnce = async (
    clientKey: string,
    kind: 'welcome' | 'first_visit' | 'birthday',
    year: number
  ): Promise<boolean> => {
    const { data } = await supabase
      .from('lifecycle_notifications')
      .upsert(
        { client_key: clientKey, kind, year },
        { onConflict: 'client_key,kind,year', ignoreDuplicates: true }
      )
      .select('id')
    return !!data && data.length > 0
  }

  const recordChannels = async (clientKey: string, kind: string, year: number, ch: LedgerChannels) => {
    await supabase
      .from('lifecycle_notifications')
      .update({ channel_wa: ch.wa, channel_email: ch.email })
      .eq('client_key', clientKey)
      .eq('kind', kind)
      .eq('year', year)
  }

  const now = new Date()
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)

  // ========== 1a. Incremental client sync ==========
  let syncedClients = 0
  try {
    let offset = 0
    while (true) {
      const { clients, pagination } = await getClients({
        lastModifiedDate: threeDaysAgo.toISOString(),
        limit: PAGE,
        offset,
      })
      if (clients.length > 0) {
        const rows = clients.map(c => ({
          id: String(c.Id),
          first_name: c.FirstName,
          last_name: c.LastName,
          email: c.Email,
          phone: c.MobilePhone,
          birth_date: c.BirthDate ? c.BirthDate.slice(0, 10) : null,
          creation_date: c.CreationDate,
          updated_at: new Date().toISOString(),
        }))
        await supabase.from('mb_clients').upsert(rows, { onConflict: 'id' })
        syncedClients += rows.length
      }
      const total = pagination?.TotalResults ?? clients.length
      offset += PAGE
      if (offset >= total || clients.length < PAGE) break
    }
  } catch (err) {
    console.error('Incremental client sync failed:', err)
  }

  // ========== 1b. Rolling full backfill (birthday coverage) ==========
  let backfilled = 0
  let backfillDone = false
  try {
    const { data: stateRow } = await supabase
      .from('lifecycle_state')
      .select('value')
      .eq('key', 'client_backfill')
      .maybeSingle()
    const state = (stateRow?.value as { offset?: number; done?: boolean } | null) || {}
    backfillDone = !!state.done
    if (!backfillDone) {
      let offset = state.offset ?? 0
      for (let page = 0; page < BACKFILL_PAGES_PER_RUN; page++) {
        const { clients, pagination } = await getClients({ limit: PAGE, offset })
        if (clients.length > 0) {
          const rows = clients.map(c => ({
            id: String(c.Id),
            first_name: c.FirstName,
            last_name: c.LastName,
            email: c.Email,
            phone: c.MobilePhone,
            birth_date: c.BirthDate ? c.BirthDate.slice(0, 10) : null,
            creation_date: c.CreationDate,
            updated_at: new Date().toISOString(),
          }))
          await supabase.from('mb_clients').upsert(rows, { onConflict: 'id' })
          backfilled += rows.length
        }
        const total = pagination?.TotalResults ?? 0
        offset += PAGE
        if (offset >= total || clients.length < PAGE) {
          backfillDone = true
          break
        }
      }
      await supabase.from('lifecycle_state').upsert(
        { key: 'client_backfill', value: { offset, done: backfillDone }, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      )
    }
  } catch (err) {
    console.error('Client backfill failed:', err)
  }

  // ========== 2. Welcome (new clients, last 3 days) ==========
  let welcomesSent = 0
  {
    const { data: fresh } = await supabase
      .from('mb_clients')
      .select('id, first_name, email, phone')
      .gte('creation_date', threeDaysAgo.toISOString())
      .limit(200)
    for (const c of fresh || []) {
      if (welcomesSent >= WELCOME_CAP) break
      const clientId = c.id as string
      const name = (c.first_name as string | null)?.trim()
      const phone = normalizePhoneForWati(c.phone as string | null)
      const email = (c.email as string | null)?.trim() || null
      if (!name || (!phone && !email)) continue
      if (!(await claimOnce(clientId, 'welcome', 0))) continue

      const ch: LedgerChannels = { wa: false, email: false }
      if (phone && isWatiConfigured()) {
        const r = await sendWelcome({ clientName: name, clientPhone: phone })
        ch.wa = !!r.result
        if (!r.result) console.error(`Welcome WA failed for ${clientId}:`, JSON.stringify(r).slice(0, 200))
      }
      if (email && isEmailConfigured()) {
        const mail = welcomeEmail({ clientName: name })
        const r = await sendEmail({ to: email, subject: mail.subject, html: mail.html, kind: 'relation' })
        ch.email = r.ok
        if (!r.ok) console.error(`Welcome email failed for ${clientId}:`, r.error)
      }
      await recordChannels(clientId, 'welcome', 0, ch)
      if (ch.wa || ch.email) welcomesSent++
    }
  }

  // ========== 3. First-visit thanks ==========
  let firstVisitsSent = 0
  {
    const { data: recentDone } = await supabase
      .from('bookings')
      .select('mindbody_client_id, client_name, client_email, client_phone, location_id, appointment_start')
      .eq('status', 'completed')
      .gte('appointment_start', threeDaysAgo.toISOString())
      .order('appointment_start', { ascending: true })
      .limit(200)

    const seen = new Set<string>()
    for (const b of recentDone || []) {
      if (firstVisitsSent >= FIRST_VISIT_CAP) break
      const clientId = String(b.mindbody_client_id)
      if (!clientId || clientId === 'null' || seen.has(clientId)) continue
      seen.add(clientId)

      // Verify against Mindbody that this really was their FIRST visit —
      // our bookings table only goes back to when ingestion started.
      try {
        const { visits, pagination } = await getClientVisits({
          clientId,
          startDate: '2020-01-01',
          endDate: new Date(new Date(b.appointment_start as string).getTime() - 12 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 10),
        })
        const priorVisits = pagination?.TotalResults ?? visits.length
        if (priorVisits > 0) continue
      } catch (err) {
        console.error(`Visit check failed for client ${clientId} — skipping:`, err)
        continue
      }

      const name = (b.client_name as string | null)?.trim()?.split(/\s+/)[0]
      const phone = normalizePhoneForWati(b.client_phone as string | null)
      const email = (b.client_email as string | null)?.trim() || null
      if (!name || (!phone && !email)) continue
      if (!(await claimOnce(clientId, 'first_visit', 0))) continue

      const ch: LedgerChannels = { wa: false, email: false }
      if (phone && isWatiConfigured()) {
        const r = await sendFirstVisitThanks({ clientName: name, clientPhone: phone })
        ch.wa = !!r.result
        if (!r.result) console.error(`First-visit WA failed for ${clientId}:`, JSON.stringify(r).slice(0, 200))
      }
      if (email && isEmailConfigured()) {
        const mail = firstVisitEmail({ clientName: name, locationId: b.location_id as number | null })
        const r = await sendEmail({ to: email, subject: mail.subject, html: mail.html, kind: 'relation' })
        ch.email = r.ok
        if (!r.ok) console.error(`First-visit email failed for ${clientId}:`, r.error)
      }
      await recordChannels(clientId, 'first_visit', 0, ch)
      if (ch.wa || ch.email) firstVisitsSent++
    }
  }

  // ========== 4. Birthdays (today, Panama time) ==========
  let birthdaysSent = 0
  {
    const panama = new Date(now.toLocaleString('en-US', { timeZone: 'America/Panama' }))
    const year = panama.getFullYear()
    const birthMd = (panama.getMonth() + 1) * 100 + panama.getDate()
    const { data: bdays } = await supabase
      .from('mb_clients')
      .select('id, first_name, email, phone')
      .eq('birth_md', birthMd)
      .limit(200)
    for (const c of bdays || []) {
      if (birthdaysSent >= BIRTHDAY_CAP) break
      const clientId = c.id as string
      const name = (c.first_name as string | null)?.trim()
      const phone = normalizePhoneForWati(c.phone as string | null)
      const email = (c.email as string | null)?.trim() || null
      if (!name || (!phone && !email)) continue
      if (!(await claimOnce(clientId, 'birthday', year))) continue

      const ch: LedgerChannels = { wa: false, email: false }
      if (phone && isWatiConfigured()) {
        const r = await sendBirthday({ clientName: name, clientPhone: phone })
        ch.wa = !!r.result
        if (!r.result) console.error(`Birthday WA failed for ${clientId}:`, JSON.stringify(r).slice(0, 200))
      }
      if (email && isEmailConfigured()) {
        const mail = birthdayEmail({ clientName: name })
        const r = await sendEmail({ to: email, subject: mail.subject, html: mail.html, kind: 'relation' })
        ch.email = r.ok
        if (!r.ok) console.error(`Birthday email failed for ${clientId}:`, r.error)
      }
      await recordChannels(clientId, 'birthday', year, ch)
      if (ch.wa || ch.email) birthdaysSent++
    }
  }

  return NextResponse.json({
    syncedClients,
    backfilled,
    backfillDone,
    welcomesSent,
    firstVisitsSent,
    birthdaysSent,
  })
}
