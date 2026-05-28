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
    acrobatics: Skill
    awareness: Skill
    bartering: Skill
    beastLore: Skill
    bluffing: Skill
    bushcraft: Skill
    crafting: Skill
    evade: Skill
    healing: Skill
    huntingFishing: Skill
    languages: Skill
    mythsLegends: Skill
    performance: Skill
    persuasion: Skill
    riding: Skill
    seamanship: Skill
    sleightOfHand: Skill
    sneaking: Skill
    spotHidden: Skill
    swimming: Skill
  }

  weaponSkills: {
    axes: Skill
    bows: Skill
    brawling: Skill
    crossbows: Skill
    hammers: Skill
    knives: Skill
    slings: Skill
    spears: Skill
    staves: Skill
    swords: Skill
  }

  secondarySkills: Skill[]
  weapons: Weapon[]
  armor: Armor
  helmet: Helmet
  inventory: InventoryItem[]
  tinyItems: TinyItem[]
}
