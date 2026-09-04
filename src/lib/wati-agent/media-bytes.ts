import { createClient } from '@supabase/supabase-js'

export async function mediaBytesFromStorage(storagePath: string) {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data, error } = await sb.storage.from('wati-agent-media').download(storagePath)
  if (error || !data) throw new Error(`media download failed: ${error?.message}`)
  return { bytes: new Uint8Array(await data.arrayBuffer()), mime: data.type || 'image/jpeg', filename: storagePath.split('/').pop() || 'imagen.jpg' }
}
