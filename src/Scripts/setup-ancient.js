const { world, Vector } = require("@tabletop-playground/api");
const { buildMythosDeck } = require("./build-mythos");
const { GameUtil } = require("./game-util");
const { Util } = require("./util");
const {
  doomToken,
  gameBoardLocations,
  tableLocations,
  ancientContainer,
  expansionSpawn,
} = require("./world-constants");

/**
 * @param {AncientOne} ancientOne
 * @param {MythosDifficulty} difficulty
 * @param {Vector | undefined} sideBoardSpawn
 */
function setupAncient(ancientOne, difficulty, sideBoardSpawn) {
  world.__eldritchHorror.activeAncientOne = ancientOne;
  setupAncientOneSheet(ancientOne.sheetId);
  setupDoomToken(ancientOne.doom);
  setupMonsters(ancientOne.monsters);
  buildMythosDeck(ancientOne.mythosDeck, difficulty);
  setupMysteryCards(ancientOne.mysteryTemplateIds);
  setupResearchCards(ancientOne.researchTemplateIds);
  setupSpecialCards(ancientOne.specialTemplateIds);

  ancientOne?.customSetup?.(sideBoardSpawn);
}
exports.setupAncient = setupAncient;

/**
 * @param {keyof GameBoardLocations["doom"]} num
 */
function setupDoomToken(num) {
  let doomLocation = gameBoardLocations.doom[num];
  Util.moveObject(doomToken, doomLocation);
}

/**
 * @param {string} sheetId
 */
function setupAncientOneSheet(sheetId) {
  const sheet = world.getObjectById(sheetId);
  if (!sheet) {
    throw new Error("Cannot find Ancient One with id " + sheetId);
  }

  Util.flip(sheet);
  const ancientOneTableLocation = tableLocations.ancientOne;
  if (!ancientOneTableLocation) {
    throw new Error("Cannot find table location for the Ancient One");
  }

  const container = sheet.getContainer();
  if (container) {
    container.take(sheet, ancientOneTableLocation.getGlobalPosition());
  } else {
    Util.moveObject(sheet, ancientOneTableLocation);
  }

  // cleanup - return unused ancients to game box
  ancientContainer.destroy();
}

/**
 * @param {Record<string, number>} [monsters]
 */
function setupMonsters(monsters) {
  if (typeof monsters !== "object") {
    return;
  }

  for (const [monsterName, count] of Object.entries(monsters)) {
    try {
      const [monsterStack, _] = GameUtil.setAsideMonster(monsterName, count);

      if (monsterStack.getStackSize() > 1) {
        monsterStack.setName(monsterName);
      }
    } catch (error) {
      console.error(error.message);

      continue;
    }
  }
}

/**
 * @param {string[]} mysteryTemplateIds
 */
function setupMysteryCards(mysteryTemplateIds) {
  if (!Array.isArray(mysteryTemplateIds)) {
    return;
  }

  const mysteryDeckTableLocation = tableLocations.mysteryDeck;
  if (!mysteryDeckTableLocation) {
    throw new Error("Cannot find table location for the mystery deck");
  }

  const mysteryDeck = Util.createCard(mysteryDeckTableLocation, ...mysteryTemplateIds);

  mysteryDeck.setName("Mysteries");
  mysteryDeck.setId("mystery-deck");
  mysteryDeck.shuffle();
  const topMysteryCard = Util.takeCards(mysteryDeck, 1);
  const activeMysteryTableLocation = tableLocations.activeMystery;
  if (!activeMysteryTableLocation) {
    throw new Error("Cannot find table location for the active mystery deck");
  }
  Util.moveObject(topMysteryCard, activeMysteryTableLocation);
  Util.flip(topMysteryCard);
}

/**
 * @param {string[]} researchTemplateIds
 */
function setupResearchCards(researchTemplateIds) {
  if (!Array.isArray(researchTemplateIds)) {
    return;
  }

  const researchDeck = Util.createCard(tableLocations.research, ...researchTemplateIds);

  researchDeck.setName("Research Encounters");
  researchDeck.snap();
  researchDeck.shuffle();
}

/**
 *
 * @param {Record<string, string[]>} [specialTemplateIds]
 */
function setupSpecialCards(specialTemplateIds) {
  if (typeof specialTemplateIds !== "object") {
    return;
  }

  for (const [specialName, templateIds] of Object.entries(specialTemplateIds)) {
    let specialDeck;
    try {
      const snapPoint = Util.getNextAvailableSnapPoint(tableLocations.specials);
      specialDeck = Util.createCard(snapPoint, ...templateIds);
    } catch {
      // some ancient ones have more than 2 special decks,
      // in that event we need to shift the entire top row to make room
      specialDeck = Util.createCard(expansionSpawn, ...templateIds);
      Util.insertObjectAt(specialDeck, [tableLocations.research, ...tableLocations.topDeckRow], 0);
    }
    specialDeck.snap();
    specialDeck.setName(specialName);
    specialDeck.shuffle();
  }
}
