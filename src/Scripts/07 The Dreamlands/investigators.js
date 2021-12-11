/** @type Investigator[] */
exports.investigators = [
  {
    name: "Amanda Sharpe",
    pawnTemplateId: "D33B1FE6487728FFF021EB87D2BD5CB4",
    health: 6,
    sanity: 6,
    startingItems: {
      conditions: ["Quick Study"],
      uniqueAssets: ["Unspeakable Research"],
    },
    startingLocation: "Istanbul",
    personalStory: "Dreaming of R'lyeh",
  },
  {
    name: "Carolyn Fern",
    pawnTemplateId: "5D054FA86172494DA18005CBCC374887",
    health: 5,
    sanity: 7,
    startingItems: {
      assets: ["Dream Diary"],
      uniqueAssets: ["Death XIII"],
    },
    startingLocation: "Rome",
    personalStory: "Final Analysis",
  },
  {
    name: "Darrell Simmons",
    pawnTemplateId: "E998851712DC4FEF9D5083EEB16F4053",
    health: 7,
    sanity: 5,
    startingItems: {
      assets: ["Camera", "Seek the Truth"],
    },
    startingLocation: 10,
    personalStory: "A Thousand Words",
  },
  {
    name: "Gloria Goldberg",
    pawnTemplateId: "AE23D39416C74EBEBCC76F07AAFC2C43",
    health: 4,
    sanity: 8,
    startingItems: {
      uniqueAssets: ["Mythos Codex"],
      spells: ["Find Gate"],
    },
    startingLocation: "Arkham",
    personalStory: "Based on a True Story",
  },
  {
    name: "Kate Winthrop",
    pawnTemplateId: "3EF51A3C93174BCF804135ED733F84EE",
    health: 5,
    sanity: 7,
    startingItems: {
      clues: 1,
      uniqueAssets: ["Dimensional Study"],
    },
    startingLocation: "Buenos Aires",
    personalStory: "Resonance",
  },
  {
    name: "Luke Robinson",
    pawnTemplateId: "F90AD966F9124D91927C5F84169A61F2",
    health: 4,
    sanity: 8,
    startingItems: {
      assets: ["Dream Box"],
      clues: 1,
    },
    startingLocation: undefined, // A space containing a Gate
    personalStory: "Shadow of Doubt",
  },
  {
    name: "Vincent Lee",
    pawnTemplateId: "6FC760B4EA5B42C080CF81DA8057D707",
    health: 6,
    sanity: 6,
    startingItems: {
      assets: ["Bandages"],
      conditions: ["Composed"],
    },
    startingLocation: 17,
    personalStory: "The Doctor is In",
  },
  {
    name: "William Yorick",
    pawnTemplateId: "60D6A78EB78F44CFAFDE0CE952D54801",
    health: 7,
    sanity: 5,
    startingItems: {
      assets: ["Alchemical Concoction"],
      uniqueAssets: ["Bury Them Deep"],
      focus: 1,
    },
    startingLocation: "Sydney",
    personalStory: "To Be Or Not To Be",
  },
];
