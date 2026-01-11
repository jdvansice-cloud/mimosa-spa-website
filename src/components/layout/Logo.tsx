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

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
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
          textSizes[size],
          textColor
        )}>
          Mimosa
        </span>
        <span className={cn('text-xs tracking-[0.15em] uppercase -mt-0.5', subtextColor)}>
          Spa Retreat
        </span>
      </div>
    )
  }

  // Full variant - for dark theme, use icon + text; for light, use full logo image
  if (theme === 'dark') {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <div 
          className="relative flex-shrink-0" 
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
        <div className="flex flex-col">
          <span className={cn(
            'font-display font-semibold tracking-wide',
            textSizes[size],
            textColor
          )}>
            Mimosa
          </span>
          <span className={cn('text-xs tracking-[0.15em] uppercase -mt-0.5', subtextColor)}>
            Spa Retreat
          </span>
        </div>
      </div>
    )
  }

  // Light theme - use full logo image
  return (
    <div 
      className={cn('relative', className)} 
      style={{ width: fullSizes[size].width, height: fullSizes[size].height }}
    >
      <Image
        src="/logo.png"
        alt="Mimosa Spa Retreat"
        fill
        className="object-contain object-left"
        priority
      />
    </div>
  )
}
