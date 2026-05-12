'use client'

import { LabelBarcode } from './LabelBarcode'
import { LabelCard, LABEL_WIDTH_IN, LABEL_HEIGHT_IN, formatLabelMoney } from './types'

/**
 * Certificado de Regalo label — treatment-priced (ITBMS-inclusive).
 *
 * Physical size: 2.25" × 1.25" thermal label.
 * Layout (top → bottom):
 *   - Brand strip      MIMOSA SPA · CERTIFICADO DE REGALO
 *   - Recipient        Para: <name>             (if print_recipient)
 *   - Treatment        <treatment name>         (always — defines the gift)
 *   - Amount           $XX.XX  (incl. ITBMS)    (if print_amount)
 *   - Message          "<message>"              (if print_message)
 *   - Barcode          [CODE128]
 *   - Serial           MG-NNNNNN
 *
 * Tweak this file in isolation — no other template depends on it.
 */
export function CertificadoLabel({ card }: { card: LabelCard }) {
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
      {/* Brand strip */}
      <div
        className="flex items-baseline justify-between"
        style={{ fontSize: '7pt', letterSpacing: '0.04em' }}
      >
        <span style={{ fontWeight: 700 }}>MIMOSA SPA</span>
        <span style={{ fontWeight: 600, textTransform: 'uppercase' }}>
          Certificado de Regalo
        </span>
      </div>

      <div
        style={{
          borderTop: '0.5pt solid #000',
          margin: '0.02in 0',
        }}
      />

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center" style={{ gap: '0.02in' }}>
        {card.print_recipient && (
          <div style={{ fontSize: '7.5pt' }}>
            <span style={{ fontWeight: 600 }}>Para: </span>
            <span>{card.recipient_name}</span>
          </div>
        )}
        {card.treatment_name && (
          <div
            style={{
              fontSize: '8pt',
              fontWeight: 600,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {card.treatment_name}
          </div>
        )}
        {card.print_amount && (
          <div className="flex items-baseline" style={{ gap: '0.04in' }}>
            <span style={{ fontSize: '13pt', fontWeight: 800, lineHeight: 1 }}>
              {formatLabelMoney(card.amount_cents, card.currency)}
            </span>
            <span style={{ fontSize: '5.5pt' }}>incl. ITBMS</span>
          </div>
        )}
        {card.print_message && card.message && (
          <div
            style={{
              fontSize: '6pt',
              fontStyle: 'italic',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
            }}
          >
            “{card.message}”
          </div>
        )}
      </div>

      {/* Barcode + serial */}
      <div className="flex flex-col items-center" style={{ gap: '0.01in' }}>
        <LabelBarcode serial={card.serial} widthIn={1.9} heightIn={0.28} />
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
