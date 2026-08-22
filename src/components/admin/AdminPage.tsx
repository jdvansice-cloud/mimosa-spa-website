import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface Breadcrumb {
  href: string
  label: string
}

interface AdminPageProps {
  title: string
  /** One line under the title explaining what this screen is for. */
  description?: React.ReactNode
  /** Shown in a tinted square to the left of the title. */
  icon?: React.ComponentType<{ className?: string }>
  /** Link back to the parent screen, for sub-pages. */
  breadcrumb?: Breadcrumb
  /** Primary actions, right-aligned on wide screens. */
  actions?: React.ReactNode
  children: React.ReactNode
}

/**
 * The standard admin page shell: one header treatment for every screen.
 *
 * Replaces the four different header patterns that had accumulated across the
 * panel (text-3xl display, text-2xl display, text-2xl bold in the body font,
 * and icon-chip variants), so titles, spacing and back-links stay consistent.
 */
export function AdminPage({
  title,
  description,
  icon: Icon,
  breadcrumb,
  actions,
  children,
}: AdminPageProps) {
  return (
    <div>
      <header className="mb-6">
        {breadcrumb && (
          <Link
            href={breadcrumb.href}
            className="inline-flex items-center gap-1 min-h-[44px] text-sm text-warm-gray-500 hover:text-dark"
          >
            <ArrowLeft className="h-4 w-4" /> {breadcrumb.label}
          </Link>
        )}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              {Icon && (
                <span className="p-2 bg-gold/10 rounded-lg shrink-0">
                  <Icon className="h-6 w-6 text-gold-700" />
                </span>
              )}
              <h1 className="text-3xl font-display font-semibold text-dark">{title}</h1>
            </div>
            {description && (
              <p className="text-warm-gray-500 mt-2 max-w-2xl">{description}</p>
            )}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      </header>
      {children}
    </div>
  )
}
