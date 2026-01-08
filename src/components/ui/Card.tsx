'use client'

import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

export function Card({
  className,
  variant = 'default',
  padding = 'md',
  hover = false,
  children,
  ...props
}: CardProps) {
  const variants = {
    default: 'bg-white shadow-card',
    elevated: 'bg-white shadow-elevated',
    outline: 'bg-white border border-beige-300',
  }

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <div
      className={cn(
        'rounded-2xl overflow-hidden transition-all duration-300',
        variants[variant],
        paddings[padding],
        hover && 'hover:shadow-elevated hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  )
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export function CardTitle({
  className,
  as: Component = 'h3',
  children,
  ...props
}: CardTitleProps) {
  return (
    <Component
      className={cn('text-xl font-display font-semibold text-dark', className)}
      {...props}
    >
      {children}
    </Component>
  )
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function CardDescription({
  className,
  children,
  ...props
}: CardDescriptionProps) {
  return (
    <p className={cn('text-warm-gray text-sm mt-1', className)} {...props}>
      {children}
    </p>
  )
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div
      className={cn('mt-4 pt-4 border-t border-beige-200 flex items-center', className)}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: 'square' | 'video' | 'wide'
  overlay?: boolean
}

export function CardImage({
  className,
  aspectRatio = 'video',
  overlay = false,
  alt = '',
  ...props
}: CardImageProps) {
  const aspects = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]',
  }

  return (
    <div className={cn('relative overflow-hidden', aspects[aspectRatio])}>
      <img
        className={cn(
          'w-full h-full object-cover transition-transform duration-500',
          'group-hover:scale-105',
          className
        )}
        alt={alt}
        {...props}
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      )}
    </div>
  )
}
