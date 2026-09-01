/** Full mb_clients pull — one-time backfill so every client has email/phone. */
import { syncClients } from '../../src/lib/kpis/sync'
const r = await syncClients() // no modifiedSince = every client, ~131 pages
console.log(`clientes sincronizados: ${r.clients}`)
