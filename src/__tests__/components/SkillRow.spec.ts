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
    expect(
      (w.find('input[type="number"]').element as HTMLInputElement).value,
    ).toBe('5')
  })

  it('emits update:skill with new value on change', async () => {
    const w = mount(SkillRow, { props: { skill, skillId: 'acrobatics' } })
    const input = w.find('input[type="number"]')
    await input.setValue('8')
    const emitted = w.emitted('update:skill') as Array<[typeof skill]>
    expect(emitted[0][0].value).toBe(8)
  })

  it('emits update:skill with marked true on checkbox change', async () => {
    const w = mount(SkillRow, { props: { skill, skillId: 'acrobatics' } })
    await w.find('input[type="checkbox"]').setChecked(true)
    const emitted = w.emitted('update:skill') as Array<[typeof skill]>
    expect(emitted[0][0].marked).toBe(true)
  })

  it('has sr-only label for the value input (a11y)', () => {
    const w = mount(SkillRow, { props: { skill, skillId: 'acrobatics' } })
    expect(w.find('.sr-only').exists()).toBe(true)
  })
})
