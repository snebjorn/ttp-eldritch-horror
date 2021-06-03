const { Card, world } = require("@tabletop-playground/api");
const { mythosSetupDecks, tableLocations } = require("./world-constants");

/**
 * @param {MythosDeckOptions} mythosDeckOptions
 * @param {GameDifficulty} gameDifficulty
 */
function buildMythosDeck(mythosDeckOptions, gameDifficulty) {
  if (
    !gameDifficulty.isEasy &&
    !gameDifficulty.isMedium &&
    !gameDifficulty.isHard
  ) {
    throw new Error("No difficulty set. Cannot build mythos deck!");
  }

  shuffleMythosSetupDecks(); // shuffle for good measure

  const greenMythos = setupDifficulty(gameDifficulty, "green");
  const yellowMythos = setupDifficulty(gameDifficulty, "yellow");
  const blueMythos = setupDifficulty(gameDifficulty, "blue");

  if (
    greenMythos === undefined ||
    yellowMythos === undefined ||
    blueMythos === undefined
  ) {
    console.warn(
      "Cannot configure mythos difficulty, something is wrong with the decks."
    );
    return;
  }

  const stage1 = setupStage(
    mythosDeckOptions.stage1,
    greenMythos,
    yellowMythos,
    blueMythos
  );
  const stage2 = setupStage(
    mythosDeckOptions.stage2,
    greenMythos,
    yellowMythos,
    blueMythos
  );
  const stage3 = setupStage(
    mythosDeckOptions.stage3,
    greenMythos,
    yellowMythos,
    blueMythos
  );

  if (stage1 === undefined || stage2 === undefined || stage3 === undefined) {
    console.warn(
      "Cannot build mythos deck, something is wrong with the stages."
    );
    return;
  }

  stage3.addCards(stage2, true);
  stage3.addCards(stage1, true);

  stage3.setPosition(tableLocations.mythosDeck.getGlobalPosition(), 1);
  stage3.setName("Mythos Deck");
  stage3.setId("mythos-deck");

  cleanupMythosCards();
}
exports.buildMythosDeck = buildMythosDeck;

function shuffleMythosSetupDecks() {
  Object.values(mythosSetupDecks).forEach((color) =>
    Object.values(color).forEach((difficulty) => difficulty.shuffle())
  );
}

/** Return all remaining Mythos cards to the game box */
function cleanupMythosCards() {
  Object.values(mythosSetupDecks).forEach((color) =>
    Object.values(color).forEach((difficulty) => difficulty.destroy())
  );
}

/**
 * @param {GameDifficulty} gameDifficulty
 * @param {MythosCardColors} color
 */
function setupDifficulty(gameDifficulty, color) {
  const active = [];
  if (gameDifficulty.isEasy) {
    active.push(mythosSetupDecks[color].easy);
  }
  if (gameDifficulty.isMedium) {
    active.push(mythosSetupDecks[color].medium);
  }
  if (gameDifficulty.isHard) {
    active.push(mythosSetupDecks[color].hard);
  }

  const primary = active.pop();
  if (primary === undefined) {
    return;
  }

  active.forEach((deck) => primary.addCards(deck, true));
  primary.shuffle();

  return primary;
}

/**
 * @param {MythosColorOptions} config
 * @param {Card} greenDeck
 * @param {Card} yellowDeck
 * @param {Card} blueDeck
 */
function setupStage(config, greenDeck, yellowDeck, blueDeck) {
  let stageDeck;
  if (config.green > 0) {
    stageDeck = greenDeck.takeCards(config.green);
  }
  if (config.yellow > 0) {
    const yellowCards = yellowDeck.takeCards(config.yellow);
    if (stageDeck === undefined) {
      stageDeck = yellowCards;
    } else {
      stageDeck.addCards(yellowCards, true);
    }
  }
  if (config.blue > 0) {
    const blueCards = blueDeck.takeCards(config.blue);
    if (stageDeck === undefined) {
      stageDeck = blueCards;
    } else {
      stageDeck.addCards(blueCards, true);
    }
  }

  return stageDeck;
}
