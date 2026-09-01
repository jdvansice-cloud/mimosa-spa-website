'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2, UserRound } from 'lucide-react'

/**
 * Name input with Mindbody client typeahead.
 *
 * Free text always wins: this is a plain input that happens to offer
 * suggestions, so a buyer who isn't a client yet is just typed in — no mode
 * switch, no "custom name" checkbox. Picking a suggestion hands the full
 * client to onSelect so the form can prefill email/phone.
 */

export interface ClientSuggestion {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
}

const fullName = (c: ClientSuggestion) =>
  [c.first_name, c.last_name].filter(Boolean).join(' ').trim()

export function ClientLookupInput({
  value,
  onChange,
  onSelect,
  required,
  placeholder,
  id,
}: {
  value: string
  onChange: (v: string) => void
  /** A suggestion was picked (never fires for free text). */
  onSelect: (client: ClientSuggestion) => void
  required?: boolean
  placeholder?: string
  id?: string
}) {
  const [suggestions, setSuggestions] = useState<ClientSuggestion[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [highlight, setHighlight] = useState(-1)
  // Suppress the lookup for the value we just selected — retriggering the
  // dropdown right after a pick reads as the UI refusing to accept it.
  const selectedRef = useRef<string | null>(null)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const q = value.trim()
    if (q.length < 2 || q === selectedRef.current) {
      setSuggestions([])
      setOpen(false)
      return
    }
    const t = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/admin/clients?q=${encodeURIComponent(q)}`)
        const data = await res.json()
        if (res.ok) {
          setSuggestions(data.data ?? [])
          setOpen((data.data ?? []).length > 0)
          setHighlight(-1)
        }
      } catch {
        // lookup is a convenience — typing plain text must keep working
      } finally {
        setLoading(false)
      }
    }, 250)
    return () => clearTimeout(t)
  }, [value])

  // Close on outside click.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const pick = (c: ClientSuggestion) => {
    const name = fullName(c) || value
    selectedRef.current = name
    onChange(name)
    onSelect(c)
    setOpen(false)
  }

  return (
    <div ref={boxRef} className="relative">
      <input
        id={id}
        type="text"
        className="input w-full"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => {
          if (!open) return
          if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight(h => Math.min(h + 1, suggestions.length - 1)) }
          else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight(h => Math.max(h - 1, 0)) }
          else if (e.key === 'Enter' && highlight >= 0) { e.preventDefault(); pick(suggestions[highlight]) }
          else if (e.key === 'Escape') setOpen(false)
        }}
        required={required}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
      />
      {loading && (
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-warm-gray-400" />
      )}
      {open && (
        <ul
          role="listbox"
          className="absolute z-20 mt-1 w-full max-h-72 overflow-auto rounded-lg border border-beige-300 bg-white shadow-lg"
        >
          {suggestions.map((c, i) => (
            <li key={c.id} role="option" aria-selected={i === highlight}>
              <button
                type="button"
                // mousedown, not click: click fires after blur closes the list
                onMouseDown={e => { e.preventDefault(); pick(c) }}
                onMouseEnter={() => setHighlight(i)}
                className={`w-full text-left px-3 py-2.5 flex items-start gap-2.5 ${i === highlight ? 'bg-beige-100' : ''}`}
              >
                <UserRound className="h-4 w-4 mt-0.5 shrink-0 text-warm-gray-400" />
                <span className="min-w-0">
                  <span className="block text-sm text-dark truncate">{fullName(c) || '(sin nombre)'}</span>
                  {(c.email || c.phone) && (
                    <span className="block text-xs text-warm-gray-500 truncate">
                      {[c.email, c.phone].filter(Boolean).join(' · ')}
                    </span>
                  )}
                </span>
              </button>
            </li>
          ))}
          <li className="px-3 py-2 text-xs text-warm-gray-400 border-t border-beige-200">
            O sigue escribiendo un nombre nuevo — no hace falta elegir.
          </li>
        </ul>
      )}
    </div>
  )
}
