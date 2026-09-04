/** Splits on lines that are exactly '---', trims each bubble, drops empties, merges overflow into the last bubble. */
export function splitBubbles(text: string, max = 3): string[] {
  const lines = text.split(/\r?\n/)
  const parts: string[] = []
  let current: string[] = []
  for (const line of lines) {
    if (line.trim() === '---') {
      parts.push(current.join('\n').trim())
      current = []
    } else {
      current.push(line)
    }
  }
  parts.push(current.join('\n').trim())
  const bubbles = parts.filter(Boolean)
  if (bubbles.length <= max) return bubbles
  return [...bubbles.slice(0, max - 1), bubbles.slice(max - 1).join('\n\n')]
}
