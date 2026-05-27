# DBCS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first Vue 3 PWA character sheet companion app with multi-character management, autosave to IndexedDB, and JSON export/import.

**Architecture:** Single-page app with Vue Router tab-level routing (`/character/:id/skills` etc.), Pinia stores for in-memory state, and IndexedDB for persistence. A Pinia plugin debounces character mutations and writes to IndexedDB automatically. No backend.

**Tech Stack:** Vue 3, TypeScript, Vite, Pinia, Vue Router, Tailwind CSS v4, DaisyUI, `idb`, `vite-plugin-pwa`, `@iconify/tailwind4`, Vitest + `@vue/test-utils` + `fake-indexeddb`, Playwright

---

## File Map

### Created
| File | Responsibility |
|---|---|
| `CLAUDE.md` | Project docs, commands, architecture overview |
| `src/style.css` | Tailwind v4 entry + DaisyUI + Iconify plugins |
| `src/types/character.ts` | All TypeScript types (Character, Skill, Weapon, etc.) |
| `src/db.ts` | IndexedDB helpers — only file that touches IDB |
| `src/utils/character.ts` | `createBlankCharacter()` factory |
| `src/utils/export.ts` | `exportCharacterAsJson()` — triggers browser download |
| `src/utils/import.ts` | `parseAndValidateCharacter()` — parse + validate JSON |
| `src/stores/characterList.ts` | `useCharacterListStore` — summaries + CRUD |
| `src/stores/character.ts` | `useCharacterStore` — active character |
| `src/plugins/autosave.ts` | Pinia plugin — 300 ms debounced save on any mutation |
| `src/router/index.ts` | All routes (replaces scaffold) |
| `src/views/CharacterListView.vue` | Home screen: list, create, import |
| `src/views/CharacterView.vue` | Character shell: header + nav + RouterView |
| `src/tabs/SkillsTab.vue` | Attributes, conditions, all skill lists |
| `src/tabs/CombatTab.vue` | Weapons, damage bonuses, armor, helmet, death rolls |
| `src/tabs/InventoryTab.vue` | Coins, encumbrance, items, tiny items |
| `src/tabs/BackgroundTab.vue` | Identity, weakness, appearance, memento, abilities |
| `src/components/CharacterHeader.vue` | Sticky HP / WP / Movement bar |
| `src/components/SkillRow.vue` | Mark checkbox + label + value input |
| `src/components/WeaponSlot.vue` | Single weapon row with remove |
| `src/components/InventoryItemRow.vue` | Single inventory item with remove |
| `src/components/TinyItemRow.vue` | Single tiny item with remove |
| `src/components/ConfirmDialog.vue` | Reusable destructive-action dialog |
| `src/__tests__/db.spec.ts` | DB layer tests |
| `src/__tests__/utils/import.spec.ts` | Import validation tests |
| `src/__tests__/utils/export.spec.ts` | Export filename tests |
| `src/__tests__/stores/characterList.spec.ts` | List store tests |
| `src/__tests__/stores/character.spec.ts` | Character store tests |
| `src/__tests__/plugins/autosave.spec.ts` | Autosave debounce tests |
| `src/__tests__/components/SkillRow.spec.ts` | SkillRow unit tests |
| `src/__tests__/components/ConfirmDialog.spec.ts` | ConfirmDialog unit tests |
| `src/__tests__/views/CharacterListView.spec.ts` | List view tests |
| `e2e/character.spec.ts` | End-to-end character flows |

### Modified
| File | Change |
|---|---|
| `vite.config.ts` | Add Tailwind + PWA plugins |
| `src/main.ts` | Import style, register autosave plugin |
| `src/App.vue` | Replace with minimal RouterView wrapper |
| `index.html` | Title, viewport-fit, PWA meta tags |
| `public/` | Copy PWA icons from `old/public/` |

### Deleted
| File | Reason |
|---|---|
| `src/stores/counter.ts` | Scaffold leftover |
| `src/__tests__/App.spec.ts` | Scaffold leftover |

---

## Task 1: CLAUDE.md + copy icons

**Files:**
- Create: `CLAUDE.md`
- Modify: `public/` (copy icons)

- [ ] **Create CLAUDE.md**

```markdown
# DBCS

Mobile-first PWA character sheet companion app for the TTRPG "Dragonbane". No backend — fully local, works offline.

## Commands

\`\`\`bash
pnpm dev        # Dev server at http://localhost:5173
pnpm test:unit  # Unit tests (Vitest)
pnpm test:e2e   # E2E tests — requires dev server running
pnpm build      # Type-check + build
pnpm lint       # Lint + auto-fix
pnpm format     # Format src/
\`\`\`

## Stack

- Vue 3 + TypeScript, Vite, Pinia, Vue Router
- Tailwind CSS v4 + DaisyUI (emerald light / sunset dark)
- Iconify `@iconify/tailwind4` — tabler + game-icons sets
- IndexedDB via `idb` for persistence
- `vite-plugin-pwa` (Workbox) for PWA
- Vitest + `@vue/test-utils` + `fake-indexeddb` for unit tests
- Playwright for E2E

## Architecture

Characters live in IndexedDB (`dbcs` DB, `characters` store). A Pinia plugin autosaves any mutation to the active character with a 300 ms debounce. Each tab is a named route (`/character/:id/skills` etc.). The list screen is at `/`.

**Only `src/db.ts` accesses IndexedDB directly.**

## Key files

\`\`\`
src/types/character.ts      All types
src/db.ts                   IDB helpers
src/utils/character.ts      createBlankCharacter()
src/utils/export.ts         JSON download
src/utils/import.ts         JSON parse + validation
src/stores/characterList.ts Character summaries store
src/stores/character.ts     Active character store
src/plugins/autosave.ts     Pinia autosave plugin
src/views/CharacterListView.vue
src/views/CharacterView.vue
src/tabs/Skill|Combat|Inventory|BackgroundTab.vue
src/components/CharacterHeader|SkillRow|WeaponSlot|...vue
\`\`\`

## Accessibility (Level B)

- Min 48×48 px touch targets on all interactive elements
- All inputs have explicit `<label for>` — no placeholder-only labels
- Fieldsets with `<legend>` for every grouped section
- Icon-only buttons always have `aria-label`
- Min 16 px font on inputs

## Design spec

`docs/superpowers/specs/2026-05-26-dragonbane-character-sheet-design.md`
```

- [ ] **Copy PWA icons from old prototype**

```bash
cp old/public/pwa-192x192.png public/
cp old/public/pwa-512x512.png public/
cp old/public/pwa-maskable-192x192.png public/
cp old/public/pwa-maskable-512x512.png public/
cp old/public/apple-touch-icon.png public/
cp old/public/favicon-16x16.png public/
cp old/public/favicon-32x32.png public/
```

- [ ] **Commit**

```bash
git add CLAUDE.md public/
git commit -m "docs: add CLAUDE.md and copy PWA icons"
```

---

## Task 2: Install + configure Tailwind v4, DaisyUI, Iconify

**Files:**
- Modify: `vite.config.ts`, `src/main.ts`, `index.html`
- Create: `src/style.css`

- [ ] **Install packages**

```bash
pnpm add tailwindcss @tailwindcss/vite daisyui @iconify/tailwind4 @iconify-json/tabler @iconify-json/game-icons
```

- [ ] **Update `vite.config.ts`**

```typescript
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
```

- [ ] **Create `src/style.css`**

```css
@import "tailwindcss";
@plugin "@iconify/tailwind4";
@plugin "daisyui" {
  themes: emerald --default, sunset --prefersdark;
}
```

- [ ] **Update `src/main.ts`** — add style import (plugin registration comes in Task 8)

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
```

- [ ] **Update `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
    <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#00A96E" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#1d232a" media="(prefers-color-scheme: dark)" />
    <title>DBCS</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [ ] **Smoke-test: run dev server and confirm DaisyUI classes render**

```bash
pnpm dev
# Open http://localhost:5173 — page should load without errors
```

- [ ] **Commit**

```bash
git add vite.config.ts src/style.css src/main.ts index.html
git commit -m "feat: configure Tailwind v4, DaisyUI, Iconify"
```

---

## Task 3: TypeScript types + blank character factory

**Files:**
- Create: `src/types/character.ts`, `src/utils/character.ts`

No tests for pure types.

- [ ] **Create `src/types/character.ts`**

```typescript
export type Skill = {
  label: string
  value: number
  marked: boolean
}

export type Weapon = {
  name: string
  grip: string
  range: string
  damage: string
  durability: number | null
  features: string
}

export type Armor = {
  name: string
  rating: number | null
  banes: { sneaking: boolean; evade: boolean; acrobatics: boolean }
}

export type Helmet = {
  name: string
  rating: number | null
  banes: { awareness: boolean; rangedAttacks: boolean }
}

export type InventoryItem = {
  name: string
  description: string
  weight: number
}

export type TinyItem = {
  name: string
  description: string
}

export type CharacterSummary = {
  id: string
  name: string
  kin: string
  profession: string
  updatedAt: string
}

export type Character = {
  id: string
  updatedAt: string

  name: string
  kin: string
  profession: string
  age: string
  weakness: string
  appearance: string
  memento: string
  abilities: string

  attributes: { str: number; con: number; agl: number; int: number; wil: number; cha: number }

  conditions: {
    exhausted: boolean
    sickly: boolean
    dazed: boolean
    angry: boolean
    scared: boolean
    disheartened: boolean
  }

  hitPoints: number
  maxHitPoints: number
  willpowerPoints: number
  maxWillpowerPoints: number
  movement: number
  damageBonusStr: string
  damageBonusAgl: string
  encumbranceLimit: number

  deathRolls: { successes: number; failures: number }
  coins: { gold: number; silver: number; copper: number }

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

  secondarySkills: Skill[]
  weapons: Weapon[]
  armor: Armor
  helmet: Helmet
  inventory: InventoryItem[]
  tinyItems: TinyItem[]
}
```

- [ ] **Create `src/utils/character.ts`**

```typescript
import type { Character } from '../types/character'

export function createBlankCharacter(): Omit<Character, 'id' | 'updatedAt'> {
  return {
    name: '', kin: '', profession: '', age: '',
    weakness: '', appearance: '', memento: '', abilities: '',
    attributes: { str: 0, con: 0, agl: 0, int: 0, wil: 0, cha: 0 },
    conditions: {
      exhausted: false, sickly: false, dazed: false,
      angry: false, scared: false, disheartened: false,
    },
    hitPoints: 0, maxHitPoints: 0,
    willpowerPoints: 0, maxWillpowerPoints: 0,
    movement: 0, damageBonusStr: '', damageBonusAgl: '',
    encumbranceLimit: 0,
    deathRolls: { successes: 0, failures: 0 },
    coins: { gold: 0, silver: 0, copper: 0 },
    skills: {
      acrobatics:    { label: 'Acrobatics (AGL)',       value: 0, marked: false },
      awareness:     { label: 'Awareness (INT)',         value: 0, marked: false },
      bartering:     { label: 'Bartering (CHA)',         value: 0, marked: false },
      beastLore:     { label: 'Beast Lore (INT)',        value: 0, marked: false },
      bluffing:      { label: 'Bluffing (CHA)',          value: 0, marked: false },
      bushcraft:     { label: 'Bushcraft (INT)',         value: 0, marked: false },
      crafting:      { label: 'Crafting (STR)',          value: 0, marked: false },
      evade:         { label: 'Evade (AGL)',             value: 0, marked: false },
      healing:       { label: 'Healing (INT)',           value: 0, marked: false },
      huntingFishing:{ label: 'Hunting & Fishing (AGL)',value: 0, marked: false },
      languages:     { label: 'Languages (INT)',         value: 0, marked: false },
      mythsLegends:  { label: 'Myths & Legends (INT)',  value: 0, marked: false },
      performance:   { label: 'Performance (CHA)',       value: 0, marked: false },
      persuasion:    { label: 'Persuasion (CHA)',        value: 0, marked: false },
      riding:        { label: 'Riding (AGL)',            value: 0, marked: false },
      seamanship:    { label: 'Seamanship (INT)',        value: 0, marked: false },
      sleightOfHand: { label: 'Sleight of Hand (AGL)',  value: 0, marked: false },
      sneaking:      { label: 'Sneaking (AGL)',          value: 0, marked: false },
      spotHidden:    { label: 'Spot Hidden (INT)',       value: 0, marked: false },
      swimming:      { label: 'Swimming (AGL)',          value: 0, marked: false },
    },
    weaponSkills: {
      axes:      { label: 'Axes (STR)',      value: 0, marked: false },
      bows:      { label: 'Bows (AGL)',      value: 0, marked: false },
      brawling:  { label: 'Brawling (STR)',  value: 0, marked: false },
      crossbows: { label: 'Crossbows (AGL)', value: 0, marked: false },
      hammers:   { label: 'Hammers (STR)',   value: 0, marked: false },
      knives:    { label: 'Knives (AGL)',    value: 0, marked: false },
      slings:    { label: 'Slings (AGL)',    value: 0, marked: false },
      spears:    { label: 'Spears (STR)',    value: 0, marked: false },
      staves:    { label: 'Staves (AGL)',    value: 0, marked: false },
      swords:    { label: 'Swords (STR)',    value: 0, marked: false },
    },
    secondarySkills: [],
    weapons: [],
    armor:   { name: '', rating: null, banes: { sneaking: false, evade: false, acrobatics: false } },
    helmet:  { name: '', rating: null, banes: { awareness: false, rangedAttacks: false } },
    inventory: [],
    tinyItems: [],
  }
}
```

- [ ] **Commit**

```bash
git add src/types/character.ts src/utils/character.ts
git commit -m "feat: add Character types and blank character factory"
```

---

## Task 4: DB layer (TDD)

**Files:**
- Create: `src/db.ts`, `src/__tests__/db.spec.ts`

- [ ] **Install packages**

```bash
pnpm add idb
pnpm add -D fake-indexeddb
```

- [ ] **Write failing test `src/__tests__/db.spec.ts`**

```typescript
import { beforeEach, describe, expect, it } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'
import {
  deleteCharacter, getAllCharacterSummaries,
  getCharacter, putCharacter, resetDb,
} from '../db'
import type { Character } from '../types/character'
import { createBlankCharacter } from '../utils/character'

function makeChar(overrides: Partial<Character> = {}): Character {
  return {
    ...createBlankCharacter(),
    id: 'id-1',
    updatedAt: '2026-01-01T00:00:00.000Z',
    name: 'Test Hero',
    ...overrides,
  }
}

beforeEach(() => {
  globalThis.indexedDB = new IDBFactory()
  resetDb()
})

describe('putCharacter / getCharacter', () => {
  it('stores and retrieves a character', async () => {
    await putCharacter(makeChar())
    expect(await getCharacter('id-1')).toEqual(makeChar())
  })

  it('returns undefined for unknown id', async () => {
    expect(await getCharacter('nope')).toBeUndefined()
  })

  it('overwrites on re-put', async () => {
    await putCharacter(makeChar({ name: 'Original' }))
    await putCharacter(makeChar({ name: 'Updated' }))
    expect((await getCharacter('id-1'))?.name).toBe('Updated')
  })
})

describe('deleteCharacter', () => {
  it('removes the character', async () => {
    await putCharacter(makeChar())
    await deleteCharacter('id-1')
    expect(await getCharacter('id-1')).toBeUndefined()
  })
})

describe('getAllCharacterSummaries', () => {
  it('returns [] when empty', async () => {
    expect(await getAllCharacterSummaries()).toEqual([])
  })

  it('returns only summary fields', async () => {
    await putCharacter(makeChar({ id: 'a', name: 'Alice', kin: 'Elf', profession: 'Mage' }))
    const summaries = await getAllCharacterSummaries()
    expect(summaries).toHaveLength(1)
    expect(summaries[0]).toEqual({
      id: 'a', name: 'Alice', kin: 'Elf',
      profession: 'Mage', updatedAt: '2026-01-01T00:00:00.000Z',
    })
    expect(Object.keys(summaries[0])).toHaveLength(5)
  })
})
```

- [ ] **Run test — expect it to fail**

```bash
pnpm test:unit src/__tests__/db.spec.ts
# Expected: FAIL (db module does not exist)
```

- [ ] **Create `src/db.ts`**

```typescript
import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Character, CharacterSummary } from './types/character'

interface DbSchema extends DBSchema {
  characters: { key: string; value: Character }
}

let _db: Promise<IDBPDatabase<DbSchema>> | null = null

export function resetDb(): void {
  _db = null
}

function getDb(): Promise<IDBPDatabase<DbSchema>> {
  if (!_db) {
    _db = openDB<DbSchema>('dbcs', 1, {
      upgrade(db) {
        db.createObjectStore('characters', { keyPath: 'id' })
      },
    })
  }
  return _db
}

export async function getCharacter(id: string): Promise<Character | undefined> {
  return (await getDb()).get('characters', id)
}

export async function putCharacter(character: Character): Promise<void> {
  await (await getDb()).put('characters', character)
}

export async function deleteCharacter(id: string): Promise<void> {
  await (await getDb()).delete('characters', id)
}

export async function getAllCharacterSummaries(): Promise<CharacterSummary[]> {
  const all = await (await getDb()).getAll('characters')
  return all.map(({ id, name, kin, profession, updatedAt }) => ({
    id, name, kin, profession, updatedAt,
  }))
}
```

- [ ] **Run test — expect it to pass**

```bash
pnpm test:unit src/__tests__/db.spec.ts
# Expected: all tests PASS
```

- [ ] **Commit**

```bash
git add src/db.ts src/__tests__/db.spec.ts
git commit -m "feat: add IndexedDB layer"
```

---

## Task 5: Import + Export utilities (TDD)

**Files:**
- Create: `src/utils/import.ts`, `src/utils/export.ts`
- Create: `src/__tests__/utils/import.spec.ts`, `src/__tests__/utils/export.spec.ts`

- [ ] **Write failing import tests `src/__tests__/utils/import.spec.ts`**

```typescript
import { describe, expect, it } from 'vitest'
import { parseAndValidateCharacter } from '../../utils/import'
import { createBlankCharacter } from '../../utils/character'

function validJson(): string {
  return JSON.stringify({
    ...createBlankCharacter(),
    id: 'x', updatedAt: '2026-01-01T00:00:00.000Z',
  })
}

describe('parseAndValidateCharacter', () => {
  it('accepts a valid character JSON', () => {
    expect(parseAndValidateCharacter(validJson()).success).toBe(true)
  })

  it('rejects malformed JSON', () => {
    const r = parseAndValidateCharacter('{bad')
    expect(r.success).toBe(false)
    if (!r.success) expect(r.error).toMatch(/Invalid JSON/)
  })

  it('rejects a non-object value', () => {
    const r = parseAndValidateCharacter('"a string"')
    expect(r.success).toBe(false)
  })

  it('rejects when "name" field is missing', () => {
    const obj = JSON.parse(validJson())
    delete obj.name
    const r = parseAndValidateCharacter(JSON.stringify(obj))
    expect(r.success).toBe(false)
    if (!r.success) expect(r.error).toContain('"name"')
  })

  it('rejects when "name" is not a string', () => {
    const obj = JSON.parse(validJson())
    obj.name = 99
    expect(parseAndValidateCharacter(JSON.stringify(obj)).success).toBe(false)
  })

  it('rejects when "attributes" is missing', () => {
    const obj = JSON.parse(validJson())
    delete obj.attributes
    expect(parseAndValidateCharacter(JSON.stringify(obj)).success).toBe(false)
  })

  it('rejects when "skills" is missing', () => {
    const obj = JSON.parse(validJson())
    delete obj.skills
    expect(parseAndValidateCharacter(JSON.stringify(obj)).success).toBe(false)
  })
})
```

- [ ] **Run import test — expect FAIL**

```bash
pnpm test:unit src/__tests__/utils/import.spec.ts
# Expected: FAIL
```

- [ ] **Create `src/utils/import.ts`**

```typescript
import type { Character } from '../types/character'

type ImportSuccess = { success: true; character: Omit<Character, 'id' | 'updatedAt'> }
type ImportFailure = { success: false; error: string }
export type ImportResult = ImportSuccess | ImportFailure

const REQUIRED_STRINGS = [
  'name', 'kin', 'profession', 'age',
  'weakness', 'appearance', 'memento', 'abilities',
] as const

const REQUIRED_OBJECTS = [
  'attributes', 'conditions', 'deathRolls', 'coins',
  'skills', 'weaponSkills', 'armor', 'helmet',
] as const

const REQUIRED_ARRAYS = [
  'secondarySkills', 'weapons', 'inventory', 'tinyItems',
] as const

export function parseAndValidateCharacter(json: string): ImportResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    return { success: false, error: 'Invalid JSON: the file could not be parsed.' }
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return { success: false, error: 'Invalid format: expected a JSON object.' }
  }

  const obj = parsed as Record<string, unknown>

  for (const field of REQUIRED_STRINGS) {
    if (typeof obj[field] !== 'string') {
      return { success: false, error: `Invalid format: missing or invalid field "${field}".` }
    }
  }

  for (const field of REQUIRED_OBJECTS) {
    if (typeof obj[field] !== 'object' || obj[field] === null || Array.isArray(obj[field])) {
      return { success: false, error: `Invalid format: missing or invalid field "${field}".` }
    }
  }

  for (const field of REQUIRED_ARRAYS) {
    if (!Array.isArray(obj[field])) {
      return { success: false, error: `Invalid format: "${field}" must be an array.` }
    }
  }

  return { success: true, character: obj as unknown as Omit<Character, 'id' | 'updatedAt'> }
}
```

- [ ] **Run import test — expect PASS**

```bash
pnpm test:unit src/__tests__/utils/import.spec.ts
# Expected: all PASS
```

- [ ] **Write failing export test `src/__tests__/utils/export.spec.ts`**

```typescript
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { exportCharacterAsJson } from '../../utils/export'
import { createBlankCharacter } from '../../utils/character'
import type { Character } from '../../types/character'

describe('exportCharacterAsJson', () => {
  let anchor: HTMLAnchorElement

  beforeEach(() => {
    anchor = document.createElement('a')
    vi.spyOn(anchor, 'click').mockImplementation(() => {})
    vi.spyOn(document, 'createElement').mockReturnValue(anchor as any)
    vi.spyOn(document.body, 'appendChild').mockReturnValue(anchor as any)
    vi.spyOn(document.body, 'removeChild').mockReturnValue(anchor as any)
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
  })

  afterEach(() => vi.restoreAllMocks())

  function makeChar(name: string): Character {
    return { ...createBlankCharacter(), id: 'x', updatedAt: '2026-01-01T00:00:00.000Z', name }
  }

  it('sets download filename to character name + .json', () => {
    exportCharacterAsJson(makeChar('Elara'))
    expect(anchor.download).toBe('Elara.json')
  })

  it('falls back to "character.json" when name is empty', () => {
    exportCharacterAsJson(makeChar(''))
    expect(anchor.download).toBe('character.json')
  })

  it('triggers a click on the anchor', () => {
    exportCharacterAsJson(makeChar('Hero'))
    expect(anchor.click).toHaveBeenCalled()
  })
})
```

- [ ] **Run export test — expect FAIL**

```bash
pnpm test:unit src/__tests__/utils/export.spec.ts
# Expected: FAIL
```

- [ ] **Create `src/utils/export.ts`**

```typescript
import type { Character } from '../types/character'

export function exportCharacterAsJson(character: Character): void {
  const json = JSON.stringify(character, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${character.name.trim() || 'character'}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
```

- [ ] **Run export test — expect PASS**

```bash
pnpm test:unit src/__tests__/utils/export.spec.ts
# Expected: all PASS
```

- [ ] **Commit**

```bash
git add src/utils/import.ts src/utils/export.ts \
        src/__tests__/utils/import.spec.ts src/__tests__/utils/export.spec.ts
git commit -m "feat: add import validation and export utilities"
```

---

## Task 6: Pinia stores (TDD)

**Files:**
- Create: `src/stores/characterList.ts`, `src/stores/character.ts`
- Create: `src/__tests__/stores/characterList.spec.ts`, `src/__tests__/stores/character.spec.ts`

- [ ] **Write failing characterList store test**

`src/__tests__/stores/characterList.spec.ts`:

```typescript
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useCharacterListStore } from '../../stores/characterList'
import type { CharacterSummary } from '../../types/character'

vi.mock('../../db', () => ({
  getAllCharacterSummaries: vi.fn().mockResolvedValue([]),
  deleteCharacter: vi.fn().mockResolvedValue(undefined),
}))

beforeEach(() => setActivePinia(createPinia()))

describe('useCharacterListStore', () => {
  it('starts empty and unloaded', () => {
    const s = useCharacterListStore()
    expect(s.summaries).toEqual([])
    expect(s.isLoaded).toBe(false)
  })

  it('loadSummaries populates from db', async () => {
    const { getAllCharacterSummaries } = await import('../../db')
    vi.mocked(getAllCharacterSummaries).mockResolvedValueOnce([
      { id: '1', name: 'Alice', kin: 'Elf', profession: 'Mage', updatedAt: '' },
    ])
    const s = useCharacterListStore()
    await s.loadSummaries()
    expect(s.summaries).toHaveLength(1)
    expect(s.isLoaded).toBe(true)
  })

  it('addSummary appends', () => {
    const s = useCharacterListStore()
    const summary: CharacterSummary = { id: '1', name: 'Bob', kin: 'Human', profession: 'Fighter', updatedAt: '' }
    s.addSummary(summary)
    expect(s.summaries).toContainEqual(summary)
  })

  it('removeCharacter calls db and removes from list', async () => {
    const s = useCharacterListStore()
    s.addSummary({ id: '1', name: 'X', kin: '', profession: '', updatedAt: '' })
    await s.removeCharacter('1')
    expect(s.summaries).toHaveLength(0)
  })

  it('updateSummary replaces matching summary', () => {
    const s = useCharacterListStore()
    s.addSummary({ id: '1', name: 'Old', kin: '', profession: '', updatedAt: '' })
    s.updateSummary({ id: '1', name: 'New', kin: '', profession: '', updatedAt: '' })
    expect(s.summaries[0].name).toBe('New')
  })
})
```

- [ ] **Run — expect FAIL**

```bash
pnpm test:unit src/__tests__/stores/characterList.spec.ts
# Expected: FAIL
```

- [ ] **Create `src/stores/characterList.ts`**

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CharacterSummary } from '../types/character'
import { getAllCharacterSummaries, deleteCharacter as dbDelete } from '../db'

export const useCharacterListStore = defineStore('characterList', () => {
  const summaries = ref<CharacterSummary[]>([])
  const isLoaded = ref(false)

  async function loadSummaries() {
    summaries.value = await getAllCharacterSummaries()
    isLoaded.value = true
  }

  function addSummary(summary: CharacterSummary) {
    summaries.value.push(summary)
  }

  function updateSummary(summary: CharacterSummary) {
    const idx = summaries.value.findIndex((s) => s.id === summary.id)
    if (idx !== -1) summaries.value[idx] = summary
  }

  async function removeCharacter(id: string) {
    await dbDelete(id)
    summaries.value = summaries.value.filter((s) => s.id !== id)
  }

  return { summaries, isLoaded, loadSummaries, addSummary, updateSummary, removeCharacter }
})
```

- [ ] **Run characterList test — expect PASS**

```bash
pnpm test:unit src/__tests__/stores/characterList.spec.ts
```

- [ ] **Write failing character store test**

`src/__tests__/stores/character.spec.ts`:

```typescript
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useCharacterStore } from '../../stores/character'
import { createBlankCharacter } from '../../utils/character'
import type { Character } from '../../types/character'

const mockChar = (): Character => ({
  ...createBlankCharacter(),
  id: '1', updatedAt: '2026-01-01T00:00:00.000Z', name: 'Alice',
})

vi.mock('../../db', () => ({
  getCharacter: vi.fn(),
  putCharacter: vi.fn().mockResolvedValue(undefined),
}))

beforeEach(() => setActivePinia(createPinia()))

describe('useCharacterStore', () => {
  it('starts with null character', () => {
    const s = useCharacterStore()
    expect(s.character).toBeNull()
    expect(s.isLoaded).toBe(false)
  })

  it('loadCharacter returns true and sets character', async () => {
    const { getCharacter } = await import('../../db')
    vi.mocked(getCharacter).mockResolvedValueOnce(mockChar())
    const s = useCharacterStore()
    expect(await s.loadCharacter('1')).toBe(true)
    expect(s.character?.name).toBe('Alice')
    expect(s.isLoaded).toBe(true)
  })

  it('loadCharacter returns false when not found', async () => {
    const { getCharacter } = await import('../../db')
    vi.mocked(getCharacter).mockResolvedValueOnce(undefined)
    const s = useCharacterStore()
    expect(await s.loadCharacter('missing')).toBe(false)
    expect(s.character).toBeNull()
  })

  it('clearCharacter resets to null', async () => {
    const { getCharacter } = await import('../../db')
    vi.mocked(getCharacter).mockResolvedValueOnce(mockChar())
    const s = useCharacterStore()
    await s.loadCharacter('1')
    s.clearCharacter()
    expect(s.character).toBeNull()
    expect(s.isLoaded).toBe(false)
  })
})
```

- [ ] **Run — expect FAIL**

```bash
pnpm test:unit src/__tests__/stores/character.spec.ts
# Expected: FAIL
```

- [ ] **Create `src/stores/character.ts`**

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Character } from '../types/character'
import { getCharacter } from '../db'

export const useCharacterStore = defineStore('character', () => {
  const character = ref<Character | null>(null)
  const isLoaded = ref(false)

  async function loadCharacter(id: string): Promise<boolean> {
    const c = await getCharacter(id)
    if (!c) return false
    character.value = c
    isLoaded.value = true
    return true
  }

  function clearCharacter() {
    character.value = null
    isLoaded.value = false
  }

  return { character, isLoaded, loadCharacter, clearCharacter }
})
```

- [ ] **Run character store test — expect PASS**

```bash
pnpm test:unit src/__tests__/stores/character.spec.ts
```

- [ ] **Commit**

```bash
git add src/stores/ src/__tests__/stores/
git commit -m "feat: add characterList and character Pinia stores"
```

---

## Task 7: Autosave plugin + wire into main.ts

**Files:**
- Create: `src/plugins/autosave.ts`, `src/__tests__/plugins/autosave.spec.ts`
- Modify: `src/main.ts`

- [ ] **Write failing autosave test**

`src/__tests__/plugins/autosave.spec.ts`:

```typescript
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { autosavePlugin } from '../../plugins/autosave'
import { useCharacterStore } from '../../stores/character'
import { createBlankCharacter } from '../../utils/character'
import type { Character } from '../../types/character'

const mockChar = (): Character => ({
  ...createBlankCharacter(), id: '1', updatedAt: '2026-01-01T00:00:00.000Z',
})

vi.mock('../../db', () => ({
  getCharacter: vi.fn(),
  putCharacter: vi.fn().mockResolvedValue(undefined),
}))

beforeEach(() => {
  vi.useFakeTimers()
  const pinia = createPinia()
  pinia.use(autosavePlugin)
  setActivePinia(pinia)
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('autosavePlugin', () => {
  it('calls putCharacter after 300 ms when character changes', async () => {
    const { getCharacter, putCharacter } = await import('../../db')
    vi.mocked(getCharacter).mockResolvedValueOnce(mockChar())
    const store = useCharacterStore()
    await store.loadCharacter('1')

    store.character!.name = 'Changed'
    expect(putCharacter).not.toHaveBeenCalled()

    vi.advanceTimersByTime(300)
    await vi.runAllTimersAsync()

    expect(putCharacter).toHaveBeenCalledOnce()
    expect(vi.mocked(putCharacter).mock.calls[0][0].name).toBe('Changed')
  })

  it('debounces rapid changes into one save', async () => {
    const { getCharacter, putCharacter } = await import('../../db')
    vi.mocked(getCharacter).mockResolvedValueOnce(mockChar())
    const store = useCharacterStore()
    await store.loadCharacter('1')

    store.character!.name = 'A'
    vi.advanceTimersByTime(100)
    store.character!.name = 'AB'
    vi.advanceTimersByTime(100)
    store.character!.name = 'ABC'
    vi.advanceTimersByTime(300)
    await vi.runAllTimersAsync()

    expect(putCharacter).toHaveBeenCalledOnce()
  })

  it('does not save when character is null', async () => {
    const { putCharacter } = await import('../../db')
    useCharacterStore() // just access store, don't load character
    vi.advanceTimersByTime(300)
    await vi.runAllTimersAsync()
    expect(putCharacter).not.toHaveBeenCalled()
  })
})
```

- [ ] **Run — expect FAIL**

```bash
pnpm test:unit src/__tests__/plugins/autosave.spec.ts
# Expected: FAIL
```

- [ ] **Create `src/plugins/autosave.ts`**

```typescript
import type { PiniaPluginContext } from 'pinia'
import { putCharacter } from '../db'

export function autosavePlugin({ store }: PiniaPluginContext) {
  if (store.$id !== 'character') return

  let timeout: ReturnType<typeof setTimeout> | null = null
  let saving = false

  store.$subscribe((_mutation, state) => {
    if (saving || !state.character) return
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(async () => {
      if (!state.character) return
      const updatedAt = new Date().toISOString()
      const toSave = { ...state.character, updatedAt }
      await putCharacter(toSave)
      saving = true
      store.$patch((s: typeof state) => {
        if (s.character) s.character.updatedAt = updatedAt
      })
      saving = false
    }, 300)
  })
}
```

- [ ] **Run autosave test — expect PASS**

```bash
pnpm test:unit src/__tests__/plugins/autosave.spec.ts
```

- [ ] **Update `src/main.ts` to register the plugin**

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import { autosavePlugin } from './plugins/autosave'

const pinia = createPinia()
pinia.use(autosavePlugin)

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
```

- [ ] **Commit**

```bash
git add src/plugins/autosave.ts src/__tests__/plugins/autosave.spec.ts src/main.ts
git commit -m "feat: add autosave Pinia plugin"
```

---

## Task 8: Router + App.vue + remove scaffold files

**Files:**
- Modify: `src/router/index.ts`, `src/App.vue`
- Delete: `src/stores/counter.ts`, `src/__tests__/App.spec.ts`

- [ ] **Delete scaffold files**

```bash
rm src/stores/counter.ts src/__tests__/App.spec.ts
```

- [ ] **Replace `src/router/index.ts`**

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import CharacterListView from '../views/CharacterListView.vue'
import CharacterView from '../views/CharacterView.vue'
import SkillsTab from '../tabs/SkillsTab.vue'
import CombatTab from '../tabs/CombatTab.vue'
import InventoryTab from '../tabs/InventoryTab.vue'
import BackgroundTab from '../tabs/BackgroundTab.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: CharacterListView },
    {
      path: '/character/:id',
      component: CharacterView,
      children: [
        { path: '', redirect: (to) => ({ name: 'skills', params: to.params }) },
        { path: 'skills',     name: 'skills',     component: SkillsTab },
        { path: 'combat',     name: 'combat',     component: CombatTab },
        { path: 'inventory',  name: 'inventory',  component: InventoryTab },
        { path: 'background', name: 'background', component: BackgroundTab },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

export default router
```

- [ ] **Replace `src/App.vue`**

```vue
<script setup lang="ts"></script>

<template>
  <RouterView />
</template>
```

- [ ] **Commit**

```bash
git add src/router/index.ts src/App.vue
git rm src/stores/counter.ts src/__tests__/App.spec.ts
git commit -m "feat: configure routes, clean up scaffold"
```

---

## Task 9: ConfirmDialog component (TDD)

**Files:**
- Create: `src/components/ConfirmDialog.vue`, `src/__tests__/components/ConfirmDialog.spec.ts`

- [ ] **Write failing test**

`src/__tests__/components/ConfirmDialog.spec.ts`:

```typescript
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ConfirmDialog from '../../components/ConfirmDialog.vue'

describe('ConfirmDialog', () => {
  it('renders the message', () => {
    const w = mount(ConfirmDialog, { props: { open: true, message: 'Delete?' } })
    expect(w.text()).toContain('Delete?')
  })

  it('emits confirm on confirm button click', async () => {
    const w = mount(ConfirmDialog, { props: { open: true, message: 'Sure?' } })
    await w.find('[data-testid="confirm-btn"]').trigger('click')
    expect(w.emitted('confirm')).toBeTruthy()
  })

  it('emits cancel on cancel button click', async () => {
    const w = mount(ConfirmDialog, { props: { open: true, message: 'Sure?' } })
    await w.find('[data-testid="cancel-btn"]').trigger('click')
    expect(w.emitted('cancel')).toBeTruthy()
  })

  it('shows custom confirmLabel', () => {
    const w = mount(ConfirmDialog, {
      props: { open: true, message: 'Sure?', confirmLabel: 'Remove' },
    })
    expect(w.find('[data-testid="confirm-btn"]').text()).toBe('Remove')
  })
})
```

- [ ] **Run — expect FAIL**

```bash
pnpm test:unit src/__tests__/components/ConfirmDialog.spec.ts
```

- [ ] **Create `src/components/ConfirmDialog.vue`**

```vue
<script setup lang="ts">
withDefaults(defineProps<{ open: boolean; message: string; confirmLabel?: string }>(), {
  confirmLabel: 'Confirm',
})
const emit = defineEmits<{ confirm: []; cancel: [] }>()
</script>

<template>
  <dialog class="modal" :open="open">
    <div class="modal-box">
      <p class="py-4">{{ message }}</p>
      <div class="modal-action">
        <button data-testid="cancel-btn" class="btn min-h-[48px]" @click="emit('cancel')">
          Cancel
        </button>
        <button data-testid="confirm-btn" class="btn btn-error min-h-[48px]" @click="emit('confirm')">
          {{ confirmLabel }}
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="emit('cancel')">close</button>
    </form>
  </dialog>
</template>
```

- [ ] **Run — expect PASS**

```bash
pnpm test:unit src/__tests__/components/ConfirmDialog.spec.ts
```

- [ ] **Commit**

```bash
git add src/components/ConfirmDialog.vue src/__tests__/components/ConfirmDialog.spec.ts
git commit -m "feat: add ConfirmDialog component"
```

---

## Task 10: SkillRow component (TDD)

**Files:**
- Create: `src/components/SkillRow.vue`, `src/__tests__/components/SkillRow.spec.ts`

- [ ] **Write failing test**

`src/__tests__/components/SkillRow.spec.ts`:

```typescript
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SkillRow from '../../components/SkillRow.vue'

const skill = { label: 'Acrobatics (AGL)', value: 5, marked: false }

describe('SkillRow', () => {
  it('renders the skill label', () => {
    const w = mount(SkillRow, { props: { skill, skillId: 'acrobatics' } })
    expect(w.text()).toContain('Acrobatics (AGL)')
  })

  it('shows current value', () => {
    const w = mount(SkillRow, { props: { skill, skillId: 'acrobatics' } })
    expect((w.find('input[type="number"]').element as HTMLInputElement).value).toBe('5')
  })

  it('emits update:skill with new value on change', async () => {
    const w = mount(SkillRow, { props: { skill, skillId: 'acrobatics' } })
    const input = w.find('input[type="number"]')
    await input.trigger('change', { target: { value: '8' } })
    const emitted = w.emitted('update:skill') as Array<[typeof skill]>
    expect(emitted[0][0].value).toBe(8)
  })

  it('emits update:skill with marked true on checkbox change', async () => {
    const w = mount(SkillRow, { props: { skill, skillId: 'acrobatics' } })
    await w.find('input[type="checkbox"]').trigger('change', { target: { checked: true } })
    const emitted = w.emitted('update:skill') as Array<[typeof skill]>
    expect(emitted[0][0].marked).toBe(true)
  })

  it('has sr-only label for the value input (a11y)', () => {
    const w = mount(SkillRow, { props: { skill, skillId: 'acrobatics' } })
    expect(w.find('.sr-only').exists()).toBe(true)
  })
})
```

- [ ] **Run — expect FAIL**

```bash
pnpm test:unit src/__tests__/components/SkillRow.spec.ts
```

- [ ] **Create `src/components/SkillRow.vue`**

```vue
<script setup lang="ts">
import type { Skill } from '../types/character'

const props = defineProps<{ skill: Skill; skillId: string }>()
const emit = defineEmits<{ 'update:skill': [skill: Skill] }>()

function onMarkChange(e: Event) {
  emit('update:skill', { ...props.skill, marked: (e.target as HTMLInputElement).checked })
}
function onValueChange(e: Event) {
  const v = parseInt((e.target as HTMLInputElement).value, 10)
  emit('update:skill', { ...props.skill, value: isNaN(v) ? 0 : v })
}
</script>

<template>
  <div class="flex items-center justify-between p-2 bg-base-200/30 rounded-lg min-h-[48px]">
    <div class="flex items-center gap-2">
      <input
        :id="`mark-${skillId}`"
        type="checkbox"
        :checked="skill.marked"
        class="checkbox checkbox-sm"
        @change="onMarkChange"
      />
      <label :for="`mark-${skillId}`" class="text-sm select-none">{{ skill.label }}</label>
    </div>
    <label :for="`value-${skillId}`" class="sr-only">{{ skill.label }} value</label>
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
```

- [ ] **Run — expect PASS**

```bash
pnpm test:unit src/__tests__/components/SkillRow.spec.ts
```

- [ ] **Commit**

```bash
git add src/components/SkillRow.vue src/__tests__/components/SkillRow.spec.ts
git commit -m "feat: add SkillRow component"
```

---

## Task 11: CharacterHeader component

**Files:**
- Create: `src/components/CharacterHeader.vue`

The header uses the character store directly. Test by setting store state manually.

- [ ] **Create `src/components/CharacterHeader.vue`**

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCharacterStore } from '../stores/character'

const { character } = storeToRefs(useCharacterStore())
</script>

<template>
  <header v-if="character" class="py-3 px-2 border-b-2 border-b-base-200 flex flex-wrap gap-4 justify-center">
    <!-- Hit Points -->
    <div class="flex flex-col items-center gap-1">
      <div class="join">
        <label class="label floating-label">
          <span>HP</span>
          <input type="number" class="join-item input w-20" step="1" min="0"
            :value="character.hitPoints"
            @change="character.hitPoints = +($event.target as HTMLInputElement).value" />
        </label>
        <label class="label floating-label">
          <span>Max</span>
          <input type="number" class="join-item input w-20" step="1" min="0"
            :value="character.maxHitPoints"
            @change="character.maxHitPoints = +($event.target as HTMLInputElement).value" />
        </label>
      </div>
      <button class="btn btn-xs w-40 min-h-[44px]"
        @click="character.hitPoints = character.maxHitPoints">
        ↩️ <span class="sr-only">Reset HP to max</span>
      </button>
    </div>
    <!-- Willpower Points -->
    <div class="flex flex-col items-center gap-1">
      <div class="join">
        <label class="label floating-label">
          <span>WP</span>
          <input type="number" class="join-item input w-20" step="1" min="0"
            :value="character.willpowerPoints"
            @change="character.willpowerPoints = +($event.target as HTMLInputElement).value" />
        </label>
        <label class="label floating-label">
          <span>Max</span>
          <input type="number" class="join-item input w-20" step="1" min="0"
            :value="character.maxWillpowerPoints"
            @change="character.maxWillpowerPoints = +($event.target as HTMLInputElement).value" />
        </label>
      </div>
      <button class="btn btn-xs w-40 min-h-[44px]"
        @click="character.willpowerPoints = character.maxWillpowerPoints">
        ↩️ <span class="sr-only">Reset WP to max</span>
      </button>
    </div>
    <!-- Movement -->
    <div class="flex items-center">
      <label class="label floating-label">
        <span>Movement</span>
        <input type="number" class="input w-20" step="1" min="0"
          :value="character.movement"
          @change="character.movement = +($event.target as HTMLInputElement).value" />
      </label>
    </div>
  </header>
</template>
```

- [ ] **Commit**

```bash
git add src/components/CharacterHeader.vue
git commit -m "feat: add CharacterHeader component"
```

---

## Task 12: CharacterListView

**Files:**
- Create: `src/views/CharacterListView.vue`, `src/__tests__/views/CharacterListView.spec.ts`

- [ ] **Write failing test**

`src/__tests__/views/CharacterListView.spec.ts`:

```typescript
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import CharacterListView from '../../views/CharacterListView.vue'

vi.mock('../../db', () => ({
  putCharacter: vi.fn().mockResolvedValue(undefined),
  getCharacter: vi.fn().mockResolvedValue(null),
  deleteCharacter: vi.fn().mockResolvedValue(undefined),
  getAllCharacterSummaries: vi.fn().mockResolvedValue([]),
}))

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: CharacterListView },
    { path: '/character/:id/skills', component: { template: '<div/>' } },
  ],
})

let pinia: ReturnType<typeof createPinia>

beforeEach(() => {
  pinia = createPinia()
  setActivePinia(pinia)
})

function mountView() {
  return mount(CharacterListView, { global: { plugins: [pinia, router] } })
}

describe('CharacterListView', () => {
  it('shows New Character button', () => {
    const w = mountView()
    expect(w.text()).toContain('New Character')
  })

  it('shows Import button', () => {
    const w = mountView()
    expect(w.text()).toContain('Import')
  })

  it('shows empty state after load', async () => {
    const w = mountView()
    await new Promise((r) => setTimeout(r, 0))
    await w.vm.$nextTick()
    expect(w.text()).toContain('No characters yet')
  })

  it('shows character cards when summaries exist', async () => {
    const { getAllCharacterSummaries } = await import('../../db')
    vi.mocked(getAllCharacterSummaries).mockResolvedValueOnce([
      { id: '1', name: 'Alice', kin: 'Elf', profession: 'Mage', updatedAt: '' },
    ])
    const w = mountView()
    await new Promise((r) => setTimeout(r, 0))
    await w.vm.$nextTick()
    expect(w.text()).toContain('Alice')
  })

  it('shows import error alert on invalid file', async () => {
    const w = mountView()
    // Trigger importError state directly
    ;(w.vm as any).importError = 'Invalid JSON: the file could not be parsed.'
    await w.vm.$nextTick()
    expect(w.find('[role="alert"]').exists()).toBe(true)
  })
})
```

- [ ] **Run — expect FAIL**

```bash
pnpm test:unit src/__tests__/views/CharacterListView.spec.ts
```

- [ ] **Create `src/views/CharacterListView.vue`**

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCharacterListStore } from '../stores/characterList'
import { putCharacter, getCharacter } from '../db'
import { exportCharacterAsJson } from '../utils/export'
import { parseAndValidateCharacter } from '../utils/import'
import { createBlankCharacter } from '../utils/character'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import type { CharacterSummary } from '../types/character'

const router = useRouter()
const listStore = useCharacterListStore()

const deleteTarget = ref<CharacterSummary | null>(null)
const importError = ref<string | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

onMounted(() => listStore.loadSummaries())

async function createCharacter() {
  const character = {
    ...createBlankCharacter(),
    id: crypto.randomUUID(),
    updatedAt: new Date().toISOString(),
  }
  await putCharacter(character)
  listStore.addSummary({ id: character.id, name: character.name, kin: character.kin, profession: character.profession, updatedAt: character.updatedAt })
  router.push(`/character/${character.id}/skills`)
}

async function onFileSelected(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const text = await file.text()
  const result = parseAndValidateCharacter(text)
  if (!result.success) { importError.value = result.error; return }
  importError.value = null
  const character = { ...result.character, id: crypto.randomUUID(), updatedAt: new Date().toISOString() }
  await putCharacter(character)
  listStore.addSummary({ id: character.id, name: character.name, kin: character.kin, profession: character.profession, updatedAt: character.updatedAt })
  if (fileInputRef.value) fileInputRef.value.value = ''
}

async function exportCharacter(summary: CharacterSummary) {
  const character = await getCharacter(summary.id)
  if (character) exportCharacterAsJson(character)
}

async function onDeleteConfirmed() {
  if (!deleteTarget.value) return
  await listStore.removeCharacter(deleteTarget.value.id)
  deleteTarget.value = null
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <nav class="navbar bg-base-100 shadow-sm">
      <div class="flex-1"><h1 class="text-xl font-bold px-2">DBCS</h1></div>
      <div class="flex-none gap-2 pr-2">
        <button class="btn btn-primary min-h-[48px]" @click="createCharacter">New Character</button>
        <button class="btn min-h-[48px]" @click="fileInputRef?.click()">Import</button>
        <input ref="fileInputRef" type="file" accept=".json" class="hidden" @change="onFileSelected" />
      </div>
    </nav>

    <main class="p-4 flex flex-col gap-4 flex-1">
      <div v-if="importError" role="alert" class="alert alert-error">
        <span>{{ importError }}</span>
        <button class="btn btn-sm btn-ghost" @click="importError = null">Dismiss</button>
      </div>

      <p v-if="listStore.isLoaded && listStore.summaries.length === 0"
         class="text-center py-16 text-base-content/50">
        No characters yet. Create one or import from a JSON file.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="summary in listStore.summaries" :key="summary.id"
             class="card bg-base-200 shadow-sm">
          <div class="card-body p-4">
            <div class="flex items-start justify-between gap-2">
              <RouterLink :to="`/character/${summary.id}/skills`"
                class="flex-1 min-h-[48px] flex flex-col justify-center">
                <h2 class="card-title text-base">{{ summary.name || 'Unnamed' }}</h2>
                <p class="text-sm opacity-60">{{ [summary.kin, summary.profession].filter(Boolean).join(' ') }}</p>
              </RouterLink>
              <div class="dropdown dropdown-end">
                <button tabindex="0" class="btn btn-ghost btn-sm min-h-[48px] min-w-[48px]"
                  :aria-label="`Actions for ${summary.name || 'character'}`">⋯</button>
                <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box shadow z-10 w-36 p-1">
                  <li><button @click="exportCharacter(summary)">Export</button></li>
                  <li><button class="text-error" @click="deleteTarget = summary">Delete</button></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <ConfirmDialog
      :open="deleteTarget !== null"
      :message="`Delete ${deleteTarget?.name || 'this character'}? This cannot be undone.`"
      confirm-label="Delete"
      @confirm="onDeleteConfirmed"
      @cancel="deleteTarget = null"
    />
  </div>
</template>
```

- [ ] **Run — expect PASS**

```bash
pnpm test:unit src/__tests__/views/CharacterListView.spec.ts
```

- [ ] **Commit**

```bash
git add src/views/CharacterListView.vue src/__tests__/views/CharacterListView.spec.ts
git commit -m "feat: add CharacterListView"
```

---

## Task 13: CharacterView shell

**Files:**
- Create: `src/views/CharacterView.vue`

- [ ] **Create `src/views/CharacterView.vue`**

```vue
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
        <div class="font-bold truncate">{{ character.name || 'Character' }}</div>
        <div v-if="character.kin || character.profession" class="text-xs opacity-60 truncate">
          {{ [character.kin, character.profession].filter(Boolean).join(' · ') }}
        </div>
      </div>
      <div class="flex-none w-24"></div>
    </nav>

    <!-- HP / WP / Movement -->
    <CharacterHeader />

    <!-- Desktop tab bar -->
    <nav class="hidden md:flex tabs tabs-border w-full justify-center border-b border-base-200"
         role="tablist" aria-label="Character tabs">
      <RouterLink v-for="tab in tabs" :key="tab.name"
        :to="`/character/${route.params.id}/${tab.path}`"
        class="tab" active-class="tab-active" role="tab">
        {{ tab.label }}
      </RouterLink>
    </nav>

    <!-- Tab content -->
    <main class="flex-1 p-2 overflow-y-auto">
      <RouterView />
    </main>

    <!-- Mobile bottom dock -->
    <nav class="dock z-50 md:hidden" aria-label="Character tabs">
      <RouterLink v-for="tab in tabs" :key="tab.name"
        :to="`/character/${route.params.id}/${tab.path}`"
        active-class="dock-active">
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

<script lang="ts">
const tabs = [
  { name: 'skills',     path: 'skills',     label: 'Skills',     icon: 'icon-[game-icons--skills]' },
  { name: 'combat',     path: 'combat',     label: 'Combat',     icon: 'icon-[game-icons--swords-emblem]' },
  { name: 'inventory',  path: 'inventory',  label: 'Inventory',  icon: 'icon-[game-icons--swap-bag]' },
  { name: 'background', path: 'background', label: 'Background', icon: 'icon-[game-icons--white-book]' },
]
</script>
```

> **Note:** The `<script lang="ts">` block at the end defines the `tabs` constant in the Options API style so it can be referenced in the template. Alternatively, move `tabs` into the `<script setup>` block as a plain `const`.

- [ ] **Fix: move `tabs` into `<script setup>` block instead — cleaner**

Replace the two `<script>` blocks with a single `<script setup lang="ts">`:

```vue
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
  { name: 'skills',     path: 'skills',     label: 'Skills',     icon: 'icon-[game-icons--skills]' },
  { name: 'combat',     path: 'combat',     label: 'Combat',     icon: 'icon-[game-icons--swords-emblem]' },
  { name: 'inventory',  path: 'inventory',  label: 'Inventory',  icon: 'icon-[game-icons--swap-bag]' },
  { name: 'background', path: 'background', label: 'Background', icon: 'icon-[game-icons--white-book]' },
]

onMounted(async () => {
  const found = await store.loadCharacter(route.params.id as string)
  if (!found) router.replace('/')
})

onUnmounted(() => store.clearCharacter())
</script>
```

- [ ] **Commit**

```bash
git add src/views/CharacterView.vue
git commit -m "feat: add CharacterView shell"
```

---

## Task 14: SkillsTab

**Files:**
- Create: `src/tabs/SkillsTab.vue`

- [ ] **Create `src/tabs/SkillsTab.vue`**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCharacterStore } from '../stores/character'
import SkillRow from '../components/SkillRow.vue'
import type { Skill } from '../types/character'

const { character } = storeToRefs(useCharacterStore())

const showAddSecondary = ref(false)
const newSecondaryLabel = ref('')

const attributePairs = [
  { attrKey: 'str' as const, condKey: 'exhausted' as const, attrLabel: 'Strength',     condLabel: 'Exhausted' },
  { attrKey: 'con' as const, condKey: 'sickly'    as const, attrLabel: 'Constitution', condLabel: 'Sickly' },
  { attrKey: 'agl' as const, condKey: 'dazed'     as const, attrLabel: 'Agility',      condLabel: 'Dazed' },
  { attrKey: 'int' as const, condKey: 'angry'     as const, attrLabel: 'Intelligence', condLabel: 'Angry' },
  { attrKey: 'wil' as const, condKey: 'scared'    as const, attrLabel: 'Willpower',    condLabel: 'Scared' },
  { attrKey: 'cha' as const, condKey: 'disheartened' as const, attrLabel: 'Charisma',  condLabel: 'Disheartened' },
]

function updateSkill(key: keyof NonNullable<typeof character.value>['skills'], skill: Skill) {
  if (character.value) character.value.skills[key] = skill
}
function updateWeaponSkill(key: keyof NonNullable<typeof character.value>['weaponSkills'], skill: Skill) {
  if (character.value) character.value.weaponSkills[key] = skill
}
function updateSecondarySkill(index: number, skill: Skill) {
  if (character.value) character.value.secondarySkills[index] = skill
}
function addSecondarySkill() {
  if (!character.value || !newSecondaryLabel.value.trim()) return
  character.value.secondarySkills.push({ label: newSecondaryLabel.value.trim(), value: 0, marked: false })
  newSecondaryLabel.value = ''
  showAddSecondary.value = false
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
            <input type="number" class="input w-20" step="1" min="0"
              :value="character.attributes[p.attrKey]"
              @change="character.attributes[p.attrKey] = +($event.target as HTMLInputElement).value" />
          </label>
          <label class="label text-sm gap-1">
            <input type="checkbox" class="checkbox checkbox-sm checked:checkbox-warning"
              :checked="character.conditions[p.condKey]"
              @change="character.conditions[p.condKey] = ($event.target as HTMLInputElement).checked" />
            {{ p.condLabel }}
          </label>
        </div>
      </div>
    </fieldset>

    <!-- Core skills -->
    <fieldset class="fieldset border-base-300 rounded-box border p-4">
      <legend class="fieldset-legend">Skills</legend>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <SkillRow v-for="(skill, key) in character.skills" :key="key"
          :skill="skill" :skill-id="key"
          @update:skill="updateSkill(key as keyof typeof character.skills, $event)" />
      </div>
    </fieldset>

    <!-- Weapon skills -->
    <fieldset class="fieldset border-base-300 rounded-box border p-4">
      <legend class="fieldset-legend">Weapon Skills</legend>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <SkillRow v-for="(skill, key) in character.weaponSkills" :key="key"
          :skill="skill" :skill-id="`weapon-${key}`"
          @update:skill="updateWeaponSkill(key as keyof typeof character.weaponSkills, $event)" />
      </div>
    </fieldset>

    <!-- Secondary skills -->
    <fieldset class="fieldset border-base-300 rounded-box border p-4">
      <legend class="fieldset-legend">Secondary Skills</legend>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
        <div v-for="(skill, i) in character.secondarySkills" :key="i" class="flex gap-1 items-center">
          <SkillRow class="flex-1" :skill="skill" :skill-id="`secondary-${i}`"
            @update:skill="updateSecondarySkill(i, $event)" />
          <button class="btn btn-ghost btn-sm btn-square min-h-[48px] min-w-[48px]"
            :aria-label="`Remove ${skill.label}`"
            @click="character.secondarySkills.splice(i, 1)">
            <span class="icon-[tabler--trash]" aria-hidden="true"></span>
          </button>
        </div>
      </div>
      <button class="btn btn-sm min-h-[44px]" @click="showAddSecondary = true">Add Skill</button>

      <dialog :open="showAddSecondary" class="modal">
        <div class="modal-box">
          <h2 class="text-lg font-bold">Add Secondary Skill</h2>
          <label for="new-secondary-label" class="label mt-2">Name</label>
          <input id="new-secondary-label" v-model="newSecondaryLabel" type="text"
            class="input w-full" @keyup.enter="addSecondarySkill" />
          <div class="modal-action">
            <button class="btn" @click="showAddSecondary = false; newSecondaryLabel = ''">Cancel</button>
            <button class="btn btn-primary" :disabled="!newSecondaryLabel.trim()" @click="addSecondarySkill">Add</button>
          </div>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button @click="showAddSecondary = false">close</button>
        </form>
      </dialog>
    </fieldset>
  </div>
</template>
```

- [ ] **Commit**

```bash
git add src/tabs/SkillsTab.vue
git commit -m "feat: add SkillsTab"
```

---

## Task 15: WeaponSlot + CombatTab

**Files:**
- Create: `src/components/WeaponSlot.vue`, `src/tabs/CombatTab.vue`

- [ ] **Create `src/components/WeaponSlot.vue`**

```vue
<script setup lang="ts">
import type { Weapon } from '../types/character'

const props = defineProps<{ weapon: Weapon; index: number }>()
const emit = defineEmits<{ 'update:weapon': [w: Weapon]; remove: [] }>()

function u(field: keyof Weapon, value: string | number | null) {
  emit('update:weapon', { ...props.weapon, [field]: value })
}
function str(e: Event) { return (e.target as HTMLInputElement).value }
function num(e: Event) {
  const v = (e.target as HTMLInputElement).value
  return v === '' ? null : Number(v)
}
</script>

<template>
  <div class="grid grid-cols-12 gap-2 items-end p-2 bg-base-200/30 rounded-lg">
    <label class="label floating-label col-span-12 md:col-span-5">
      <span>Name</span>
      <input type="text" class="input w-full" :value="weapon.name" @input="u('name', str($event))" />
    </label>
    <label class="label floating-label col-span-4 md:col-span-2">
      <span>Grip</span>
      <input type="text" class="input w-full" :value="weapon.grip" @input="u('grip', str($event))" />
    </label>
    <label class="label floating-label col-span-4 md:col-span-2">
      <span>Range</span>
      <input type="text" class="input w-full" :value="weapon.range" @input="u('range', str($event))" />
    </label>
    <label class="label floating-label col-span-4 md:col-span-2">
      <span>Damage</span>
      <input type="text" class="input w-full" :value="weapon.damage" @input="u('damage', str($event))" />
    </label>
    <label class="label floating-label col-span-5 md:col-span-2">
      <span>Durability</span>
      <input type="number" class="input w-full" :value="weapon.durability ?? ''" @input="u('durability', num($event))" />
    </label>
    <label class="label floating-label col-span-6 md:col-span-10">
      <span>Features</span>
      <input type="text" class="input w-full" :value="weapon.features" @input="u('features', str($event))" />
    </label>
    <button class="col-span-1 btn btn-ghost btn-sm btn-square min-h-[48px] min-w-[48px]"
      :aria-label="`Remove weapon ${index + 1}`" @click="emit('remove')">
      <span class="icon-[tabler--trash]" aria-hidden="true"></span>
    </button>
  </div>
</template>
```

- [ ] **Create `src/tabs/CombatTab.vue`**

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCharacterStore } from '../stores/character'
import WeaponSlot from '../components/WeaponSlot.vue'
import type { Weapon } from '../types/character'

const { character } = storeToRefs(useCharacterStore())

function addWeapon() {
  character.value?.weapons.push({ name: '', grip: '', range: '', damage: '', durability: null, features: '' })
}
function updateWeapon(i: number, w: Weapon) {
  if (character.value) character.value.weapons[i] = w
}
</script>

<template>
  <div v-if="character" class="space-y-4">
    <fieldset class="fieldset border-base-300 rounded-box border p-4">
      <legend class="fieldset-legend">Weapons</legend>
      <div class="flex flex-col gap-2 mb-2">
        <WeaponSlot v-for="(w, i) in character.weapons" :key="i"
          :weapon="w" :index="i"
          @update:weapon="updateWeapon(i, $event)"
          @remove="character.weapons.splice(i, 1)" />
      </div>
      <button class="btn btn-sm min-h-[44px]" @click="addWeapon">Add Weapon</button>
    </fieldset>

    <fieldset class="fieldset border-base-300 rounded-box border p-4">
      <legend class="fieldset-legend">Damage Bonuses</legend>
      <div class="flex gap-4 flex-wrap">
        <label class="label floating-label">
          <span>Strength</span>
          <input type="text" class="input w-20" :value="character.damageBonusStr"
            @input="character.damageBonusStr = ($event.target as HTMLInputElement).value" />
        </label>
        <label class="label floating-label">
          <span>Agility</span>
          <input type="text" class="input w-20" :value="character.damageBonusAgl"
            @input="character.damageBonusAgl = ($event.target as HTMLInputElement).value" />
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
            <input type="text" class="input w-full" :value="character.armor.name"
              @input="character.armor.name = ($event.target as HTMLInputElement).value" />
          </label>
          <label class="label floating-label">
            <span>Rating</span>
            <input type="number" class="input w-24" :value="character.armor.rating ?? ''"
              @input="character.armor.rating = ($event.target as HTMLInputElement).value ? +($event.target as HTMLInputElement).value : null" />
          </label>
          <p class="text-xs font-medium">Bane on:</p>
          <div class="flex flex-wrap gap-3">
            <label class="label gap-1 min-h-[44px]"><input type="checkbox" class="checkbox checkbox-sm" :checked="character.armor.banes.acrobatics" @change="character.armor.banes.acrobatics = ($event.target as HTMLInputElement).checked" /> Acrobatics</label>
            <label class="label gap-1 min-h-[44px]"><input type="checkbox" class="checkbox checkbox-sm" :checked="character.armor.banes.evade" @change="character.armor.banes.evade = ($event.target as HTMLInputElement).checked" /> Evade</label>
            <label class="label gap-1 min-h-[44px]"><input type="checkbox" class="checkbox checkbox-sm" :checked="character.armor.banes.sneaking" @change="character.armor.banes.sneaking = ($event.target as HTMLInputElement).checked" /> Sneaking</label>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <h3 class="font-semibold">Helmet</h3>
          <label class="label floating-label">
            <span>Name</span>
            <input type="text" class="input w-full" :value="character.helmet.name"
              @input="character.helmet.name = ($event.target as HTMLInputElement).value" />
          </label>
          <label class="label floating-label">
            <span>Rating</span>
            <input type="number" class="input w-24" :value="character.helmet.rating ?? ''"
              @input="character.helmet.rating = ($event.target as HTMLInputElement).value ? +($event.target as HTMLInputElement).value : null" />
          </label>
          <p class="text-xs font-medium">Bane on:</p>
          <div class="flex flex-wrap gap-3">
            <label class="label gap-1 min-h-[44px]"><input type="checkbox" class="checkbox checkbox-sm" :checked="character.helmet.banes.awareness" @change="character.helmet.banes.awareness = ($event.target as HTMLInputElement).checked" /> Awareness</label>
            <label class="label gap-1 min-h-[44px]"><input type="checkbox" class="checkbox checkbox-sm" :checked="character.helmet.banes.rangedAttacks" @change="character.helmet.banes.rangedAttacks = ($event.target as HTMLInputElement).checked" /> Ranged Attacks</label>
          </div>
        </div>
      </div>
    </fieldset>

    <fieldset class="fieldset border-base-300 rounded-box border p-4">
      <legend class="fieldset-legend">Death Rolls</legend>
      <div class="flex gap-4">
        <label class="label floating-label">
          <span>Successes</span>
          <input type="number" class="input input-success w-24" step="1" min="0" max="3"
            :value="character.deathRolls.successes"
            @input="character.deathRolls.successes = +($event.target as HTMLInputElement).value" />
        </label>
        <label class="label floating-label">
          <span>Failures</span>
          <input type="number" class="input input-warning w-24" step="1" min="0" max="3"
            :value="character.deathRolls.failures"
            @input="character.deathRolls.failures = +($event.target as HTMLInputElement).value" />
        </label>
      </div>
    </fieldset>
  </div>
</template>
```

- [ ] **Commit**

```bash
git add src/components/WeaponSlot.vue src/tabs/CombatTab.vue
git commit -m "feat: add WeaponSlot and CombatTab"
```

---

## Task 16: InventoryItemRow, TinyItemRow, InventoryTab

**Files:**
- Create: `src/components/InventoryItemRow.vue`, `src/components/TinyItemRow.vue`, `src/tabs/InventoryTab.vue`

- [ ] **Create `src/components/InventoryItemRow.vue`**

```vue
<script setup lang="ts">
import type { InventoryItem } from '../types/character'
defineProps<{ item: InventoryItem; index: number }>()
defineEmits<{ remove: [] }>()
</script>

<template>
  <li class="flex items-start gap-2 py-2 border-b border-base-200 last:border-0">
    <span class="text-sm opacity-30 tabular-nums w-5 pt-0.5">{{ index + 1 }}</span>
    <div class="flex-1 min-w-0">
      <div class="font-medium">{{ item.name }}</div>
      <div class="text-xs opacity-60">Weight {{ item.weight }}</div>
      <div v-if="item.description" class="text-xs mt-0.5 opacity-70">{{ item.description }}</div>
    </div>
    <button class="btn btn-ghost btn-sm btn-square min-h-[48px] min-w-[48px]"
      :aria-label="`Remove ${item.name}`" @click="$emit('remove')">
      <span class="icon-[tabler--trash]" aria-hidden="true"></span>
    </button>
  </li>
</template>
```

- [ ] **Create `src/components/TinyItemRow.vue`**

```vue
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
      <div v-if="item.description" class="text-xs mt-0.5 opacity-70">{{ item.description }}</div>
    </div>
    <button class="btn btn-ghost btn-sm btn-square min-h-[48px] min-w-[48px]"
      :aria-label="`Remove ${item.name}`" @click="$emit('remove')">
      <span class="icon-[tabler--trash]" aria-hidden="true"></span>
    </button>
  </li>
</template>
```

- [ ] **Create `src/tabs/InventoryTab.vue`**

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCharacterStore } from '../stores/character'
import InventoryItemRow from '../components/InventoryItemRow.vue'
import TinyItemRow from '../components/TinyItemRow.vue'

const { character } = storeToRefs(useCharacterStore())

const totalWeight = computed(() =>
  character.value?.inventory.reduce((s, i) => s + i.weight, 0) ?? 0)

const overEncumbered = computed(() =>
  !!character.value && character.value.encumbranceLimit > 0 &&
  totalWeight.value > character.value.encumbranceLimit)

// Add item dialog
const showAddItem = ref(false)
const newName = ref(''); const newWeight = ref(1); const newDesc = ref('')
function addItem() {
  if (!character.value || !newName.value.trim()) return
  character.value.inventory.push({ name: newName.value.trim(), weight: newWeight.value, description: newDesc.value.trim() })
  newName.value = ''; newWeight.value = 1; newDesc.value = ''
  showAddItem.value = false
}

// Add tiny item dialog
const showAddTiny = ref(false)
const newTinyName = ref(''); const newTinyDesc = ref('')
function addTinyItem() {
  if (!character.value || !newTinyName.value.trim()) return
  character.value.tinyItems.push({ name: newTinyName.value.trim(), description: newTinyDesc.value.trim() })
  newTinyName.value = ''; newTinyDesc.value = ''
  showAddTiny.value = false
}
</script>

<template>
  <div v-if="character" class="space-y-4">
    <fieldset class="fieldset border-base-300 rounded-box border p-4">
      <legend class="fieldset-legend">Coins</legend>
      <div class="flex flex-wrap gap-4 justify-center">
        <label class="label floating-label"><span>Gold</span>
          <input type="number" class="input w-24" step="1" min="0" :value="character.coins.gold" @input="character.coins.gold = +($event.target as HTMLInputElement).value" /></label>
        <label class="label floating-label"><span>Silver</span>
          <input type="number" class="input w-24" step="1" min="0" :value="character.coins.silver" @input="character.coins.silver = +($event.target as HTMLInputElement).value" /></label>
        <label class="label floating-label"><span>Copper</span>
          <input type="number" class="input w-24" step="1" min="0" :value="character.coins.copper" @input="character.coins.copper = +($event.target as HTMLInputElement).value" /></label>
      </div>
    </fieldset>

    <fieldset class="fieldset border-base-300 rounded-box border p-4">
      <legend class="fieldset-legend">Items</legend>
      <div class="mb-3">
        <label class="label floating-label">
          <span>Encumbrance Limit</span>
          <input type="number" class="input w-28" step="1" min="0" :value="character.encumbranceLimit"
            @input="character.encumbranceLimit = +($event.target as HTMLInputElement).value" />
        </label>
      </div>
      <div v-if="character.encumbranceLimit > 0" class="mb-3">
        <progress class="progress w-full" :class="overEncumbered ? 'progress-error' : ''"
          :value="totalWeight" :max="character.encumbranceLimit" />
        <div class="text-xs text-center mt-1">{{ totalWeight }} / {{ character.encumbranceLimit }}</div>
      </div>
      <ul class="mb-3">
        <InventoryItemRow v-for="(item, i) in character.inventory" :key="i"
          :item="item" :index="i" @remove="character.inventory.splice(i, 1)" />
      </ul>
      <button class="btn btn-sm min-h-[44px]" @click="showAddItem = true">Add Item</button>

      <dialog :open="showAddItem" class="modal">
        <div class="modal-box">
          <h2 class="text-lg font-bold">Add Item</h2>
          <label for="item-name" class="label mt-2">Name</label>
          <input id="item-name" v-model="newName" type="text" class="input w-full mb-2" />
          <label for="item-weight" class="label">Weight</label>
          <input id="item-weight" v-model.number="newWeight" type="number" class="input w-full mb-2" min="1" step="1" />
          <label for="item-desc" class="label">Description</label>
          <textarea id="item-desc" v-model="newDesc" class="textarea w-full"></textarea>
          <div class="modal-action">
            <button class="btn" @click="showAddItem = false">Cancel</button>
            <button class="btn btn-primary" :disabled="!newName.trim()" @click="addItem">Add</button>
          </div>
        </div>
        <form method="dialog" class="modal-backdrop"><button @click="showAddItem = false">close</button></form>
      </dialog>
    </fieldset>

    <fieldset class="fieldset border-base-300 rounded-box border p-4">
      <legend class="fieldset-legend">Tiny Items</legend>
      <ul class="mb-3">
        <TinyItemRow v-for="(item, i) in character.tinyItems" :key="i"
          :item="item" :index="i" @remove="character.tinyItems.splice(i, 1)" />
      </ul>
      <button class="btn btn-sm min-h-[44px]" @click="showAddTiny = true">Add Tiny Item</button>

      <dialog :open="showAddTiny" class="modal">
        <div class="modal-box">
          <h2 class="text-lg font-bold">Add Tiny Item</h2>
          <label for="tiny-name" class="label mt-2">Name</label>
          <input id="tiny-name" v-model="newTinyName" type="text" class="input w-full mb-2" />
          <label for="tiny-desc" class="label">Description</label>
          <textarea id="tiny-desc" v-model="newTinyDesc" class="textarea w-full"></textarea>
          <div class="modal-action">
            <button class="btn" @click="showAddTiny = false">Cancel</button>
            <button class="btn btn-primary" :disabled="!newTinyName.trim()" @click="addTinyItem">Add</button>
          </div>
        </div>
        <form method="dialog" class="modal-backdrop"><button @click="showAddTiny = false">close</button></form>
      </dialog>
    </fieldset>
  </div>
</template>
```

- [ ] **Commit**

```bash
git add src/components/InventoryItemRow.vue src/components/TinyItemRow.vue src/tabs/InventoryTab.vue
git commit -m "feat: add inventory components and InventoryTab"
```

---

## Task 17: BackgroundTab

**Files:**
- Create: `src/tabs/BackgroundTab.vue`

- [ ] **Create `src/tabs/BackgroundTab.vue`**

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCharacterStore } from '../stores/character'

const { character } = storeToRefs(useCharacterStore())

const PROFESSIONS = ['Artisan','Bard','Fighter','Hunter','Knight','Mage','Mariner','Merchant','Scholar','Thief']
const KINS = ['Human','Elf','Dwarf','Halfling','Mallard','Wolfkin']
</script>

<template>
  <div v-if="character" class="space-y-4">
    <fieldset class="fieldset border-base-300 rounded-box border p-4">
      <legend class="fieldset-legend">Identity</legend>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="label floating-label block">
          <span>Name</span>
          <input type="text" class="input w-full" :value="character.name"
            @input="character.name = ($event.target as HTMLInputElement).value" />
        </label>
        <div>
          <label for="bg-kin" class="label">Kin</label>
          <input id="bg-kin" type="text" list="kin-list" class="input w-full"
            :value="character.kin"
            @input="character.kin = ($event.target as HTMLInputElement).value" />
          <datalist id="kin-list">
            <option v-for="k in KINS" :key="k" :value="k" />
          </datalist>
        </div>
        <div>
          <label for="bg-profession" class="label">Profession</label>
          <input id="bg-profession" type="text" list="profession-list" class="input w-full"
            :value="character.profession"
            @input="character.profession = ($event.target as HTMLInputElement).value" />
          <datalist id="profession-list">
            <option v-for="p in PROFESSIONS" :key="p" :value="p" />
          </datalist>
        </div>
        <label class="label floating-label block">
          <span>Age</span>
          <input type="text" class="input w-full" :value="character.age"
            @input="character.age = ($event.target as HTMLInputElement).value" />
        </label>
      </div>
    </fieldset>

    <fieldset class="fieldset border-base-300 rounded-box border p-4">
      <legend class="fieldset-legend">Character</legend>
      <div class="space-y-3">
        <label class="label floating-label block">
          <span>Weakness</span>
          <textarea class="textarea w-full" :value="character.weakness"
            @input="character.weakness = ($event.target as HTMLTextAreaElement).value"></textarea>
        </label>
        <label class="label floating-label block">
          <span>Appearance</span>
          <textarea class="textarea w-full" :value="character.appearance"
            @input="character.appearance = ($event.target as HTMLTextAreaElement).value"></textarea>
        </label>
        <label class="label floating-label block">
          <span>Memento</span>
          <textarea class="textarea w-full" :value="character.memento"
            @input="character.memento = ($event.target as HTMLTextAreaElement).value"></textarea>
        </label>
        <label class="label floating-label block">
          <span>Abilities &amp; Notes</span>
          <textarea class="textarea w-full min-h-32" :value="character.abilities"
            @input="character.abilities = ($event.target as HTMLTextAreaElement).value"></textarea>
        </label>
      </div>
    </fieldset>
  </div>
</template>
```

- [ ] **Smoke test: `pnpm dev`, navigate to all four tabs, verify no console errors**

- [ ] **Commit**

```bash
git add src/tabs/BackgroundTab.vue
git commit -m "feat: add BackgroundTab"
```

---

## Task 18: PWA setup

**Files:**
- Modify: `vite.config.ts`

- [ ] **Install vite-plugin-pwa**

```bash
pnpm add -D vite-plugin-pwa
```

- [ ] **Update `vite.config.ts`**

```typescript
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'DBCS',
        short_name: 'DBCS',
        description: 'Character sheet companion app',
        theme_color: '#00A96E',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/pwa-192x192.png',          sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512x512.png',          sizes: '512x512', type: 'image/png' },
          { src: '/pwa-maskable-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/pwa-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
    }),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
```

- [ ] **Verify PWA builds correctly**

```bash
pnpm build
# Should produce dist/ with sw.js and manifest.webmanifest
ls dist/sw.js dist/manifest.webmanifest
```

- [ ] **Commit**

```bash
git add vite.config.ts
git commit -m "feat: configure PWA with vite-plugin-pwa"
```

---

## Task 19: E2E tests

**Files:**
- Modify: `e2e/character.spec.ts` (replaces scaffold)

- [ ] **Replace `e2e/character.spec.ts`**

```typescript
import { test, expect } from '@playwright/test'
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

test.describe('Character list', () => {
  test('shows New Character and Import buttons', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'New Character' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Import' })).toBeVisible()
  })

  test('shows empty state with no characters', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('No characters yet')).toBeVisible()
  })
})

test.describe('Character creation and persistence', () => {
  test('creates a character, fills background, reloads, data persists', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'New Character' }).click()
    await expect(page).toHaveURL(/\/character\/.+\/skills/)

    await page.getByRole('link', { name: 'Background' }).click()
    await page.getByLabel('Name').fill('Elara')
    await page.waitForTimeout(500) // debounce

    await page.reload()
    await expect(page.getByLabel('Name')).toHaveValue('Elara')
  })

  test('stale character URL redirects to home', async ({ page }) => {
    await page.goto('/character/nonexistent-id-99999/skills')
    await expect(page).toHaveURL('/')
  })
})

test.describe('Multi-character', () => {
  test('two characters have independent data', async ({ page }) => {
    await page.goto('/')
    // Create Alice
    await page.getByRole('button', { name: 'New Character' }).click()
    await page.getByRole('link', { name: 'Background' }).click()
    await page.getByLabel('Name').fill('Alice')
    await page.waitForTimeout(500)

    // Back to list, create Bob
    await page.getByRole('link', { name: '← Characters' }).click()
    await page.getByRole('button', { name: 'New Character' }).click()
    await page.getByRole('link', { name: 'Background' }).click()
    await page.getByLabel('Name').fill('Bob')
    await page.waitForTimeout(500)

    // Back to list — both visible
    await page.getByRole('link', { name: '← Characters' }).click()
    await expect(page.getByText('Alice')).toBeVisible()
    await expect(page.getByText('Bob')).toBeVisible()
  })
})

test.describe('Export / Import', () => {
  test('export then import round-trip preserves name', async ({ page }) => {
    // Create a character
    await page.goto('/')
    await page.getByRole('button', { name: 'New Character' }).click()
    await page.getByRole('link', { name: 'Background' }).click()
    await page.getByLabel('Name').fill('Exported Hero')
    await page.waitForTimeout(500)

    // Export from list
    await page.getByRole('link', { name: '← Characters' }).click()
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: /Actions for/ }).click()
    await page.getByRole('menuitem', { name: 'Export' }).click()
    const download = await downloadPromise
    const exportPath = await download.path()
    expect(exportPath).toBeTruthy()

    // Delete the character
    await page.getByRole('button', { name: /Actions for/ }).click()
    await page.getByRole('menuitem', { name: 'Delete' }).click()
    await page.getByTestId('confirm-btn').click()
    await expect(page.getByText('Exported Hero')).not.toBeVisible()

    // Import from downloaded file
    const fileChooserPromise = page.waitForEvent('filechooser')
    await page.getByRole('button', { name: 'Import' }).click()
    const fc = await fileChooserPromise
    await fc.setFiles(exportPath!)
    await expect(page.getByText('Exported Hero')).toBeVisible()
  })

  test('importing invalid JSON shows an error', async ({ page }) => {
    const badFile = join(tmpdir(), 'bad-import.json')
    await writeFile(badFile, '{ this is not valid JSON }')

    await page.goto('/')
    const fileChooserPromise = page.waitForEvent('filechooser')
    await page.getByRole('button', { name: 'Import' }).click()
    const fc = await fileChooserPromise
    await fc.setFiles(badFile)

    await expect(page.getByRole('alert')).toBeVisible()
  })
})
```

- [ ] **Delete scaffold E2E test**

```bash
rm e2e/vue.spec.ts
```

- [ ] **Run E2E tests (requires dev server running in another terminal)**

```bash
# Terminal 1:
pnpm dev

# Terminal 2:
pnpm test:e2e
# Expected: all tests PASS (or investigate failures and fix)
```

- [ ] **Commit**

```bash
git add e2e/character.spec.ts
git rm e2e/vue.spec.ts
git commit -m "test: add E2E character flow tests"
```

---

## Task 20: Final check

- [ ] **Run all unit tests**

```bash
pnpm test:unit
# Expected: all tests PASS, no failures
```

- [ ] **Type-check**

```bash
pnpm type-check
# Expected: no TypeScript errors
```

- [ ] **Lint**

```bash
pnpm lint
# Fix any reported issues, then re-run until clean
```

- [ ] **Build**

```bash
pnpm build
# Expected: no errors, dist/ produced
```

- [ ] **Manual smoke test on mobile viewport**

```bash
pnpm preview
# Open http://localhost:4173 in Chrome DevTools mobile viewport (375px)
# Verify: all four tabs accessible, bottom dock visible, touch targets comfortable
```

- [ ] **Commit any remaining fixes**

```bash
git add -A
git commit -m "chore: final lint/type fixes"
```
