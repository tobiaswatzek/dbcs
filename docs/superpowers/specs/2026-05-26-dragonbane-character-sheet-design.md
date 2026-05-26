# Dragonbane Character Sheet — Design Spec

**Date:** 2026-05-26
**Status:** Approved

## Overview

A mobile-first PWA companion app for the Dragonbane TTRPG. Replaces an Alpine.js prototype with a Vue 3 application. Supports multiple characters, autosaves to IndexedDB, exports/imports characters as JSON, and works fully offline without a backend.

---

## Stack

| Concern | Choice |
|---|---|
| Framework | Vue 3 + TypeScript |
| Build | Vite |
| State | Pinia |
| Routing | Vue Router |
| Styling | Tailwind CSS v4 + DaisyUI (themes: emerald / sunset) |
| Icons | Iconify (`@iconify/tailwind4`) — Tabler + game-icons sets |
| Storage | IndexedDB via `idb` |
| PWA | `vite-plugin-pwa` (Workbox `generateSW` mode) |
| Unit tests | Vitest + `fake-indexeddb` |
| E2E tests | Playwright |

---

## Routes

```
/                            CharacterListView   — pick, create, or import a character
/character/:id               → redirect to /character/:id/skills
/character/:id/skills        SkillsTab
/character/:id/combat        CombatTab
/character/:id/inventory     InventoryTab
/character/:id/background    BackgroundTab
```

---

## Data Model

```typescript
type Skill = {
  label: string
  value: number
  marked: boolean
}

type SecondarySkill = {
  label: string
  value: number
  marked: boolean
}

type Weapon = {
  name: string
  grip: string
  range: string
  damage: string
  durability: number | null
  features: string
}

type Armor = {
  name: string
  rating: number | null
  banes: { sneaking: boolean; evade: boolean; acrobatics: boolean }
}

type Helmet = {
  name: string
  rating: number | null
  banes: { awareness: boolean; rangedAttacks: boolean }
}

type InventoryItem = {
  name: string
  description: string
  weight: number
}

type TinyItem = {
  name: string
  description: string
}

type CharacterSummary = {
  id: string
  name: string
  kin: string
  profession: string
  updatedAt: string
}

type Character = {
  id: string           // UUID v4
  updatedAt: string    // ISO 8601 timestamp

  // Identity
  name: string
  kin: string          // Human | Elf | Dwarf | Halfling | Mallard | Wolfkin
  profession: string   // Artisan | Bard | Fighter | Hunter | Knight | Mage | Mariner | Merchant | Scholar | Thief
  age: string
  weakness: string
  appearance: string
  memento: string
  abilities: string    // free text — heroic abilities, dark secret, special abilities

  // Attributes
  attributes: {
    str: number; con: number; agl: number
    int: number; wil: number; cha: number
  }

  // Conditions (one per attribute, paired: str↔exhausted, con↔sickly, agl↔dazed, int↔angry, wil↔scared, cha↔disheartened)
  conditions: {
    exhausted: boolean; sickly: boolean; dazed: boolean
    angry: boolean; scared: boolean; disheartened: boolean
  }

  // Derived stats (manually entered)
  hitPoints: number
  maxHitPoints: number
  willpowerPoints: number
  maxWillpowerPoints: number
  movement: number
  damageBonusStr: string
  damageBonusAgl: string
  encumbranceLimit: number

  // Death rolls
  deathRolls: { successes: number; failures: number }

  // Currency
  coins: { gold: number; silver: number; copper: number }

  // Skills
  skills: {
    acrobatics: Skill; awareness: Skill; bartering: Skill; beastLore: Skill
    bluffing: Skill; bushcraft: Skill; crafting: Skill; evade: Skill
    healing: Skill; huntingFishing: Skill; languages: Skill; mythsLegends: Skill
    performance: Skill; persuasion: Skill; riding: Skill; seamanship: Skill
    sleightOfHand: Skill; sneaking: Skill; spotHidden: Skill; swimming: Skill
  }

  weaponSkills: {
    axes: Skill; bows: Skill; brawling: Skill; crossbows: Skill; hammers: Skill
    knives: Skill; slings: Skill; spears: Skill; staves: Skill; swords: Skill
  }

  secondarySkills: SecondarySkill[]

  // Equipment
  weapons: Weapon[]      // dynamic array — add/remove freely (no fixed slots)
  armor: Armor
  helmet: Helmet
  inventory: InventoryItem[]
  tinyItems: TinyItem[]
}
```

**Changes from prototype:**
- `id` and `updatedAt` fields added for IndexedDB keying and list display
- Conditions moved from flat top-level booleans to `conditions.*` nested object
- Weapons changed from 3 fixed slots to a dynamic array
- `abilities` promoted from an afterthought to a first-class field in BackgroundTab

Derived stats remain manually entered — no auto-calculation from attributes, to allow house-ruling.

---

## Component Structure

### Views
- `CharacterListView` — home screen
- `CharacterView` — active character shell (header + nav + `<RouterView>`)

### Tab components (rendered inside CharacterView's RouterView)
- `SkillsTab` — attributes + conditions, core skills, weapon skills, secondary skills
- `CombatTab` — weapons, damage bonuses, armor, helmet, death rolls
- `InventoryTab` — coins, encumbrance + items, tiny items
- `BackgroundTab` — weakness, appearance, age, memento, abilities

### Shared components
- `CharacterHeader` — sticky bar: HP/WP (current/max + reset), movement
- `SkillRow` — mark checkbox + label + number input; used in all three skill lists
- `WeaponSlot` — single weapon with add/remove
- `InventoryItem` — name, weight, description, remove button
- `TinyItem` — name, description, remove button
- `ConfirmDialog` — reusable dialog for destructive actions

### Navigation
- **Mobile:** bottom dock (DaisyUI `dock`) — Skills, Combat, Inventory, Background. Each item is a `<RouterLink>`. Labels always visible (not icon-only).
- **Desktop:** horizontal tab bar below the header.
- **Character switcher:** navbar button that navigates to `/`. Full navigation, no overlay/drawer.

---

## Persistence

### IndexedDB
- DB: `dbcs`, version 1
- Object store: `characters`, keyPath `id`
- Module `src/db.ts` exports typed helpers only — no other file accesses IndexedDB directly:
  - `getCharacter(id): Promise<Character>`
  - `putCharacter(character): Promise<void>`
  - `deleteCharacter(id): Promise<void>`
  - `getAllCharacterSummaries(): Promise<CharacterSummary[]>` — returns `{ id, name, kin, profession, updatedAt }` only

### Pinia stores
- `useCharacterListStore` — loads summaries on startup; updated on create/delete/import
- `useCharacterStore` — loads full character when a character route activates; cleared on leaving

### Autosave
- Pinia plugin watches `characterStore.$state`
- 300 ms debounce — calls `putCharacter` on any mutation
- `updatedAt` is set to `new Date().toISOString()` before each write

### IndexedDB unavailable
- Catch the `IDBFactory.open()` failure (e.g. private browsing on Firefox)
- Show a persistent DaisyUI alert banner: data won't be saved this session
- App remains fully functional — ephemeral mode

---

## PWA

- `vite-plugin-pwa` with Workbox `generateSW` mode
- Cache-first for all static assets; no runtime network requests
- Manifest:
  - `name`: "Dragonbane Character Sheet"
  - `short_name`: "DBCS"
  - `display`: "standalone"
  - `start_url`: "/"
  - `theme_color`: light `#00A96E` (emerald), dark `#E8572A` (sunset)
- Icons: reuse existing icons from `public/` (carried over from prototype)

---

## Export / Import

### Export
- Serialise character to `JSON.stringify(character, null, 2)`
- Download via temporary `<a href="blob:...">`, filename `<character-name>.json`
- Available from the `⋯` action menu on each character card (list screen) and from a menu button in the character navbar

### Import
- Hidden `<input type="file" accept=".json">` triggered by an "Import" button on the list screen
- Parse file content as JSON
- Validate: check required top-level keys exist and have correct types (no heavy schema library)
- If valid: assign a new UUID and `updatedAt`, write to IndexedDB, add to list
- If invalid: show DaisyUI alert with a descriptive error message
- Import always creates a new character — never silently overwrites an existing one

---

## Accessibility (Level B)

- Minimum 48×48 px touch targets on all interactive elements
- All inputs have explicit `<label for="...">` associations — no placeholder-only labels
- Fieldsets with `<legend>` for every grouped section
- Minimum 16px font size on input text
- DaisyUI emerald (light) and sunset (dark) themes maintain WCAG AA contrast on text
- Bottom dock labels always visible alongside icons
- No icon-only buttons without a `sr-only` text alternative

---

## Testing

### Unit (Vitest)
- `db.ts`: CRUD operations against `fake-indexeddb`
- Import validation: valid JSON, missing required fields, wrong types, malformed file
- `useCharacterStore`: autosave debounce, load/unload lifecycle
- Utility functions: export filename generation

### E2E (Playwright)
- Create character → fill name/kin/profession → navigate all tabs → reload → data persists
- Create two characters → switch between them → data is independent
- Export → import round-trip → all fields match
- Import invalid JSON → error message shown, no crash
- Character not found (stale URL) → redirects to `/`

---

## Out of Scope (this version)

- Spell / magic tracking (deferred to future version)
- PDF export
- IndexedDB schema migrations (version 1 only; add when model changes)
- Conflict resolution for simultaneous edits in multiple tabs (last write wins)
- Dice roller
- Backend / sync
