'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  variant?: 'full' | 'icon' | 'text'
  theme?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Logo({ className, variant = 'full', theme = 'light', size = 'md' }: LogoProps) {
  // Size configurations
  const fullSizes = {
    sm: { width: 120, height: 40 },
    md: { width: 160, height: 53 },
    lg: { width: 200, height: 67 },
    xl: { width: 280, height: 93 },
  }

  const iconSizes = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 80,
  }

  const textColor = theme === 'dark' ? 'text-cream' : 'text-dark'
  const subtextColor = theme === 'dark' ? 'text-cream/70' : 'text-warm-gray'

  // Icon only variant - Mimosa flower
  if (variant === 'icon') {
    return (
      <div 
        className={cn('relative', className)} 
        style={{ width: iconSizes[size], height: iconSizes[size] }}
      >
        <Image
          src="/logo-icon.png"
          alt="Mimosa Spa"
          fill
          className="object-contain"
          priority
        />
      </div>
    )
  }

  // Text only variant
  if (variant === 'text') {
    return (
      <div className={cn('flex flex-col', className)}>
        <span className={cn(
          'font-display font-semibold tracking-wide',
          size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : size === 'xl' ? 'text-4xl' : 'text-2xl',
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

  // Full variant - Complete logo image
  return (
    <div 
      className={cn('relative', className)} 
      style={{ width: fullSizes[size].width, height: fullSizes[size].height }}
    >
      <Image
        src="/logo.png"
        alt="Mimosa Spa Retreat"
        fill
        className={cn(
          'object-contain object-left',
          theme === 'dark' && 'brightness-0 invert'
        )}
        priority
      />
    </div>
  )
}
