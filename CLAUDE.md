# DBCS

Mobile-first PWA character sheet companion app for the TTRPG "Dragonbane". No backend — fully local, works offline.

## Commands

```bash
pnpm dev        # Dev server at http://localhost:5173
pnpm test:unit  # Unit tests (Vitest)
pnpm test:e2e   # E2E tests — requires dev server running
pnpm build      # Type-check + build
pnpm lint       # Lint + auto-fix
pnpm format     # Format src/
```

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

```
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
```

## Accessibility (Level B)

- Min 48×48 px touch targets on all interactive elements
- All inputs have explicit `<label for>` — no placeholder-only labels
- Fieldsets with `<legend>` for every grouped section
- Icon-only buttons always have `aria-label`
- Min 16 px font on inputs

## Design spec

`docs/superpowers/specs/2026-05-26-dragonbane-character-sheet-design.md`
