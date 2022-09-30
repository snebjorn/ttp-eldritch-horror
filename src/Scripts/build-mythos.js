const { Card, world, Vector } = require("@tabletop-playground/api");
const { Util } = require("./util");
const { mythosSetupDecks, tableLocations } = require("./world-constants");

/**
 * @param {MythosDeckOptions} mythosDeckOptions
 * @param {MythosDifficulty} mythosDifficulty
 */
function buildMythosDeck(mythosDeckOptions, mythosDifficulty) {
  if (!mythosDifficulty.isEasy && !mythosDifficulty.isMedium && !mythosDifficulty.isHard) {
    throw new Error("No difficulty set. Cannot build mythos deck!");
  }

  shuffleMythosSetupDecks(); // shuffle for good measure

  const greenMythos = setupDifficulty(mythosDifficulty, "green");
  const yellowMythos = setupDifficulty(mythosDifficulty, "yellow");
  const blueMythos = setupDifficulty(mythosDifficulty, "blue");

  if (greenMythos === undefined || yellowMythos === undefined || blueMythos === undefined) {
    world.broadcastChatMessage(
      "Cannot configure Mythos difficulty, something is wrong with the decks."
    );
    return;
  }

  warnIfMissingMythosColors(mythosDeckOptions, greenMythos, yellowMythos, blueMythos);

  const stage1 = setupStage(mythosDeckOptions.stage1, greenMythos, yellowMythos, blueMythos);
  const stage2 = setupStage(mythosDeckOptions.stage2, greenMythos, yellowMythos, blueMythos);
  const stage3 = setupStage(mythosDeckOptions.stage3, greenMythos, yellowMythos, blueMythos);

  if (stage1 === undefined || stage2 === undefined || stage3 === undefined) {
    world.broadcastChatMessage("Cannot build mythos deck, something is wrong with the stages.");
    return;
  }

  warnIfMythosDeckIsIncomplete(mythosDeckOptions, stage1, stage2, stage3);

  stage1.addCards(stage2, true);
  stage1.addCards(stage3, true);

  if (tableLocations.mythosDeck === undefined) {
    throw new Error("Cannot find Mythos Deck snap point.");
  }

  Util.moveObject(stage1, tableLocations.mythosDeck);
  stage1.setName("Mythos Deck");
  stage1.setId("mythos-deck");
  stage1.setScript("mythos-deck.js", "8A0B748B4DA2CE04CB79E4A02C7FD720");

  cleanupMythosCards();
}
exports.buildMythosDeck = buildMythosDeck;

/**
 * @param {MythosDeckOptions} mythosDeckOptions
 * @param {MythosDifficulty} mythosDifficulty
 */
function canBuildMythosDeck(mythosDeckOptions, mythosDifficulty) {
  if (!mythosDifficulty.isEasy && !mythosDifficulty.isMedium && !mythosDifficulty.isHard) {
    return false;
  }

  const mythosColorsNeeded = [
    mythosDeckOptions.stage1,
    mythosDeckOptions.stage2,
    mythosDeckOptions.stage3,
  ].reduce(
    (sum, stage) => {
      sum.green += stage.green;
      sum.yellow += stage.yellow;
      sum.blue += stage.blue;

      return sum;
    },
    { green: 0, yellow: 0, blue: 0 }
  );

  const mythosColorsAvailable = Object.entries(mythosSetupDecks).reduce(
    (sum, decks) => {
      /** @type {[MythosCardColors, MythosCardDifficult]} */
      // @ts-ignore
      const [color, mythosDeck] = decks;
      if (mythosDifficulty.isEasy) {
        sum[color] += mythosDeck.easy.getStackSize();
      }

      if (mythosDifficulty.isMedium) {
        sum[color] += mythosDeck.medium.getStackSize();
      }

      if (mythosDifficulty.isHard) {
        sum[color] += mythosDeck.hard.getStackSize();
      }

      return sum;
    },
    {
      green: 0,
      yellow: 0,
      blue: 0,
    }
  );

  return (
    mythosColorsAvailable.green >= mythosColorsNeeded.green &&
    mythosColorsAvailable.yellow >= mythosColorsNeeded.yellow &&
    mythosColorsAvailable.blue >= mythosColorsNeeded.blue
  );
}
exports.canBuildMythosDeck = canBuildMythosDeck;

/**
 * @param {MythosDeckOptions} mythosDeckOptions
 * @param {Card} greenMythos
 * @param {Card} yellowMythos
 * @param {Card} blueMythos
 */
function warnIfMissingMythosColors(mythosDeckOptions, greenMythos, yellowMythos, blueMythos) {
  const greenCardCount =
    mythosDeckOptions.stage1.green +
    mythosDeckOptions.stage2.green +
    mythosDeckOptions.stage3.green;
  if (greenMythos.getStackSize() < greenCardCount) {
    world.broadcastChatMessage(
      "Not enough green Mythos cards to build the correct Mythos deck. Include more difficulties or expansions so the green card pool is bigger."
    );
  }

  const yellowCardCount =
    mythosDeckOptions.stage1.yellow +
    mythosDeckOptions.stage2.yellow +
    mythosDeckOptions.stage3.yellow;
  if (yellowMythos.getStackSize() < yellowCardCount) {
    world.broadcastChatMessage(
      "Not enough yellow Mythos cards to build the correct Mythos deck. Include more difficulties or expansions so the yellow card pool is bigger."
    );
  }

  const blueCardCount =
    mythosDeckOptions.stage1.blue + mythosDeckOptions.stage2.blue + mythosDeckOptions.stage3.blue;
  if (blueMythos.getStackSize() < blueCardCount) {
    world.broadcastChatMessage(
      "Not enough blue Mythos cards to build the correct Mythos deck. Include more difficulties or expansions so the blue card pool is bigger."
    );
  }
}

/**
 * @param {MythosDeckOptions} mythosDeckOptions
 * @param {Card} stage1
 * @param {Card} stage2
 * @param {Card} stage3
 */
function warnIfMythosDeckIsIncomplete(mythosDeckOptions, stage1, stage2, stage3) {
  const stage1CardCount =
    mythosDeckOptions.stage1.green +
    mythosDeckOptions.stage1.yellow +
    mythosDeckOptions.stage1.blue;
  const stage2CardCount =
    mythosDeckOptions.stage2.green +
    mythosDeckOptions.stage2.yellow +
    mythosDeckOptions.stage2.blue;
  const stage3CardCount =
    mythosDeckOptions.stage3.green +
    mythosDeckOptions.stage3.yellow +
    mythosDeckOptions.stage3.blue;
  const totalCardCount = stage1CardCount + stage2CardCount + stage3CardCount;
  const builtDeckCount = stage1.getStackSize() + stage2.getStackSize() + stage3.getStackSize();
  if (builtDeckCount !== totalCardCount) {
    world.broadcastChatMessage(
      `Mythos deck was supposed to have ${totalCardCount} cards, however it only contains ${builtDeckCount} cards. Include more difficulties or expansions so the Mythos card pool is bigger.`
    );
  }
}

function shuffleMythosSetupDecks() {
  Object.values(mythosSetupDecks).forEach((color) =>
    Object.values(color).forEach((difficulty) => difficulty.shuffle())
  );
}

/** Join all remaining Mythos cards into a single deck. This is considered to be in the game box */
function cleanupMythosCards() {
  /** @type {Card[]} */
  const mythosDecks = Object.values(mythosSetupDecks).flatMap((color) => Object.values(color));
  const remainingMythosDeck = mythosDecks.pop();
  if (!remainingMythosDeck) {
    throw new Error("Unable to .pop() from mythosDecks");
  }
  mythosDecks.forEach((deck) => remainingMythosDeck.addCards(deck));
  Util.moveObject(remainingMythosDeck, new Vector(58, 105, 87));
  remainingMythosDeck.shuffle();
  remainingMythosDeck.setId("unused-mythos-deck");
  remainingMythosDeck.setName("Unused Mythos cards (game box)");
  remainingMythosDeck.setDescription(
    "These are the unused Mythos cards and considered in the game box.\nSome cards require you to draw Mythos cards from the game box."
  );
}

/**
 * @param {MythosDifficulty} mythosDifficulty
 * @param {MythosCardColors} color
 */
function setupDifficulty(mythosDifficulty, color) {
  const active = [];
  if (mythosDifficulty.isEasy) {
    active.push(mythosSetupDecks[color].easy);
  }
  if (mythosDifficulty.isMedium) {
    active.push(mythosSetupDecks[color].medium);
  }
  if (mythosDifficulty.isHard) {
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
    stageDeck = Util.takeCards(greenDeck, config.green);
  }
  if (config.yellow > 0) {
    const yellowCards = Util.takeCards(yellowDeck, config.yellow);
    if (stageDeck === undefined) {
      stageDeck = yellowCards;
    } else {
      stageDeck.addCards(yellowCards, true);
    }
  }
  if (config.blue > 0) {
    const blueCards = Util.takeCards(blueDeck, config.blue);
    if (stageDeck === undefined) {
      stageDeck = blueCards;
    } else {
      stageDeck.addCards(blueCards, true);
    }
  }

  stageDeck?.shuffle();

  return stageDeck;
}
