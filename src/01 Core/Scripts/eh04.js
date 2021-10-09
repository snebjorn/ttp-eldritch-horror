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
        world.showPing(mysticRuinsToken.getPosition(), Util.Colors.WHITE, true);

        Util.logScriptAction(
          "SETUP (Prelude: In Cosmic Alignment) set up the Mystic Ruins Encounter Deck."
        );
      }
    },
    afterResolvingSetup: (ancientOne) => {
      // if syzygy place 1 eldritch token on red omen
      // else setup cosmic alignment adventures and draw top and spawn 1 gate
      if (ancientOne === "Syzygy") {
        const eldritchToken = GameUtil.takeEldritchTokens(1);
        Util.moveOrAddObject(eldritchToken, gameBoardLocations.omen.red);
        Util.logScriptAction(
          "SETUP (Prelude: In Cosmic Alignment) placed 1 Eldritch token on the red space of the Omen track."
        );
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

        const spawnedGates = GameUtil.spawnGates(1);
        const [spawnedGate, spawnedMonster] = spawnedGates[0];

        const adventureToken = createCard("BEEB07464B9819C2D6BAB883A88C9146");
        adventureToken.setId("adventure-cosmic-alignment-token");
        adventureToken.setName("Adventure Token: Cosmic Alignment");
        Util.moveObject(adventureToken, gameBoardLocations.space.Arkham);
        Util.logScriptAction(
          `SETUP (Prelude: In Cosmic Alignment) set aside Cosmic Alignment Adventures; then drew the "Discovery of a Cosmic Syzygy" Adventure and spawned 1 Gate on "${spawnedGate}" with a "${spawnedMonster}" Monster.`
        );
      }
    },
    investigatorSetup: (investigator, sheet, healthToken, sanityToken, pawn, ancientOne) => {
      if (ancientOne === "Syzygy") {
        // TODO lose 1 sanity and gain 1 relic unique asset
      }
    },
  },
  "The Coming Storm": {
    afterResolvingSetup: () => {
      // TODO resolve mythos effects: advance the omen, spawn gates, monster surge
      // TODO need to find a way to advance doom for each matching gate and do a monster surge
      // const activeIconReference = GameUtil.getActiveIconReference();
      // if (activeIconReference) {
      //   GameUtil.spawnGates(activeIconReference.spawnGates);
      // }
      // Util.logScriptAction(`SETUP (Prelude: The Coming Storm) spawned Gates on `)
    },
  },
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
            const activeMysteryName = activeMystery.getCardDetails().name;
            if (activeMysteryName !== "Spawn of Yog-Sothoth") {
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

        Util.logScriptAction(
          'SETUP (Prelude: The Dunwich Horror) drew the "Spawn of Yog-Sothoth" Mystery instead of a random Mystery then resolved the "when this card enters play" effect.'
        );
      } else {
        Util.logScriptAction(
          'SETUP (Prelude: The Dunwich Horror) spawned the "Dunwich Horror" Epic Monster on Arkham.'
        );
      }

      try {
        GameUtil.spawnEpicMonster("Dunwich Horror", gameBoardLocations.space.Arkham);
      } catch (error) {
        console.error(error.message);
      }
    },
    investigatorSetup: (investigator, sheet, healthToken, sanityToken, pawn, ancientOne) => {
      // TODO gain 1 Glamour Spell - need tagging support to tag cards with Glamour
    },
  },
};

if (!world.__eldritchHorror.alreadyLoaded.includes("49664EDA4BD3C0E79AC8238645999EE2")) {
  for (const [name, prelude] of Object.entries(preludes)) {
    world.__eldritchHorror.preludes.set(name, prelude);
  }
  world.__eldritchHorror.alreadyLoaded.push("49664EDA4BD3C0E79AC8238645999EE2");
}

if (!world.__eldritchHorror.alreadyLoaded.includes("591BEA1C441F19F1B9B321B8290E3FE3")) {
  // @ts-ignore
  const { investigators } = require("../../1080813/Scripts/investigators");
  world.__eldritchHorror.investigators.push(...investigators);
  world.__eldritchHorror.alreadyLoaded.push("591BEA1C441F19F1B9B321B8290E3FE3");
}
