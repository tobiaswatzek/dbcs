import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { autosavePlugin } from '../../plugins/autosave'
import { useCharacterStore } from '../../stores/character'
import { createBlankCharacter } from '../../utils/character'
import type { Character } from '../../types/character'

const mockChar = (): Character => ({
  ...createBlankCharacter(),
  id: '1',
  updatedAt: '2026-01-01T00:00:00.000Z',
})

vi.mock('../../db', () => ({
  getCharacter: vi.fn(),
  putCharacter: vi.fn().mockResolvedValue(undefined),
}))

beforeEach(() => {
  vi.useFakeTimers()
  const pinia = createPinia()
  const app = createApp({})
  app.use(pinia)
  pinia.use(autosavePlugin)
  setActivePinia(pinia)
})

afterEach(() => {
  vi.useRealTimers()
  vi.clearAllMocks()
})

describe('autosavePlugin', () => {
  it('calls putCharacter after 300 ms when character changes', async () => {
    const { getCharacter, putCharacter } = await import('../../db')
    vi.mocked(getCharacter).mockResolvedValueOnce(mockChar())
    const store = useCharacterStore()
    await store.loadCharacter('1')

    store.character!.name = 'Changed'
    expect(putCharacter).not.toHaveBeenCalled()

    vi.advanceTimersByTime(300)
    await vi.runAllTimersAsync()

    expect(putCharacter).toHaveBeenCalledOnce()
    expect(vi.mocked(putCharacter).mock.calls[0][0].name).toBe('Changed')
  })

  it('debounces rapid changes into one save', async () => {
    const { getCharacter, putCharacter } = await import('../../db')
    vi.mocked(getCharacter).mockResolvedValueOnce(mockChar())
    const store = useCharacterStore()
    await store.loadCharacter('1')

    store.character!.name = 'A'
    vi.advanceTimersByTime(100)
    store.character!.name = 'AB'
    vi.advanceTimersByTime(100)
    store.character!.name = 'ABC'
    vi.advanceTimersByTime(300)
    await vi.runAllTimersAsync()

    expect(putCharacter).toHaveBeenCalledOnce()
  })

  it('does not save when character is null', async () => {
    const { putCharacter } = await import('../../db')
    useCharacterStore() // just access store, don't load character
    vi.advanceTimersByTime(300)
    await vi.runAllTimersAsync()
    expect(putCharacter).not.toHaveBeenCalled()
  })
})
