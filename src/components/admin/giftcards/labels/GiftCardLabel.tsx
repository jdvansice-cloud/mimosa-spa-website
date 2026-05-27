'use client'

import { LabelBarcode } from './LabelBarcode'
import { LabelCard, LABEL_WIDTH_IN, LABEL_HEIGHT_IN, formatLabelMoney } from './types'

/**
 * Mimosa Gift Card label.
 *
 * Physical size: 2.25" × 1.25" thermal label (Star Micronics TSP143IIIU).
 * Layout:
 *   - Amount         top-right corner            (print_amount)
 *   - Treatments     Incluye: A · B · C          (print_treatments && list non-empty)
 *   - Message        "<message>"                 (print_message && message)
 *   - Barcode        [CODE128, narrow]
 *   - Serial         MGNNNNNN
 *
 * The recipient name is intentionally NOT printed — staff writes it by hand
 * on the gift card holder. The brand / "Gift Card" header is also intentionally
 * omitted; the label only carries data the customer needs.
 */
export function GiftCardLabel({ card }: { card: LabelCard }) {
  const showTreatments =
    card.print_treatments &&
    Array.isArray(card.gift_treatment_names) &&
    card.gift_treatment_names.length > 0
  const treatmentText = showTreatments
    ? (card.gift_treatment_names ?? []).join(' · ')
    : null

  return (
    <div
      className="bg-white text-black font-sans flex flex-col"
      style={{
        width: `${LABEL_WIDTH_IN}in`,
        height: `${LABEL_HEIGHT_IN}in`,
        padding: '0.06in 0.08in',
        boxSizing: 'border-box',
        lineHeight: 1.1,
      }}
    >
      {/* Top content area. Amount sits in the top-right corner; treatments
          and message flow below it on the left. */}
      <div className="flex-1 flex flex-col" style={{ gap: '0.03in' }}>
        {card.print_amount && (
          <div
            style={{
              alignSelf: 'flex-end',
              fontSize: '18pt',
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            {formatLabelMoney(card.amount_cents, card.currency)}
          </div>
        )}
        {treatmentText && (
          <div
            style={{
              fontSize: '7pt',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            <span style={{ fontWeight: 600 }}>Incluye: </span>
            <span>{treatmentText}</span>
          </div>
        )}
        {card.print_message && card.message && (
          <div
            style={{
              fontSize: '7pt',
              fontStyle: 'italic',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            “{card.message}”
          </div>
        )}
      </div>

      {/* Barcode + serial — centered, narrow and short. */}
      <div className="flex flex-col items-center" style={{ gap: '0.01in' }}>
        <LabelBarcode serial={card.serial} widthIn={1.4} heightIn={0.22} />
        <div
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: '7pt',
            letterSpacing: '0.08em',
          }}
        >
          {card.serial}
        </div>
      </div>
    </div>
  )
}
