'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ExpandableDescriptionProps {
  html: string
  maxLines?: number
  className?: string
  seeMoreText?: string
  seeLessText?: string
}

export function ExpandableDescription({
  html,
  maxLines = 2,
  className,
  seeMoreText = 'ver más',
  seeLessText = 'ver menos'
}: ExpandableDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [needsExpansion, setNeedsExpansion] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if content overflows the max lines
    if (measureRef.current && contentRef.current) {
      const lineHeight = parseInt(getComputedStyle(measureRef.current).lineHeight) || 20
      const maxHeight = lineHeight * maxLines
      const actualHeight = measureRef.current.scrollHeight
      setNeedsExpansion(actualHeight > maxHeight + 4) // 4px tolerance
    }
  }, [html, maxLines])

  return (
    <div className={cn('relative', className)}>
      {/* Hidden element to measure full content height */}
      <div
        ref={measureRef}
        className="absolute opacity-0 pointer-events-none text-xs text-warm-gray-600 leading-relaxed [&_p]:mb-0 [&_br]:hidden"
        style={{ width: '100%' }}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Visible content */}
      <div
        ref={contentRef}
        className={cn(
          'text-xs text-warm-gray-600 leading-relaxed [&_p]:mb-0 [&_br]:hidden overflow-hidden transition-all duration-200',
          !isExpanded && needsExpansion && 'line-clamp-2'
        )}
        style={!isExpanded && needsExpansion ? {
          display: '-webkit-box',
          WebkitLineClamp: maxLines,
          WebkitBoxOrient: 'vertical'
        } : undefined}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {needsExpansion && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-gold-600 hover:text-gold-700 font-medium mt-1 inline-block"
        >
          {isExpanded ? seeLessText : seeMoreText}
        </button>
      )}
    </div>
  )
}
