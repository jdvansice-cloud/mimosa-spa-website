'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Gift, ArrowLeft, Plus, Printer, Loader2, RefreshCw, Search, X,
  ChevronLeft, ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui'
import { AdminTable, CardField, StatusPill, type AdminColumn } from '@/components/admin/AdminTable'

interface IssuedRow {
  id: string
  serial: string
  buyer_name: string
  recipient_name: string
  amount_cents: number
  gift_treatment_names: string[] | null
  gift_card_serial_config_id: string | null
  issued_at: string
  redeemed_at: string | null
  sold_at: string | null
  mindbody_remaining_balance_cents: number | null
  mindbody_synced_at: string | null
}

interface LocationConfig {
  id: string
  location_name: string
  prefix: string
}

type Status = '' | 'emitida' | 'vendida' | 'usada'

const STATUS_FILTERS: Array<{ key: Status; label: string }> = [
  { key: '', label: 'Todas' },
  { key: 'emitida', label: 'Emitidas' },
  { key: 'vendida', label: 'Vendidas' },
  { key: 'usada', label: 'Usadas' },
]

const PAGE_SIZE = 25

/** "Mimosa Spa | Costa del Este" → "Costa del Este" so the pill fits one line. */
function shortLocation(name: string): string {
  const parts = name.split('|')
  return (parts.length > 1 ? parts[parts.length - 1] : name).trim()
}

function formatMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('es-PA', { dateStyle: 'short', timeStyle: 'short' })
}

/**
 * Three lifecycle states, in the order a card moves through them:
 *   Emitida — the serial was generated here; Mindbody hasn't seen it yet
 *   Vendida — the serial exists in Mindbody and still has balance
 *   Usada   — Mindbody reports the balance fully consumed
 */
function statusLabel(row: IssuedRow): { label: string; tone: 'green' | 'amber' | 'gray' } {
  if (row.redeemed_at) return { label: 'Usada', tone: 'gray' }
  if (row.sold_at) return { label: 'Vendida', tone: 'green' }
  return { label: 'Emitida', tone: 'amber' }
}

/** Pill filter — shared vocabulary with the KPIs section. */
function Pill({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
        active
          ? 'bg-dark text-white border-dark'
          : 'bg-white text-warm-gray-500 border-beige-400 hover:bg-beige'
      }`}
    >
      {children}
    </button>
  )
}

export default function AdminGiftCardsIssuedPage() {
  return (
    <Suspense fallback={null}>
      <IssuedList />
    </Suspense>
  )
}

function IssuedList() {
  // The dashboard links here pre-filtered, e.g. ?status=emitida.
  const searchParams = useSearchParams()
  const initialStatus = searchParams.get('status')

  const [rows, setRows] = useState<IssuedRow[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [syncingId, setSyncingId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  // Filters
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [status, setStatus] = useState<Status>(
    STATUS_FILTERS.some(f => f.key && f.key === initialStatus) ? initialStatus as Status : '',
  )
  const [configId, setConfigId] = useState('')
  const [page, setPage] = useState(1)

  // Super admins get a location filter; location-restricted admins are scoped
  // server-side and only ever receive their own location back.
  const [locations, setLocations] = useState<LocationConfig[]>([])
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)

  const searchRef = useRef<HTMLInputElement>(null)
  // Guards against a slow early request overwriting a newer one while typing.
  const requestSeq = useRef(0)

  // Page resets ride along with the filter change itself — doing it in a
  // separate effect would let one request fire against the stale page first.
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim())
      setPage(1)
    }, 300)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    (async () => {
      try {
        const [meRes, cfgRes] = await Promise.all([
          fetch('/api/admin/giftcards/me'),
          fetch('/api/admin/giftcards/config'),
        ])
        const me = await meRes.json()
        const cfg = await cfgRes.json()
        if (meRes.ok) setIsSuperAdmin(!!me.isSuperAdmin)
        if (cfgRes.ok) setLocations(cfg.data ?? [])
      } catch { /* the list still works without the location filter */ }
    })()
  }, [])

  const load = useCallback(async () => {
    const seq = ++requestSeq.current
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) })
      if (debouncedSearch) params.set('q', debouncedSearch)
      if (status) params.set('status', status)
      if (configId) params.set('configId', configId)

      const res = await fetch(`/api/admin/giftcards/issued?${params}`)
      const data = await res.json()
      if (seq !== requestSeq.current) return
      if (!res.ok) throw new Error(data?.error || 'Error al cargar')
      setRows(data.data ?? [])
      setTotal(data.total ?? 0)
      setTotalPages(data.totalPages ?? 1)
      // The server clamps a page that's past the end of the result set.
      if (typeof data.page === 'number' && data.page !== page) setPage(data.page)
    } catch (e) {
      if (seq !== requestSeq.current) return
      setError(e instanceof Error ? e.message : 'Error al cargar')
    } finally {
      if (seq === requestSeq.current) setLoading(false)
    }
  }, [page, debouncedSearch, status, configId])

  useEffect(() => { load() }, [load])

  // Staff arrive here to look up a serial — put the cursor where they'll type.
  useEffect(() => { searchRef.current?.focus() }, [])

  const handleSync = async (id: string) => {
    setSyncingId(id)
    setToast(null)
    try {
      const res = await fetch(`/api/admin/giftcards/issued/${id}/sync`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Error al sincronizar')
      if (data.status === 'not_found_in_mindbody') {
        setToast(data.message || 'No encontrada en Mindbody todavía.')
      } else {
        setToast('Sincronizada con Mindbody.')
      }
      await load()
    } catch (e) {
      setToast(e instanceof Error ? e.message : 'Error al sincronizar')
    } finally {
      setSyncingId(null)
      setTimeout(() => setToast(null), 4000)
    }
  }

  const hasFilters = !!debouncedSearch || !!status || !!configId
  const clearFilters = () => { setSearch(''); setStatus(''); setConfigId(''); setPage(1) }

  const firstOnPage = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const lastOnPage = Math.min(page * PAGE_SIZE, total)

  const syncButton = (row: IssuedRow, className: string) => (
    <button
      type="button"
      onClick={() => handleSync(row.id)}
      disabled={syncingId === row.id}
      title="Sincronizar con Mindbody"
      aria-label={`Sincronizar ${row.serial} con Mindbody`}
      className={className}
    >
      {syncingId === row.id
        ? <Loader2 className="h-5 w-5 animate-spin" />
        : <RefreshCw className="h-5 w-5" />}
    </button>
  )

  const balance = (row: IssuedRow) =>
    row.mindbody_remaining_balance_cents != null
      ? formatMoney(row.mindbody_remaining_balance_cents)
      : null

  const columns: Array<AdminColumn<IssuedRow>> = [
    { key: 'serial', header: 'Serial', cellClassName: 'font-mono', render: r => r.serial },
    { key: 'buyer', header: 'Comprador', render: r => r.buyer_name },
    { key: 'recipient', header: 'Destinatario', render: r => r.recipient_name },
    { key: 'amount', header: 'Monto', cellClassName: 'tabular-nums', render: r => formatMoney(r.amount_cents) },
    {
      key: 'treatments',
      header: 'Tratamientos',
      cellClassName: 'text-warm-gray-500 text-xs',
      render: r => r.gift_treatment_names?.length ? r.gift_treatment_names.join(' · ') : '—',
    },
    {
      key: 'balance',
      header: 'Saldo Mindbody',
      render: r => (
        <>
          {balance(r) ? <span className="tabular-nums">{balance(r)}</span> : <span className="text-warm-gray-500">—</span>}
          {r.mindbody_synced_at && (
            <div className="text-[10px] text-warm-gray-500">{formatDate(r.mindbody_synced_at)}</div>
          )}
        </>
      ),
    },
    {
      key: 'issued',
      header: 'Emitida',
      cellClassName: 'text-warm-gray-500',
      render: r => formatDate(r.issued_at),
    },
    {
      key: 'status',
      header: 'Estado',
      render: r => {
        const st = statusLabel(r)
        return <StatusPill tone={st.tone}>{st.label}</StatusPill>
      },
    },
    {
      key: 'actions',
      header: '',
      srHeader: 'Acciones',
      align: 'right',
      render: r => (
        <div className="flex items-center gap-1 justify-end">
          {syncButton(r, 'h-11 w-11 flex items-center justify-center rounded-lg text-warm-gray-500 hover:text-dark hover:bg-beige disabled:opacity-50')}
          <Link
            href={`/admin/giftcards/issued/${r.id}/print`}
            title="Imprimir etiqueta"
            aria-label={`Imprimir etiqueta de ${r.serial}`}
            className="h-11 w-11 flex items-center justify-center rounded-lg text-warm-gray-500 hover:text-dark hover:bg-beige"
          >
            <Printer className="h-5 w-5" />
          </Link>
        </div>
      ),
    },
  ]

  const mobileCard = (row: IssuedRow) => {
    const st = statusLabel(row)
    return (
      <>
        <div className="flex items-start justify-between gap-3">
          <div className="font-mono text-lg font-semibold text-dark break-all">{row.serial}</div>
          <StatusPill tone={st.tone}>{st.label}</StatusPill>
        </div>
        <div className="mt-1 text-2xl font-display font-semibold text-dark tabular-nums">
          {formatMoney(row.amount_cents)}
          {balance(row) && (
            <span className="ml-2 text-sm font-body font-normal text-warm-gray-500">
              saldo {balance(row)}
            </span>
          )}
        </div>
        <dl className="mt-3 space-y-1">
          <CardField label="Para">{row.recipient_name}</CardField>
          <CardField label="Compró">{row.buyer_name}</CardField>
          <CardField label="Emitida">{formatDate(row.issued_at)}</CardField>
          {row.gift_treatment_names?.length ? (
            <CardField label="Incluye">{row.gift_treatment_names.join(' · ')}</CardField>
          ) : null}
        </dl>
        <div className="mt-4 flex items-center gap-2">
          <Link href={`/admin/giftcards/issued/${row.id}/print`} className="flex-1">
            <Button size="sm" className="w-full min-h-[44px]" leftIcon={<Printer className="h-4 w-4" />}>
              Imprimir
            </Button>
          </Link>
          {syncButton(row, 'h-11 w-11 shrink-0 flex items-center justify-center rounded-lg border border-beige-400 text-warm-gray-500 hover:text-dark hover:bg-beige disabled:opacity-50')}
        </div>
      </>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/giftcards"
          className="inline-flex items-center gap-1 min-h-[44px] text-sm text-warm-gray-500 hover:text-dark"
        >
          <ArrowLeft className="h-4 w-4" /> Gift Cards
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gold/10 rounded-lg">
                <Gift className="h-6 w-6 text-gold-700" />
              </div>
              <h1 className="text-3xl font-display font-semibold text-dark">Gift Cards Emitidas</h1>
            </div>
            <p className="text-warm-gray-500">
              Busca por serial, comprador o destinatario. &quot;Sincronizar&quot; consulta el saldo actual en Mindbody.
            </p>
          </div>
          <Link href="/admin/giftcards/issue">
            <Button leftIcon={<Plus className="h-4 w-4" />}>Emitir Nueva</Button>
          </Link>
        </div>
      </div>

      {/* Only the search box is sticky. The pills are set-and-forget, and on a
          phone a sticky block tall enough to hold them leaves room for barely
          one result. */}
      <div className="sticky top-14 lg:top-0 z-20 -mx-4 px-4 lg:-mx-8 lg:px-8 py-3 bg-beige-100/95 backdrop-blur-sm border-b border-beige-300">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-warm-gray-400 pointer-events-none" />
          {/* [&::-webkit-search-cancel-button]:hidden — the native clear button
              would otherwise sit right beside our own X. */}
          <input
            ref={searchRef}
            type="search"
            inputMode="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar serial, comprador o destinatario…"
            aria-label="Buscar gift cards"
            className="w-full min-h-[44px] pl-10 pr-10 py-2 rounded-lg border border-beige-400 bg-white text-dark placeholder:text-warm-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold [&::-webkit-search-cancel-button]:hidden"
          />
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(''); searchRef.current?.focus() }}
              aria-label="Limpiar búsqueda"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-11 w-11 flex items-center justify-center text-warm-gray-500 hover:text-dark rounded-lg"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

      </div>

      <div className="space-y-3 my-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Estado">
          {STATUS_FILTERS.map(f => (
            <Pill key={f.key} active={status === f.key} onClick={() => { setStatus(f.key); setPage(1) }}>
              {f.label}
            </Pill>
          ))}
        </div>

        {isSuperAdmin && locations.length > 1 && (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Ubicación">
            <Pill active={configId === ''} onClick={() => { setConfigId(''); setPage(1) }}>Todas las sucursales</Pill>
            {locations.map(loc => (
              <Pill key={loc.id} active={configId === loc.id} onClick={() => { setConfigId(loc.id); setPage(1) }}>
                {shortLocation(loc.location_name)}
              </Pill>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 text-sm text-warm-gray-500">
          <span aria-live="polite">
            {loading
              ? 'Buscando…'
              : total === 0
                ? 'Sin resultados'
                : `Mostrando ${firstOnPage}–${lastOnPage} de ${total}`}
          </span>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-gold-700 hover:underline font-medium"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {toast && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-white border border-beige-300 text-dark text-sm" role="status">
          {toast}
        </div>
      )}


      <AdminTable
        rows={rows}
        columns={columns}
        rowKey={row => row.id}
        mobileCard={mobileCard}
        loading={loading}
        error={error}
        stickyFirstColumn
        empty={hasFilters
          ? 'Ninguna Gift Card coincide con los filtros.'
          : 'Aún no se han emitido Gift Cards.'}
      />

      {totalPages > 1 && (
        <nav className="mt-4 flex items-center justify-between gap-3" aria-label="Paginación">
              <button
                type="button"
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page <= 1}
                className="inline-flex items-center gap-1 min-h-[44px] px-4 rounded-lg border border-beige-400 bg-white text-dark hover:bg-beige disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" /> Anterior
              </button>
              <span className="text-sm text-warm-gray-500 tabular-nums">
                Página {page} de {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page >= totalPages}
                className="inline-flex items-center gap-1 min-h-[44px] px-4 rounded-lg border border-beige-400 bg-white text-dark hover:bg-beige disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Siguiente <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
      )}
    </div>
  )
}
