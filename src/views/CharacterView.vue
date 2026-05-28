<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCharacterStore } from '../stores/character'
import CharacterHeader from '../components/CharacterHeader.vue'

const route = useRoute()
const router = useRouter()
const store = useCharacterStore()
const { character } = storeToRefs(store)

const tabs = [
  {
    name: 'skills',
    path: 'skills',
    label: 'Skills',
    icon: 'icon-[game-icons--skills]',
  },
  {
    name: 'combat',
    path: 'combat',
    label: 'Combat',
    icon: 'icon-[game-icons--swords-emblem]',
  },
  {
    name: 'inventory',
    path: 'inventory',
    label: 'Inventory',
    icon: 'icon-[game-icons--swap-bag]',
  },
  {
    name: 'background',
    path: 'background',
    label: 'Background',
    icon: 'icon-[game-icons--white-book]',
  },
]

onMounted(async () => {
  const found = await store.loadCharacter(route.params.id as string)
  if (!found) router.replace('/')
})

onUnmounted(() => store.clearCharacter())
</script>

<template>
  <div v-if="character" class="flex flex-col min-h-screen mb-20 md:mb-0">
    <!-- Navbar -->
    <nav class="navbar bg-base-100 shadow-sm">
      <div class="flex-none">
        <RouterLink to="/" class="btn btn-ghost btn-sm min-h-[48px]">← Characters</RouterLink>
      </div>
      <div class="flex-1 text-center overflow-hidden px-2">
        <div class="font-bold truncate">
          {{ character.name || 'Character' }}
        </div>
        <div v-if="character.kin || character.profession" class="text-xs opacity-60 truncate">
          {{ [character.kin, character.profession].filter(Boolean).join(' · ') }}
        </div>
      </div>
      <div class="flex-none w-24"></div>
    </nav>

    <!-- HP / WP / Movement -->
    <CharacterHeader />

    <!-- Desktop tab bar -->
    <nav
      class="hidden md:flex tabs tabs-border w-full justify-center border-b border-base-200"
      role="tablist"
      aria-label="Character tabs"
    >
      <RouterLink
        v-for="tab in tabs"
        :key="tab.name"
        :to="`/character/${route.params.id}/${tab.path}`"
        class="tab"
        active-class="tab-active"
        role="tab"
      >
        {{ tab.label }}
      </RouterLink>
    </nav>

    <!-- Tab content -->
    <main class="flex-1 p-2 overflow-y-auto">
      <RouterView />
    </main>

    <!-- Mobile bottom dock -->
    <nav class="dock z-50 md:hidden" aria-label="Character tabs">
      <RouterLink
        v-for="tab in tabs"
        :key="tab.name"
        :to="`/character/${route.params.id}/${tab.path}`"
        active-class="dock-active"
      >
        <span :class="tab.icon" aria-hidden="true"></span>
        <span class="dock-label">{{ tab.label }}</span>
      </RouterLink>
    </nav>
  </div>

  <!-- Loading state -->
  <div v-else class="flex items-center justify-center min-h-screen">
    <span class="loading loading-spinner loading-lg"></span>
  </div>
</template>
