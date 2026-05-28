<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCharacterStore } from '../stores/character'

const { character } = storeToRefs(useCharacterStore())
</script>

<template>
  <header
    v-if="character"
    class="py-3 px-2 border-b-2 border-b-base-200 flex flex-wrap gap-4 justify-center"
  >
    <!-- Hit Points -->
    <div class="flex flex-col items-center gap-1">
      <div class="join">
        <label class="label floating-label">
          <span>HP</span>
          <input
            type="number"
            class="join-item input w-20"
            step="1"
            min="0"
            :value="character.hitPoints"
            @change="character.hitPoints = +($event.target as HTMLInputElement).value"
          />
        </label>
        <label class="label floating-label">
          <span>Max</span>
          <input
            type="number"
            class="join-item input w-20"
            step="1"
            min="0"
            :value="character.maxHitPoints"
            @change="character.maxHitPoints = +($event.target as HTMLInputElement).value"
          />
        </label>
      </div>
      <button
        class="btn btn-xs w-40 min-h-[44px]"
        @click="character.hitPoints = character.maxHitPoints"
      >
        ↩️ <span class="sr-only">Reset HP to max</span>
      </button>
    </div>
    <!-- Willpower Points -->
    <div class="flex flex-col items-center gap-1">
      <div class="join">
        <label class="label floating-label">
          <span>WP</span>
          <input
            type="number"
            class="join-item input w-20"
            step="1"
            min="0"
            :value="character.willpowerPoints"
            @change="character.willpowerPoints = +($event.target as HTMLInputElement).value"
          />
        </label>
        <label class="label floating-label">
          <span>Max</span>
          <input
            type="number"
            class="join-item input w-20"
            step="1"
            min="0"
            :value="character.maxWillpowerPoints"
            @change="character.maxWillpowerPoints = +($event.target as HTMLInputElement).value"
          />
        </label>
      </div>
      <button
        class="btn btn-xs w-40 min-h-[44px]"
        @click="character.willpowerPoints = character.maxWillpowerPoints"
      >
        ↩️ <span class="sr-only">Reset WP to max</span>
      </button>
    </div>
    <!-- Movement -->
    <div class="flex items-center">
      <label class="label floating-label">
        <span>Movement</span>
        <input
          type="number"
          class="input w-20"
          step="1"
          min="0"
          :value="character.movement"
          @change="character.movement = +($event.target as HTMLInputElement).value"
        />
      </label>
    </div>
  </header>
</template>
