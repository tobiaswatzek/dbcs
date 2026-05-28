import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SkillRow from '../../components/SkillRow.vue'
import type { FixedSkill } from '../../types/character'

const skill: FixedSkill = { value: 5, marked: false }
const label = 'Acrobatics (AGL)'

describe('SkillRow', () => {
  it('renders the skill label', () => {
    const w = mount(SkillRow, { props: { skill, skillId: 'acrobatics', label } })
    expect(w.text()).toContain('Acrobatics (AGL)')
  })

  it('shows current value', () => {
    const w = mount(SkillRow, { props: { skill, skillId: 'acrobatics', label } })
    expect(
      (w.find('input[type="number"]').element as HTMLInputElement).value,
    ).toBe('5')
  })

  it('emits update:skill with new value on change', async () => {
    const w = mount(SkillRow, { props: { skill, skillId: 'acrobatics', label } })
    const input = w.find('input[type="number"]')
    await input.setValue('8')
    const emitted = w.emitted('update:skill') as Array<[FixedSkill]>
    expect(emitted[0][0].value).toBe(8)
  })

  it('emits update:skill with marked true on checkbox change', async () => {
    const w = mount(SkillRow, { props: { skill, skillId: 'acrobatics', label } })
    await w.find('input[type="checkbox"]').setChecked(true)
    const emitted = w.emitted('update:skill') as Array<[FixedSkill]>
    expect(emitted[0][0].marked).toBe(true)
  })

  it('has sr-only label for the value input (a11y)', () => {
    const w = mount(SkillRow, { props: { skill, skillId: 'acrobatics', label } })
    expect(w.find('.sr-only').exists()).toBe(true)
  })
})
