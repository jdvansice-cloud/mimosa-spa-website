import { describe, it, expect } from 'vitest'
import { splitBubbles } from './bubbles'

describe('splitBubbles', () => {
  it('splits on --- lines', () => {
    expect(splitBubbles('Hola\n---\n¿Para qué día?')).toEqual(['Hola', '¿Para qué día?'])
  })
  it('keeps a single bubble', () => expect(splitBubbles('Con gusto 🌼')).toEqual(['Con gusto 🌼']))
  it('caps at 3 bubbles, merging the rest', () => {
    expect(splitBubbles('a\n---\nb\n---\nc\n---\nd')).toEqual(['a', 'b', 'c\n\nd'])
  })
  it('drops empty bubbles', () => expect(splitBubbles('a\n---\n\n---\nb')).toEqual(['a', 'b']))
})
