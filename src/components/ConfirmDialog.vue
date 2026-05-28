<script setup lang="ts">
withDefaults(
  defineProps<{ open: boolean; message: string; confirmLabel?: string }>(),
  {
    confirmLabel: "Confirm",
  },
);
const emit = defineEmits<{ confirm: []; cancel: [] }>();
</script>

<template>
  <dialog class="modal" :open="open">
    <div class="modal-box">
      <p class="py-4">{{ message }}</p>
      <div class="modal-action">
        <button
          data-testid="cancel-btn"
          class="btn min-h-[48px]"
          @click="emit('cancel')"
        >
          Cancel
        </button>
        <button
          data-testid="confirm-btn"
          class="btn btn-error min-h-[48px]"
          @click="emit('confirm')"
        >
          {{ confirmLabel }}
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="emit('cancel')">close</button>
    </form>
  </dialog>
</template>
