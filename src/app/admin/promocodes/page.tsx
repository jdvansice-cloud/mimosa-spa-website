'use client'

import { useCallback, useEffect, useState } from 'react'
import { Loader2, Plus, RefreshCw, Ticket, Trash2, Copy } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { AdminPage } from '@/components/admin/AdminPage'
import { AdminTable, CardField, StatusPill, type AdminColumn } from '@/components/admin/AdminTable'

interface PromoCode {
  id: string
  code: string
  kind: 'percent' | 'fixed'
  value: number
  scope: 'all' | 'services' | 'gift_cards' | 'programs'
  program_ids: number[]
  min_subtotal_cents: number
  starts_at: string | null
  ends_at: string | null
  max_uses: number | null
  max_uses_per_customer: number | null
  is_active: boolean
  description: string | null
  uses: number
}

const SCOPE_LABEL: Record<string, string> = {
  all: 'Todo',
  services: 'Servicios',
  gift_cards: 'Gift cards',
  programs: 'Categorías',
}

const emptyForm = {
  code: '',
  kind: 'percent' as 'percent' | 'fixed',
  value: '10',
  scope: 'services' as PromoCode['scope'],
  minSubtotal: '',
  startsAt: '',
  endsAt: '',
  maxUses: '',
  maxUsesPerCustomer: '1',
  description: '',
}

type Tone = 'green' | 'amber' | 'red' | 'gray'
/**
 * What the customer will actually experience — not just the is_active flag.
 * An expired or not-yet-started code is "Activo" in the database but fails at
 * checkout, so showing it as active leaves staff debugging a phantom.
 */
function effectiveStatus(c: { is_active: boolean; starts_at: string | null; ends_at: string | null }):
  { label: string; tone: Tone } {
  if (!c.is_active) return { label: 'Inactivo', tone: 'gray' }
  const now = Date.now()
  if (c.starts_at && now < Date.parse(c.starts_at)) return { label: 'Programado', tone: 'amber' }
  if (c.ends_at && now > Date.parse(c.ends_at)) return { label: 'Vencido', tone: 'red' }
  return { label: 'Activo', tone: 'green' }
}

export default function AdminPromoCodesPage() {
  const [codes, setCodes] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [copied, setCopied] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/promocodes')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Error')
      setCodes(json.data ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const save = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/promocodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: form.code,
          kind: form.kind,
          // fixed amounts are entered in dollars, stored in cents
          value: form.kind === 'fixed' ? Math.round(Number(form.value) * 100) : Number(form.value),
          scope: form.scope,
          minSubtotalCents: form.minSubtotal ? Math.round(Number(form.minSubtotal) * 100) : 0,
          startsAt: form.startsAt || null,
          endsAt: form.endsAt || null,
          maxUses: form.maxUses || null,
          maxUsesPerCustomer: form.maxUsesPerCustomer || null,
          description: form.description,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Error')
      setForm(emptyForm)
      setShowForm(false)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (c: PromoCode) => {
    await fetch('/api/admin/promocodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: c.id, code: c.code, kind: c.kind, value: c.value, scope: c.scope,
        programIds: c.program_ids, minSubtotalCents: c.min_subtotal_cents,
        startsAt: c.starts_at, endsAt: c.ends_at, maxUses: c.max_uses,
        maxUsesPerCustomer: c.max_uses_per_customer, description: c.description,
        isActive: !c.is_active,
      }),
    })
    await load()
  }

  const remove = async (c: PromoCode) => {
    if (!confirm(`¿Eliminar el código ${c.code}? Se borra también su historial de usos.`)) return
    await fetch(`/api/admin/promocodes?id=${c.id}`, { method: 'DELETE' })
    await load()
  }

  const copyLink = (c: PromoCode) => {
    const url = `${window.location.origin}/es/reservar?promo=${c.code}`
    navigator.clipboard.writeText(url)
    setCopied(c.id)
    setTimeout(() => setCopied(null), 2000)
  }

  const inputCls = 'w-full rounded-lg border border-beige px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold'

  const discount = (c: PromoCode) =>
    c.kind === 'percent' ? `${c.value}%` : `$${(c.value / 100).toFixed(2)}`

  // Month name, not digits: "08/20/2026" is read as 20 Aug or 8 Dec depending
  // on the reader, and this panel is used in Panama (same reason the WhatsApp
  // templates were switched to month names).
  const day = (s: string | null) =>
    s ? new Date(s).toLocaleDateString('es-PA', {
      timeZone: 'America/Panama', day: '2-digit', month: 'short', year: 'numeric',
    }) : '—'
  const validity = (c: PromoCode) => `${day(c.starts_at)} → ${day(c.ends_at)}`

  // One action set, rendered in both the desktop row and the mobile card.
  const actions = (c: PromoCode) => (
    <div className="flex flex-wrap gap-1.5">
      <button onClick={() => copyLink(c)} title="Copiar enlace de campaña"
        aria-label={`Copiar enlace de ${c.code}`}
        className="inline-flex items-center min-h-[44px] rounded-lg border border-beige-400 px-3 text-xs hover:bg-beige/50">
        {copied === c.id ? '¡Copiado!' : <Copy className="h-4 w-4" />}
      </button>
      <button onClick={() => toggleActive(c)}
        className="min-h-[44px] rounded-lg border border-beige-400 px-3 text-xs hover:bg-beige/50">
        {c.is_active ? 'Desactivar' : 'Activar'}
      </button>
      <button onClick={() => remove(c)} title="Eliminar" aria-label={`Eliminar ${c.code}`}
        className="inline-flex items-center min-h-[44px] rounded-lg border border-beige-400 px-3 text-xs text-red-600 hover:bg-red-50">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )

  const columns: Array<AdminColumn<PromoCode>> = [
    {
      key: 'code',
      header: 'Código',
      render: c => (
        <>
          <span className="font-mono font-semibold text-dark">{c.code}</span>
          {(() => {
            const st = effectiveStatus(c)
            return st.label !== 'Activo'
              ? <span className="ml-2"><StatusPill tone={st.tone}>{st.label.toLowerCase()}</StatusPill></span>
              : null
          })()}
          {c.description && <p className="text-[11px] text-warm-gray-500">{c.description}</p>}
        </>
      ),
    },
    {
      key: 'discount',
      header: 'Descuento',
      cellClassName: 'tabular-nums',
      render: c => (
        <>
          {discount(c)}
          {c.min_subtotal_cents > 0 && (
            <p className="text-[11px] text-warm-gray-500">mín. ${(c.min_subtotal_cents / 100).toFixed(2)}</p>
          )}
        </>
      ),
    },
    { key: 'scope', header: 'Aplica a', cellClassName: 'text-xs', render: c => SCOPE_LABEL[c.scope] },
    {
      key: 'validity',
      header: 'Vigencia',
      cellClassName: 'text-xs text-warm-gray-500',
      render: validity,
    },
    {
      key: 'uses',
      header: 'Usos',
      cellClassName: 'tabular-nums text-xs',
      render: c => (
        <>
          {c.uses}{c.max_uses ? ` / ${c.max_uses}` : ''}
          {c.max_uses_per_customer && (
            <p className="text-[11px] text-warm-gray-500">{c.max_uses_per_customer} por cliente</p>
          )}
        </>
      ),
    },
    { key: 'actions', header: '', srHeader: 'Acciones', render: actions },
  ]

  const mobileCard = (c: PromoCode) => (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-lg font-semibold text-dark break-all">{c.code}</span>
        {(() => { const st = effectiveStatus(c); return <StatusPill tone={st.tone}>{st.label}</StatusPill> })()}
      </div>
      <p className="mt-1 text-2xl font-display font-semibold text-dark tabular-nums">{discount(c)}</p>
      {c.description && <p className="text-[11px] text-warm-gray-500">{c.description}</p>}
      <dl className="mt-3 space-y-1">
        <CardField label="Aplica a">{SCOPE_LABEL[c.scope]}</CardField>
        <CardField label="Vigencia">{validity(c)}</CardField>
        <CardField label="Usos">
          {c.uses}{c.max_uses ? ` / ${c.max_uses}` : ''}
          {c.max_uses_per_customer ? ` · ${c.max_uses_per_customer} por cliente` : ''}
        </CardField>
        {c.min_subtotal_cents > 0 && (
          <CardField label="Mínimo">${(c.min_subtotal_cents / 100).toFixed(2)}</CardField>
        )}
      </dl>
      <div className="mt-3">{actions(c)}</div>
    </>
  )

  return (
    <AdminPage
      title="Códigos de descuento"
      icon={Ticket}
      description="Se aplican en el checkout en línea y se registran en Mindbody como descuento por línea."
      actions={
        <>
          <button onClick={load} className="inline-flex items-center gap-1.5 min-h-[44px] rounded-lg border border-beige-400 px-4 text-sm hover:bg-beige/50">
            <RefreshCw className="h-4 w-4" /> Actualizar
          </button>
          <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-1.5 min-h-[44px] rounded-lg bg-gold px-4 text-sm font-semibold text-dark hover:bg-gold-600">
            <Plus className="h-4 w-4" /> Nuevo código
          </button>
        </>
      }
    >
      <div className="space-y-4">
      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      {showForm && (
        <Card>
          <CardHeader><CardTitle>Nuevo código</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs text-warm-gray-500">Código</label>
                <input className={`${inputCls} uppercase`} value={form.code}
                  onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="BIENVENIDA10" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-warm-gray-500">Tipo</label>
                <select className={inputCls} value={form.kind}
                  onChange={e => setForm({ ...form, kind: e.target.value as 'percent' | 'fixed' })}>
                  <option value="percent">Porcentaje (%)</option>
                  <option value="fixed">Monto fijo ($)</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-warm-gray-500">
                  {form.kind === 'percent' ? 'Porcentaje' : 'Monto en dólares'}
                </label>
                <input className={inputCls} type="number" value={form.value}
                  onChange={e => setForm({ ...form, value: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-warm-gray-500">Aplica a</label>
                <select className={inputCls} value={form.scope}
                  onChange={e => setForm({ ...form, scope: e.target.value as PromoCode['scope'] })}>
                  <option value="services">Solo servicios</option>
                  <option value="all">Todo</option>
                  <option value="gift_cards">Solo gift cards</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-warm-gray-500">Compra mínima ($)</label>
                <input className={inputCls} type="number" value={form.minSubtotal}
                  onChange={e => setForm({ ...form, minSubtotal: e.target.value })} placeholder="0" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-warm-gray-500">Usos por cliente</label>
                <input className={inputCls} type="number" value={form.maxUsesPerCustomer}
                  onChange={e => setForm({ ...form, maxUsesPerCustomer: e.target.value })} placeholder="sin límite" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-warm-gray-500">Usos totales</label>
                <input className={inputCls} type="number" value={form.maxUses}
                  onChange={e => setForm({ ...form, maxUses: e.target.value })} placeholder="sin límite" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-warm-gray-500">Desde</label>
                <input className={inputCls} type="date" value={form.startsAt}
                  onChange={e => setForm({ ...form, startsAt: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-warm-gray-500">Hasta</label>
                <input className={inputCls} type="date" value={form.endsAt}
                  onChange={e => setForm({ ...form, endsAt: e.target.value })} />
              </div>
              <div className="md:col-span-3">
                <label className="mb-1 block text-xs text-warm-gray-500">Nota interna</label>
                <input className={inputCls} value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Campaña Instagram noviembre" />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={save} disabled={saving || !form.code}
                className="inline-flex items-center gap-2 rounded-lg bg-dark px-4 py-2 text-sm font-semibold text-cream disabled:opacity-50">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />} Guardar
              </button>
              <button onClick={() => { setShowForm(false); setForm(emptyForm) }}
                className="rounded-lg border border-beige px-4 py-2 text-sm">Cancelar</button>
            </div>
          </CardContent>
        </Card>
      )}

      <AdminTable
        rows={codes}
        columns={columns}
        rowKey={c => c.id}
        mobileCard={mobileCard}
        loading={loading}
        empty="Todavía no hay códigos."
      />
      </div>
    </AdminPage>
  )
}
