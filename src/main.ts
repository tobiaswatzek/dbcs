import Alpine from "alpinejs";

declare global {
  // Note the capital "W"
  interface Window {
    Alpine: typeof Alpine;
  }
}

window.Alpine = Alpine;

Alpine.store("activeTab", "skills");

Alpine.store("character", {
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
  damageBonStr: 0,
  damageBonAgl: 0,
  encumbranceLimit: 0,

  // Conditions
  exhausted: false,
  sickly: false,
  dazed: false,
  angry: false,
  scared: false,
  disheartened: false,

  // Death rolls
  deathSuccesses: 0,
  deathFailures: 0,

  // Currency
  copper: 0,
  silver: 0,
  gold: 0,

  // Skills
  skills: {
    acrobatics: { label: "Acrobatics", value: 0, marked: false },
    awareness: { label: "Awareness", value: 0, marked: false },
    bartering: { label: "Bartering", value: 0, marked: false },
    beastLore: { label: "Beast Lore", value: 0, marked: false },
    bluffing: { label: "Bluffing", value: 0, marked: false },
    bushcraft: { label: "Bushcraft", value: 0, marked: false },
    crafting: { label: "Crafting", value: 0, marked: false },
    evade: { label: "Evade", value: 0, marked: false },
    healing: { label: "Healing", value: 0, marked: false },
    huntingFishing: { label: "Hunting & Fishing", value: 0, marked: false },
    languages: { label: "Languages", value: 0, marked: false },
    mythsLegends: { label: "Myths & Legends", value: 0, marked: false },
    performance: { label: "Performance", value: 0, marked: false },
    persuasion: { label: "Persuasion", value: 0, marked: false },
    riding: { label: "Riding", value: 0, marked: false },
    seamanship: { label: "Seamanship", value: 0, marked: false },
    sleightOfHand: { label: "Sleight of Hand", value: 0, marked: false },
    sneaking: { label: "Sneaking", value: 0, marked: false },
    spotHidden: { label: "Spot Hidden", value: 0, marked: false },
    swimming: { label: "Swimming", value: 0, marked: false },
  },

  // Weapon skills
  weaponSkills: {
    axes: 0,
    bows: 0,
    brawling: 0,
    crossbows: 0,
    hammers: 0,
    knives: 0,
    slings: 0,
    spears: 0,
    staves: 0,
    swords: 0,
  },

  // Equipment
  weapons: [],
  armor: { rating: 0, banes: [] },
  helmet: { rating: 0, banes: [] },
  inventory: [],
  tinyItems: "",

  // Abilities
  abilities: "",
});

Alpine.start();
