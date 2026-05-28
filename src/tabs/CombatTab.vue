<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../stores/character";
import WeaponSlot from "../components/WeaponSlot.vue";
import type { Weapon } from "../types/character";

const { character } = storeToRefs(useCharacterStore());

function addWeapon() {
  character.value?.weapons.push({
    name: "",
    grip: "",
    range: "",
    damage: "",
    durability: null,
    features: "",
  });
}
function updateWeapon(i: number, w: Weapon) {
  if (character.value) character.value.weapons[i] = w;
}
</script>

<template>
  <div v-if="character" class="space-y-4">
    <fieldset class="fieldset border-base-300 rounded-box border p-4">
      <legend class="fieldset-legend">Weapons</legend>
      <div class="flex flex-col gap-2 mb-2">
        <WeaponSlot
          v-for="(w, i) in character.weapons"
          :key="i"
          :weapon="w"
          :index="i"
          @update:weapon="updateWeapon(i, $event)"
          @remove="character.weapons.splice(i, 1)"
        />
      </div>
      <button class="btn btn-sm min-h-[44px]" @click="addWeapon">
        Add Weapon
      </button>
    </fieldset>

    <fieldset class="fieldset border-base-300 rounded-box border p-4">
      <legend class="fieldset-legend">Damage Bonuses</legend>
      <div class="flex gap-4 flex-wrap">
        <label class="label floating-label">
          <span>Strength</span>
          <input
            type="text"
            class="input w-20"
            :value="character.damageBonusStr"
            @input="
              character.damageBonusStr = (
                $event.target as HTMLInputElement
              ).value
            "
          />
        </label>
        <label class="label floating-label">
          <span>Agility</span>
          <input
            type="text"
            class="input w-20"
            :value="character.damageBonusAgl"
            @input="
              character.damageBonusAgl = (
                $event.target as HTMLInputElement
              ).value
            "
          />
        </label>
      </div>
    </fieldset>

    <fieldset class="fieldset border-base-300 rounded-box border p-4">
      <legend class="fieldset-legend">Armor &amp; Helmet</legend>
      <div class="flex flex-col md:flex-row gap-6">
        <div class="flex flex-col gap-2">
          <h3 class="font-semibold">Armor</h3>
          <label class="label floating-label">
            <span>Name</span>
            <input
              type="text"
              class="input w-full"
              :value="character.armor.name"
              @input="
                character.armor.name = ($event.target as HTMLInputElement).value
              "
            />
          </label>
          <label class="label floating-label">
            <span>Rating</span>
            <input
              type="number"
              class="input w-24"
              :value="character.armor.rating ?? ''"
              @input="
                character.armor.rating = ($event.target as HTMLInputElement)
                  .value
                  ? +($event.target as HTMLInputElement).value
                  : null
              "
            />
          </label>
          <p class="text-xs font-medium">Bane on:</p>
          <div class="flex flex-wrap gap-3">
            <label class="label gap-1 min-h-[44px]">
              <input
                type="checkbox"
                class="checkbox checkbox-sm"
                :checked="character.armor.banes.acrobatics"
                @change="
                  character.armor.banes.acrobatics = (
                    $event.target as HTMLInputElement
                  ).checked
                "
              />
              Acrobatics
            </label>
            <label class="label gap-1 min-h-[44px]">
              <input
                type="checkbox"
                class="checkbox checkbox-sm"
                :checked="character.armor.banes.evade"
                @change="
                  character.armor.banes.evade = (
                    $event.target as HTMLInputElement
                  ).checked
                "
              />
              Evade
            </label>
            <label class="label gap-1 min-h-[44px]">
              <input
                type="checkbox"
                class="checkbox checkbox-sm"
                :checked="character.armor.banes.sneaking"
                @change="
                  character.armor.banes.sneaking = (
                    $event.target as HTMLInputElement
                  ).checked
                "
              />
              Sneaking
            </label>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <h3 class="font-semibold">Helmet</h3>
          <label class="label floating-label">
            <span>Name</span>
            <input
              type="text"
              class="input w-full"
              :value="character.helmet.name"
              @input="
                character.helmet.name = (
                  $event.target as HTMLInputElement
                ).value
              "
            />
          </label>
          <label class="label floating-label">
            <span>Rating</span>
            <input
              type="number"
              class="input w-24"
              :value="character.helmet.rating ?? ''"
              @input="
                character.helmet.rating = ($event.target as HTMLInputElement)
                  .value
                  ? +($event.target as HTMLInputElement).value
                  : null
              "
            />
          </label>
          <p class="text-xs font-medium">Bane on:</p>
          <div class="flex flex-wrap gap-3">
            <label class="label gap-1 min-h-[44px]">
              <input
                type="checkbox"
                class="checkbox checkbox-sm"
                :checked="character.helmet.banes.awareness"
                @change="
                  character.helmet.banes.awareness = (
                    $event.target as HTMLInputElement
                  ).checked
                "
              />
              Awareness
            </label>
            <label class="label gap-1 min-h-[44px]">
              <input
                type="checkbox"
                class="checkbox checkbox-sm"
                :checked="character.helmet.banes.rangedAttacks"
                @change="
                  character.helmet.banes.rangedAttacks = (
                    $event.target as HTMLInputElement
                  ).checked
                "
              />
              Ranged Attacks
            </label>
          </div>
        </div>
      </div>
    </fieldset>

    <fieldset class="fieldset border-base-300 rounded-box border p-4">
      <legend class="fieldset-legend">Death Rolls</legend>
      <div class="flex gap-4">
        <label class="label floating-label">
          <span>Successes</span>
          <input
            type="number"
            class="input input-success w-24"
            step="1"
            min="0"
            max="3"
            :value="character.deathRolls.successes"
            @input="
              character.deathRolls.successes = +(
                $event.target as HTMLInputElement
              ).value
            "
          />
        </label>
        <label class="label floating-label">
          <span>Failures</span>
          <input
            type="number"
            class="input input-warning w-24"
            step="1"
            min="0"
            max="3"
            :value="character.deathRolls.failures"
            @input="
              character.deathRolls.failures = +(
                $event.target as HTMLInputElement
              ).value
            "
          />
        </label>
      </div>
    </fieldset>
  </div>
</template>
