export type FixedSkill = {
  value: number
  marked: boolean
}

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

export type HeroicAbility = {
  name: string
  willpowerCost: number | null
  description: string
}

export type Spell = {
  name: string
  school: string
  rank: number | null
  requirement: string
  willpowerCost: string
  castingTime: string
  range: string
  duration: string
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
  notes: string

  attributes: {
    str: number
    con: number
    agl: number
    int: number
    wil: number
    cha: number
  }

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
    acrobatics: FixedSkill
    awareness: FixedSkill
    bartering: FixedSkill
    beastLore: FixedSkill
    bluffing: FixedSkill
    bushcraft: FixedSkill
    crafting: FixedSkill
    evade: FixedSkill
    healing: FixedSkill
    huntingFishing: FixedSkill
    languages: FixedSkill
    mythsLegends: FixedSkill
    performance: FixedSkill
    persuasion: FixedSkill
    riding: FixedSkill
    seamanship: FixedSkill
    sleightOfHand: FixedSkill
    sneaking: FixedSkill
    spotHidden: FixedSkill
    swimming: FixedSkill
  }

  weaponSkills: {
    axes: FixedSkill
    bows: FixedSkill
    brawling: FixedSkill
    crossbows: FixedSkill
    hammers: FixedSkill
    knives: FixedSkill
    slings: FixedSkill
    spears: FixedSkill
    staves: FixedSkill
    swords: FixedSkill
  }

  secondarySkills: Skill[]
  heroicAbilities: HeroicAbility[]
  spells: Spell[]
  weapons: Weapon[]
  armor: Armor
  helmet: Helmet
  inventory: InventoryItem[]
  tinyItems: TinyItem[]
}
