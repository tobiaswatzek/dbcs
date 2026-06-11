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
      <button
        class="join-item btn btn-square"
        aria-label="Reset HP to max"
        @click="character.hitPoints = character.maxHitPoints"
      >
        <span class="icon-[game-icons--clockwise-rotation] text-xl" aria-hidden="true"></span>
      </button>
    </div>
    <!-- Willpower Points -->
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
      <button
        class="join-item btn btn-square"
        aria-label="Reset WP to max"
        @click="character.willpowerPoints = character.maxWillpowerPoints"
      >
        <span class="icon-[game-icons--clockwise-rotation] text-xl" aria-hidden="true"></span>
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
