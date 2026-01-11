'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  variant?: 'full' | 'icon' | 'text'
  theme?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ className, variant = 'full', theme = 'light', size = 'md' }: LogoProps) {
  const sizes = {
    sm: { width: 120, height: 40, iconSize: 32 },
    md: { width: 160, height: 50, iconSize: 48 },
    lg: { width: 200, height: 60, iconSize: 64 },
  }

  const textColor = theme === 'dark' ? 'text-cream' : 'text-dark'
  const subtextColor = theme === 'dark' ? 'text-cream/70' : 'text-warm-gray'
  const goldColor = theme === 'dark' ? '#FCCF08' : '#FCCF08'

  // Icon only variant - Mimosa flower
  if (variant === 'icon') {
    return (
      <div className={cn('', className)} style={{ width: sizes[size].iconSize, height: sizes[size].iconSize }}>
        <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="25" cy="14" r="8" fill={goldColor}/>
          <circle cx="15" cy="22" r="6" fill={goldColor} opacity="0.8"/>
          <circle cx="35" cy="22" r="6" fill={goldColor} opacity="0.8"/>
          <circle cx="17" cy="32" r="5" fill={goldColor} opacity="0.6"/>
          <circle cx="33" cy="32" r="5" fill={goldColor} opacity="0.6"/>
          <path d="M25 24V44" stroke="#7A9E7E" strokeWidth="2" strokeLinecap="round"/>
          <path d="M25 30L20 36" stroke="#7A9E7E" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M25 36L30 42" stroke="#7A9E7E" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
    )
  }

  // Text only variant
  if (variant === 'text') {
    return (
      <div className={cn('flex flex-col', className)}>
        <span className={cn(
          'font-display font-semibold tracking-wide',
          size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-2xl',
          textColor
        )}>
          Mimosa
        </span>
        <span className={cn('text-xs tracking-[0.2em] uppercase -mt-1', subtextColor)}>
          Spa Retreat
        </span>
      </div>
    )
  }

  // Full variant - Use image if available, otherwise SVG fallback
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Mimosa flower icon */}
      <div style={{ width: sizes[size].iconSize, height: sizes[size].iconSize }}>
        <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="25" cy="14" r="8" fill={goldColor}/>
          <circle cx="15" cy="22" r="6" fill={goldColor} opacity="0.8"/>
          <circle cx="35" cy="22" r="6" fill={goldColor} opacity="0.8"/>
          <circle cx="17" cy="32" r="5" fill={goldColor} opacity="0.6"/>
          <circle cx="33" cy="32" r="5" fill={goldColor} opacity="0.6"/>
          <path d="M25 24V44" stroke="#7A9E7E" strokeWidth="2" strokeLinecap="round"/>
          <path d="M25 30L20 36" stroke="#7A9E7E" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M25 36L30 42" stroke="#7A9E7E" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      
      {/* Text */}
      <div className="flex flex-col">
        <span className={cn(
          'font-display font-semibold tracking-wide',
          size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-2xl',
          textColor
        )}>
          Mimosa
        </span>
        <span className={cn('text-xs tracking-[0.2em] uppercase -mt-1', subtextColor)}>
          Spa Retreat
        </span>
      </div>
    </div>
  )
}

// Export a version that uses custom image
export function LogoWithImage({ 
  src, 
  className,
  theme = 'light',
  size = 'md' 
}: { 
  src: string
  className?: string
  theme?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizes = {
    sm: { width: 120, height: 40 },
    md: { width: 160, height: 50 },
    lg: { width: 200, height: 60 },
  }

  return (
    <div className={cn('relative', className)} style={{ width: sizes[size].width, height: sizes[size].height }}>
      <Image
        src={src}
        alt="Mimosa Spa Retreat"
        fill
        className="object-contain"
        priority
      />
    </div>
  )
}
