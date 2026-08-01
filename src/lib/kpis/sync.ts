import { createClient } from '@supabase/supabase-js'
import { mindbodyRequest } from '@/lib/booking/mindbody'
import { LOCATION_IDS, PANAMA_TZ } from './constants'

// ===========================================
// Mindbody → Supabase sync for the KPI dashboard.
// Shared by /api/cron/sync-kpis (scheduled + backfill) and the
// admin "refresh now" endpoint.
// ===========================================

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

type Supabase = ReturnType<typeof serviceClient>

/** Today's date (YYYY-MM-DD) in Panama local time. */
export function panamaToday(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: PANAMA_TZ }).format(new Date())
}

/** Add days to a YYYY-MM-DD string. */
export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

// Mindbody puts a spurious 'Z' on SaleDateTime; times are actually site-local.
function localStamp(dt: string): string {
  return dt.replace(/Z$/, '')
}

// ===========================================
// SALES
// ===========================================

interface MbSaleItem {
  Id: number
  IsService: boolean
  Description: string | null
  CategoryId: number
  Quantity: number
  UnitPrice: number
  DiscountAmount: number
  TaxAmount: number
  TotalAmount: number
  Returned: boolean
}

interface MbSale {
  Id: number
  SaleDateTime: string
  ClientId: string | null
  SalesRepId: number | null
  LocationId: number
  PurchasedItems: MbSaleItem[] | null
  Payments: Array<{ Type: string; Amount: number }> | null
}

function isGiftCardPayment(type: string): boolean {
  const t = type.toLowerCase()
  return t.includes('gift')
}

// "Cortesía/Invitado" — comped, no money received
function isCompPayment(type: string): boolean {
  const t = type.toLowerCase()
  return t.includes('cortes') || t.includes('invitado')
}

interface SalesResponse {
  PaginationResponse?: { TotalResults: number }
  Sales: MbSale[]
}

/**
 * Classify a sale line item for the revenue mix.
 * Tips are excluded from net sales downstream; verified against live data
 * (tips arrive as items with Description "Tip").
 */
function bucketFor(item: MbSaleItem): 'tip' | 'giftcard' | 'service' | 'retail' {
  const desc = (item.Description || '').trim().toLowerCase()
  if (desc === 'tip' || desc === 'propina') return 'tip'
  if (desc.includes('gift card') || desc.includes('gift certificate')) return 'giftcard'
  if (item.IsService) return 'service'
  return 'retail'
}

export async function syncSales(startDate: string, endDate: string) {
  const supabase = serviceClient()
  const PAGE = 200
  let offset = 0
  const sales: MbSale[] = []

  while (true) {
    const res = await mindbodyRequest<SalesResponse>('/sale/sales', {
      params: {
        // NB: docs/libraries disagree on the name; live-tested — this works,
        // 'request.SaleStartDateTime' is silently ignored (returns today only).
        'request.startSaleDateTime': `${startDate}T00:00:00`,
        'request.endSaleDateTime': `${endDate}T23:59:59`,
        'request.limit': PAGE,
        'request.offset': offset,
      },
    })
    const page = res.Sales || []
    sales.push(...page)
    const total = res.PaginationResponse?.TotalResults ?? page.length
    offset += PAGE
    if (offset >= total || page.length < PAGE) break
  }

  const saleRows = sales.map(s => {
    const payments = s.Payments || []
    return {
      id: s.Id,
      sale_datetime: localStamp(s.SaleDateTime),
      sale_date: localStamp(s.SaleDateTime).slice(0, 10),
      // Rare sales arrive without a location (seen in Aug 2025 data); 0 = unknown,
      // still counted in the "all locations" totals.
      location_id: s.LocationId ?? 0,
      client_id: s.ClientId != null ? String(s.ClientId) : null,
      sales_rep_id: s.SalesRepId ?? null,
      payment_types: payments.map(p => p.Type),
      payments: payments.map(p => ({ type: p.Type, amount: p.Amount ?? 0 })),
      gc_paid: Math.round(payments.filter(p => isGiftCardPayment(p.Type)).reduce((sum, p) => sum + (p.Amount ?? 0), 0) * 100) / 100,
      comp_paid: Math.round(payments.filter(p => isCompPayment(p.Type)).reduce((sum, p) => sum + (p.Amount ?? 0), 0) * 100) / 100,
      total_paid: Math.round(payments.reduce((sum, p) => sum + (p.Amount ?? 0), 0) * 100) / 100,
      synced_at: new Date().toISOString(),
    }
  })

  const itemRows = sales.flatMap(s =>
    (s.PurchasedItems || []).map((it, i) => ({
      sale_id: s.Id,
      line_no: i,
      item_id: it.Id,
      description: it.Description,
      is_service: it.IsService,
      bucket: bucketFor(it),
      category_id: it.CategoryId,
      quantity: it.Quantity ?? 1,
      unit_price: it.UnitPrice ?? 0,
      discount_amount: it.DiscountAmount ?? 0,
      tax_amount: it.TaxAmount ?? 0,
      total_amount: it.TotalAmount ?? 0,
      returned: it.Returned ?? false,
    }))
  )

  for (const batch of chunk(saleRows, 500)) {
    const { error } = await supabase.from('mb_sales').upsert(batch)
    if (error) throw new Error(`mb_sales upsert: ${error.message}`)
  }
  // Replace items wholesale so edits/refunds in Mindbody are reflected
  for (const batch of chunk(saleRows.map(s => s.id), 500)) {
    const { error } = await supabase.from('mb_sale_items').delete().in('sale_id', batch)
    if (error) throw new Error(`mb_sale_items delete: ${error.message}`)
  }
  for (const batch of chunk(itemRows, 500)) {
    const { error } = await supabase.from('mb_sale_items').insert(batch)
    if (error) throw new Error(`mb_sale_items insert: ${error.message}`)
  }

  return { sales: saleRows.length, items: itemRows.length }
}

// ===========================================
// APPOINTMENTS
// ===========================================

interface MbAppointment {
  Id: number
  StartDateTime: string
  EndDateTime: string | null
  Duration: number | null
  Status: string
  LocationId: number
  StaffId: number | null
  Staff?: { Id: number; FirstName?: string; LastName?: string; DisplayName?: string } | null
  ClientId: string | null
  SessionTypeId: number | null
  FirstAppointment: boolean
  StaffRequested: boolean
}

interface AppointmentsResponse {
  PaginationResponse?: { TotalResults: number }
  Appointments: MbAppointment[]
}

export async function syncAppointments(startDate: string, endDate: string) {
  const supabase = serviceClient()
  const PAGE = 200
  const rows: Array<Record<string, unknown>> = []

  for (const locationId of LOCATION_IDS) {
    let offset = 0
    while (true) {
      const res = await mindbodyRequest<AppointmentsResponse>('/appointment/staffappointments', {
        params: { locationIds: [locationId], startDate, endDate, limit: PAGE, offset },
      })
      const page = res.Appointments || []
      for (const a of page) {
        // Prefer First + Last name — DisplayName is often just the first name
        const staffName =
          [a.Staff?.FirstName, a.Staff?.LastName].filter(Boolean).join(' ') ||
          a.Staff?.DisplayName ||
          null
        rows.push({
          id: a.Id,
          start_datetime: localStamp(a.StartDateTime),
          end_datetime: a.EndDateTime ? localStamp(a.EndDateTime) : null,
          duration_min: a.Duration ?? null,
          status: a.Status,
          location_id: a.LocationId ?? 0,
          staff_id: a.StaffId ?? a.Staff?.Id ?? null,
          staff_name: staffName,
          client_id: a.ClientId != null ? String(a.ClientId) : null,
          session_type_id: a.SessionTypeId ?? null,
          first_appointment: a.FirstAppointment ?? false,
          staff_requested: a.StaffRequested ?? false,
          synced_at: new Date().toISOString(),
        })
      }
      const total = res.PaginationResponse?.TotalResults ?? page.length
      offset += PAGE
      if (offset >= total || page.length < PAGE) break
    }
  }

  for (const batch of chunk(rows, 500)) {
    const { error } = await supabase.from('mb_appointments').upsert(batch)
    if (error) throw new Error(`mb_appointments upsert: ${error.message}`)
  }

  // Reconcile deletions: Mindbody drops cancelled appointments from the API
  // instead of returning them with a Cancelled status, so anything in the
  // window that the API no longer returns is a ghost and must go — otherwise
  // the Agenda over-counts vs the Mindbody app. Skipped when the fetch came
  // back empty, so a hiccup can never wipe history.
  let deleted = 0
  if (rows.length > 0) {
    const fetched = new Set(rows.map(r => r.id as number))
    const stale: number[] = []
    const DB_PAGE = 1000
    let from = 0
    while (true) {
      const { data: existing, error } = await supabase
        .from('mb_appointments')
        .select('id')
        .gte('start_datetime', `${startDate}T00:00:00`)
        .lte('start_datetime', `${endDate}T23:59:59`)
        .order('id', { ascending: true })
        .range(from, from + DB_PAGE - 1)
      if (error) throw new Error(`mb_appointments scan: ${error.message}`)
      for (const r of existing ?? []) if (!fetched.has(r.id as number)) stale.push(r.id as number)
      if (!existing || existing.length < DB_PAGE) break
      from += DB_PAGE
    }
    for (const batch of chunk(stale, 200)) {
      const { error } = await supabase.from('mb_appointments').delete().in('id', batch)
      if (error) throw new Error(`mb_appointments delete: ${error.message}`)
      deleted += batch.length
    }
  }

  return { appointments: rows.length, deleted }
}

// ===========================================
// CLIENTS
// ===========================================

interface MbClient {
  Id: string
  FirstName: string | null
  LastName: string | null
  CreationDate: string | null
  FirstAppointmentDate: string | null
  ReferredBy: string | null
}

interface ClientsResponse {
  PaginationResponse?: { TotalResults: number }
  Clients: MbClient[]
}

/** @param modifiedSince ISO date; omit for a full pull (backfill). */
export async function syncClients(modifiedSince?: string) {
  const supabase = serviceClient()
  const PAGE = 200
  let offset = 0
  let count = 0

  while (true) {
    const params: Record<string, string | number> = {
      'request.limit': PAGE,
      'request.offset': offset,
      'request.includeInactive': 'true',
    }
    if (modifiedSince) params['request.lastModifiedDate'] = `${modifiedSince}T00:00:00`

    const res = await mindbodyRequest<ClientsResponse>('/client/clients', { params })
    const page = res.Clients || []

    const rows = page.map(c => ({
      id: String(c.Id),
      first_name: c.FirstName || null,
      last_name: c.LastName || null,
      creation_date: c.CreationDate ? localStamp(c.CreationDate) : null,
      first_appointment_date: c.FirstAppointmentDate ? localStamp(c.FirstAppointmentDate) : null,
      referred_by: c.ReferredBy || null,
      synced_at: new Date().toISOString(),
    }))
    for (const batch of chunk(rows, 500)) {
      const { error } = await supabase.from('mb_clients').upsert(batch)
      if (error) throw new Error(`mb_clients upsert: ${error.message}`)
    }
    count += rows.length

    const total = res.PaginationResponse?.TotalResults ?? page.length
    offset += PAGE
    if (offset >= total || page.length < PAGE) break
  }

  return { clients: count }
}

// ===========================================
// SYNC STATE + ORCHESTRATION
// ===========================================

export async function getSyncState(supabase: Supabase, key: string): Promise<string | null> {
  const { data } = await supabase.from('kpi_sync_state').select('value').eq('key', key).maybeSingle()
  return (data?.value as { date?: string } | null)?.date ?? null
}

export async function setSyncState(supabase: Supabase, key: string, date: string) {
  const { error } = await supabase
    .from('kpi_sync_state')
    .upsert({ key, value: { date }, updated_at: new Date().toISOString() })
  if (error) throw new Error(`kpi_sync_state upsert: ${error.message}`)
}

/**
 * Refresh TODAY only — appointments AND sales (4–6 API calls, ~5 s) so the
 * Agenda tracks arrivals near-live and the sales report shows today's sales.
 * Skips when synced within the last `maxAgeMinutes` — called on entry and
 * every 5 minutes while a Mobile Manager page is open.
 */
export async function syncTodayAppointments(maxAgeMinutes = 5) {
  const supabase = serviceClient()
  const today = panamaToday()

  const { data } = await supabase
    .from('kpi_sync_state')
    .select('value, updated_at')
    .eq('key', 'today_appts_sync')
    .maybeSingle()
  const last = data?.updated_at ? Date.parse(data.updated_at as string) : 0
  if (Date.now() - last < maxAgeMinutes * 60_000) {
    return { skipped: true as const, lastSyncedAt: data?.updated_at as string }
  }

  const appts = await syncAppointments(today, today)
  const sales = await syncSales(today, today)
  const { error } = await supabase
    .from('kpi_sync_state')
    .upsert({ key: 'today_appts_sync', value: { date: today }, updated_at: new Date().toISOString() })
  if (error) throw new Error(`kpi_sync_state upsert: ${error.message}`)

  return { skipped: false as const, date: today, ...appts, ...sales }
}

/**
 * Incremental sync used by the hourly cron and the admin refresh button.
 * - Sales: from 2 days before the last sales sync (catches edits/refunds).
 * - Appointments: rolling window, 7 days back → 60 days ahead
 *   (keeps statuses fresh and feeds the pre-booked metric).
 * - Clients: modified since last client sync (1-day overlap).
 */
export async function runIncrementalSync() {
  const supabase = serviceClient()
  const today = panamaToday()

  const salesSince = (await getSyncState(supabase, 'sales_last_sync')) ?? addDays(today, -7)
  const clientsSince = (await getSyncState(supabase, 'clients_last_sync')) ?? addDays(today, -7)

  const sales = await syncSales(addDays(salesSince, -2), today)
  const appointments = await syncAppointments(addDays(today, -7), addDays(today, 60))
  const clients = await syncClients(addDays(clientsSince, -1))

  await setSyncState(supabase, 'sales_last_sync', today)
  await setSyncState(supabase, 'clients_last_sync', today)

  return { ...sales, ...appointments, ...clients, syncedAt: new Date().toISOString() }
}
