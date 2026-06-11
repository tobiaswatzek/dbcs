<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCharacterStore } from '../stores/character'
import SkillRow from '../components/SkillRow.vue'
import HeroicAbilityRow from '../components/HeroicAbilityRow.vue'
import SpellRow from '../components/SpellRow.vue'
import type { FixedSkill, HeroicAbility, Spell } from '../types/character'
import { SKILL_LABELS, WEAPON_SKILL_LABELS } from '../utils/character'

const { character } = storeToRefs(useCharacterStore())

const showAddSecondary = ref(false)
const newSecondaryLabel = ref('')
const showAddHeroicAbility = ref(false)
const newHeroicAbility = ref<HeroicAbility>({
  name: '',
  willpowerCost: null,
  description: '',
})
const showAddSpell = ref(false)
const newSpell = ref<Spell>({
  name: '',
  school: '',
  rank: null,
  requirement: '',
  willpowerCost: '',
  castingTime: '',
  range: '',
  duration: '',
  description: '',
})

const attributePairs = [
  {
    attrKey: 'str' as const,
    condKey: 'exhausted' as const,
    attrLabel: 'Strength',
    condLabel: 'Exhausted',
  },
  {
    attrKey: 'con' as const,
    condKey: 'sickly' as const,
    attrLabel: 'Constitution',
    condLabel: 'Sickly',
  },
  {
    attrKey: 'agl' as const,
    condKey: 'dazed' as const,
    attrLabel: 'Agility',
    condLabel: 'Dazed',
  },
  {
    attrKey: 'int' as const,
    condKey: 'angry' as const,
    attrLabel: 'Intelligence',
    condLabel: 'Angry',
  },
  {
    attrKey: 'wil' as const,
    condKey: 'scared' as const,
    attrLabel: 'Willpower',
    condLabel: 'Scared',
  },
  {
    attrKey: 'cha' as const,
    condKey: 'disheartened' as const,
    attrLabel: 'Charisma',
    condLabel: 'Disheartened',
  },
]

function updateSkill(key: keyof NonNullable<typeof character.value>['skills'], skill: FixedSkill) {
  if (character.value) character.value.skills[key] = skill
}
function updateWeaponSkill(
  key: keyof NonNullable<typeof character.value>['weaponSkills'],
  skill: FixedSkill,
) {
  if (character.value) character.value.weaponSkills[key] = skill
}
function updateSecondarySkill(index: number, update: FixedSkill) {
  if (!character.value) return
  const existing = character.value.secondarySkills[index]
  if (!existing) return
  character.value.secondarySkills[index] = {
    label: existing.label,
    value: update.value,
    marked: update.marked,
  }
}
function addSecondarySkill() {
  if (!character.value || !newSecondaryLabel.value.trim()) return
  character.value.secondarySkills.push({
    label: newSecondaryLabel.value.trim(),
    value: 0,
    marked: false,
  })
  newSecondaryLabel.value = ''
  showAddSecondary.value = false
}

function nullableNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function updateHeroicAbility(index: number, ability: HeroicAbility) {
  if (character.value) character.value.heroicAbilities[index] = ability
}

function resetNewHeroicAbility() {
  newHeroicAbility.value = {
    name: '',
    willpowerCost: null,
    description: '',
  }
}

function addHeroicAbility() {
  if (!character.value || !newHeroicAbility.value.name.trim()) return
  character.value.heroicAbilities.push({
    ...newHeroicAbility.value,
    name: newHeroicAbility.value.name.trim(),
    willpowerCost: nullableNumber(newHeroicAbility.value.willpowerCost),
    description: newHeroicAbility.value.description.trim(),
  })
  resetNewHeroicAbility()
  showAddHeroicAbility.value = false
}

function updateSpell(index: number, spell: Spell) {
  if (character.value) character.value.spells[index] = spell
}

function resetNewSpell() {
  newSpell.value = {
    name: '',
    school: '',
    rank: null,
    requirement: '',
    willpowerCost: '',
    castingTime: '',
    range: '',
    duration: '',
    description: '',
  }
}

function addSpell() {
  if (!character.value || !newSpell.value.name.trim()) return
  character.value.spells.push({
    ...newSpell.value,
    name: newSpell.value.name.trim(),
    school: newSpell.value.school.trim(),
    rank: nullableNumber(newSpell.value.rank),
    requirement: newSpell.value.requirement.trim(),
    willpowerCost: newSpell.value.willpowerCost.trim(),
    castingTime: newSpell.value.castingTime.trim(),
    range: newSpell.value.range.trim(),
    duration: newSpell.value.duration.trim(),
    description: newSpell.value.description.trim(),
  })
  resetNewSpell()
  showAddSpell.value = false
}
</script>

<template>
  <div v-if="character" class="space-y-4">
    <!-- Attributes + Conditions -->
    <fieldset class="fieldset border-base-300 rounded-box border p-4">
      <legend class="fieldset-legend">Attributes</legend>
      <div class="grid grid-cols-3 lg:grid-cols-6 gap-x-2 gap-y-6">
        <div v-for="p in attributePairs" :key="p.attrKey" class="flex flex-col items-center gap-2">
          <label class="label floating-label">
            <span>{{ p.attrLabel }}</span>
            <input
              type="number"
              class="input w-20"
              step="1"
              min="0"
              :value="character.attributes[p.attrKey]"
              @change="character.attributes[p.attrKey] = +($event.target as HTMLInputElement).value"
            />
          </label>
          <label class="label text-sm gap-1">
            <input
              type="checkbox"
              class="checkbox checkbox-sm checked:checkbox-warning"
              :checked="character.conditions[p.condKey]"
              @change="
                character.conditions[p.condKey] = ($event.target as HTMLInputElement).checked
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
          :label="SKILL_LABELS[key as keyof typeof SKILL_LABELS]"
          @update:skill="updateSkill(key as keyof typeof character.skills, $event)"
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
          :label="WEAPON_SKILL_LABELS[key as keyof typeof WEAPON_SKILL_LABELS]"
          @update:skill="updateWeaponSkill(key as keyof typeof character.weaponSkills, $event)"
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
            :label="skill.label"
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
      <button class="btn btn-sm min-h-[44px]" @click="showAddSecondary = true">Add Skill</button>

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
                () => {
                  showAddSecondary = false
                  newSecondaryLabel = ''
                }
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

    <!-- Heroic abilities -->
    <fieldset class="fieldset border-base-300 rounded-box border p-4">
      <legend class="fieldset-legend">Heroic Abilities</legend>
      <div class="flex flex-col gap-2 mb-3">
        <HeroicAbilityRow
          v-for="(ability, i) in character.heroicAbilities"
          :key="i"
          :ability="ability"
          :index="i"
          @update:ability="updateHeroicAbility(i, $event)"
          @remove="character.heroicAbilities.splice(i, 1)"
        />
      </div>
      <button class="btn btn-sm min-h-[44px]" @click="showAddHeroicAbility = true">
        Add Heroic Ability
      </button>

      <dialog :open="showAddHeroicAbility" class="modal">
        <div class="modal-box">
          <h2 class="text-lg font-bold">Add Heroic Ability</h2>
          <label for="heroic-ability-name" class="label mt-2">Name</label>
          <input
            id="heroic-ability-name"
            v-model="newHeroicAbility.name"
            type="text"
            class="input w-full mb-2"
            @keyup.enter="addHeroicAbility"
          />
          <label for="heroic-ability-wp" class="label">WP Cost</label>
          <input
            id="heroic-ability-wp"
            v-model.number="newHeroicAbility.willpowerCost"
            type="number"
            class="input w-full mb-2"
            min="0"
            step="1"
          />
          <label for="heroic-ability-description" class="label">Description</label>
          <textarea
            id="heroic-ability-description"
            v-model="newHeroicAbility.description"
            class="textarea w-full"
          ></textarea>
          <div class="modal-action">
            <button
              class="btn"
              @click="
                () => {
                  showAddHeroicAbility = false
                  resetNewHeroicAbility()
                }
              "
            >
              Cancel
            </button>
            <button
              class="btn btn-primary"
              :disabled="!newHeroicAbility.name.trim()"
              @click="addHeroicAbility"
            >
              Add
            </button>
          </div>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button
            @click="
              () => {
                showAddHeroicAbility = false
                resetNewHeroicAbility()
              }
            "
          >
            close
          </button>
        </form>
      </dialog>
    </fieldset>

    <!-- Spells -->
    <fieldset class="fieldset border-base-300 rounded-box border p-4">
      <legend class="fieldset-legend">Spells</legend>
      <div class="flex flex-col gap-2 mb-3">
        <SpellRow
          v-for="(spell, i) in character.spells"
          :key="i"
          :spell="spell"
          :index="i"
          @update:spell="updateSpell(i, $event)"
          @remove="character.spells.splice(i, 1)"
        />
      </div>
      <button class="btn btn-sm min-h-[44px]" @click="showAddSpell = true">Add Spell</button>

      <dialog :open="showAddSpell" class="modal">
        <div class="modal-box">
          <h2 class="text-lg font-bold">Add Spell</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <label for="spell-name" class="label">Name</label>
            <input
              id="spell-name"
              v-model="newSpell.name"
              type="text"
              class="input w-full md:col-start-1"
              @keyup.enter="addSpell"
            />
            <label for="spell-school" class="label">School</label>
            <input id="spell-school" v-model="newSpell.school" type="text" class="input w-full" />
            <label for="spell-rank" class="label">Rank</label>
            <input
              id="spell-rank"
              v-model.number="newSpell.rank"
              type="number"
              class="input w-full"
              min="0"
              step="1"
            />
            <label for="spell-wp" class="label">WP Cost</label>
            <input
              id="spell-wp"
              v-model="newSpell.willpowerCost"
              type="text"
              class="input w-full"
            />
            <label for="spell-requirement" class="label">Requirement</label>
            <input
              id="spell-requirement"
              v-model="newSpell.requirement"
              type="text"
              class="input w-full"
            />
            <label for="spell-casting-time" class="label">Casting Time</label>
            <input
              id="spell-casting-time"
              v-model="newSpell.castingTime"
              type="text"
              class="input w-full"
            />
            <label for="spell-range" class="label">Range</label>
            <input id="spell-range" v-model="newSpell.range" type="text" class="input w-full" />
            <label for="spell-duration" class="label">Duration</label>
            <input
              id="spell-duration"
              v-model="newSpell.duration"
              type="text"
              class="input w-full"
            />
          </div>
          <label for="spell-description" class="label mt-2">Description</label>
          <textarea
            id="spell-description"
            v-model="newSpell.description"
            class="textarea w-full"
          ></textarea>
          <div class="modal-action">
            <button
              class="btn"
              @click="
                () => {
                  showAddSpell = false
                  resetNewSpell()
                }
              "
            >
              Cancel
            </button>
            <button class="btn btn-primary" :disabled="!newSpell.name.trim()" @click="addSpell">
              Add
            </button>
          </div>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button
            @click="
              () => {
                showAddSpell = false
                resetNewSpell()
              }
            "
          >
            close
          </button>
        </form>
      </dialog>
    </fieldset>
  </div>
</template>
