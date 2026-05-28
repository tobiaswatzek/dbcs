<script setup lang="ts">
import type { TinyItem } from '../types/character'
defineProps<{ item: TinyItem; index: number }>()
defineEmits<{ remove: [] }>()
</script>

<template>
  <li class="flex items-start gap-2 py-2 border-b border-base-200 last:border-0">
    <span class="text-sm opacity-30 tabular-nums w-5 pt-0.5">{{ index + 1 }}</span>
    <div class="flex-1 min-w-0">
      <div class="font-medium">{{ item.name }}</div>
      <div v-if="item.description" class="text-xs mt-0.5 opacity-70">
        {{ item.description }}
      </div>
    </div>
    <button
      class="btn btn-ghost btn-sm btn-square min-h-[48px] min-w-[48px]"
      :aria-label="`Remove ${item.name}`"
      @click="$emit('remove')"
    >
      <span class="icon-[tabler--trash]" aria-hidden="true"></span>
    </button>
  </li>
</template>
