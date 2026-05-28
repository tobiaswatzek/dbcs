import type { PiniaPluginContext } from 'pinia'
import { watch } from 'vue'
import { putCharacter } from '../db'

export function autosavePlugin({ store }: PiniaPluginContext) {
  if (store.$id !== 'character') return

  let timeout: ReturnType<typeof setTimeout> | null = null
  let saving = false

  watch(
    () => store.$state,
    (state) => {
      if (saving || !state.character) return
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(async () => {
        if (!state.character) return
        const updatedAt = new Date().toISOString()
        const toSave = JSON.parse(JSON.stringify(state.character)) as typeof state.character
        toSave.updatedAt = updatedAt
        await putCharacter(toSave)
        saving = true
        store.$patch((s: typeof state) => {
          if (s.character) s.character.updatedAt = updatedAt
        })
        saving = false
      }, 300)
    },
    { deep: true, flush: 'sync' },
  )
}
