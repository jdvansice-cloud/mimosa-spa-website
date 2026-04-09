'use client'

import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react'

interface OtpInputProps {
  length?: number
  onComplete: (code: string) => void
  disabled?: boolean
  error?: boolean
}

export function OtpInput({ length = 6, onComplete, disabled = false, error = false }: OtpInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (error) {
      setValues(Array(length).fill(''))
      inputRefs.current[0]?.focus()
    }
  }, [error, length])

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const newValues = [...values]
    newValues[index] = digit
    setValues(newValues)

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    const code = newValues.join('')
    if (code.length === length && newValues.every(v => v !== '')) {
      onComplete(code)
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (pasted) {
      const newValues = Array(length).fill('')
      pasted.split('').forEach((char, i) => { newValues[i] = char })
      setValues(newValues)
      const nextIndex = Math.min(pasted.length, length - 1)
      inputRefs.current[nextIndex]?.focus()
      if (pasted.length === length) {
        onComplete(pasted)
      }
    }
  }

  return (
    <div className="flex gap-2 justify-center">
      {values.map((val, i) => (
        <input
          key={i}
          ref={el => { inputRefs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={val}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl
                     focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold
                     transition-all disabled:opacity-50
                     ${error ? 'border-red-300 bg-red-50' : 'border-beige-200 bg-white'}`}
        />
      ))}
    </div>
  )
}
