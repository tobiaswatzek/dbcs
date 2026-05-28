import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CharacterSummary } from '../types/character'
import { getAllCharacterSummaries, deleteCharacter as dbDelete } from '../db'

export const useCharacterListStore = defineStore('characterList', () => {
  const summaries = ref<CharacterSummary[]>([])
  const isLoaded = ref(false)

  async function loadSummaries() {
    summaries.value = await getAllCharacterSummaries()
    isLoaded.value = true
  }

  function addSummary(summary: CharacterSummary) {
    summaries.value.push(summary)
  }

  function updateSummary(summary: CharacterSummary) {
    const idx = summaries.value.findIndex((s) => s.id === summary.id)
    if (idx !== -1) summaries.value[idx] = summary
  }

  async function removeCharacter(id: string) {
    await dbDelete(id)
    summaries.value = summaries.value.filter((s) => s.id !== id)
  }

  return {
    summaries,
    isLoaded,
    loadSummaries,
    addSummary,
    updateSummary,
    removeCharacter,
  }
})
