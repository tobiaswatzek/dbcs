<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCharacterStore } from '../stores/character'

const { character } = storeToRefs(useCharacterStore())

const PROFESSIONS = [
  'Artisan',
  'Bard',
  'Fighter',
  'Hunter',
  'Knight',
  'Mage',
  'Mariner',
  'Merchant',
  'Scholar',
  'Thief',
]
const KINS = ['Human', 'Elf', 'Dwarf', 'Halfling', 'Mallard', 'Wolfkin']
</script>

<template>
  <div v-if="character" class="space-y-4">
    <fieldset class="fieldset border-base-300 rounded-box border p-4">
      <legend class="fieldset-legend">Identity</legend>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="label floating-label block">
          <span>Name</span>
          <input
            type="text"
            class="input w-full"
            :value="character.name"
            @input="character.name = ($event.target as HTMLInputElement).value"
          />
        </label>
        <div>
          <label for="bg-kin" class="label">Kin</label>
          <input
            id="bg-kin"
            type="text"
            list="kin-list"
            class="input w-full"
            :value="character.kin"
            @input="character.kin = ($event.target as HTMLInputElement).value"
          />
          <datalist id="kin-list">
            <option v-for="k in KINS" :key="k" :value="k" />
          </datalist>
        </div>
        <div>
          <label for="bg-profession" class="label">Profession</label>
          <input
            id="bg-profession"
            type="text"
            list="profession-list"
            class="input w-full"
            :value="character.profession"
            @input="
              character.profession = ($event.target as HTMLInputElement).value
            "
          />
          <datalist id="profession-list">
            <option v-for="p in PROFESSIONS" :key="p" :value="p" />
          </datalist>
        </div>
        <label class="label floating-label block">
          <span>Age</span>
          <input
            type="text"
            class="input w-full"
            :value="character.age"
            @input="character.age = ($event.target as HTMLInputElement).value"
          />
        </label>
      </div>
    </fieldset>

    <fieldset class="fieldset border-base-300 rounded-box border p-4">
      <legend class="fieldset-legend">Character</legend>
      <div class="space-y-3">
        <label class="label floating-label block">
          <span>Weakness</span>
          <textarea
            class="textarea w-full"
            :value="character.weakness"
            @input="
              character.weakness = ($event.target as HTMLTextAreaElement).value
            "
          ></textarea>
        </label>
        <label class="label floating-label block">
          <span>Appearance</span>
          <textarea
            class="textarea w-full"
            :value="character.appearance"
            @input="
              character.appearance = (
                $event.target as HTMLTextAreaElement
              ).value
            "
          ></textarea>
        </label>
        <label class="label floating-label block">
          <span>Memento</span>
          <textarea
            class="textarea w-full"
            :value="character.memento"
            @input="
              character.memento = ($event.target as HTMLTextAreaElement).value
            "
          ></textarea>
        </label>
        <label class="label floating-label block">
          <span>Abilities &amp; Notes</span>
          <textarea
            class="textarea w-full min-h-32"
            :value="character.abilities"
            @input="
              character.abilities = ($event.target as HTMLTextAreaElement).value
            "
          ></textarea>
        </label>
      </div>
    </fieldset>
  </div>
</template>
