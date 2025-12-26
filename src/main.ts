import Alpine from "alpinejs";

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
  str: 0,
  con: 0,
  agl: 0,
  int: 0,
  wil: 0,
  cha: 0,

  // Derived stats
  hitPoints: 0,
  maxHitPoints: 0,
  willpowerPoints: 0,
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
    acrobatics: 0,
    awareness: 0,
    bartering: 0,
    beastLore: 0,
    bluffing: 0,
    bushcraft: 0,
    crafting: 0,
    evade: 0,
    healing: 0,
    huntingFishing: 0,
    languages: 0,
    mythsLegends: 0,
    performance: 0,
    persuasion: 0,
    riding: 0,
    seamanship: 0,
    sleightOfHand: 0,
    sneaking: 0,
    spotHidden: 0,
    swimming: 0,
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
