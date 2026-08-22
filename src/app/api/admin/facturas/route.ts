import { NextRequest, NextResponse } from 'next/server'
import { getGiftCardAdminContext } from '@/lib/giftcards/auth'
import { ordersAdminClient } from '@/lib/orders/pipeline'
import { emitInvoiceForOrder } from '@/lib/efactura/emit'
import { ONLINE_CHANNEL_ID, cancelInvoice, fetchCafePdf, loadEfacturaConfig } from '@/lib/efactura/pac'

// GET /api/admin/facturas — emitted documents + config state.
export async function GET(request: NextRequest) {
  const ctx = await getGiftCardAdminContext()
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const supabase = ordersAdminClient()

  let query = supabase
    .from('electronic_invoices')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(Math.min(Number(searchParams.get('limit') || 100), 500))
  if (status) query = query.eq('status', status)

  const [{ data, error }, { data: config }] = await Promise.all([
    query,
    supabase.from('efactura_config').select('location_id, label, codigo_sucursal, environment, punto_facturacion, enabled').order('location_id'),
  ])
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const rows = (data ?? []) as Array<Record<string, unknown> & { order_id: string | null }>
  const orderIds = rows.map(r => r.order_id).filter((v): v is string => !!v)
  const { data: orders } = orderIds.length
    ? await supabase.from('orders').select('id, order_number, buyer_name, total_cents').in('id', orderIds)
    : { data: [] }

  return NextResponse.json({
    config: config ?? [],
    data: rows.map(r => ({
      ...r,
      order: (orders ?? []).find(o => o.id === r.order_id) ?? null,
      // Never ship raw payloads to the browser — they're large and contain
      // the full customer record; the detail view fetches them on demand.
      request_payload: undefined,
      response_payload: undefined,
    })),
  })
}

// POST /api/admin/facturas — retry, cancel (anular), or fetch the CAFE PDF.
export async function POST(request: NextRequest) {
  const ctx = await getGiftCardAdminContext()
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const action = String(body.action ?? '')
  const invoiceId = String(body.invoiceId ?? '')
  const supabase = ordersAdminClient()

  const { data: inv } = await supabase
    .from('electronic_invoices')
    .select('*')
    .eq('id', invoiceId)
    .maybeSingle()
  if (!inv) return NextResponse.json({ error: 'Documento no encontrado' }, { status: 404 })

  if (action === 'retry') {
    if (!inv.order_id) return NextResponse.json({ error: 'Sin pedido asociado' }, { status: 400 })
    // Free the one-active-factura slot before re-emitting.
    await supabase
      .from('electronic_invoices')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', invoiceId)
    const outcome = await emitInvoiceForOrder(inv.order_id, {
      supabase,
      docType: inv.doc_type,
      referencedCufe: inv.referenced_cufe ?? undefined,
    })
    return NextResponse.json({ ok: outcome.ok, outcome }, { status: outcome.ok ? 200 : 502 })
  }

  // Resolve the config the document was EMITTED under, not the spa that
  // delivers the service: an online invoice carries location_id = the spa but
  // was emitted by the "Mimosa Online" channel, so looking it up by
  // location_id would report "no configurada" and break CAFE/Anular.
  const { data: byS } = inv.codigo_sucursal
    ? await supabase.from('efactura_config').select('location_id')
        .eq('codigo_sucursal', inv.codigo_sucursal).maybeSingle()
    : { data: null }
  const config =
    (byS ? await loadEfacturaConfig(supabase, byS.location_id) : null) ??
    (await loadEfacturaConfig(supabase, ONLINE_CHANNEL_ID)) ??
    (await loadEfacturaConfig(supabase, inv.location_id))
  if (!config) return NextResponse.json({ error: 'efactura no configurada' }, { status: 400 })

  if (action === 'cafe') {
    if (!inv.cufe) return NextResponse.json({ error: 'El documento no tiene CUFE' }, { status: 400 })
    const pdf = await fetchCafePdf(config, inv.cufe)
    if (!pdf.ok) return NextResponse.json({ error: `PAC HTTP ${pdf.status}` }, { status: 502 })
    return NextResponse.json({ ok: true, base64: pdf.base64 })
  }

  if (action === 'cancel') {
    if (!inv.cufe) return NextResponse.json({ error: 'El documento no tiene CUFE' }, { status: 400 })
    const reason = String(body.reason ?? '').trim()
    if (reason.length < 10) {
      return NextResponse.json({ error: 'El motivo debe tener al menos 10 caracteres' }, { status: 400 })
    }
    const res = await cancelInvoice(config, inv.cufe, reason)
    if (!res.ok) return NextResponse.json({ error: 'El PAC rechazó la anulación', raw: res.raw }, { status: 502 })
    await supabase
      .from('electronic_invoices')
      .update({
        status: 'cancelled',
        error: `Anulada por ${ctx.email ?? 'admin'}: ${reason}`.slice(0, 500),
        updated_at: new Date().toISOString(),
      })
      .eq('id', invoiceId)
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Acción no válida' }, { status: 400 })
}
