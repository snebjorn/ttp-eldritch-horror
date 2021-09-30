/** @type Investigator[] */
exports.investigators = [
  {
    name: '"Ashcan" Pete',
    pawnTemplateId: "BC312402411F46A4A822667D77E88801",
    health: 7,
    sanity: 5,
    startingItems: {
      uniqueAssets: ["Duke"],
      clues: 1,
    },
    startingLocation: 14,
    personalStory: "Powerful Nightmares",
  },
  {
    name: "Bob Jenkins",
    pawnTemplateId: "46B7F55FEAB24428AF8EA4872BCDEC4A",
    health: 7,
    sanity: 5,
    startingItems: {
      assets: ["Winchester Rifle"],
      clues: 1,
    },
    startingLocation: "London",
    personalStory: "Doing Business",
  },
  {
    name: "Rita Young",
    pawnTemplateId: "14DD17C8E38D4E60A8C1EC12D0EAE9E1",
    health: 7,
    sanity: 5,
    startingItems: {
      conditions: ["Rugged"],
      clues: 1,
    },
    startingLocation: "Shanghai",
    personalStory: "Through Prejudice",
  },
  {
    name: "Roland Banks",
    pawnTemplateId: "E31512A575394574AA9C102D395686FC",
    health: 7,
    sanity: 5,
    startingItems: {
      assets: ["Mauser C96"],
      uniqueAssets: ["Agency Secrets"],
    },
    startingLocation: "San Francisco",
    personalStory: "The Truth is Out There",
  },
];
