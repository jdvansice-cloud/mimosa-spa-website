export { GiftCardLabel } from './GiftCardLabel'
export { CertificadoLabel } from './CertificadoLabel'
export { MembershipLabel } from './MembershipLabel'
export { LabelBarcode } from './LabelBarcode'
export {
  LABEL_WIDTH_IN,
  LABEL_HEIGHT_IN,
  formatLabelMoney,
} from './types'
export type { LabelCard, GiftCardFormat } from './types'

import { GiftCardLabel } from './GiftCardLabel'
import { CertificadoLabel } from './CertificadoLabel'
import { MembershipLabel } from './MembershipLabel'
import type { LabelCard } from './types'

/** Renders the correct template for the card's format. */
export function GiftCardLabelRenderer({ card }: { card: LabelCard }) {
  switch (card.format) {
    case 'certificado':
      return <CertificadoLabel card={card} />
    case 'privilege':
      return <MembershipLabel card={card} />
    case 'gift_card':
    default:
      return <GiftCardLabel card={card} />
  }
}
