const { world, Rotator, Card, Vector } = require("@tabletop-playground/api");
const { buildMythosDeck } = require("./build-mythos");
const { takeCardNameFromStack } = require("./util");
const {
  doomToken,
  gameBoardLocations,
  monsterCup,
  tableLocations,
  ancientContainer,
} = require("./world-constants");

/**
 * @param {AncientOne} ancientOne
 * @param {GameDifficulty} difficulty
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
  doomToken.setPosition(doomLocation.getGlobalPosition(), 1);
}

/**
 * @param {string} sheetId
 */
function setupAncientOneSheet(sheetId) {
  const sheet = world.getObjectById(sheetId);
  sheet.setRotation(new Rotator(0, 0, 180), 0); // flip it
  const container = sheet.getContainer();
  if (container) {
    container.take(sheet, tableLocations.ancientOne.getGlobalPosition());
  } else {
    sheet.setPosition(tableLocations.ancientOne.getGlobalPosition(), 1);
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
    let monsterStack = takeCardNameFromStack(monsterCup, monsterName);
    if (monsterStack === undefined) {
      return;
    }

    for (let i = 1; i < count; i++) {
      let monsterToken = takeCardNameFromStack(monsterCup, monsterName);
      if (monsterToken === undefined) {
        continue;
      }

      monsterStack.addCards(monsterToken, true);
    }
    monsterStack.setPosition(
      tableLocations.ancientOneMonsters[offset++].getGlobalPosition(),
      1
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
  topMysteryCard.setRotation(new Rotator(0, -90, 180), 0); // flip, no animation
  topMysteryCard.setPosition(
    tableLocations.activeMystery.getGlobalPosition(),
    1
  );
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
