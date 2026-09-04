'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  MessageCircle,
  Pause,
  Play,
  UserCheck,
  Image as ImageIcon,
  Settings as SettingsIcon,
  Loader2,
  Upload,
  Trash2,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import type { Conversation, ConversationMode, StoredMessage, EventKind } from '@/lib/wati-agent/types'
import type { BusinessOverrides, LocationOverride } from '@/lib/wati-agent/config/business'

type Tab = 'conversaciones' | 'imagenes' | 'ajustes'

interface EventRow {
  id: number
  kind: EventKind
  payload: unknown
  created_at: string
}

interface MediaAssetRow {
  key: string
  description: string
  caption: string
  storage_path: string
  valid_from: string | null
  valid_until: string | null
  active: boolean
  publicUrl: string
}

interface StatsResponse {
  handled: number
  booked: number
  handoffs: Record<string, number>
  shadow: number
  mode: string
}

const MODE_LABEL: Record<ConversationMode, string> = {
  agent: 'Agente',
  human: 'Humano',
  off: 'Pausado',
}

const MODE_CHIP_CLASS: Record<ConversationMode, string> = {
  agent: 'bg-blue-100 text-blue-700',
  human: 'bg-green-100 text-green-700',
  off: 'bg-gray-200 text-gray-600',
}

function relativeTime(iso: string | null): string {
  if (!iso) return '—'
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return 'ahora'
  if (mins < 60) return `hace ${mins} min`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `hace ${hours} h`
  const days = Math.round(hours / 24)
  return `hace ${days} d`
}

export default function WatiAgentClient() {
  const [tab, setTab] = useState<Tab>('conversaciones')
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [settingsEnabled, setSettingsEnabled] = useState(true)

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/wati-agent/stats?days=7')
      if (res.ok) setStats(await res.json())
    } catch (e) {
      console.error('stats fetch failed', e)
    }
  }, [])

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/wati-agent/settings')
      if (res.ok) {
        const data = await res.json()
        setSettingsEnabled(Boolean(data.enabled))
      }
    } catch (e) {
      console.error('settings fetch failed', e)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    fetchSettings()
  }, [fetchStats, fetchSettings])

  const toggleEnabled = async () => {
    const next = !settingsEnabled
    setSettingsEnabled(next)
    await fetch('/api/admin/wati-agent/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: next }),
    })
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-yellow-600" />
          <h1 className="text-xl font-semibold">Camila (WhatsApp)</h1>
          {stats && (
            <span className="ml-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              modo: {stats.mode}
            </span>
          )}
        </div>
        <Button variant={settingsEnabled ? 'outline' : 'primary'} onClick={toggleEnabled}>
          {settingsEnabled ? 'Desactivar Camila' : 'Activar Camila'}
        </Button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Atendidas (7d)" value={stats.handled} />
          <StatCard label="Reservas (7d)" value={stats.booked} />
          <StatCard
            label="Handoffs (7d)"
            value={Object.values(stats.handoffs).reduce((a, b) => a + b, 0)}
          />
          <StatCard label="Respuestas shadow (7d)" value={stats.shadow} />
        </div>
      )}

      <div className="flex gap-2 border-b border-gray-200">
        <TabButton active={tab === 'conversaciones'} onClick={() => setTab('conversaciones')} icon={MessageCircle} label="Conversaciones" />
        <TabButton active={tab === 'imagenes'} onClick={() => setTab('imagenes')} icon={ImageIcon} label="Imágenes" />
        <TabButton active={tab === 'ajustes'} onClick={() => setTab('ajustes')} icon={SettingsIcon} label="Ajustes" />
      </div>

      {tab === 'conversaciones' && <ConversationsTab />}
      {tab === 'imagenes' && <ImagesTab />}
      {tab === 'ajustes' && <SettingsTab enabled={settingsEnabled} onEnabledChange={setSettingsEnabled} />}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-2xl font-semibold">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </CardContent>
    </Card>
  )
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
        active ? 'border-yellow-500 text-yellow-700' : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

const MODE_FILTERS: Array<{ value: ConversationMode | 'all'; label: string }> = [
  { value: 'all', label: 'Todas' },
  { value: 'agent', label: 'Agente' },
  { value: 'human', label: 'Humano' },
  { value: 'off', label: 'Off' },
]

function ConversationsTab() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [filter, setFilter] = useState<ConversationMode | 'all'>('all')
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const visibleRef = useRef(true)

  const load = useCallback(async (mode: ConversationMode | 'all') => {
    try {
      const url = mode === 'all' ? '/api/admin/wati-agent/conversations' : `/api/admin/wati-agent/conversations?mode=${mode}`
      const res = await fetch(url)
      if (res.ok) {
        const { data } = await res.json()
        setConversations(data ?? [])
      }
    } catch (e) {
      console.error('conversations fetch failed', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    load(filter)
  }, [filter, load])

  useEffect(() => {
    const onVisibility = () => {
      visibleRef.current = document.visibilityState === 'visible'
    }
    document.addEventListener('visibilitychange', onVisibility)
    const interval = setInterval(() => {
      if (visibleRef.current) load(filter)
    }, 15000)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      clearInterval(interval)
    }
  }, [filter, load])

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <div className="flex-1 space-y-3">
        <div className="flex gap-2">
          {MODE_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                filter === f.value ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center p-8 text-gray-400">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : conversations.length === 0 ? (
              <p className="p-6 text-center text-sm text-gray-400">No hay conversaciones.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
                      <th className="px-4 py-2 font-medium">Teléfono</th>
                      <th className="px-4 py-2 font-medium">Cliente</th>
                      <th className="px-4 py-2 font-medium">Modo</th>
                      <th className="px-4 py-2 font-medium">Sucursal</th>
                      <th className="px-4 py-2 font-medium">Último mensaje</th>
                      <th className="px-4 py-2 font-medium">Motivo handoff</th>
                    </tr>
                  </thead>
                  <tbody>
                    {conversations.map(c => (
                      <tr
                        key={c.phone}
                        onClick={() => setSelectedPhone(c.phone)}
                        className={`cursor-pointer border-b border-gray-50 hover:bg-gray-50 ${
                          selectedPhone === c.phone ? 'bg-yellow-50' : ''
                        }`}
                      >
                        <td className="px-4 py-2 font-mono text-xs">{c.phone}</td>
                        <td className="px-4 py-2">{c.client_name ?? '—'}</td>
                        <td className="px-4 py-2">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${MODE_CHIP_CLASS[c.mode]}`}>
                            {MODE_LABEL[c.mode]}
                          </span>
                        </td>
                        <td className="px-4 py-2 uppercase text-xs text-gray-500">{c.sucursal ?? '—'}</td>
                        <td className="px-4 py-2 text-xs text-gray-500">{relativeTime(c.last_inbound_at)}</td>
                        <td className="px-4 py-2 text-xs text-gray-500">{c.handoff_reason ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {selectedPhone && (
        <div className="w-full lg:w-[420px]">
          <ConversationPanel phone={selectedPhone} onClose={() => setSelectedPhone(null)} onAction={() => load(filter)} />
        </div>
      )}
    </div>
  )
}

function ConversationPanel({
  phone,
  onClose,
  onAction,
}: {
  phone: string
  onClose: () => void
  onAction: () => void
}) {
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<StoredMessage[]>([])
  const [events, setEvents] = useState<EventRow[]>([])
  const [eventsOpen, setEventsOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/wati-agent/conversations/${phone}`)
      if (res.ok) {
        const data = await res.json()
        setConversation(data.conversation)
        setMessages(data.messages ?? [])
        setEvents(data.events ?? [])
      }
    } catch (e) {
      console.error('conversation fetch failed', e)
    }
  }, [phone])

  useEffect(() => {
    load()
  }, [load])

  const doAction = async (action: 'pause' | 'resume' | 'handoff') => {
    setBusy(true)
    try {
      await fetch(`/api/admin/wati-agent/conversations/${phone}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      await load()
      onAction()
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base">{conversation?.client_name ?? phone}</CardTitle>
          <p className="font-mono text-xs text-gray-400">{phone}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Cerrar">
          ×
        </button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" disabled={busy} onClick={() => doAction('pause')}>
            <Pause className="mr-1 h-3.5 w-3.5" />
            Pausar
          </Button>
          <Button size="sm" variant="outline" disabled={busy} onClick={() => doAction('resume')}>
            <Play className="mr-1 h-3.5 w-3.5" />
            Reanudar
          </Button>
          <Button size="sm" variant="outline" disabled={busy} onClick={() => doAction('handoff')}>
            <UserCheck className="mr-1 h-3.5 w-3.5" />
            Pasar a humano
          </Button>
        </div>

        <div className="max-h-[420px] space-y-2 overflow-y-auto rounded-lg bg-gray-50 p-3">
          {messages.length === 0 && <p className="text-center text-xs text-gray-400">Sin mensajes.</p>}
          {messages.map(m => (
            <MessageBubble key={m.id ?? `${m.created_at}-${m.text}`} message={m} />
          ))}
        </div>

        <div>
          <button
            onClick={() => setEventsOpen(o => !o)}
            className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700"
          >
            {eventsOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            Eventos ({events.length})
          </button>
          {eventsOpen && (
            <div className="mt-2 max-h-64 space-y-1 overflow-y-auto rounded-lg border border-gray-100 p-2 text-xs">
              {events.map(e => (
                <div key={e.id} className="border-b border-gray-50 py-1 last:border-0">
                  <span className="font-medium text-gray-600">{e.kind}</span>{' '}
                  <span className="text-gray-400">{new Date(e.created_at).toLocaleString('es-PA')}</span>
                  <pre className="mt-0.5 whitespace-pre-wrap break-all text-[11px] text-gray-500">
                    {JSON.stringify(e.payload)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function MessageBubble({ message }: { message: StoredMessage }) {
  const isCustomer = message.author === 'customer'
  const isCamila = message.author === 'camila' || message.author === 'bot' || message.author === 'template'
  const isHuman = message.author === 'human'

  const align = isCustomer ? 'justify-start' : 'justify-end'
  let bubbleClass = 'bg-white border border-gray-200 text-gray-800'
  if (isCamila) bubbleClass = 'bg-yellow-100 text-yellow-900'
  if (isHuman) bubbleClass = 'bg-green-100 text-green-900'
  if (message.shadow) bubbleClass += ' border-dashed border-2 border-gray-400 opacity-80'

  return (
    <div className={`flex ${align}`}>
      <div className={`max-w-[80%] rounded-lg px-3 py-1.5 text-sm ${bubbleClass}`}>
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
        {message.shadow && <p className="mt-0.5 text-[10px] italic text-gray-500">no enviado</p>}
      </div>
    </div>
  )
}

function ImagesTab() {
  const [items, setItems] = useState<MediaAssetRow[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ key: '', description: '', caption: '', valid_from: '', valid_until: '' })
  const [file, setFile] = useState<File | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/wati-agent/media')
      if (res.ok) {
        const { data } = await res.json()
        setItems(data ?? [])
      }
    } catch (e) {
      console.error('media fetch failed', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const upload = async () => {
    if (!file || !form.key) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('key', form.key)
      fd.append('description', form.description)
      fd.append('caption', form.caption)
      if (form.valid_from) fd.append('valid_from', form.valid_from)
      if (form.valid_until) fd.append('valid_until', form.valid_until)
      const res = await fetch('/api/admin/wati-agent/media', { method: 'POST', body: fd })
      if (res.ok) {
        setForm({ key: '', description: '', caption: '', valid_from: '', valid_until: '' })
        setFile(null)
        await load()
      }
    } finally {
      setUploading(false)
    }
  }

  const remove = async (key: string) => {
    await fetch(`/api/admin/wati-agent/media?key=${encodeURIComponent(key)}`, { method: 'DELETE' })
    await load()
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Subir imagen</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Clave (key)"
            value={form.key}
            onChange={e => setForm(f => ({ ...f, key: e.target.value }))}
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
          />
          <input
            type="file"
            accept="image/*"
            onChange={e => setFile(e.target.files?.[0] ?? null)}
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Descripción"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="rounded-md border border-gray-200 px-3 py-2 text-sm sm:col-span-2"
          />
          <input
            type="text"
            placeholder="Caption (texto que acompaña la imagen)"
            value={form.caption}
            onChange={e => setForm(f => ({ ...f, caption: e.target.value }))}
            className="rounded-md border border-gray-200 px-3 py-2 text-sm sm:col-span-2"
          />
          <label className="flex flex-col gap-1 text-xs text-gray-500">
            Válido desde
            <input
              type="date"
              value={form.valid_from}
              onChange={e => setForm(f => ({ ...f, valid_from: e.target.value }))}
              className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-gray-500">
            Válido hasta
            <input
              type="date"
              value={form.valid_until}
              onChange={e => setForm(f => ({ ...f, valid_until: e.target.value }))}
              className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            />
          </label>
          <div className="sm:col-span-2">
            <Button onClick={upload} disabled={uploading || !file || !form.key}>
              {uploading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Upload className="mr-1.5 h-4 w-4" />}
              Subir
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-8 text-gray-400">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <p className="p-6 text-center text-sm text-gray-400">No hay imágenes.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map(item => (
                // eslint-disable-next-line @next/next/no-img-element
                <div key={item.key} className="overflow-hidden rounded-lg border border-gray-100">
                  <img src={item.publicUrl} alt={item.description} className="h-32 w-full object-cover" />
                  <div className="space-y-1 p-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.key}</span>
                      <button onClick={() => remove(item.key)} className="text-red-400 hover:text-red-600" aria-label="Eliminar">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-gray-500">{item.description}</p>
                    <p className="text-gray-400">{item.caption}</p>
                    <p className="text-gray-400">
                      {item.valid_from ?? '—'} → {item.valid_until ?? '—'} · {item.active ? 'activa' : 'inactiva'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const LOCATION_FIELDS: Array<[keyof LocationOverride, string]> = [
  ['address', 'Dirección'],
  ['parking', 'Estacionamiento'],
  ['wazeUrl', 'Waze'],
  ['mapsUrl', 'Google Maps'],
]

function SettingsTab({
  enabled,
  onEnabledChange,
}: {
  enabled: boolean
  onEnabledChange: (v: boolean) => void
}) {
  const [personaName, setPersonaName] = useState('Camila')
  const [operatorLabels, setOperatorLabels] = useState('')
  const [overrides, setOverrides] = useState<BusinessOverrides>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/wati-agent/settings')
      .then(res => res.json())
      .then(data => {
        onEnabledChange(Boolean(data.enabled))
        setPersonaName(data.persona_name ?? 'Camila')
        setOperatorLabels((data.api_operator_labels ?? []).join(', '))
        setOverrides(data.business_overrides ?? {})
      })
      .catch(e => console.error('settings fetch failed', e))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const save = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await fetch('/api/admin/wati-agent/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabled,
          persona_name: personaName,
          api_operator_labels: operatorLabels
            .split(',')
            .map(s => s.trim())
            .filter(Boolean),
          business_overrides: overrides,
        }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-400">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    )
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle className="text-base">Ajustes de Camila</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <label className="flex items-center justify-between">
          <span className="text-sm font-medium">Activada</span>
          <input type="checkbox" checked={enabled} onChange={e => onEnabledChange(e.target.checked)} className="h-4 w-4" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Nombre del asistente</span>
          <input
            type="text"
            value={personaName}
            onChange={e => setPersonaName(e.target.value)}
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Etiquetas de operador (separadas por coma)</span>
          <input
            type="text"
            value={operatorLabels}
            onChange={e => setOperatorLabels(e.target.value)}
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          />
        </label>
        {(['cde', 'sfc'] as const).map(suc => (
          <div key={suc} className="space-y-2 rounded-md border border-gray-200 p-3">
            <p className="text-sm font-semibold">{suc === 'cde' ? 'Costa del Este' : 'San Francisco'}</p>
            {LOCATION_FIELDS.map(([field, label]) => (
              <label key={field} className="block space-y-1">
                <span className="text-xs text-gray-500">{label}</span>
                <input
                  type="text"
                  value={overrides[suc]?.[field] ?? ''}
                  placeholder="(usar el valor por defecto)"
                  onChange={e => setOverrides(prev => ({ ...prev, [suc]: { ...prev[suc], [field]: e.target.value } }))}
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
            ))}
          </div>
        ))}
        <Button onClick={save} disabled={saving}>
          {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : null}
          {saved ? 'Guardado' : 'Guardar'}
        </Button>
      </CardContent>
    </Card>
  )
}
