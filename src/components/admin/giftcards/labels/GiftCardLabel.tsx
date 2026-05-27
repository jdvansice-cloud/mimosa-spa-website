'use client'

import { LabelBarcode } from './LabelBarcode'
import { LabelCard, LABEL_WIDTH_IN, LABEL_HEIGHT_IN, formatLabelMoney } from './types'

/**
 * Mimosa Gift Card label.
 *
 * Physical size: 2.25" × 1.25" thermal label (Star Micronics TSP143IIIU).
 * Layout (top → bottom):
 *   - Amount (top-right corner)             — print_amount
 *   - Middle band, vertically centered:
 *       Incluye: A · B · C                  — print_treatments && list non-empty
 *       "<message>"                         — print_message && message
 *   - Barcode + serial (centered, bottom)
 *
 * Recipient name is intentionally not printed — staff writes it by hand on
 * the gift card holder. No brand header; the label only carries the data
 * the customer needs.
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
      {/* Amount — anchored top-right with a touch of inset. */}
      {card.print_amount && (
        <div
          style={{
            alignSelf: 'flex-end',
            marginRight: '0.06in',
            fontSize: '13pt',
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          {formatLabelMoney(card.amount_cents, card.currency)}
        </div>
      )}

      {/* Middle text band — expands to fill the empty space between amount
          and barcode, and vertically centers its contents so the gap
          balances above and below. */}
      <div
        className="flex-1 flex flex-col justify-center"
        style={{ gap: '0.06in' }}
      >
        {treatmentText && (
          <div
            style={{
              fontSize: '6pt',
              lineHeight: 1.15,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
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
              textAlign: 'center',
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

      {/* Barcode + serial — centered, bottom. */}
      <div className="flex flex-col items-center" style={{ gap: '0.01in' }}>
        <LabelBarcode serial={card.serial} widthIn={1.13} heightIn={0.14} />
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
