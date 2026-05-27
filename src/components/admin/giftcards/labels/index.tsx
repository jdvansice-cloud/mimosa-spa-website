export { GiftCardLabel } from './GiftCardLabel'
export { LabelBarcode } from './LabelBarcode'
export {
  LABEL_WIDTH_IN,
  LABEL_HEIGHT_IN,
  formatLabelMoney,
} from './types'
export type { LabelCard } from './types'

import { GiftCardLabel } from './GiftCardLabel'
import type { LabelCard } from './types'

/** Single-template renderer — Mimosa has one label design. */
export function GiftCardLabelRenderer({ card }: { card: LabelCard }) {
  return <GiftCardLabel card={card} />
}
