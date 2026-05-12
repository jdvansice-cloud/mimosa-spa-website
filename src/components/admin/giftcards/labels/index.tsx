export { GiftCardLabel } from './GiftCardLabel'
export { CertificadoLabel } from './CertificadoLabel'
export { LabelBarcode } from './LabelBarcode'
export {
  LABEL_WIDTH_IN,
  LABEL_HEIGHT_IN,
  formatLabelMoney,
} from './types'
export type { LabelCard } from './types'

import { GiftCardLabel } from './GiftCardLabel'
import { CertificadoLabel } from './CertificadoLabel'
import type { LabelCard } from './types'

/** Renders the correct template for the card's format. */
export function GiftCardLabelRenderer({ card }: { card: LabelCard }) {
  return card.format === 'certificado'
    ? <CertificadoLabel card={card} />
    : <GiftCardLabel card={card} />
}
