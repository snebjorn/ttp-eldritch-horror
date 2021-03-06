const { world } = require("@tabletop-playground/api");
const { Util } = require("../util");
const { GameUtil } = require("../game-util");
const { expansionSpawn, tableLocations, gameBoardLocations } = require("../world-constants");

/**
 * @param {...string} templateId
 */
function createCard(...templateId) {
  return Util.createCard(expansionSpawn, ...templateId);
}

/** @type {Expansion.Items} */
exports.expansionItems = {
  encounterCards: {
    otherWorld: createCard("58D64EDB44CD95E3A5B294A411EEA988"),
    america: createCard("6B1CC20E4155E55C0CF169921E3D97A6"),
    europe: createCard("E2984CB840DA59B5F437FE9313B85DA9"),
    asia: createCard("BFCEAA30425C82BDEBF7B4BA09BB83EA"),
    general: createCard("D117134445158FDCA16D9E962A2A3F11"),
    expedition: createCard("F95CFAC9456B268E21406DA419B49964"),
  },
  monsters: createCard("F45BEDBD4CBCAB676561F995D9420D6C"),
  epicMonsters: createCard("5F475D80446B3BEAEB2DF5A4429322F3"),
  assetCards: createCard("1D6A59FC4E5EF0922E252FB142195525"),
  uniqueAssetCards: createCard("2D5FCAAA411D6AA9D94CFE904E36148D"),
  conditionCards: createCard("DC2EBB4B410E16A156AA1B938E510C1D"),
  artifactCards: createCard("E27DB1DC4C2683AA8F2BA2AF2FA76C16"),
  spellCards: createCard("6C21FA4C47AFD2A59D9B72805BBDE59F"),
  preludeCards: createCard("2A69E598405654F70CA5E69F45921612"),
  mythosCards: {
    green: {
      easy: createCard("B4D0668146D282FC6B8CCFA17F994CF0"),
      medium: createCard("8FDE59FD4EDAA21617436BAEC1A84DD8"),
      hard: createCard("6431901643D86ECF1B80FCA94C952B39"),
    },
    yellow: {
      easy: createCard("7D28EFBD41BA5AE1C5AF9BAE11553F2B"),
      medium: createCard("1C787BB94C7A4AD0FD9444A5B4E59F1A"),
      hard: createCard("EF1139F141432A718C2634A9899FBE83"),
    },
    blue: {
      easy: createCard("1D00AA9E4A16DFA3501E4588504B62A3"),
      medium: createCard("102CA96F4C496268538F8BBE56042849"),
      hard: createCard("F71A096244AD0771799DC692534CBF5E"),
    },
  },
  investigators: createCard("76FF24AE4DC7280C6323AF8C1E6537EB"),
  ancientOneSheets: [createCard("41A0780D434575F41CBBDAA1E0472C59")],
  personalStories: {
    missions: "5310DE9546AE94A83474B5B8F6C66E99",
    rewards: "18AF2EC946759D934043A7A48968A21A",
    consequences: "4ECCB24545908FEFAB035688280091B3",
  },
};

/** @type {Record<string, Prelude>} */
const preludes = {
  "Apocalypse Nigh": {
    afterResolvingSetup: (ancientOne) => {
      if (ancientOne === "Shudde M'ell") {
        const eldritchToken = GameUtil.takeEldritchTokens(1);
        Util.moveOrAddObject(eldritchToken, gameBoardLocations.doom[14]);

        Util.logScriptAction(
          `SETUP (Prelude: Apocalypse Nigh) placed 1 Eldritch token on space 14 of the Doom track.`
        );
      } else {
        Util.moveOrAddObject(GameUtil.takeEldritchTokens(1), gameBoardLocations.doom[2]);
        Util.moveOrAddObject(GameUtil.takeEldritchTokens(1), gameBoardLocations.doom[5]);
        Util.moveOrAddObject(GameUtil.takeEldritchTokens(1), gameBoardLocations.doom[8]);
        Util.moveOrAddObject(GameUtil.takeEldritchTokens(1), gameBoardLocations.doom[11]);

        Util.logScriptAction(
          `SETUP (Prelude: Apocalypse Nigh) placed 1 Eldritch token each on spaces 2,5,8,11 of the Doom track.`
        );
      }
    },
  },
  "Fall of Man": {
    afterResolvingSetup: () => {
      // this places the eldritch token underneath the omen token
      const eldritchToken = GameUtil.takeEldritchTokens(1);
      Util.moveOrAddObject(eldritchToken, gameBoardLocations.omen.green);

      Util.logScriptAction(
        "SETUP (Prelude: Fall of Man) placed 1 Eldritch token on the green space of the Omen track."
      );
    },
  },
  "The Price of Prestige": {},
  "You Know What You Must Do": {
    afterResolvingSetup: () => {
      GameUtil.advanceDoom(3);

      Util.logScriptAction("SETUP (Prelude: You Know What You Must Do) advanced Doom by 3.");
    },
    investigatorSetup: (
      investigator,
      sheet,
      healthToken,
      sanityToken,
      pawn,
      ancientOne,
      player
    ) => {
      // the lead investigator gains 1 For the Greater Good Unique Asset
      // each other investigator gains 1 Clue
      const gameState = GameUtil.getSavedData();
      if (gameState.leadInvestigator === investigator.name) {
        Util.logScriptAction(
          `SETUP (Prelude: You Know What You Must Do, Investigator: ${investigator.name}) gained 1 For the Greater Good Unique Asset.`
        );

        return { uniqueAsset: "For the Greater Good" };
      } else {
        Util.logScriptAction(
          `SETUP (Prelude: You Know What You Must Do, Investigator: ${investigator.name}) gained 1 Clue.`
        );

        return { clues: 1 };
      }
    },
  },
};

if (!world.__eldritchHorror.alreadyLoaded.includes("2A69E598405654F70CA5E69F45921612")) {
  for (const [name, prelude] of Object.entries(preludes)) {
    world.__eldritchHorror.preludes.set(name, prelude);
  }
  world.__eldritchHorror.alreadyLoaded.push("2A69E598405654F70CA5E69F45921612");
}

if (!world.__eldritchHorror.alreadyLoaded.includes("76FF24AE4DC7280C6323AF8C1E6537EB")) {
  const { investigators08 } = require("./investigators");
  world.__eldritchHorror.investigators.push(...investigators08);
  world.__eldritchHorror.alreadyLoaded.push("76FF24AE4DC7280C6323AF8C1E6537EB");
}

/**
 * When playing with the Cities in Ruin expansion
 *
 * - Shuffle the Disasters and Devastation Encounters to create their two respective decks.
 *   Place the Disaster deck facedown with the Mythos deck and the Devastation Encounter
 *   deck facedown with the other encounter decks.
 *   Add the Devastation tokens to the general token pool
 */
if (!world.__eldritchHorror.alreadyLoaded.includes("Disaster/Devastation")) {
  // setup Devastation Encounter deck
  const devastationDeck = createCard("98595B724DF997F72CB37997196EB8DE");
  devastationDeck.setId("encounter-devastation-deck");
  devastationDeck.setName("Devastation Encounters");
  devastationDeck.setDescription(
    "- Devastation Encounters are complex encounters that may require an investigator to resolve multiple tests.\n" +
      "- An investigator on a devastated space cannot resolve a General Encounter or a location encounter that corresponds to his space. Instead, during the Encounter Phase, an investigator on a devastated space may encounter that space by drawing and resolving the top card of the Devastation Encounter deck."
  );
  GameUtil.addEncounterDeck(devastationDeck);
  devastationDeck.shuffle();

  // setup Devastation token
  const devastationToken = Util.convertToInfiniteStack(
    createCard("41A12F664413E91443499C984A9A80F9")
  );
  devastationToken.setId("devastation-token");
  devastationToken.setName("Devastation Token");
  devastationToken.setDescription(
    "- When a space is devastated, discard all Clues and defeated investigator tokens on that space, search the Expedition Encounter deck for each card that corresponds to that space and return them to the game box, then place a Devastation token on the space.\n" +
      "- If a Clue would be spawned on a devastated space, discard that Clue instead. A Clue cannot be moved to a devastated space.\n" +
      "- A devastated space does not have a space type; it is no longer a City space.\n" +
      "- If all nine named City spaces on the main board would be devastated, the investigators lose the game."
  );
  const devastationTokenSnapPoint = tableLocations.devastationToken;
  if (!devastationTokenSnapPoint) {
    throw new Error("Cannot find position for Devastation Token");
  }
  Util.moveObject(devastationToken, devastationTokenSnapPoint);

  // setup Disaster deck
  const disasterDeck = createCard("727547664488EA26E9DE96B8602C61FF");
  disasterDeck.setId("disaster-deck");
  disasterDeck.setName("Disasters");
  disasterDeck.setDescription(
    "Disasters represent natural or unnatural destructive forces that act on the cities of the world or other locations.\n" +
      "Some effects cause the investigators to draw and resolve one or more Disasters. To do so, the Lead Investigator draws the top card of the Disaster deck, then he reads the card aloud to all investigators, resolving the card's effects as instructed.\n" +
      "The card's effect is resolved immediately. After resolving the card's effect in its entirety, the card is discarded to a faceup discard pile by the Disaster deck."
  );
  const disasterSnapPoint = tableLocations.disasterDeck;
  if (!disasterSnapPoint) {
    throw new Error("Cannot find position for Devastation Token");
  }
  Util.moveObject(disasterDeck, disasterSnapPoint);
  disasterDeck.shuffle();

  world.__eldritchHorror.alreadyLoaded.push("Disaster/Devastation");
}
