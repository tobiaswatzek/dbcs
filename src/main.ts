import Alpine from "alpinejs";

declare global {
  // Note the capital "W"
  interface Window {
    Alpine: typeof Alpine;
  }
}

window.Alpine = Alpine;

Alpine.store("activeTab", "combat");

type Skill = { label: string; value: number; marked: boolean };

type Weapon = {
  name: string;
  grip: string;
  range: string;
  damage: string;
  durability: number | null;
  features: string;
};

type Character = {
  name: string;
  kin: string;
  profession: string;
  age: string;
  weakness: string;
  appearance: string;
  memento: string;

  // Attributes
  attributes: {
    str: 0;
    con: 0;
    agl: 0;
    int: 0;
    wil: 0;
    cha: 0;
  };

  // Derived stats
  hitPoints: number;
  maxHitPoints: number;
  willpowerPoints: number;
  maxWillpowerPoints: number;
  movement: number;
  damageBonStr: string;
  damageBonAgl: string;
  encumbranceLimit: number;

  // Conditions
  exhausted: boolean;
  sickly: boolean;
  dazed: boolean;
  angry: boolean;
  scared: boolean;
  disheartened: boolean;

  // Death rolls
  deathRolls: {
    successes: number;
    failures: number;
  };

  // Currency
  copper: number;
  silver: number;
  gold: number;

  // Skills
  skills: {
    acrobatics: Skill;
    awareness: Skill;
    bartering: Skill;
    beastLore: Skill;
    bluffing: Skill;
    bushcraft: Skill;
    crafting: Skill;
    evade: Skill;
    healing: Skill;
    huntingFishing: Skill;
    languages: Skill;
    mythsLegends: Skill;
    performance: Skill;
    persuasion: Skill;
    riding: Skill;
    seamanship: Skill;
    sleightOfHand: Skill;
    sneaking: Skill;
    spotHidden: Skill;
    swimming: Skill;
  };

  // Weapon skills
  weaponSkills: {
    axes: Skill;
    bows: Skill;
    brawling: Skill;
    crossbows: Skill;
    hammers: Skill;
    knives: Skill;
    slings: Skill;
    spears: Skill;
    staves: Skill;
    swords: Skill;
  };

  secondarySkills: Skill[];

  // Equipment
  weapons: Weapon[];
  armor: { rating: number; banes: [] };
  helmet: { rating: number; banes: [] };
  inventory: string[];
  tinyItems: string[];

  // Abilities
  abilities: string;
};

const initialCharacter: Character = {
  name: "",
  kin: "",
  profession: "",
  age: "",
  weakness: "",
  appearance: "",
  memento: "",

  // Attributes
  attributes: {
    str: 0,
    con: 0,
    agl: 0,
    int: 0,
    wil: 0,
    cha: 0,
  },

  // Derived stats
  hitPoints: 0,
  maxHitPoints: 0,
  willpowerPoints: 0,
  maxWillpowerPoints: 0,
  movement: 0,
  damageBonStr: "",
  damageBonAgl: "",
  encumbranceLimit: 0,

  // Conditions
  exhausted: false,
  sickly: false,
  dazed: false,
  angry: false,
  scared: false,
  disheartened: false,

  // Death rolls
  deathRolls: { successes: 0, failures: 0 },

  // Currency
  copper: 0,
  silver: 0,
  gold: 0,

  // Skills
  skills: {
    acrobatics: { label: "Acrobatics (AGL)", value: 0, marked: false },
    awareness: { label: "Awareness (INT)", value: 0, marked: false },
    bartering: { label: "Bartering (CHA)", value: 0, marked: false },
    beastLore: { label: "Beast Lore (INT)", value: 0, marked: false },
    bluffing: { label: "Bluffing (CHA)", value: 0, marked: false },
    bushcraft: { label: "Bushcraft (INT)", value: 0, marked: false },
    crafting: { label: "Crafting (STR)", value: 0, marked: false },
    evade: { label: "Evade (AGL)", value: 0, marked: false },
    healing: { label: "Healing (INT)", value: 0, marked: false },
    huntingFishing: {
      label: "Hunting & Fishing (AGL)",
      value: 0,
      marked: false,
    },
    languages: { label: "Languages (INT)", value: 0, marked: false },
    mythsLegends: { label: "Myths & Legends (INT)", value: 0, marked: false },
    performance: { label: "Performance (CHA)", value: 0, marked: false },
    persuasion: { label: "Persuasion (CHA)", value: 0, marked: false },
    riding: { label: "Riding (AGL)", value: 0, marked: false },
    seamanship: { label: "Seamanship (INT)", value: 0, marked: false },
    sleightOfHand: { label: "Sleight of Hand (AGL)", value: 0, marked: false },
    sneaking: { label: "Sneaking (AGL)", value: 0, marked: false },
    spotHidden: { label: "Spot Hidden (INT)", value: 0, marked: false },
    swimming: { label: "Swimming (AGL)", value: 0, marked: false },
  },

  // Weapon skills
  weaponSkills: {
    axes: { label: "Axes (STR)", value: 0, marked: false },
    bows: { label: "Bows (AGL)", value: 0, marked: false },
    brawling: { label: "Brawling (STR)", value: 0, marked: false },
    crossbows: { label: "Crossbows (AGL)", value: 0, marked: false },
    hammers: { label: "Hammers (STR)", value: 0, marked: false },
    knives: { label: "Knives (AGL)", value: 0, marked: false },
    slings: { label: "Slings (AGL)", value: 0, marked: false },
    spears: { label: "Spears (STR)", value: 0, marked: false },
    staves: { label: "Staves (AGL)", value: 0, marked: false },
    swords: { label: "Swords (STR)", value: 0, marked: false },
  },

  secondarySkills: [],

  // Equipment
  weapons: [
    {
      name: "",
      grip: "",
      range: "",
      damage: "",
      durability: null,
      features: "",
    },
    {
      name: "",
      grip: "",
      range: "",
      damage: "",
      durability: null,
      features: "",
    },
    {
      name: "",
      grip: "",
      range: "",
      damage: "",
      durability: null,
      features: "",
    },
  ],
  armor: { rating: 0, banes: [] },
  helmet: { rating: 0, banes: [] },
  inventory: [],
  tinyItems: [],

  // Abilities
  abilities: "",
};

Alpine.store("character", initialCharacter);

Alpine.start();
