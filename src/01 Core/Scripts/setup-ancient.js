const { world, Card, Vector } = require("@tabletop-playground/api");
const { buildMythosDeck } = require("./build-mythos");
const { Util } = require("./util");
const {
  doomToken,
  gameBoardLocations,
  monsterCup,
  tableLocations,
  ancientContainer,
} = require("./world-constants");

/**
 * @param {AncientOne} ancientOne
 * @param {MythosDifficulty} difficulty
 */
function setupAncient(ancientOne, difficulty) {
  setupAncientOneSheet(ancientOne.sheetId);
  setupDoomToken(ancientOne.doom);
  setupMonsters(ancientOne.monsters);
  buildMythosDeck(ancientOne.mythosDeck, difficulty);
  setupMysteryCards(ancientOne.mysteryTemplateIds);
  setupResearchCards(ancientOne.researchTemplateIds);
  setupSpecialCards(ancientOne.specialTemplateIds);

  if (!!ancientOne.customSetup) {
    ancientOne.customSetup();
  }
}
exports.setupAncient = setupAncient;

/**
 * @param {keyof GameBoardLocations["doom"]} num
 */
function setupDoomToken(num) {
  let doomLocation = gameBoardLocations.doom[num];
  Util.setPositionAtSnapPoint(doomToken, doomLocation);
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
    Util.setPositionAtSnapPoint(sheet, ancientOneTableLocation);
  }

  // cleanup - return unused ancients to game box
  ancientContainer.destroy();
}

/**
 *
 * @param {Record<string, number>} [monsters]
 */
function setupMonsters(monsters) {
  if (typeof monsters !== "object") {
    return;
  }

  let offset = 0;
  for (const [monsterName, count] of Object.entries(monsters)) {
    const monsterStack = Util.takeCardNameFromStack(monsterCup, monsterName, count);
    if (monsterStack === undefined) {
      continue;
    }

    Util.setPositionAtSnapPoint(monsterStack, tableLocations.ancientOneMonsters[offset++]);
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

  const mysteryDeck = buildDeck(mysteryTemplateIds, mysteryDeckTableLocation.getGlobalPosition());

  mysteryDeck.setName("Mysteries");
  mysteryDeck.setId("mystery-deck");
  mysteryDeck.shuffle();
  const topMysteryCard = mysteryDeck.takeCards();
  if (!topMysteryCard) {
    throw new Error("Cannot find the top card of the mystery deck");
  }
  const activeMysteryTableLocation = tableLocations.activeMystery;
  if (!activeMysteryTableLocation) {
    throw new Error("Cannot find table location for the active mystery deck");
  }
  Util.setPositionAtSnapPoint(topMysteryCard, activeMysteryTableLocation);
  Util.flip(topMysteryCard);
}

/**
 * @param {string[]} researchTemplateIds
 */
function setupResearchCards(researchTemplateIds) {
  if (!Array.isArray(researchTemplateIds)) {
    return;
  }
  const researchTableLocation = tableLocations.research;
  if (!researchTableLocation) {
    throw new Error("Cannot find table location for the research deck");
  }

  const researchDeck = buildDeck(researchTemplateIds, researchTableLocation.getGlobalPosition());

  researchDeck.setName("Research Encounters");
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

  let offset = 0;
  for (const [specialName, templateIds] of Object.entries(specialTemplateIds)) {
    const specialDeck = buildDeck(
      templateIds,
      tableLocations.specials[offset++].getGlobalPosition()
    );
    specialDeck.setName(specialName);
    specialDeck.shuffle();
  }
}

/**
 * @param {string[]} templateIds
 * @param {Vector} location
 */
function buildDeck(templateIds, location) {
  /** @type Card */
  // @ts-ignore
  const finalDeck = templateIds.reduce(
    /** @param {Card | undefined} deck */
    (deck, templateId) => {
      const expansionCards = Util.createCard(templateId, location);
      if (deck === undefined) {
        deck = expansionCards;
      } else {
        deck.addCards(expansionCards, true, 0, false);
      }

      return deck;
    },
    undefined
  );

  return finalDeck;
}
