import { beforeEach, describe, expect, it } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'
import {
  deleteCharacter,
  getAllCharacterSummaries,
  getCharacter,
  putCharacter,
  resetDb,
} from '../db'
import type { Character } from '../types/character'
import { createBlankCharacter } from '../utils/character'

function makeChar(overrides: Partial<Character> = {}): Character {
  return {
    ...createBlankCharacter(),
    id: 'id-1',
    updatedAt: '2026-01-01T00:00:00.000Z',
    name: 'Test Hero',
    ...overrides,
  }
}

beforeEach(() => {
  globalThis.indexedDB = new IDBFactory()
  resetDb()
})

describe('putCharacter / getCharacter', () => {
  it('stores and retrieves a character', async () => {
    await putCharacter(makeChar())
    expect(await getCharacter('id-1')).toEqual(makeChar())
  })

  it('returns undefined for unknown id', async () => {
    expect(await getCharacter('nope')).toBeUndefined()
  })

  it('overwrites on re-put', async () => {
    await putCharacter(makeChar({ name: 'Original' }))
    await putCharacter(makeChar({ name: 'Updated' }))
    expect((await getCharacter('id-1'))?.name).toBe('Updated')
  })
})

describe('deleteCharacter', () => {
  it('removes the character', async () => {
    await putCharacter(makeChar())
    await deleteCharacter('id-1')
    expect(await getCharacter('id-1')).toBeUndefined()
  })
})

describe('getAllCharacterSummaries', () => {
  it('returns [] when empty', async () => {
    expect(await getAllCharacterSummaries()).toEqual([])
  })

  it('returns only summary fields', async () => {
    await putCharacter(makeChar({ id: 'a', name: 'Alice', kin: 'Elf', profession: 'Mage' }))
    const summaries = await getAllCharacterSummaries()
    expect(summaries).toHaveLength(1)
    expect(summaries[0]).toEqual({
      id: 'a',
      name: 'Alice',
      kin: 'Elf',
      profession: 'Mage',
      updatedAt: '2026-01-01T00:00:00.000Z',
    })
    expect(Object.keys(summaries[0]!)).toHaveLength(5)
  })
})
