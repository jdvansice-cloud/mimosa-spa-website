// ===========================================
// Server → TV push over Supabase Realtime Broadcast.
//
// Uses the Realtime REST endpoint (no persistent socket needed from a
// serverless route). The TV client subscribes to the same topic and
// refetches the agenda when a "refresh" message lands.
// ===========================================

export const TV_REFRESH_TOPIC = 'tv-agenda'
export const TV_REFRESH_EVENT = 'refresh'

export interface TvRefreshPayload {
  /** Mindbody location id; null when unknown → every board refreshes. */
  locationId: number | null
  appointmentId: number | null
  eventId: string
  at?: string
}

export async function broadcastTvRefresh(payload: TvRefreshPayload): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) throw new Error('Supabase env not configured')

  const res = await fetch(`${url}/realtime/v1/api/broadcast`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
    body: JSON.stringify({
      messages: [
        {
          topic: TV_REFRESH_TOPIC,
          event: TV_REFRESH_EVENT,
          payload: { ...payload, at: payload.at ?? new Date().toISOString() },
        },
      ],
    }),
  })
  if (!res.ok) {
    throw new Error(`Realtime broadcast ${res.status}: ${await res.text()}`)
  }
}
