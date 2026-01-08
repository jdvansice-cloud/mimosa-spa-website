'use client'

import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  variant?: 'full' | 'icon'
}

export function Logo({ className, variant = 'full' }: LogoProps) {
  if (variant === 'icon') {
    return (
      <div className={cn('text-gold', className)}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
          <path
            d="M20 10C15 10 12 14 12 18C12 22 14 25 17 27C14 25 12 22 12 18C12 14 15 10 20 10Z"
            fill="currentColor"
          />
          <path
            d="M20 10C25 10 28 14 28 18C28 22 26 25 23 27C26 25 28 22 28 18C28 14 25 10 20 10Z"
            fill="currentColor"
          />
          <circle cx="20" cy="18" r="4" fill="currentColor" />
          <path
            d="M16 28L20 32L24 28"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Mimosa flower icon */}
      <div className="text-gold w-10 h-10">
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <circle cx="20" cy="14" r="6" fill="currentColor" />
          <circle cx="12" cy="20" r="5" fill="currentColor" opacity="0.8" />
          <circle cx="28" cy="20" r="5" fill="currentColor" opacity="0.8" />
          <circle cx="14" cy="28" r="4" fill="currentColor" opacity="0.6" />
          <circle cx="26" cy="28" r="4" fill="currentColor" opacity="0.6" />
          <path
            d="M20 20V36"
            stroke="#7A9E7E"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M20 24L16 28"
            stroke="#7A9E7E"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M20 28L24 32"
            stroke="#7A9E7E"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      
      {/* Text */}
      <div className="flex flex-col">
        <span className="font-display text-2xl font-semibold text-dark tracking-wide">
          Mimosa
        </span>
        <span className="text-xs text-warm-gray tracking-[0.2em] uppercase -mt-1">
          Spa Retreat
        </span>
      </div>
    </div>
  )
}
