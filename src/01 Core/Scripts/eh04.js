const { world, Card } = require("@tabletop-playground/api");
const { Util } = require("./util");
const { GameUtil } = require("./game-util");
const { expansionSpawn, gameBoardLocations, tableLocations } = require("./world-constants");

/**
 * @param {string} templateId
 */
function createCard(templateId) {
  return Util.createCard(templateId, expansionSpawn);
}

/** @type Expansion.Items */
exports.expansionItems = {
  encounterCards: {
    otherWorld: createCard("803FD166477F3DD0265FA0AD35896396"),
    america: createCard("C9ED0A7D42115947CDAC41B7666C3DBB"),
    europe: createCard("8072F2814379CA97B69A95823B8B1FF8"),
    asia: createCard("3B9635E1438D2BD8433AFEBFFED83686"),
    general: createCard("BE2065E1416A512C36D26992EEB6C7EB"),
  },
  monsters: createCard("D499DDE44BFFA4C07681E7B069F29E22"),
  epicMonsters: createCard("3E68F8A546BFFDD12444D38B3A18B2BC"),
  assetCards: createCard("77DC7D1F4C828E8ECF9566AFAA41F558"),
  uniqueAssetCards: createCard("1E2D04ED4970756CD9F9B1A0B50382C7"),
  conditionCards: createCard("85AA79CB4270FD37B12802A6D8720FFB"),
  artifactCards: createCard("9366F1D54EC2AD7DC7E5AC87489048F9"),
  spellCards: createCard("08E069AF449EF2E023565AB0C7FC3340"),
  focus: true,
  preludeCards: createCard("49664EDA4BD3C0E79AC8238645999EE2"),
  mythosCards: {
    green: {
      easy: createCard("CD272D5845713D124047B5A5A59186BB"),
      medium: createCard("B73AB4F346734528973F0082283D1AD5"),
      hard: createCard("669833DC41CC434A5774B8ADD983B92E"),
    },
    yellow: {
      easy: createCard("6A7BA0AF4D81FE06F83A3D9D2ADFFEC5"),
      medium: createCard("1465C1D04BBD93634394C7969DBCB98C"),
      hard: createCard("F824BEAD42DF66C1259620BA125C3AF5"),
    },
    blue: {
      easy: createCard("FE142919436A92FCA651F1A748FAE317"),
      medium: createCard("B1B18D7947D4CDFE44B320B669E4FEA9"),
      hard: createCard("E484C9534FA358830DCE298F382D0C3C"),
    },
  },
  investigators: createCard("591BEA1C441F19F1B9B321B8290E3FE3"),
  ancientOneSheets: [createCard("3C9D40C143F59A69AEF3E6BDBE72E815")],
};

/** @type Record<string, Prelude> */
const preludes = {
  "Dark Blessings": {},
  "In Cosmic Alignment": {
    step5: (ancientOne) => {
      if (ancientOne !== "Syzygy") {
        // setup mystic ruins deck
        const mysticRuinsDeck = createCard("8477CAF347EE3FEB6BC15E827D79544B");
        mysticRuinsDeck.setId("encounter-mystic-ruins-deck");
        mysticRuinsDeck.setName("Mystic Ruins Encounters");
        const mysticRuinsSnapPoint = GameUtil.addEncounterDeck(mysticRuinsDeck);
        mysticRuinsDeck.shuffle();

        const mysticRuinsToken = createCard("A9C452A442F9A36AC77CC1B68633FEEE");
        mysticRuinsToken.setId("mystic-ruins-token");
        mysticRuinsToken.setName("Mystic Ruins Token");
        Util.moveObject(mysticRuinsToken, mysticRuinsSnapPoint);
      }
    },
    afterResolvingSetup: (ancientOne) => {
      // if syzygy place 1 eldritch token on red omen
      // else setup cosmic alignment adventures and draw top and spawn 1 gate
      if (ancientOne === "Syzygy") {
        const eldritchToken = GameUtil.takeEldritchTokens(1);
        Util.moveObject(eldritchToken, gameBoardLocations.omen.red);
      } else {
        const randomAdventureTemplateId =
          Util.randomIntFromInterval(1, 2) === 1
            ? "FAFF3F5A4C92090ABA2BBAB21C2A12A8"
            : "A3BC4BE7436B3744F08731BC0B0AEE1D";
        const adventureDeck = createCard(randomAdventureTemplateId);
        if (!tableLocations.adventureDeck) {
          throw new Error("Unable to find snap point for adventure deck");
        }
        Util.moveObject(adventureDeck, tableLocations.adventureDeck);
        adventureDeck.setId("adventure-cosmic-alignment-deck");
        adventureDeck.setName("Cosmic Alignment Adventures");
        const firstAdventureCard = adventureDeck.takeCards(1);
        if (!firstAdventureCard) {
          throw new Error("Unable to take the first card from the Cosmic Alignment adventure deck");
        }
        if (!tableLocations.activeAdventure) {
          throw new Error("Unable to find snap point for active adventure deck");
        }
        Util.moveObject(firstAdventureCard, tableLocations.activeAdventure);
        Util.flip(firstAdventureCard);

        GameUtil.spawnGates(1);

        const adventureToken = createCard("BEEB07464B9819C2D6BAB883A88C9146");
        adventureToken.setId("adventure-cosmic-alignment-token");
        adventureToken.setName("Adventure Token: Cosmic Alignment");
        Util.moveObject(adventureToken, gameBoardLocations.space.Arkham);
      }
    },
    investigatorSetup: (investigator, sheet, ancientOne) => {
      if (ancientOne === "Syzygy") {
        // TODO lose 1 sanity and gain 1 relic unique asset
      }
    },
  },
  "The Coming Storm": {},
  "The Dunwich Horror": {
    afterResolvingSetup: (ancientOne) => {
      // if Yog-Sothoth make "Spawn of Yog-Sothoth" the active mystery
      // always spawn the Dunwich Horror epic monster on Arkham
      if (ancientOne === "Yog-Sothoth") {
        const mysteryDeck = world.getObjectById("mystery-deck");
        if (!mysteryDeck || !(mysteryDeck instanceof Card)) {
          throw new Error("Unable to find mystery deck");
        }

        const activeMysterySnapPoint = tableLocations.activeMystery;
        if (activeMysterySnapPoint) {
          const activeMystery = activeMysterySnapPoint.getSnappedObject(2);
          if (activeMystery instanceof Card) {
            const cardDetails = activeMystery.getCardDetails();
            if (cardDetails && cardDetails.name !== "Spawn of Yog-Sothoth") {
              mysteryDeck.addCards(activeMystery);

              const activeMysteryCard = Util.takeCardNameFromStack(
                mysteryDeck,
                "Spawn of Yog-Sothoth"
              );
              if (!activeMysteryCard) {
                throw new Error('Unable to find "Spawn of Yog-Sothoth" in mystery deck');
              }

              if (!tableLocations.activeMystery) {
                throw new Error("Unable to find active mystery snap point");
              }
              Util.moveObject(activeMysteryCard, tableLocations.activeMystery);
              Util.flip(activeMysteryCard);
            }
          }
        }
      }

      try {
        GameUtil.spawnEpicMonster("Dunwich Horror", gameBoardLocations.space.Arkham);
      } catch (error) {
        console.error(error.message);
      }
    },
  },
};

if (!world.__eldritchHorror.alreadyLoaded.includes("49664EDA4BD3C0E79AC8238645999EE2")) {
  for (const [name, prelude] of Object.entries(preludes)) {
    world.__eldritchHorror.preludes.set(name, prelude);
  }
  world.__eldritchHorror.alreadyLoaded.push("49664EDA4BD3C0E79AC8238645999EE2");
}

/** @type Investigator[] */
const investigators = [
  {
    name: "Marie Lambeau",
    pawnTemplateId: "542253EF3921472B9C912E2B7D221C8B",
    health: 6,
    sanity: 6,
    startingItems: {
      assets: ["Ritual Dagger"],
      spells: ["Voice of Ra"],
    },
    startingLocation: 20,
    personalStory: "Grand-mere's Warning",
  },
  {
    name: "Tony Morgan",
    pawnTemplateId: "8A1696181EAD4F60AF76CE00B8A14C10",
    health: 7,
    sanity: 5,
    startingItems: {
      assets: ["Handcuffs"],
    },
    startingLocation: 7,
    personalStory: "Thrill of the Hunt",
  },
  {
    name: '"Skide" O\'Toole',
    pawnTemplateId: "BBC1FE23C7BF4244990D63A9BAAEAADB",
    health: 6,
    sanity: 6,
    startingItems: {
      assets: ["Axe"],
    },
    startingLocation: "Buenos Aires",
    personalStory: "Leave it to Chance",
  },
  {
    name: "Zoey Samaras",
    pawnTemplateId: "18D9EB3FA2714657B20AB423DBE8B76D",
    health: 5,
    sanity: 7,
    startingItems: {
      assets: ["Holy Cross"],
    },
    startingLocation: "Rome",
    personalStory: "In His Name",
  },
];

if (!world.__eldritchHorror.alreadyLoaded.includes("591BEA1C441F19F1B9B321B8290E3FE3")) {
  world.__eldritchHorror.investigators.push(...investigators);
  world.__eldritchHorror.alreadyLoaded.push("591BEA1C441F19F1B9B321B8290E3FE3");
}
