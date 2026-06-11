import type { Character } from '../types/character'

type ImportSuccess = {
  success: true
  character: Omit<Character, 'id' | 'updatedAt'>
}
type ImportFailure = { success: false; error: string }
export type ImportResult = ImportSuccess | ImportFailure

const REQUIRED_STRINGS = [
  'name',
  'kin',
  'profession',
  'age',
  'weakness',
  'appearance',
  'memento',
  'notes',
] as const

const REQUIRED_OBJECTS = [
  'attributes',
  'conditions',
  'deathRolls',
  'coins',
  'skills',
  'weaponSkills',
  'armor',
  'helmet',
] as const

const REQUIRED_ARRAYS = [
  'secondarySkills',
  'heroicAbilities',
  'spells',
  'weapons',
  'inventory',
  'tinyItems',
] as const

export function parseAndValidateCharacter(json: string): ImportResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    return {
      success: false,
      error: 'Invalid JSON: the file could not be parsed.',
    }
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return { success: false, error: 'Invalid format: expected a JSON object.' }
  }

  const obj = parsed as Record<string, unknown>

  for (const field of REQUIRED_STRINGS) {
    if (typeof obj[field] !== 'string') {
      return {
        success: false,
        error: `Invalid format: missing or invalid field "${field}".`,
      }
    }
  }

  for (const field of REQUIRED_OBJECTS) {
    if (typeof obj[field] !== 'object' || obj[field] === null || Array.isArray(obj[field])) {
      return {
        success: false,
        error: `Invalid format: missing or invalid field "${field}".`,
      }
    }
  }

  for (const field of REQUIRED_ARRAYS) {
    if (!Array.isArray(obj[field])) {
      return {
        success: false,
        error: `Invalid format: "${field}" must be an array.`,
      }
    }
  }

  return {
    success: true,
    character: obj as unknown as Omit<Character, 'id' | 'updatedAt'>,
  }
}
