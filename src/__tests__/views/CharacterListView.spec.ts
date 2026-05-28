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
    ;(w.vm as { importError: string | null }).importError =
      'Invalid JSON: the file could not be parsed.'
    await w.vm.$nextTick()
    expect(w.find('[role="alert"]').exists()).toBe(true)
  })
})
