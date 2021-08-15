const { world, Vector } = require("@tabletop-playground/api");
const { Util } = require("./util");
const { GameUtil } = require("./game-util");
const {
  expansionSpawn,
  mythosSetupDecks,
  tableLocations,
  gameBoardLocations,
  omenToken,
  investigatorDeck,
  artifactDeck,
} = require("./world-constants");
const { setupDeadInvestigator, setupInsaneInvestigator } = require("./setup-investigator");

/**
 * @param {string} templateId
 */
function createCard(templateId) {
  return Util.createCard(templateId, expansionSpawn);
}

/** @type Expansion.Items */
exports.expansionItems = {
  encounterCards: {
    otherWorld: createCard("C15638394FE122FFCBEC96A58F0AC36A"),
    america: createCard("A3F71D3B4462C5D8B2248F85FB0B9A11"),
    europe: createCard("3966538B47BEF73A17A7DF8B6F3908A2"),
    asia: createCard("DF914DED4FCEB51BF9A1618CCF716AD2"),
    general: createCard("31FB26BC477AC65963609A89F5A45C08"),
    expedition: createCard("24309F1748A212D27DA2B78B892FB1D4"),
  },
  monsters: createCard("7C64AEE642F5FB5E75CCEAB4623A5325"),
  epicMonsters: createCard("F8E4C6B140CC90B1777317B2C684476F"),
  assetCards: createCard("B184E44A4F62EB8D0C972F8DFB7740BB"),
  uniqueAssetCards: createCard("18EEE191475302A0302B5BB0CCB35AD0"),
  conditionCards: createCard("667052AA4E22D762488D44A24158013A"),
  artifactCards: createCard("406E73BF45A8A902F43B169E9E2AF731"),
  spellCards: createCard("81C2F6474594AC701432FC98777AF98D"),
  gates: createCard("7B6A2F754AE4F5E6AA03F9942CE2C1D3"),
  focus: true,
  preludeCards: createCard("73F68CE54FC1C3DCE733929C755FEC0E"),
  mythosCards: {
    green: {
      easy: createCard("D7E070424ADC12846A5ADE8C2FAF9A72"),
      medium: createCard("E1BAD5854DF4E3F6367A81A1C80A1056"),
      hard: createCard("F654645648539894BB1C2A88FC06CF34"),
    },
    yellow: {
      easy: createCard("5B9868824DACA4ED6CB722BD625AF54A"),
      medium: createCard("2C87C8804693DB241C8009895D4B8969"),
      hard: createCard("D21991F84F6BE511D7B50E81240A7930"),
    },
    blue: {
      easy: createCard("8F393113457EB2F432A204B6FEF2451C"),
      medium: createCard("BAAA06B84AC3A59AB269F1AC5CF1354A"),
      hard: createCard("F87510D74601D63B34A5E2A2C10FA60D"),
    },
  },
  investigators: createCard("909D1B324DA61AE3A30E02B7F2DC5FB0"),
  ancientOneSheets: [
    createCard("26A4DD3948976BE61969D283B0F4CA86"),
    createCard("188CE9E84E7E061A4E26A0AEDE0BCE33"),
  ],
};

/** @type Record<string, Prelude> */
const preludes = {
  "Beginning of the End": {
    afterResolvingSetup: () => {
      // place eldritch token on green omen
      const eldritchToken = GameUtil.takeEldritchTokens(1);

      Util.moveObject(eldritchToken, gameBoardLocations.omen.green);
    },
  },
  "Doomsayer From Antarctica": {
    spawnsSideBoard: (ancientOne) => {
      if (ancientOne !== "Rise of the Elder Things") {
        return "landscape";
      }

      return;
    },
    step5: (ancientOne, sideBoardSpawn) => {
      // setup antarctica side board
      if (ancientOne !== "Rise of the Elder Things") {
        // @ts-ignore - don't try this at home kids
        // prettier-ignore
        const { setupSideBoard } = require("../../Eldritch Horror - Mountains of Madness/Scripts/setup-side-board");
        setupSideBoard(sideBoardSpawn);
      }
    },
    afterResolvingSetup: (ancientOne) => {
      // if rise of the elder things spawn rampaging shoggoth epic monster on lake camp
      // else setup antarctica adventures and draw top
      if (ancientOne === "Rise of the Elder Things") {
        try {
          // @ts-ignore - dynamically added space on side board
          const lakeCamp = gameBoardLocations.space["Lake Camp"];
          GameUtil.spawnEpicMonster("Rampaging Shoggoth", lakeCamp);
        } catch (error) {
          console.error(error.message);
        }
      } else {
        const antarcticaAdventuresStage1 = createCard("F7FD62E34F458F4B51C0FAA6EA3A1723");
        const randomStage1Card = Util.takeRandomCardFromStack(antarcticaAdventuresStage1);
        const antarcticaAdventuresStage2 = createCard("258610DA4A3A3781ADA2AFAD520DC865");
        const randomStage2Card = Util.takeRandomCardFromStack(antarcticaAdventuresStage2);
        const antarcticaAdventuresStage3 = createCard("9601C51C44FE111792B9EF910ADEAE63");
        const randomStage3Card = Util.takeRandomCardFromStack(antarcticaAdventuresStage3);

        if (randomStage1Card && randomStage2Card && randomStage3Card) {
          randomStage3Card.addCards(randomStage2Card);

          randomStage3Card.setId("adventure-antarctica-deck");
          randomStage3Card.setName("Antarctica Adventures");
          Util.moveObject(
            randomStage3Card,
            // @ts-ignore
            gameBoardLocations.antarcticaSideBoard.adventure
          );
          Util.moveObject(
            randomStage1Card,
            // @ts-ignore
            gameBoardLocations.antarcticaSideBoard.activeAdventure
          );
          Util.flip(randomStage1Card);

          const adventureToken = createCard("BEEB07464B9819C2D6BAB883A88C9146");
          adventureToken.setId("adventure-antarctica-token");
          adventureToken.setName("Adventure Token: Antarctica");
          Util.moveObject(
            adventureToken,
            // @ts-ignore - dynamically added snap point on side board
            gameBoardLocations.antarcticaSideBoard.activeAdventure
          );
        }

        antarcticaAdventuresStage1.destroy();
        antarcticaAdventuresStage2.destroy();
        antarcticaAdventuresStage3.destroy();
      }
    },
  },
  "Key to Salvation": {},
  "Rumors From the North": {
    step4: () => {
      // activate The Wind-Walker mythos card, before building the mythos deck
      const windWalkerMythos = Util.takeCardNameFromStack(
        mythosSetupDecks.blue.medium,
        "The Wind-Walker"
      );
      if (windWalkerMythos && tableLocations.activeMythos) {
        Util.moveObject(windWalkerMythos, tableLocations.activeMythos);
        Util.flip(windWalkerMythos);
      }
    },
    afterResolvingSetup: (ancientOne) => {
      // if ithaqua, advance omen by 1 and remove the The Wind-Walker mythos card
      // else put 6 eldritch tokens on The Wind-Walker mythos card
      if (ancientOne === "Ithaqua") {
        Util.moveObject(omenToken, gameBoardLocations.omen.blue1);
        const windWalkerCard =
          tableLocations.activeMythos && tableLocations.activeMythos.getSnappedObject();
        if (windWalkerCard) {
          windWalkerCard.destroy();
        }
      } else {
        if (tableLocations.activeMythos) {
          const eldritchTokens = GameUtil.takeEldritchTokens(6);
          Util.moveObject(eldritchTokens, tableLocations.activeMythos);
        }
        try {
          GameUtil.spawnEpicMonster("Wind-Walker", gameBoardLocations.space[4]);
        } catch (error) {
          console.error(error.message);
        }
      }
    },
  },
  "Ultimate Sacrifice": {
    afterResolvingSetup: () => {
      // draw 2 random investigators, set them up, then defeat them. 1 dead, 1 insane.
      // add 1 hidden random artifact to sheets
      // advance doom by 2
      GameUtil.advanceDoom(2);
      const investigatorDeckPosition = investigatorDeck.getPosition();
      const heightOfSheet = investigatorDeck.getExtent(false).x * 2;
      const separatorBuffer = 2;
      for (let i = 1; i < 3; i++) {
        const investigator = Util.takeRandomCardFromStack(investigatorDeck);
        if (investigator) {
          const newPos = investigatorDeckPosition.add(
            new Vector(-(heightOfSheet * i) - separatorBuffer * i, 0, 2)
          );
          investigator.setPosition(newPos, 1);
          Util.flip(investigator);
          investigator.snapToGround();

          const artifact = Util.takeRandomCardFromStack(artifactDeck);
          if (!artifact) {
            throw new Error(
              "Unable to fetch random artifact for investigator (Ultimate Sacrifice)"
            );
          }

          if (i === 1) {
            setupDeadInvestigator(investigator, artifact);
          } else {
            setupInsaneInvestigator(investigator, artifact);
          }
        }
      }
    },
  },
  "Unwilling Sacrifice": {},
};

if (!world.__eldritchHorror.alreadyLoaded.includes("73F68CE54FC1C3DCE733929C755FEC0E")) {
  for (const [name, prelude] of Object.entries(preludes)) {
    world.__eldritchHorror.preludes.set(name, prelude);
  }
  world.__eldritchHorror.alreadyLoaded.push("73F68CE54FC1C3DCE733929C755FEC0E");
}

/** @type Investigator[] */
const investigators = [
  {
    name: "Agnes Baker",
    pawnTemplateId: "4FB2FCA1462BC04B1E1315BB1676690D",
    health: 7,
    sanity: 5,
    startingItems: {
      assets: ["Profane Tome"],
      spells: ["Storm of Spirits"],
    },
    startingLocation: "London",
    personalStory: "In a Past Life",
  },
  {
    name: "Daisy Walker",
    pawnTemplateId: "BCB904CC8AD64D59BDB7CD089D36995E",
    health: 5,
    sanity: 7,
    startingItems: {
      spells: ["Arcane Insight"],
      uniqueAssets: ["Old Journal"],
    },
    startingLocation: "Istanbul",
    personalStory: "Unknown Secrets",
  },
  {
    name: "Finn Edwards",
    pawnTemplateId: "D1AF711CABF746A1A5EC9358ACDFDB3A",
    health: 6,
    sanity: 6,
    startingItems: {
      assets: ["Cat Burglar", "Whiskey"],
      uniqueAssets: ["Courier Run"],
    },
    startingLocation: 5,
    personalStory: "Don't Get Caught",
  },
  {
    name: "George Barnaby",
    pawnTemplateId: "5761ADFD9E1B4B68B10B0A8606156E26",
    health: 4,
    sanity: 8,
    startingItems: {
      assets: ["Investment", "Pocket Watch"],
    },
    startingLocation: 17,
    personalStory: "My Sweet Maria",
  },
  {
    name: "Patrice Hathaway",
    pawnTemplateId: "219B839466B940E0822DE2781AFAEC93",
    health: 5,
    sanity: 7,
    startingItems: {
      clues: 1,
      spells: ["Banishment"],
    },
    startingLocation: "Sydney",
    personalStory: "Cadenza",
  },
  {
    name: "Tommy Muldoon",
    pawnTemplateId: "7EAE3080C1C1416C8B72B7D1572D5712",
    health: 7,
    sanity: 5,
    startingItems: {
      assets: ["Carbine Rifle"],
      will: 1,
    },
    startingLocation: 1,
    personalStory: "We Need a Hero!",
  },
  {
    name: "Ursula Downs",
    pawnTemplateId: "7077CB0A32314D1BA10FE951B1825928",
    health: 6,
    sanity: 6,
    startingItems: {
      assets: ["Mineralogy Research"],
    },
    startingLocation: "The Heart of Africa",
    personalStory: "Next Big Discovery",
  },
  {
    name: "Wilson Richards",
    pawnTemplateId: "EB5A6B9B58604228B3B32DF35C081B86",
    health: 8,
    sanity: 4,
    startingItems: {
      assets: ["Blunderbuss"],
    },
    startingLocation: "Arkham",
    personalStory: "Heckuva Job",
  },
];

if (!world.__eldritchHorror.alreadyLoaded.includes("909D1B324DA61AE3A30E02B7F2DC5FB0")) {
  world.__eldritchHorror.investigators.push(...investigators);
  world.__eldritchHorror.alreadyLoaded.push("909D1B324DA61AE3A30E02B7F2DC5FB0");
}
