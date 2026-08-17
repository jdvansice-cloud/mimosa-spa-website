// Minimal Resend client via fetch — no SDK dependency.
// Inert until RESEND_API_KEY is set.

export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY
}

// Three sender identities:
//  - purchases (buyer receipts, order emails)         → PURCHASE_EMAIL_FROM
//  - appointment notifications (conf/reminder/cancel) → BOOKING_EMAIL_FROM
//  - the electronic gift card itself, to the RECIPIENT → GIFTCARD_EMAIL_FROM
//    (its own identity so the person receiving it recognizes a gift)
const PURCHASE_FROM =
  process.env.PURCHASE_EMAIL_FROM || 'Mimosa Spa Retreat <compras@mimosaretreat.com>'
const BOOKING_FROM =
  process.env.BOOKING_EMAIL_FROM || 'Mimosa Spa Retreat <citas@mimosaretreat.com>'
const GIFT_FROM =
  process.env.GIFTCARD_EMAIL_FROM || 'Mimosa Spa Retreat <regalos@mimosaretreat.com>'
// Relationship emails (welcome, first-visit thanks, birthday) — warm identity
const RELATION_FROM =
  process.env.RELATION_EMAIL_FROM || 'Mimosa Spa Retreat <hola@mimosaretreat.com>'

export async function sendEmail(input: {
  to: string
  subject: string
  html: string
  replyTo?: string
  /** 'purchase' (default) = receipts; 'booking' = appointments; 'gift' = the
   * gift card itself; 'relation' = welcome/birthday/thanks lifecycle emails */
  kind?: 'purchase' | 'booking' | 'gift' | 'relation'
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  const key = process.env.RESEND_API_KEY
  if (!key) return { ok: false, error: 'RESEND_API_KEY not set' }

  const testPrefix = process.env.GIFTCARD_TEST_MODE === '1' ? '[TEST] ' : ''

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:
          input.kind === 'booking' ? BOOKING_FROM :
          input.kind === 'gift' ? GIFT_FROM :
          input.kind === 'relation' ? RELATION_FROM :
          PURCHASE_FROM,
        to: [input.to],
        subject: testPrefix + input.subject,
        html: input.html,
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) {
      return { ok: false, error: data?.message || `HTTP ${res.status}` }
    }
    return { ok: true, id: data?.id }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'send failed' }
  }
}
