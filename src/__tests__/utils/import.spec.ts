import { describe, expect, it } from 'vitest'
import { parseAndValidateCharacter } from '../../utils/import'
import { createBlankCharacter } from '../../utils/character'

function validJson(): string {
  return JSON.stringify({
    ...createBlankCharacter(),
    id: 'x',
    updatedAt: '2026-01-01T00:00:00.000Z',
  })
}

describe('parseAndValidateCharacter', () => {
  it('accepts a valid character JSON', () => {
    expect(parseAndValidateCharacter(validJson()).success).toBe(true)
  })

  it('rejects malformed JSON', () => {
    const r = parseAndValidateCharacter('{bad')
    expect(r.success).toBe(false)
    if (!r.success) expect(r.error).toMatch(/Invalid JSON/)
  })

  it('rejects a non-object value', () => {
    const r = parseAndValidateCharacter('"a string"')
    expect(r.success).toBe(false)
  })

  it('rejects when "name" field is missing', () => {
    const obj = JSON.parse(validJson())
    delete obj.name
    const r = parseAndValidateCharacter(JSON.stringify(obj))
    expect(r.success).toBe(false)
    if (!r.success) expect(r.error).toContain('"name"')
  })

  it('rejects when "name" is not a string', () => {
    const obj = JSON.parse(validJson())
    obj.name = 99
    expect(parseAndValidateCharacter(JSON.stringify(obj)).success).toBe(false)
  })

  it('rejects when "attributes" is missing', () => {
    const obj = JSON.parse(validJson())
    delete obj.attributes
    expect(parseAndValidateCharacter(JSON.stringify(obj)).success).toBe(false)
  })

  it('rejects when "skills" is missing', () => {
    const obj = JSON.parse(validJson())
    delete obj.skills
    expect(parseAndValidateCharacter(JSON.stringify(obj)).success).toBe(false)
  })

  it('rejects the old abilities-only character shape', () => {
    const obj = JSON.parse(validJson())
    obj.abilities = ''
    delete obj.notes
    const r = parseAndValidateCharacter(JSON.stringify(obj))
    expect(r.success).toBe(false)
    if (!r.success) expect(r.error).toContain('"notes"')
  })

  it('rejects when heroic abilities are missing', () => {
    const obj = JSON.parse(validJson())
    delete obj.heroicAbilities
    const r = parseAndValidateCharacter(JSON.stringify(obj))
    expect(r.success).toBe(false)
    if (!r.success) expect(r.error).toContain('"heroicAbilities"')
  })

  it('rejects when spells are missing', () => {
    const obj = JSON.parse(validJson())
    delete obj.spells
    const r = parseAndValidateCharacter(JSON.stringify(obj))
    expect(r.success).toBe(false)
    if (!r.success) expect(r.error).toContain('"spells"')
  })
})
