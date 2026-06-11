<script setup lang="ts">
import type { HeroicAbility } from '../types/character'

const props = defineProps<{ ability: HeroicAbility; index: number }>()
const emit = defineEmits<{ 'update:ability': [ability: HeroicAbility]; remove: [] }>()

function update(field: keyof HeroicAbility, value: string | number | null) {
  emit('update:ability', { ...props.ability, [field]: value })
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
    <label class="label floating-label col-span-12 md:col-span-5">
      <span>Name</span>
      <input
        type="text"
        class="input w-full"
        :value="ability.name"
        @input="update('name', stringValue($event))"
      />
    </label>
    <label class="label floating-label col-span-10 md:col-span-2">
      <span>WP Cost</span>
      <input
        type="number"
        class="input w-full"
        min="0"
        step="1"
        :value="ability.willpowerCost ?? ''"
        @input="update('willpowerCost', numberValue($event))"
      />
    </label>
    <button
      class="col-span-2 md:col-start-12 btn btn-ghost btn-sm btn-square min-h-[48px] min-w-[48px] justify-self-end"
      :aria-label="`Remove heroic ability ${ability.name || index + 1}`"
      @click="emit('remove')"
    >
      <span class="icon-[tabler--trash]" aria-hidden="true"></span>
    </button>
    <label class="label floating-label col-span-12">
      <span>Description</span>
      <textarea
        class="textarea w-full min-h-24"
        :value="ability.description"
        @input="update('description', stringValue($event))"
      ></textarea>
    </label>
  </div>
</template>
