/**
 * Phase 0 spike: verify Mindbody checkout mechanics before building the
 * unified-checkout order engine. Read-only against production unless noted;
 * all writes go to the public sandbox (SiteId -99, reset nightly) or use
 * Test:true (validates without committing).
 *
 * Run:  node --env-file=.env.local scripts/spikes/mb-checkout-spike.mjs <step>
 * Steps:
 *   sandbox-recon      list sandbox locations/session types/staff/tenders
 *   sandbox-book       book an appointment in the sandbox (returns id)
 *   sandbox-checkout   checkout that appointment (Cash) and read the sale back
 *                      -> answers the location-98 attribution question
 *   sandbox-giftcard   purchasegiftcard with a custom BarcodeId
 *   prod-tenders       (prod, read-only) list custom payment methods + GC products
 *   prod-test-checkout (prod, Test:true — validates, commits nothing) preflight a
 *                      cart with a Custom web tender to read server-computed totals
 */

const PROD = {
  apiKey: process.env.MINDBODY_API_KEY,
  siteId: process.env.MINDBODY_SITE_ID,
  user: process.env.MINDBODY_USERNAME || '_mindbody_api',
  pass: process.env.MINDBODY_PASSWORD || '_mindbody_api',
}
// Public sandbox credentials are published in Mindbody's developer FAQ.
const SANDBOX = { apiKey: PROD.apiKey, siteId: '-99', user: 'Siteowner', pass: 'apitest1234' }
const SANDBOX_USER_FALLBACKS = [
  { user: 'Siteowner', pass: 'apitest1234' },
  { user: 'mindbodysandboxsite@gmail.com', pass: 'Apitest1234' },
  { user: '_mindbody_api', pass: '_mindbody_api' },
]

const BASE = process.env.MINDBODY_API_URL || 'https://api.mindbodyonline.com/public/v6'

async function issueToken(env) {
  const res = await fetch(`${BASE}/usertoken/issue`, {
    method: 'POST',
    headers: { 'Api-Key': env.apiKey, SiteId: env.siteId, 'Content-Type': 'application/json' },
    body: JSON.stringify({ Username: env.user, Password: env.pass }),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || !json.AccessToken) throw new Error(`token ${res.status}: ${JSON.stringify(json).slice(0, 300)}`)
  return json.AccessToken
}

async function tokenWithFallbacks(env) {
  if (env.siteId !== '-99') return issueToken(env)
  let lastErr
  for (const cred of SANDBOX_USER_FALLBACKS) {
    try {
      const t = await issueToken({ ...env, ...cred })
      console.log(`[auth] sandbox token issued as ${cred.user}`)
      return t
    } catch (e) { lastErr = e }
  }
  throw lastErr
}

async function mb(env, token, path, { method = 'GET', params, body } = {}) {
  const url = new URL(`${BASE}${path}`)
  if (params) for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v))
  const res = await fetch(url, {
    method,
    headers: {
      'Api-Key': env.apiKey, SiteId: env.siteId, Authorization: `Bearer ${token}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await res.json().catch(() => ({}))
  return { status: res.status, json }
}

const show = (label, obj) => console.log(`\n=== ${label} ===\n${JSON.stringify(obj, null, 2).slice(0, 4000)}`)

const step = process.argv[2]
if (!step) { console.error('usage: node mb-checkout-spike.mjs <step>'); process.exit(1) }

if (step.startsWith('sandbox')) {
  const env = SANDBOX
  const token = await tokenWithFallbacks(env)

  if (step === 'sandbox-recon') {
    const locations = await mb(env, token, '/site/locations')
    show('locations', locations.json.Locations?.map(l => ({ Id: l.Id, Name: l.Name })))
    const st = await mb(env, token, '/site/sessiontypes', { params: { limit: 200 } })
    show('appointment session types', st.json.SessionTypes?.filter(s => s.Type === 'Appointment').slice(0, 20)
      .map(s => ({ Id: s.Id, Name: s.Name, DefaultTimeLength: s.DefaultTimeLength, ProgramId: s.ProgramId })))
    const staff = await mb(env, token, '/staff/staff', { params: { limit: 100 } })
    show('staff (appointment-capable)', staff.json.StaffMembers?.filter(s => s.AppointmentInstructor || s.IndependentContractor || true).slice(0, 12)
      .map(s => ({ Id: s.Id, Name: `${s.FirstName} ${s.LastName}` })))
    const tenders = await mb(env, token, '/sale/custompaymentmethods')
    show('custom payment methods', tenders.json)
    const gc = await mb(env, token, '/sale/giftcards', { params: { soldOnline: false } })
    show('gift card products', gc.json.GiftCards?.slice(0, 8))
    const clients = await mb(env, token, '/client/clients', { params: { limit: 5 } })
    show('sample clients', clients.json.Clients?.slice(0, 5).map(c => ({ Id: c.Id, UniqueId: c.UniqueId, Name: `${c.FirstName} ${c.LastName}` })))
  }

  if (step === 'sandbox-book') {
    const [clientId, sessionTypeId, staffId, locationId, startDateTime] = process.argv.slice(3)
    if (!clientId || !sessionTypeId || !staffId || !locationId || !startDateTime) {
      // Discover a bookable slot first
      const st = await mb(env, token, '/site/sessiontypes', { params: { limit: 200 } })
      const apptTypes = st.json.SessionTypes?.filter(s => s.Type === 'Appointment') ?? []
      for (const t of apptTypes.slice(0, 6)) {
        const bi = await mb(env, token, '/appointment/bookableitems', {
          params: { sessionTypeIds: t.Id, startDate: new Date().toISOString().slice(0, 10), endDate: new Date(Date.now() + 5 * 864e5).toISOString().slice(0, 10) },
        })
        const avail = bi.json.Availabilities?.[0]
        if (avail) {
          show(`bookable via sessionType ${t.Id} (${t.Name})`, {
            SessionTypeId: t.Id, StaffId: avail.Staff?.Id, LocationId: avail.Location?.Id,
            StartDateTime: avail.StartDateTime, BookableEndDateTime: avail.EndDateTime,
          })
          console.log(`\nrun: node --env-file=.env.local scripts/spikes/mb-checkout-spike.mjs sandbox-book <clientId> ${t.Id} ${avail.Staff?.Id} ${avail.Location?.Id} "${avail.StartDateTime}"`)
          process.exit(0)
        }
      }
      console.log('No bookable availabilities found in the next 5 days; sandbox schedule may be empty.')
      process.exit(0)
    }
    const r = await mb(env, token, '/appointment/addappointment', {
      method: 'POST',
      body: { ClientId: clientId, SessionTypeId: Number(sessionTypeId), StaffId: Number(staffId), LocationId: Number(locationId), StartDateTime: startDateTime, Notes: 'mimosa spike' },
    })
    show(`addappointment -> ${r.status}`, r.json)
  }

  if (step === 'sandbox-checkout') {
    const [clientId, appointmentId, pricingOptionId, locationId] = process.argv.slice(3)
    if (!clientId || !appointmentId || !pricingOptionId) {
      console.log('usage: sandbox-checkout <clientId> <appointmentId> <pricingOptionId> [locationId]')
      console.log('find pricing options: GET /sale/services?sessionTypeId=X — run sandbox-recon or pass one you know')
      process.exit(1)
    }
    const cart = {
      ClientId: clientId,
      Items: [{ Item: { Type: 'Service', Metadata: { Id: Number(pricingOptionId) } }, Quantity: 1, AppointmentIds: [Number(appointmentId)] }],
      Payments: [{ Type: 'Cash', Metadata: { Amount: 0 } }],
      InStore: true,
      ...(locationId ? { LocationId: Number(locationId) } : {}),
      SendEmail: false,
    }
    // 1) Test:true preflight to get server-computed total
    const pre = await mb(env, token, '/sale/checkoutshoppingcart', { method: 'POST', body: { ...cart, Test: true } })
    show(`preflight (Test:true) -> ${pre.status}`, {
      SubTotal: pre.json.ShoppingCart?.SubTotal, TaxTotal: pre.json.ShoppingCart?.TaxTotal,
      GrandTotal: pre.json.ShoppingCart?.GrandTotal, Error: pre.json.Error,
    })
    const grand = pre.json.ShoppingCart?.GrandTotal
    if (typeof grand !== 'number') process.exit(1)
    // 2) real checkout paying the exact computed total in Cash
    cart.Payments[0].Metadata.Amount = grand
    const r = await mb(env, token, '/sale/checkoutshoppingcart', { method: 'POST', body: { ...cart, Test: false } })
    show(`checkout -> ${r.status}`, { SaleId: r.json.ShoppingCart?.SaleId, GrandTotal: r.json.ShoppingCart?.GrandTotal, Error: r.json.Error })
    const saleId = r.json.ShoppingCart?.SaleId
    if (!saleId) process.exit(1)
    // 3) read the sale back — THE location-attribution answer
    const today = new Date().toISOString().slice(0, 10)
    const sales = await mb(env, token, '/sale/sales', { params: { startSaleDateTime: today, limit: 200 } })
    const sale = sales.json.Sales?.find(s => s.Id === saleId)
    show('sale readback (LOCATION ATTRIBUTION)', sale ? {
      Id: sale.Id, LocationId: sale.LocationId, SaleDateTime: sale.SaleDateTime,
      Payments: sale.Payments?.map(p => ({ Type: p.Type, Amount: p.Amount })),
      Items: sale.PurchasedItems?.map(i => ({ Description: i.Description, TotalAmount: i.TotalAmount, TaxAmount: i.TaxAmount })),
    } : { note: 'sale not found in readback window', saleId })
  }

  if (step === 'sandbox-giftcard') {
    const [clientId, giftCardProductId, salePrice] = process.argv.slice(3)
    if (!clientId || !giftCardProductId) { console.log('usage: sandbox-giftcard <clientId> <giftCardProductId> [salePrice]'); process.exit(1) }
    const customBarcode = `MWTEST${Date.now().toString().slice(-6)}`
    const r = await mb(env, token, '/sale/purchasegiftcard', {
      method: 'POST',
      body: {
        Test: false, LocationId: 1, GiftCardId: Number(giftCardProductId), PurchaserClientId: clientId,
        BarcodeId: customBarcode, SendEmailReceipt: false,
        PaymentInfo: { Type: 'Cash', Metadata: { Amount: Number(salePrice ?? 100) } },
      },
    })
    show(`purchasegiftcard (requested BarcodeId=${customBarcode}) -> ${r.status}`, r.json)
    if (r.json.BarcodeId) {
      const bal = await mb(env, token, '/sale/giftcardbalance', { params: { barcodeId: r.json.BarcodeId } })
      show('balance readback', bal.json)
      console.log(`\nCustom BarcodeId honored: ${r.json.BarcodeId === customBarcode}`)
    }
  }
}

if (step === 'prod-tenders') {
  const token = await issueToken(PROD)
  const tenders = await mb(PROD, token, '/sale/custompaymentmethods')
  show('PRODUCTION custom payment methods', tenders.json)
  const gc = await mb(PROD, token, '/sale/giftcards', { params: { soldOnline: false } })
  show('PRODUCTION gift card products', gc.json.GiftCards?.map(g => ({ Id: g.Id, Name: g.Name, CardValue: g.CardValue, SalePrice: g.SalePrice })))
}

if (step === 'prod-test-checkout') {
  // Test:true — Mindbody validates and computes totals but commits NOTHING.
  const [clientId, pricingOptionId, tenderId, locationId] = process.argv.slice(3)
  if (!clientId || !pricingOptionId || !tenderId) {
    console.log('usage: prod-test-checkout <clientId> <pricingOptionId> <customTenderId> [locationId=1]')
    process.exit(1)
  }
  const token = await issueToken(PROD)
  const body = {
    ClientId: clientId, Test: true, InStore: true, LocationId: Number(locationId || 1), SendEmail: false,
    Items: [{ Item: { Type: 'Service', Metadata: { Id: Number(pricingOptionId) } }, Quantity: 1 }],
    Payments: [{ Type: 'Custom', Metadata: { Id: Number(tenderId), Amount: 0.01 } }],
  }
  const r = await mb(PROD, token, '/sale/checkoutshoppingcart', { method: 'POST', body })
  show(`PRODUCTION Test:true checkout -> ${r.status}`, {
    SubTotal: r.json.ShoppingCart?.SubTotal, TaxTotal: r.json.ShoppingCart?.TaxTotal,
    GrandTotal: r.json.ShoppingCart?.GrandTotal, Error: r.json.Error,
  })
  console.log('\nExpected: an amount-mismatch style error naming the exact GrandTotal (proves Custom tender accepted + totals validation), and NO committed sale.')
}
