<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCharacterListStore } from '../stores/characterList'
import { putCharacter, getCharacter } from '../db'
import { exportCharacterAsJson } from '../utils/export'
import { parseAndValidateCharacter } from '../utils/import'
import { createBlankCharacter } from '../utils/character'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import type { CharacterSummary } from '../types/character'

const router = useRouter()
const listStore = useCharacterListStore()

const deleteTarget = ref<CharacterSummary | null>(null)
const importError = ref<string | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

onMounted(() => listStore.loadSummaries())

async function createCharacter() {
  const character = {
    ...createBlankCharacter(),
    id: crypto.randomUUID(),
    updatedAt: new Date().toISOString(),
  }
  await putCharacter(character)
  listStore.addSummary({
    id: character.id,
    name: character.name,
    kin: character.kin,
    profession: character.profession,
    updatedAt: character.updatedAt,
  })
  router.push(`/character/${character.id}/skills`)
}

async function onFileSelected(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const text = await file.text()
  const result = parseAndValidateCharacter(text)
  if (!result.success) {
    importError.value = result.error
    return
  }
  importError.value = null
  const character = {
    ...result.character,
    id: crypto.randomUUID(),
    updatedAt: new Date().toISOString(),
  }
  await putCharacter(character)
  listStore.addSummary({
    id: character.id,
    name: character.name,
    kin: character.kin,
    profession: character.profession,
    updatedAt: character.updatedAt,
  })
  if (fileInputRef.value) fileInputRef.value.value = ''
}

async function exportCharacter(summary: CharacterSummary) {
  const character = await getCharacter(summary.id)
  if (character) exportCharacterAsJson(character)
}

async function onDeleteConfirmed() {
  if (!deleteTarget.value) return
  await listStore.removeCharacter(deleteTarget.value.id)
  deleteTarget.value = null
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <nav class="navbar bg-base-100 shadow-sm">
      <div class="flex-1"><h1 class="text-xl font-bold px-2">DBCS</h1></div>
      <div class="flex-none gap-2 pr-2">
        <button class="btn btn-primary min-h-[48px]" @click="createCharacter">New Character</button>
        <button class="btn min-h-[48px]" @click="fileInputRef?.click()">Import</button>
        <input
          ref="fileInputRef"
          type="file"
          accept=".json"
          class="hidden"
          @change="onFileSelected"
        />
      </div>
    </nav>

    <main class="p-4 flex flex-col gap-4 flex-1">
      <div v-if="importError" role="alert" class="alert alert-error">
        <span>{{ importError }}</span>
        <button class="btn btn-sm btn-ghost" @click="importError = null">Dismiss</button>
      </div>

      <p
        v-if="listStore.isLoaded && listStore.summaries.length === 0"
        class="text-center py-16 text-base-content/50"
      >
        No characters yet. Create one or import from a JSON file.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="summary in listStore.summaries"
          :key="summary.id"
          class="card bg-base-200 shadow-sm"
        >
          <div class="card-body p-4">
            <div class="flex items-start justify-between gap-2">
              <RouterLink
                :to="`/character/${summary.id}/skills`"
                class="flex-1 min-h-[48px] flex flex-col justify-center"
              >
                <h2 class="card-title text-base">
                  {{ summary.name || 'Unnamed' }}
                </h2>
                <p class="text-sm opacity-60">
                  {{ [summary.kin, summary.profession].filter(Boolean).join(' ') }}
                </p>
              </RouterLink>
              <div class="dropdown dropdown-end">
                <button
                  tabindex="0"
                  class="btn btn-ghost btn-sm min-h-[48px] min-w-[48px]"
                  :aria-label="`Actions for ${summary.name || 'character'}`"
                >
                  ⋯
                </button>
                <ul
                  tabindex="0"
                  class="dropdown-content menu bg-base-100 rounded-box shadow z-10 w-36 p-1"
                >
                  <li>
                    <button @click="exportCharacter(summary)">Export</button>
                  </li>
                  <li>
                    <button class="text-error" @click="deleteTarget = summary">Delete</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <ConfirmDialog
      :open="deleteTarget !== null"
      :message="`Delete ${deleteTarget?.name || 'this character'}? This cannot be undone.`"
      confirm-label="Delete"
      @confirm="onDeleteConfirmed"
      @cancel="deleteTarget = null"
    />
  </div>
</template>
