import { describe, expect, it } from 'vitest'
import { createBlankCharacter } from '../../utils/character'

describe('createBlankCharacter', () => {
  it('creates empty notes, heroic abilities, and spells fields', () => {
    const character = createBlankCharacter()

    expect(character.notes).toBe('')
    expect(character.heroicAbilities).toEqual([])
    expect(character.spells).toEqual([])
    expect('abilities' in character).toBe(false)
  })
})
