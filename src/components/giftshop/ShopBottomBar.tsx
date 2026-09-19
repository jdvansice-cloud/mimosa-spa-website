'use client'

import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'

export function ShopBottomBar({
  onBack,
  backLabel,
  onNext,
  nextLabel,
  disabled,
  loading,
}: {
  onBack?: () => void
  backLabel: string
  onNext: () => void
  nextLabel: string
  disabled?: boolean
  loading?: boolean
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-beige shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
      <div className="max-w-4xl mx-auto px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-between">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] text-sm text-warm-gray hover:text-dark rounded-lg hover:bg-beige/60 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={disabled || loading}
          className="flex items-center gap-1.5 px-5 py-2.5 min-h-[44px] bg-gold text-dark text-sm font-semibold rounded-lg hover:bg-gold/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {nextLabel}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}
