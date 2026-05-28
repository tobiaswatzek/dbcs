<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../stores/character";
import SkillRow from "../components/SkillRow.vue";
import type { Skill } from "../types/character";

const { character } = storeToRefs(useCharacterStore());

const showAddSecondary = ref(false);
const newSecondaryLabel = ref("");

const attributePairs = [
  {
    attrKey: "str" as const,
    condKey: "exhausted" as const,
    attrLabel: "Strength",
    condLabel: "Exhausted",
  },
  {
    attrKey: "con" as const,
    condKey: "sickly" as const,
    attrLabel: "Constitution",
    condLabel: "Sickly",
  },
  {
    attrKey: "agl" as const,
    condKey: "dazed" as const,
    attrLabel: "Agility",
    condLabel: "Dazed",
  },
  {
    attrKey: "int" as const,
    condKey: "angry" as const,
    attrLabel: "Intelligence",
    condLabel: "Angry",
  },
  {
    attrKey: "wil" as const,
    condKey: "scared" as const,
    attrLabel: "Willpower",
    condLabel: "Scared",
  },
  {
    attrKey: "cha" as const,
    condKey: "disheartened" as const,
    attrLabel: "Charisma",
    condLabel: "Disheartened",
  },
];

function updateSkill(
  key: keyof NonNullable<typeof character.value>["skills"],
  skill: Skill,
) {
  if (character.value) character.value.skills[key] = skill;
}
function updateWeaponSkill(
  key: keyof NonNullable<typeof character.value>["weaponSkills"],
  skill: Skill,
) {
  if (character.value) character.value.weaponSkills[key] = skill;
}
function updateSecondarySkill(index: number, skill: Skill) {
  if (character.value) character.value.secondarySkills[index] = skill;
}
function addSecondarySkill() {
  if (!character.value || !newSecondaryLabel.value.trim()) return;
  character.value.secondarySkills.push({
    label: newSecondaryLabel.value.trim(),
    value: 0,
    marked: false,
  });
  newSecondaryLabel.value = "";
  showAddSecondary.value = false;
}
</script>

<template>
  <div v-if="character" class="space-y-4">
    <!-- Attributes + Conditions -->
    <fieldset class="fieldset border-base-300 rounded-box border p-4">
      <legend class="fieldset-legend">Attributes</legend>
      <div class="grid grid-cols-3 lg:grid-cols-6 gap-x-2 gap-y-6">
        <div
          v-for="p in attributePairs"
          :key="p.attrKey"
          class="flex flex-col items-center gap-2"
        >
          <label class="label floating-label">
            <span>{{ p.attrLabel }}</span>
            <input
              type="number"
              class="input w-20"
              step="1"
              min="0"
              :value="character.attributes[p.attrKey]"
              @change="
                character.attributes[p.attrKey] = +(
                  $event.target as HTMLInputElement
                ).value
              "
            />
          </label>
          <label class="label text-sm gap-1">
            <input
              type="checkbox"
              class="checkbox checkbox-sm checked:checkbox-warning"
              :checked="character.conditions[p.condKey]"
              @change="
                character.conditions[p.condKey] = (
                  $event.target as HTMLInputElement
                ).checked
              "
            />
            {{ p.condLabel }}
          </label>
        </div>
      </div>
    </fieldset>

    <!-- Core skills -->
    <fieldset class="fieldset border-base-300 rounded-box border p-4">
      <legend class="fieldset-legend">Skills</legend>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <SkillRow
          v-for="(skill, key) in character.skills"
          :key="key"
          :skill="skill"
          :skill-id="key"
          @update:skill="
            updateSkill(key as keyof typeof character.skills, $event)
          "
        />
      </div>
    </fieldset>

    <!-- Weapon skills -->
    <fieldset class="fieldset border-base-300 rounded-box border p-4">
      <legend class="fieldset-legend">Weapon Skills</legend>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <SkillRow
          v-for="(skill, key) in character.weaponSkills"
          :key="key"
          :skill="skill"
          :skill-id="`weapon-${key}`"
          @update:skill="
            updateWeaponSkill(
              key as keyof typeof character.weaponSkills,
              $event,
            )
          "
        />
      </div>
    </fieldset>

    <!-- Secondary skills -->
    <fieldset class="fieldset border-base-300 rounded-box border p-4">
      <legend class="fieldset-legend">Secondary Skills</legend>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
        <div
          v-for="(skill, i) in character.secondarySkills"
          :key="i"
          class="flex gap-1 items-center"
        >
          <SkillRow
            class="flex-1"
            :skill="skill"
            :skill-id="`secondary-${i}`"
            @update:skill="updateSecondarySkill(i, $event)"
          />
          <button
            class="btn btn-ghost btn-sm btn-square min-h-[48px] min-w-[48px]"
            :aria-label="`Remove ${skill.label}`"
            @click="character.secondarySkills.splice(i, 1)"
          >
            <span class="icon-[tabler--trash]" aria-hidden="true"></span>
          </button>
        </div>
      </div>
      <button class="btn btn-sm min-h-[44px]" @click="showAddSecondary = true">
        Add Skill
      </button>

      <dialog :open="showAddSecondary" class="modal">
        <div class="modal-box">
          <h2 class="text-lg font-bold">Add Secondary Skill</h2>
          <label for="new-secondary-label" class="label mt-2">Name</label>
          <input
            id="new-secondary-label"
            v-model="newSecondaryLabel"
            type="text"
            class="input w-full"
            @keyup.enter="addSecondarySkill"
          />
          <div class="modal-action">
            <button
              class="btn"
              @click="
                showAddSecondary = false;
                newSecondaryLabel = '';
              "
            >
              Cancel
            </button>
            <button
              class="btn btn-primary"
              :disabled="!newSecondaryLabel.trim()"
              @click="addSecondarySkill"
            >
              Add
            </button>
          </div>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button @click="showAddSecondary = false">close</button>
        </form>
      </dialog>
    </fieldset>
  </div>
</template>
