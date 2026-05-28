<script setup lang="ts">
import type { Weapon } from '../types/character'

const props = defineProps<{ weapon: Weapon; index: number }>()
const emit = defineEmits<{ 'update:weapon': [w: Weapon]; remove: [] }>()

function u(field: keyof Weapon, value: string | number | null) {
  emit('update:weapon', { ...props.weapon, [field]: value })
}
function str(e: Event) {
  return (e.target as HTMLInputElement).value
}
function num(e: Event) {
  const v = (e.target as HTMLInputElement).value
  return v === '' ? null : Number(v)
}
</script>

<template>
  <div class="grid grid-cols-12 gap-2 items-end p-2 bg-base-200/30 rounded-lg">
    <label class="label floating-label col-span-12 md:col-span-5">
      <span>Name</span>
      <input
        type="text"
        class="input w-full"
        :value="weapon.name"
        @input="u('name', str($event))"
      />
    </label>
    <label class="label floating-label col-span-4 md:col-span-2">
      <span>Grip</span>
      <input
        type="text"
        class="input w-full"
        :value="weapon.grip"
        @input="u('grip', str($event))"
      />
    </label>
    <label class="label floating-label col-span-4 md:col-span-2">
      <span>Range</span>
      <input
        type="text"
        class="input w-full"
        :value="weapon.range"
        @input="u('range', str($event))"
      />
    </label>
    <label class="label floating-label col-span-4 md:col-span-2">
      <span>Damage</span>
      <input
        type="text"
        class="input w-full"
        :value="weapon.damage"
        @input="u('damage', str($event))"
      />
    </label>
    <label class="label floating-label col-span-5 md:col-span-2">
      <span>Durability</span>
      <input
        type="number"
        class="input w-full"
        :value="weapon.durability ?? ''"
        @input="u('durability', num($event))"
      />
    </label>
    <label class="label floating-label col-span-6 md:col-span-10">
      <span>Features</span>
      <input
        type="text"
        class="input w-full"
        :value="weapon.features"
        @input="u('features', str($event))"
      />
    </label>
    <button
      class="col-span-1 btn btn-ghost btn-sm btn-square min-h-[48px] min-w-[48px]"
      :aria-label="`Remove weapon ${index + 1}`"
      @click="emit('remove')"
    >
      <span class="icon-[tabler--trash]" aria-hidden="true"></span>
    </button>
  </div>
</template>
