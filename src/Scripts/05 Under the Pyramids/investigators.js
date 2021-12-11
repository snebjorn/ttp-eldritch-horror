/** @type Investigator[] */
exports.investigators = [
  {
    name: "Hank Samson",
    pawnTemplateId: "E0210F7641A7F91922CD388FD1A66777",
    health: 8,
    sanity: 4,
    startingItems: {
      assets: ["Sledgehammer"],
    },
    startingLocation: 6,
    personalStory: "Where's Pa?",
  },
  {
    name: "Harvey Walters",
    pawnTemplateId: "D79B6B3C849E47529406D5E37BEDACE3",
    health: 4,
    sanity: 8,
    startingItems: {
      assets: ["Ancient Tome"],
    },
    startingLocation: "Arkham",
    personalStory: "Higher Education",
  },
  {
    name: "Joe Diamond",
    pawnTemplateId: "882BA3DEDE054DBEB3D963D5EF6C9180",
    health: 7,
    sanity: 5,
    startingItems: {
      assets: [".32 Colt Pocket"],
    },
    startingLocation: "San Francisco",
    personalStory: "Finish the Job",
  },
  {
    name: "Mandy Thompson",
    pawnTemplateId: "9DB36782BB1C41F6B8983F6CF2CD035C",
    health: 5,
    sanity: 7,
    startingItems: {
      assets: ["Magnifying Glass"],
      uniqueAssets: ["Know Thy Enemy"],
    },
    startingLocation: "Shanghai",
    personalStory: "Connect the Dots",
  },
  {
    name: "Minh Thi Phan",
    pawnTemplateId: "10E99B8A87C14986BF92BCB688DF40EB",
    health: 6,
    sanity: 6,
    startingItems: {
      uniqueAssets: ["Cryptic Text"],
      clues: 1,
    },
    startingLocation: "Tokyo",
    personalStory: "Alone and Afraid",
  },
  {
    name: "Monterey Jack",
    pawnTemplateId: "9A41116024D5404A9DA4819BE49C20CD",
    health: 7,
    sanity: 5,
    startingItems: {
      assets: ["Bull Whip"],
      uniqueAssets: ["Treasure Map"],
    },
    startingLocation: "The Pyramids",
    personalStory: "Searching Ages Past",
  },
  {
    name: "Rex Murphy",
    pawnTemplateId: "B9C52178EA2D4C1CB5D7AEF696F25BC1",
    health: 7,
    sanity: 7,
    startingItems: {
      assets: ["Lucky Talisman"],
      conditions: ["Cursed"],
    },
    startingLocation: 1,
    personalStory: "Dispelling the Curse",
  },
  {
    name: "Sister Mary",
    pawnTemplateId: "67595EE5BB9E410ABA0C2F2801ED4EDA",
    health: 5,
    sanity: 7,
    startingItems: {
      assets: ["Holy Water"],
      clues: 1,
      shipTickets: 1,
    },
    startingLocation: 15,
    personalStory: "He is My Shepherd",
  },
];
