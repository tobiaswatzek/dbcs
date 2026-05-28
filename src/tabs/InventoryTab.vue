<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../stores/character";
import InventoryItemRow from "../components/InventoryItemRow.vue";
import TinyItemRow from "../components/TinyItemRow.vue";

const { character } = storeToRefs(useCharacterStore());

const totalWeight = computed(
  () => character.value?.inventory.reduce((s, i) => s + i.weight, 0) ?? 0,
);

const overEncumbered = computed(
  () =>
    !!character.value &&
    character.value.encumbranceLimit > 0 &&
    totalWeight.value > character.value.encumbranceLimit,
);

const showAddItem = ref(false);
const newName = ref("");
const newWeight = ref(1);
const newDesc = ref("");
function addItem() {
  if (!character.value || !newName.value.trim()) return;
  character.value.inventory.push({
    name: newName.value.trim(),
    weight: newWeight.value,
    description: newDesc.value.trim(),
  });
  newName.value = "";
  newWeight.value = 1;
  newDesc.value = "";
  showAddItem.value = false;
}

const showAddTiny = ref(false);
const newTinyName = ref("");
const newTinyDesc = ref("");
function addTinyItem() {
  if (!character.value || !newTinyName.value.trim()) return;
  character.value.tinyItems.push({
    name: newTinyName.value.trim(),
    description: newTinyDesc.value.trim(),
  });
  newTinyName.value = "";
  newTinyDesc.value = "";
  showAddTiny.value = false;
}
</script>

<template>
  <div v-if="character" class="space-y-4">
    <fieldset class="fieldset border-base-300 rounded-box border p-4">
      <legend class="fieldset-legend">Coins</legend>
      <div class="flex flex-wrap gap-4 justify-center">
        <label class="label floating-label">
          <span>Gold</span>
          <input
            type="number"
            class="input w-24"
            step="1"
            min="0"
            :value="character.coins.gold"
            @input="
              character.coins.gold = +($event.target as HTMLInputElement).value
            "
          />
        </label>
        <label class="label floating-label">
          <span>Silver</span>
          <input
            type="number"
            class="input w-24"
            step="1"
            min="0"
            :value="character.coins.silver"
            @input="
              character.coins.silver = +($event.target as HTMLInputElement)
                .value
            "
          />
        </label>
        <label class="label floating-label">
          <span>Copper</span>
          <input
            type="number"
            class="input w-24"
            step="1"
            min="0"
            :value="character.coins.copper"
            @input="
              character.coins.copper = +($event.target as HTMLInputElement)
                .value
            "
          />
        </label>
      </div>
    </fieldset>

    <fieldset class="fieldset border-base-300 rounded-box border p-4">
      <legend class="fieldset-legend">Items</legend>
      <div class="mb-3">
        <label class="label floating-label">
          <span>Encumbrance Limit</span>
          <input
            type="number"
            class="input w-28"
            step="1"
            min="0"
            :value="character.encumbranceLimit"
            @input="
              character.encumbranceLimit = +($event.target as HTMLInputElement)
                .value
            "
          />
        </label>
      </div>
      <div v-if="character.encumbranceLimit > 0" class="mb-3">
        <progress
          class="progress w-full"
          :class="overEncumbered ? 'progress-error' : ''"
          :value="totalWeight"
          :max="character.encumbranceLimit"
        />
        <div class="text-xs text-center mt-1">
          {{ totalWeight }} / {{ character.encumbranceLimit }}
        </div>
      </div>
      <ul class="mb-3">
        <InventoryItemRow
          v-for="(item, i) in character.inventory"
          :key="i"
          :item="item"
          :index="i"
          @remove="character.inventory.splice(i, 1)"
        />
      </ul>
      <button class="btn btn-sm min-h-[44px]" @click="showAddItem = true">
        Add Item
      </button>

      <dialog :open="showAddItem" class="modal">
        <div class="modal-box">
          <h2 class="text-lg font-bold">Add Item</h2>
          <label for="item-name" class="label mt-2">Name</label>
          <input
            id="item-name"
            v-model="newName"
            type="text"
            class="input w-full mb-2"
          />
          <label for="item-weight" class="label">Weight</label>
          <input
            id="item-weight"
            v-model.number="newWeight"
            type="number"
            class="input w-full mb-2"
            min="1"
            step="1"
          />
          <label for="item-desc" class="label">Description</label>
          <textarea
            id="item-desc"
            v-model="newDesc"
            class="textarea w-full"
          ></textarea>
          <div class="modal-action">
            <button class="btn" @click="showAddItem = false">Cancel</button>
            <button
              class="btn btn-primary"
              :disabled="!newName.trim()"
              @click="addItem"
            >
              Add
            </button>
          </div>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button @click="showAddItem = false">close</button>
        </form>
      </dialog>
    </fieldset>

    <fieldset class="fieldset border-base-300 rounded-box border p-4">
      <legend class="fieldset-legend">Tiny Items</legend>
      <ul class="mb-3">
        <TinyItemRow
          v-for="(item, i) in character.tinyItems"
          :key="i"
          :item="item"
          :index="i"
          @remove="character.tinyItems.splice(i, 1)"
        />
      </ul>
      <button class="btn btn-sm min-h-[44px]" @click="showAddTiny = true">
        Add Tiny Item
      </button>

      <dialog :open="showAddTiny" class="modal">
        <div class="modal-box">
          <h2 class="text-lg font-bold">Add Tiny Item</h2>
          <label for="tiny-name" class="label mt-2">Name</label>
          <input
            id="tiny-name"
            v-model="newTinyName"
            type="text"
            class="input w-full mb-2"
          />
          <label for="tiny-desc" class="label">Description</label>
          <textarea
            id="tiny-desc"
            v-model="newTinyDesc"
            class="textarea w-full"
          ></textarea>
          <div class="modal-action">
            <button class="btn" @click="showAddTiny = false">Cancel</button>
            <button
              class="btn btn-primary"
              :disabled="!newTinyName.trim()"
              @click="addTinyItem"
            >
              Add
            </button>
          </div>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button @click="showAddTiny = false">close</button>
        </form>
      </dialog>
    </fieldset>
  </div>
</template>
