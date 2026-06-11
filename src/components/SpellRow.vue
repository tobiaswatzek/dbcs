<script setup lang="ts">
import type { Spell } from '../types/character'

const props = defineProps<{ spell: Spell; index: number }>()
const emit = defineEmits<{ 'update:spell': [spell: Spell]; remove: [] }>()

function update(field: keyof Spell, value: string | number | null) {
  emit('update:spell', { ...props.spell, [field]: value })
}

function stringValue(event: Event) {
  return (event.target as HTMLInputElement | HTMLTextAreaElement).value
}

function numberValue(event: Event) {
  const value = (event.target as HTMLInputElement).value
  return value === '' ? null : Number(value)
}
</script>

<template>
  <div class="grid grid-cols-12 gap-2 items-end p-2 bg-base-200/30 rounded-lg">
    <label class="label floating-label col-span-12 md:col-span-4">
      <span>Name</span>
      <input
        type="text"
        class="input w-full"
        :value="spell.name"
        @input="update('name', stringValue($event))"
      />
    </label>
    <label class="label floating-label col-span-8 md:col-span-3">
      <span>School</span>
      <input
        type="text"
        class="input w-full"
        :value="spell.school"
        @input="update('school', stringValue($event))"
      />
    </label>
    <label class="label floating-label col-span-4 md:col-span-2">
      <span>Rank</span>
      <input
        type="number"
        class="input w-full"
        min="0"
        step="1"
        :value="spell.rank ?? ''"
        @input="update('rank', numberValue($event))"
      />
    </label>
    <label class="label floating-label col-span-10 md:col-span-2">
      <span>WP Cost</span>
      <input
        type="text"
        class="input w-full"
        :value="spell.willpowerCost"
        @input="update('willpowerCost', stringValue($event))"
      />
    </label>
    <button
      class="col-span-2 md:col-span-1 btn btn-ghost btn-sm btn-square min-h-[48px] min-w-[48px] justify-self-end"
      :aria-label="`Remove spell ${spell.name || index + 1}`"
      @click="emit('remove')"
    >
      <span class="icon-[tabler--trash]" aria-hidden="true"></span>
    </button>
    <label class="label floating-label col-span-12 md:col-span-3">
      <span>Requirement</span>
      <input
        type="text"
        class="input w-full"
        :value="spell.requirement"
        @input="update('requirement', stringValue($event))"
      />
    </label>
    <label class="label floating-label col-span-6 md:col-span-3">
      <span>Casting Time</span>
      <input
        type="text"
        class="input w-full"
        :value="spell.castingTime"
        @input="update('castingTime', stringValue($event))"
      />
    </label>
    <label class="label floating-label col-span-6 md:col-span-3">
      <span>Range</span>
      <input
        type="text"
        class="input w-full"
        :value="spell.range"
        @input="update('range', stringValue($event))"
      />
    </label>
    <label class="label floating-label col-span-12 md:col-span-3">
      <span>Duration</span>
      <input
        type="text"
        class="input w-full"
        :value="spell.duration"
        @input="update('duration', stringValue($event))"
      />
    </label>
    <label class="label floating-label col-span-12">
      <span>Description</span>
      <textarea
        class="textarea w-full min-h-24"
        :value="spell.description"
        @input="update('description', stringValue($event))"
      ></textarea>
    </label>
  </div>
</template>
