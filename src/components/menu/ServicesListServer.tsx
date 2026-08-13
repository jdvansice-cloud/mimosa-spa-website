import { Clock, Star } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { MindbodyService } from '@/types/booking'
import { getVisibleTreatments, type TreatmentRow } from '@/lib/treatments'
import { sanitizeDescriptionHtml } from '@/lib/sanitize'
import { BookingButton } from './BookingButton'
import { ExpandableDescription } from './ExpandableDescription'
import { WhatsAppBookingLink } from '@/components/shared/WhatsAppBookingLink'

interface ServicesListServerProps {
  programIds: number[]
  locale: string
  showTopPicks?: boolean
  hideTopPicksFromList?: boolean
  onlyTopPicks?: boolean
  /** Hide the WhatsApp fallback card when the program list is empty */
  hideEmptyFallback?: boolean
}

// Synthesized shape for the client BookingButton island. The booking page
// re-fetches the service by id, so this only seeds the pre-selection path.
function toMindbodyService(row: TreatmentRow): MindbodyService {
  return {
    Id: row.mindbody_service_id,
    Name: row.service_name,
    Description: row.description,
    Duration: row.duration ?? 0,
    Price: row.price ?? 0,
    OnlineBooking: row.show_booking_button,
    Category: row.category ?? '',
    ProgramId: row.program_id,
  }
}

// Server-rendered replacement for the old client ServicesList: treatment
// names, prices and descriptions are real HTML for search engines.
// Description HTML is admin-managed and passed through sanitizeDescriptionHtml
// (strips scripts/handlers) before rendering.
export async function ServicesListServer({
  programIds,
  locale,
  showTopPicks = true,
  hideTopPicksFromList = false,
  onlyTopPicks = false,
  hideEmptyFallback = false,
}: ServicesListServerProps) {
  const [services, t, tWa] = await Promise.all([
    getVisibleTreatments(programIds),
    getTranslations({ locale, namespace: 'menu' }),
    getTranslations({ locale, namespace: 'whatsapp' }),
  ])

  if (services.length === 0) {
    if (onlyTopPicks || hideEmptyFallback) return null
    // Never a spinner, never blank: a WhatsApp card until the catalog is seeded.
    return (
      <div className="text-center py-12 bg-beige-50 rounded-xl space-y-4">
        <p className="text-warm-gray">{t('noServices')}</p>
        <p className="text-sm text-warm-gray">{tWa('bookPrompt')}</p>
        <WhatsAppBookingLink cta="menu_empty_program" />
      </div>
    )
  }

  const topPicks = services.filter((s) => s.is_top_pick)
  const regularServices = hideTopPicksFromList
    ? services.filter((s) => !s.is_top_pick)
    : services

  const renderServiceCard = (row: TreatmentRow, isTopPick = false) => {
    const price = row.price ?? 0
    const priceLabel = price > 0 ? `$${price.toFixed(0)}` : t('priceOnRequest')
    const service = toMindbodyService(row)
    const safeDescription = row.description
      ? sanitizeDescriptionHtml(row.description)
      : null
    const waMessage =
      locale === 'en'
        ? `Hi, I would like to book ${row.service_name}${row.duration ? ` (${row.duration} min)` : ''}.`
        : `Hola, quiero reservar ${row.service_name}${row.duration ? ` (${row.duration} min)` : ''}.`

    return (
      <div
        key={row.mindbody_service_id}
        className={`bg-white rounded-lg md:rounded-xl border p-3 md:p-6 shadow-sm hover:shadow-md transition-shadow animate-fade-in ${
          isTopPick ? 'border-gold-300 ring-1 ring-gold-200' : 'border-beige-200'
        }`}
      >
        {/* Mobile Layout: Compact single column */}
        <div className="md:hidden">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              {isTopPick && (
                <Star className="w-4 h-4 text-gold-500 fill-gold-500 flex-shrink-0" />
              )}
              <h3 className="text-sm font-semibold text-dark truncate">{row.service_name}</h3>
              {(row.duration ?? 0) > 0 && (
                <span className="text-xs text-warm-gray flex-shrink-0">
                  - {row.duration} {t('duration')}
                </span>
              )}
            </div>
          </div>

          {safeDescription && (
            <ExpandableDescription
              html={safeDescription}
              maxLines={2}
              seeMoreText={t('seeMore')}
              seeLessText={t('seeLess')}
              className="mb-2"
            />
          )}

          <div className="flex items-center justify-between gap-2">
            <span className="text-lg font-bold text-gold-600">{priceLabel}</span>
            <div className="flex items-center gap-2">
              <WhatsAppBookingLink
                cta="menu_card"
                message={waMessage}
                variant="link"
                className="text-xs"
              />
              {row.show_booking_button && (
                <BookingButton
                  service={service}
                  locale={locale}
                  label={t('bookNow')}
                  className="inline-flex items-center px-3 py-1.5 bg-gold text-dark text-xs font-semibold rounded-lg hover:bg-gold/90 transition-colors"
                />
              )}
            </div>
          </div>
        </div>

        {/* Desktop Layout: side-by-side */}
        <div className="hidden md:flex md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {isTopPick && (
                <Star className="w-5 h-5 text-gold-500 fill-gold-500 flex-shrink-0" />
              )}
              <h3 className="text-lg font-semibold text-dark">{row.service_name}</h3>
            </div>
            {safeDescription && (
              <div
                className="text-sm text-warm-gray-600 leading-relaxed [&_p]:mb-2 [&_br]:hidden"
                dangerouslySetInnerHTML={{ __html: safeDescription }}
              />
            )}
            <div className="mt-2">
              <WhatsAppBookingLink
                cta="menu_card"
                message={waMessage}
                variant="link"
                className="text-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            {(row.duration ?? 0) > 0 && (
              <span className="flex items-center gap-1 text-sm text-warm-gray bg-beige-100 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4" />
                {row.duration} {t('duration')}
              </span>
            )}
            <span className="text-xl font-bold text-gold-600 w-16 text-right">{priceLabel}</span>
            <div className="w-24">
              {row.show_booking_button && (
                <BookingButton
                  service={service}
                  locale={locale}
                  label={t('bookNow')}
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-gold text-dark text-sm font-semibold rounded-lg hover:bg-gold/90 transition-colors"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (onlyTopPicks) {
    if (topPicks.length === 0) return null
    return (
      <div className="bg-gradient-to-r from-gold-50 to-beige-50 rounded-xl p-4 md:p-6 border border-gold-200">
        <div className="flex items-center gap-2 mb-3 md:mb-5">
          <Star className="w-5 h-5 md:w-6 md:h-6 text-gold-500 fill-gold-500" />
          <h2 className="text-lg md:text-xl font-semibold text-dark">{t('topPicks')}</h2>
        </div>
        <div className="space-y-2 md:space-y-4">
          {topPicks.map((s) => renderServiceCard(s, true))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-8">
      {showTopPicks && topPicks.length > 0 && (
        <div className="bg-gradient-to-r from-gold-50 to-beige-50 rounded-xl p-4 md:p-6 border border-gold-200">
          <div className="flex items-center gap-2 mb-3 md:mb-5">
            <Star className="w-5 h-5 md:w-6 md:h-6 text-gold-500 fill-gold-500" />
            <h2 className="text-lg md:text-xl font-semibold text-dark">{t('topPicks')}</h2>
          </div>
          <div className="space-y-2 md:space-y-4">
            {topPicks.map((s) => renderServiceCard(s, true))}
          </div>
        </div>
      )}

      {regularServices.length > 0 && (
        <div>
          {showTopPicks && topPicks.length > 0 && (
            <h2 className="text-lg md:text-xl font-semibold text-dark mb-2 md:mb-4">
              {t('allServices')}
            </h2>
          )}
          <div className="space-y-2 md:space-y-4">
            {regularServices.map((s) => renderServiceCard(s))}
          </div>
        </div>
      )}
    </div>
  )
}
