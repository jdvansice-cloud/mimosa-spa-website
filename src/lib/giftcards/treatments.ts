/**
 * Treatment lines on a gift card.
 *
 * Storage is deliberately simple: `gift_cards.gift_treatment_names` is a
 * plain string[] and QUANTITY IS REPETITION — a couple's card that includes
 * the same massage twice stores ["Masaje Relajante", "Masaje Relajante"].
 * That keeps every existing card, the issue/edit APIs and the Mindbody-side
 * logic unchanged; only the presentation collapses repeats into "2× Masaje
 * Relajante". Every place that shows the list goes through
 * formatTreatmentNames() so the label, the admin list, the detail view and
 * the public gift page all read the same.
 */

export interface TreatmentLine {
  name: string
  qty: number
}

/** Collapse repeated names into {name, qty}, keeping first-seen order. */
export function collapseTreatmentNames(names: readonly string[] | null | undefined): TreatmentLine[] {
  const out: TreatmentLine[] = []
  for (const raw of names ?? []) {
    const name = raw.trim()
    if (!name) continue
    const line = out.find(l => l.name === name)
    if (line) line.qty += 1
    else out.push({ name, qty: 1 })
  }
  return out
}

/** Inverse of collapse: repeat each name `qty` times for storage. */
export function expandTreatmentLines(lines: readonly TreatmentLine[]): string[] {
  const out: string[] = []
  for (const { name, qty } of lines) {
    for (let i = 0; i < Math.max(1, qty); i++) out.push(name)
  }
  return out
}

/** "2× Masaje Relajante" — quantity prefix only when it's more than one. */
export function formatTreatmentLine({ name, qty }: TreatmentLine): string {
  return qty > 1 ? `${qty}× ${name}` : name
}

/** Human line for a stored list: "2× Masaje Relajante · Facial Hidratante". */
export function formatTreatmentNames(
  names: readonly string[] | null | undefined,
  separator = ' · ',
): string {
  return collapseTreatmentNames(names).map(formatTreatmentLine).join(separator)
}
