#!/usr/bin/env node
// ===========================================
// Mindbody Webhooks API — subscription management.
//
// Needs MINDBODY_WEBHOOK_API_KEY in .env.local: a SEPARATE key created in
// the Mindbody developer portal (API Credentials → API Keys → name it
// "Webhooks"). The Public API key does NOT work here.
//
//   node --env-file=.env.local scripts/mindbody-webhook.mjs list
//   node --env-file=.env.local scripts/mindbody-webhook.mjs create https://www.mimosaretreat.com/api/mindbody/webhook
//   node --env-file=.env.local scripts/mindbody-webhook.mjs activate <subscriptionId>
//   node --env-file=.env.local scripts/mindbody-webhook.mjs delete <subscriptionId>
//   node --env-file=.env.local scripts/mindbody-webhook.mjs metrics
//
// Flow: `create` returns a messageSignatureKey — put it in Vercel as
// MINDBODY_WEBHOOK_SIGNATURE_KEY and redeploy BEFORE `activate`, otherwise
// the receiver answers 503 and Mindbody keeps retrying.
// ===========================================

const BASE = 'https://mb-api.mindbodyonline.com/push/api/v1'
const EVENTS = [
  'appointmentBooking.created',
  'appointmentBooking.updated',
  'appointmentBooking.cancelled',
  'appointmentAddOn.created',
  'appointmentAddOn.deleted',
]

const key = process.env.MINDBODY_WEBHOOK_API_KEY
if (!key) {
  console.error('MINDBODY_WEBHOOK_API_KEY missing — create a "Webhooks" API key in the Mindbody developer portal and add it to .env.local')
  process.exit(1)
}

async function call(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Api-Key': key,
      'Content-Type': 'application/json',
      'User-Agent': 'mimosa-spa-website/1.0',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let json
  try { json = text ? JSON.parse(text) : null } catch { json = text }
  if (!res.ok) {
    console.error(`${method} ${path} → ${res.status}`)
    console.error(JSON.stringify(json, null, 2))
    process.exit(1)
  }
  return json
}

const [cmd, arg] = process.argv.slice(2)

switch (cmd) {
  case 'list': {
    console.log(JSON.stringify(await call('GET', '/subscriptions'), null, 2))
    break
  }
  case 'create': {
    if (!arg?.startsWith('https://')) {
      console.error('usage: create https://<host>/api/mindbody/webhook')
      process.exit(1)
    }
    const out = await call('POST', '/subscriptions', {
      eventIds: EVENTS,
      eventSchemaVersion: 1,
      referenceId: 'tv-agenda',
      webhookUrl: arg,
    })
    console.log(JSON.stringify(out, null, 2))
    console.log('\nNEXT: set MINDBODY_WEBHOOK_SIGNATURE_KEY to the messageSignatureKey above (Vercel + .env.local), redeploy, then run: activate <subscriptionId>')
    break
  }
  case 'activate': {
    if (!arg) { console.error('usage: activate <subscriptionId>'); process.exit(1) }
    console.log(JSON.stringify(await call('PATCH', `/subscriptions/${arg}`, { status: 'Active' }), null, 2))
    break
  }
  case 'delete': {
    if (!arg) { console.error('usage: delete <subscriptionId>'); process.exit(1) }
    console.log(JSON.stringify(await call('DELETE', `/subscriptions/${arg}`), null, 2))
    break
  }
  case 'metrics': {
    console.log(JSON.stringify(await call('GET', '/metrics'), null, 2))
    break
  }
  default:
    console.error('usage: list | create <url> | activate <id> | delete <id> | metrics')
    process.exit(1)
}
