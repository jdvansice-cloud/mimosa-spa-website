'use client'

import { useEffect, useState } from 'react'
import { Phone } from 'lucide-react'

// The single phone-entry pattern for the whole site: country-code selector +
// local number. Emits digits only, WATI format (code + number, NO '+'),
// e.g. 50766124546. Keep the code list in sync with the portal login page.
const COUNTRY_CODES = ['507', '1', '52', '57', '506', '593', '51', '58', '34']

function splitValue(value: string): { cc: string; local: string } {
  const digits = (value || '').replace(/\D/g, '')
  // Longest code first so 507/506 win over 50, 57 etc.
  const byLength = [...COUNTRY_CODES].sort((a, b) => b.length - a.length)
  for (const code of byLength) {
    // Only treat it as a code when there is a number after it — a bare local
    // number like 66124546 stays local under the default +507.
    if (digits.startsWith(code) && digits.length > code.length + 5) {
      return { cc: code, local: digits.slice(code.length) }
    }
  }
  return { cc: '507', local: digits }
}

interface PhoneInputProps {
  /** Full number in digits (e.g. 50766124546); '' when empty */
  value: string
  onChange: (fullNumber: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  /** Class for the local-number input */
  inputClassName?: string
  /** Class for the country select */
  selectClassName?: string
  showIcon?: boolean
}

export function PhoneInput({
  value,
  onChange,
  placeholder = '6612 3456',
  required,
  disabled,
  inputClassName,
  selectClassName,
  showIcon = true,
}: PhoneInputProps) {
  const initial = splitValue(value)
  const [cc, setCc] = useState(initial.cc)
  const [local, setLocal] = useState(initial.local)

  // Adopt external value changes (async prefill from an API); no-op when the
  // change came from our own emit, so typing isn't disturbed.
  useEffect(() => {
    const digits = (value || '').replace(/\D/g, '')
    const current = local.replace(/\D/g, '') ? `${cc}${local.replace(/\D/g, '')}` : ''
    if (digits !== current) {
      const next = splitValue(digits)
      setCc(next.cc)
      setLocal(next.local)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const emit = (nextCc: string, nextLocal: string) => {
    const digits = nextLocal.replace(/\D/g, '')
    onChange(digits ? `${nextCc}${digits}` : '')
  }

  const defaultInputCls =
    'w-full py-3 border-2 border-beige-200 rounded-xl text-sm focus:outline-none ' +
    'focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all disabled:opacity-50 ' +
    (showIcon ? 'pl-10 pr-3' : 'px-3')
  const defaultSelectCls =
    'w-24 px-2 py-3 border-2 border-beige-200 rounded-xl text-sm bg-white ' +
    'focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all disabled:opacity-50'

  return (
    <div className="flex gap-2">
      <select
        value={`+${cc}`}
        onChange={(e) => {
          const next = e.target.value.replace('+', '')
          setCc(next)
          emit(next, local)
        }}
        disabled={disabled}
        className={selectClassName || defaultSelectCls}
        aria-label="Código de país"
      >
        {COUNTRY_CODES.map((code) => (
          <option key={code} value={`+${code}`}>+{code}</option>
        ))}
      </select>
      <div className="relative flex-1">
        {showIcon && (
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
        )}
        <input
          type="tel"
          value={local}
          onChange={(e) => {
            setLocal(e.target.value)
            emit(cc, e.target.value)
          }}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={inputClassName || defaultInputCls}
        />
      </div>
    </div>
  )
}
