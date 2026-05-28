<script setup lang="ts">
import type { Skill } from "../types/character";

const props = defineProps<{ skill: Skill; skillId: string }>();
const emit = defineEmits<{ "update:skill": [skill: Skill] }>();

function onMarkChange(e: Event) {
  emit("update:skill", {
    ...props.skill,
    marked: (e.target as HTMLInputElement).checked,
  });
}
function onValueChange(e: Event) {
  const v = parseInt((e.target as HTMLInputElement).value, 10);
  emit("update:skill", { ...props.skill, value: isNaN(v) ? 0 : v });
}
</script>

<template>
  <div
    class="flex items-center justify-between p-2 bg-base-200/30 rounded-lg min-h-[48px]"
  >
    <div class="flex items-center gap-2">
      <input
        :id="`mark-${skillId}`"
        type="checkbox"
        :checked="skill.marked"
        class="checkbox checkbox-sm"
        @change="onMarkChange"
      />
      <label :for="`mark-${skillId}`" class="text-sm select-none">{{
        skill.label
      }}</label>
    </div>
    <label :for="`value-${skillId}`" class="sr-only"
      >{{ skill.label }} value</label
    >
    <input
      :id="`value-${skillId}`"
      type="number"
      :value="skill.value"
      class="input input-sm w-16 text-right"
      step="1"
      min="0"
      @change="onValueChange"
    />
  </div>
</template>
