import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Character } from '../types/character'
import { getCharacter } from '../db'

export const useCharacterStore = defineStore('character', () => {
  const character = ref<Character | null>(null)
  const isLoaded = ref(false)

  async function loadCharacter(id: string): Promise<boolean> {
    const c = await getCharacter(id)
    if (!c) return false
    character.value = c
    isLoaded.value = true
    return true
  }

  function clearCharacter() {
    character.value = null
    isLoaded.value = false
  }

  return { character, isLoaded, loadCharacter, clearCharacter }
})
