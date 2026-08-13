// Minimal Resend client via fetch — no SDK dependency.
// Inert until RESEND_API_KEY is set.

export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY
}

const FROM =
  process.env.GIFTCARD_EMAIL_FROM || 'Mimosa Spa Retreat <regalos@mimosaretreat.com>'

export async function sendEmail(input: {
  to: string
  subject: string
  html: string
  replyTo?: string
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
        from: FROM,
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
