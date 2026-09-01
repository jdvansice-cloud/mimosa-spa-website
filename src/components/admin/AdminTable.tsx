'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AdminColumn<T> {
  /** Stable identity for the column; also the React key. */
  key: string
  header: React.ReactNode
  render: (row: T) => React.ReactNode
  align?: 'left' | 'right' | 'center'
  /** Extra classes for the body cells in this column. */
  cellClassName?: string
  /** Header-only label for screen readers when `header` is intentionally blank. */
  srHeader?: string
}

interface AdminTableProps<T> {
  rows: T[]
  columns: Array<AdminColumn<T>>
  rowKey: (row: T) => string
  /**
   * Card body for viewports below `md`. Without it the table just scrolls
   * horizontally, which is what we're trying to get away from — so pass one
   * for any table a person might open on a phone.
   */
  mobileCard?: (row: T) => React.ReactNode
  loading?: boolean
  error?: string | null
  /** Shown when there are no rows and nothing is loading. */
  empty?: React.ReactNode
  /**
   * Pin the first column while the rest scrolls. Use when that column is the
   * row's identity (a serial, a code, a name) and the row is wide.
   */
  stickyFirstColumn?: boolean
  /** Extra props for each desktop `<tr>` — drag handlers, state classes. */
  rowProps?: (row: T) => React.HTMLAttributes<HTMLTableRowElement> & { draggable?: boolean }
  /**
   * Inline expansion: when `expandedKey` matches a row's key, `renderExpanded`
   * is rendered right under it — a full-width panel on desktop, appended to
   * the card on mobile. Details stay in the list instead of a page jump.
   */
  expandedKey?: string | null
  renderExpanded?: (row: T) => React.ReactNode
}

const ALIGN: Record<'left' | 'right' | 'center', string> = {
  left: 'text-left',
  right: 'text-right',
  center: 'text-center',
}

/**
 * Admin data table with a real mobile presentation.
 *
 * Above `md` it renders a table; below it, one card per row. Every admin table
 * previously relied on horizontal scroll alone, which put the identifying
 * column out of view exactly when you needed it.
 */
export function AdminTable<T>({
  rows,
  columns,
  rowKey,
  mobileCard,
  loading = false,
  error = null,
  empty = 'No hay datos.',
  stickyFirstColumn = false,
  rowProps,
  expandedKey = null,
  renderExpanded,
}: AdminTableProps<T>) {
  if (loading && rows.length === 0) {
    return (
      <div className="flex items-center justify-center py-12" aria-busy="true">
        <Loader2 className="h-8 w-8 animate-spin text-gold-600" />
        <span className="sr-only">Cargando…</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 rounded-lg bg-red-50 border border-red-200 text-red-700" role="alert">
        {error}
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="p-12 text-center text-warm-gray-500 bg-white border border-beige-300 rounded-lg">
        {empty}
      </div>
    )
  }

  return (
    <>
      {mobileCard && (
        <ul className="md:hidden space-y-3">
          {rows.map(row => (
            <li key={rowKey(row)} className="bg-white border border-beige-300 rounded-xl p-4">
              {mobileCard(row)}
              {renderExpanded && expandedKey === rowKey(row) && (
                <div className="mt-4 border-t border-beige-200 pt-4">{renderExpanded(row)}</div>
              )}
            </li>
          ))}
        </ul>
      )}

      <div
        className={cn(
          'bg-white border border-beige-300 rounded-lg overflow-hidden',
          mobileCard ? 'hidden md:block' : '',
        )}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-beige-200 text-warm-gray-500 uppercase text-xs">
              <tr>
                {columns.map((col, i) => (
                  <th
                    key={col.key}
                    scope="col"
                    className={cn(
                      'px-4 py-3 font-bold',
                      ALIGN[col.align ?? 'left'],
                      stickyFirstColumn && i === 0 ? 'sticky left-0 bg-beige-200 z-10' : '',
                    )}
                  >
                    {col.srHeader ? <span className="sr-only">{col.srHeader}</span> : col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => {
                const extra = rowProps?.(row) ?? {}
                return (
                <React.Fragment key={rowKey(row)}>
                <tr
                  {...extra}
                  className={cn('border-t border-beige-200 hover:bg-beige-50 group', extra.className)}
                >
                  {columns.map((col, i) => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-4 py-3 text-dark',
                        ALIGN[col.align ?? 'left'],
                        stickyFirstColumn && i === 0
                          ? 'sticky left-0 bg-white group-hover:bg-beige-50 z-10'
                          : '',
                        col.cellClassName,
                      )}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
                {renderExpanded && expandedKey === rowKey(row) && (
                  <tr key={`${rowKey(row)}-detail`} className="border-t border-beige-200">
                    <td colSpan={columns.length} className="px-4 py-4 bg-beige-50/50">
                      {renderExpanded(row)}
                    </td>
                  </tr>
                )}
                </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

/** Status pill with the tones used across the admin. */
export function StatusPill({
  tone, children,
}: {
  tone: 'green' | 'amber' | 'red' | 'gray'
  children: React.ReactNode
}) {
  const tones = {
    green: 'bg-green-100 text-green-800',
    amber: 'bg-amber-100 text-amber-800',
    red: 'bg-red-100 text-red-700',
    gray: 'bg-beige-300 text-warm-gray-600',
  }
  return (
    <span className={cn('inline-block text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap', tones[tone])}>
      {children}
    </span>
  )
}

/** Label/value row for mobile cards, so every card reads the same way. */
export function CardField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2 text-sm">
      <dt className="text-warm-gray-500 w-24 shrink-0">{label}</dt>
      <dd className="text-dark min-w-0">{children}</dd>
    </div>
  )
}
