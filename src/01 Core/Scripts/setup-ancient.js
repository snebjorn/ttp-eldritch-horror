const { world, Rotator, Card, Vector } = require("@tabletop-playground/api");
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
  Util.flip(sheet);
  const container = sheet.getContainer();
  if (container) {
    container.take(sheet, tableLocations.ancientOne.getGlobalPosition());
  } else {
    Util.setPositionAtSnapPoint(sheet, tableLocations.ancientOne);
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
    const monsterStack = Util.takeCardNameFromStack(
      monsterCup,
      monsterName,
      count
    );
    if (monsterStack === undefined) {
      continue;
    }

    Util.setPositionAtSnapPoint(
      monsterStack,
      tableLocations.ancientOneMonsters[offset++]
    );
  }
}

/**
 * @param {string[]} mysteryTemplateIds
 */
function setupMysteryCards(mysteryTemplateIds) {
  if (!Array.isArray(mysteryTemplateIds)) {
    return;
  }

  const mysteryDeck = buildDeck(
    mysteryTemplateIds,
    tableLocations.mysteryDeck.getGlobalPosition()
  );

  mysteryDeck.setRotation(new Rotator(0, -90, 0), 0); // mystery cards need to be turned sideways
  mysteryDeck.setName("Mysteries");
  mysteryDeck.setId("mystery-deck");
  mysteryDeck.shuffle();
  const topMysteryCard = mysteryDeck.takeCards();
  // flip, no animation - for some reason I also have to turn this sideways even though the deck is turned
  topMysteryCard.setRotation(new Rotator(0, -90, 180), 0);
  Util.setPositionAtSnapPoint(topMysteryCard, tableLocations.activeMystery);
}

/**
 * @param {string[]} researchTemplateIds
 */
function setupResearchCards(researchTemplateIds) {
  if (!Array.isArray(researchTemplateIds)) {
    return;
  }

  const researchDeck = buildDeck(
    researchTemplateIds,
    tableLocations.research.getGlobalPosition()
  );

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
      /** @type Card */
      // @ts-ignore
      const expansionCards = world.createObjectFromTemplate(
        templateId,
        location
      );
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
