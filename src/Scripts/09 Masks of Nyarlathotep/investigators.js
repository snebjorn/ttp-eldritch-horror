/** @type Investigator[] */
exports.investigators = [
  {
    name: "Agatha Crane",
    pawnTemplateId: "2328B49644E3976EF242229AF820F63D",
    health: 5,
    sanity: 7,
    startingItems: {
      spells: ["Call the Storm", "Instill Bravery"],
    },
    startingLocation: "Tokyo",
    personalStory: "The Scientific Method",
  },
  {
    name: "Calvin Wright",
    pawnTemplateId: "52FE88EA45D5F19487CB4DBE839AD62D",
    health: 7,
    sanity: 7,
    startingItems: {
      assets: ["Spirit Dagger"],
      conditions: ["Corruption"],
      clues: 1,
      resources: 1,
    },
    startingLocation: "Buenos Aires",
    personalStory: "A Friend Indeed",
  },
  {
    name: "Carson Sinclair",
    pawnTemplateId: "CEBDCBD14F30F0FA75A25AB6632DF1E4",
    health: 6,
    sanity: 6,
    startingItems: {
      assets: ["Lucky Cigarette Case"],
      clues: 1,
    },
    startingLocation: "London",
    personalStory: "Seeking Answers",
  },
  {
    name: "Daniela Reyes",
    pawnTemplateId: "21004CCB4AF23D985AB138AA55B3ED23",
    health: 7,
    sanity: 5,
    startingItems: {
      conditions: ["Headstrong"],
      clues: 1,
      resources: 1,
    },
    startingLocation: "San Francisco",
    personalStory: "The Shape of Things",
  },
  {
    name: "Father Mateo",
    pawnTemplateId: "819AED634158C7EC0A17D89F3F8F70E3",
    health: 5,
    sanity: 7,
    startingItems: {
      assets: ["King James Bible"],
    },
    startingLocation: "Rome",
    personalStory: "In Nomine Patris",
  },
  {
    name: "Preston Fairmont",
    pawnTemplateId: "A4B435354AF8475EA849EB90AD96A970",
    health: 7,
    sanity: 5,
    startingItems: {
      assets: ["Fine Clothes"],
    },
    startingLocation: "Istanbul",
    personalStory: "Wealth Without Work",
  },
  {
    name: "Sefina Rousseau",
    pawnTemplateId: "B5C9FF4F45A9284C002BC0AC0E9ED4BC",
    health: 4,
    sanity: 8,
    startingItems: {
      assets: ["Treasured Memento"],
      clues: 1,
    },
    startingLocation: "Sydney",
    personalStory: "Calling",
  },
];
