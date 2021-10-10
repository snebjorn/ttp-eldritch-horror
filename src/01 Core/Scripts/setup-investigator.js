const { world, Card, Vector, SnapPoint, Rotator, Player } = require("@tabletop-playground/api");
const {
  getAssetDeck,
  spellDeck,
  conditionDeck,
  getCluePool,
  gameBoardLocations,
  willToken,
  artifactDeck,
  strengthToken,
} = require("./world-constants");
const { Util } = require("./util");
const { GameUtil } = require("./game-util");

/**
 * @param {Card} investigatorSheet
 * @param {Player} player
 */
function setupInvestigator(investigatorSheet, player) {
  const foundInvestigator = getInvestigatorData(investigatorSheet);
  let healthToken;
  const healthSnapPoint = investigatorSheet.getSnapPoint(0);
  if (healthSnapPoint) {
    healthToken = setupHealthToken(healthSnapPoint, foundInvestigator.health);
  } else {
    console.error(`Unable to find health snap point on Investigator (${foundInvestigator.name}])`);
  }

  let sanityToken;
  const sanitySnapPoint = investigatorSheet.getSnapPoint(1);
  if (sanitySnapPoint) {
    sanityToken = setupSanityToken(sanitySnapPoint, foundInvestigator.sanity);
  } else {
    console.error(`Unable to find sanity snap point on Investigator (${foundInvestigator.name}])`);
  }
  const startingLocation =
    foundInvestigator.startingLocation !== undefined
      ? getSnapPointForStartingLocation(foundInvestigator.startingLocation)
      : investigatorSheet.getPosition();
  const pawn = setupPawn(foundInvestigator.pawnTemplateId, startingLocation);

  let extraItems;
  const activePrelude = GameUtil.getActivePrelude();
  const activeAncientOne = GameUtil.getActiveAncientOne();
  if (
    activeAncientOne &&
    activePrelude &&
    !!activePrelude.investigatorSetup &&
    healthToken &&
    sanityToken &&
    pawn
  ) {
    const preludeItems = activePrelude.investigatorSetup(
      foundInvestigator,
      investigatorSheet,
      healthToken,
      sanityToken,
      pawn,
      activeAncientOne.name,
      player
    );
    if (preludeItems) {
      extraItems = preludeItems;
    }
  }

  setupStartingItems(investigatorSheet, foundInvestigator.startingItems, extraItems);
  Util.logScriptAction(`${player.getName()} setup Investigator ${foundInvestigator.name}.`);
}
exports.setupInvestigator = setupInvestigator;

/**
 * @param {Card} investigatorSheet
 * @param {ExtraItems} extras
 */
function setupCrippledInvestigator(investigatorSheet, extras) {
  const startingLocation = setupDefeatedInvestigator(investigatorSheet, extras);
  if (startingLocation) {
    setupHealthToken(startingLocation, 1);
  }
}
exports.setupCrippledInvestigator = setupCrippledInvestigator;

/**
 * @param {Card} investigatorSheet
 * @param {ExtraItems} extras
 */
function setupInsaneInvestigator(investigatorSheet, extras) {
  const startingLocation = setupDefeatedInvestigator(investigatorSheet, extras);
  if (startingLocation) {
    setupSanityToken(startingLocation, 1);
  }
}
exports.setupInsaneInvestigator = setupInsaneInvestigator;

/**
 * @param {Card} investigatorSheet
 * @param {ExtraItems} extras
 */
function setupDefeatedInvestigator(investigatorSheet, extras) {
  const foundInvestigator = getInvestigatorData(investigatorSheet);
  if (foundInvestigator) {
    setupStartingItems(investigatorSheet, foundInvestigator.startingItems, extras);
    const startingLocation =
      foundInvestigator.startingLocation !== undefined
        ? getSnapPointForStartingLocation(foundInvestigator.startingLocation)
        : investigatorSheet.getPosition();
    const pawn = setupPawn(foundInvestigator.pawnTemplateId, startingLocation);
    if (pawn) {
      const pawnHeight = pawn.getExtent(false).z;
      pawn.setPosition(pawn.getPosition().add(new Vector(-pawnHeight, 0, 0)), 1);
      pawn.setRotation(new Rotator(-90, 0, 0), 1);
      pawn.snapToGround();
    }

    return startingLocation;
  }
}

/** @param {Card} investigatorSheet */
function getInvestigatorData(investigatorSheet) {
  const investigatorName = investigatorSheet.getCardDetails().name;
  const foundInvestigator = world.__eldritchHorror.investigators.find(
    (investigator) => investigator.name === investigatorName
  );
  if (!foundInvestigator) {
    throw new Error(`Missing Investigator data for ${investigatorName}`);
  }

  return foundInvestigator;
}
exports.getInvestigatorData = getInvestigatorData;

/**
 * @param {Card} investigatorSheet
 * @param {Investigator["startingItems"]} startingItems
 * @param {ExtraItems} [extras]
 */
function setupStartingItems(investigatorSheet, startingItems, extras) {
  let itemsGiven = 0;

  if (extras && extras.asset) {
    if (startingItems.assets) {
      startingItems.assets.push(extras.asset);
    } else {
      startingItems.assets = [extras.asset];
    }
  }
  if (startingItems.assets && startingItems.assets.length > 0) {
    startingItems.assets.forEach((asset) => {
      const takenAsset = Util.takeCardNameFromStack(getAssetDeck(), asset);
      if (takenAsset === undefined) {
        console.error(`Unable to find "${asset}" in Asset Deck`);
        return;
      }

      Util.flip(takenAsset);
      positionItemOnInvestigatorSheet(investigatorSheet, takenAsset, itemsGiven++);
    });
  }

  if (extras && extras.randomAssets !== undefined && extras.randomAssets > 0) {
    for (let i = 0; i < extras.randomAssets; i++) {
      const randomAsset = Util.takeRandomCardFromStack(getAssetDeck());
      if (randomAsset === undefined) {
        console.error(`Unable to take a random asset from the Asset Deck`);
        return;
      }
      positionItemOnInvestigatorSheet(investigatorSheet, randomAsset, itemsGiven++);
    }
  }

  if (startingItems.uniqueAssets && startingItems.uniqueAssets.length > 0) {
    /** @type Card | undefined */
    // @ts-ignore
    const uniqueAssetDeck = world.getObjectById("unique-asset-deck");
    if (!uniqueAssetDeck) {
      console.error("Unable to find Unique Asset Deck");
    } else {
      startingItems.uniqueAssets.forEach((asset) => {
        const takenAsset = Util.takeCardNameFromStack(uniqueAssetDeck, asset);
        if (takenAsset === undefined) {
          console.error(`Unable to find "${asset}" in Unique Asset Deck`);
          return;
        }

        positionItemOnInvestigatorSheet(investigatorSheet, takenAsset, itemsGiven++);
      });
    }
  }

  if (startingItems.spells && startingItems.spells.length > 0) {
    startingItems.spells.forEach((spell) => {
      const spellCard = Util.takeCardNameFromStack(spellDeck, spell);
      if (spellCard === undefined) {
        console.error(`Unable to find "${spell}" in Spell Deck`);
        return;
      }

      positionItemOnInvestigatorSheet(investigatorSheet, spellCard, itemsGiven++);
    });
  }

  if (extras && extras.condition) {
    if (startingItems.conditions) {
      startingItems.conditions.push(extras.condition);
    } else {
      startingItems.conditions = [extras.condition];
    }
  }
  if (startingItems.conditions && startingItems.conditions.length > 0) {
    startingItems.conditions.forEach((condition) => {
      const conditionCard = Util.takeCardNameFromStack(conditionDeck, condition);
      if (conditionCard === undefined) {
        console.error(`Unable to find "${condition}" in Condition Deck`);
        return;
      }

      positionItemOnInvestigatorSheet(investigatorSheet, conditionCard, itemsGiven++);
    });
  }

  if (extras && extras.randomArtifacts !== undefined && extras.randomArtifacts > 0) {
    for (let i = 0; i < extras.randomArtifacts; i++) {
      const randomArtifact = Util.takeRandomCardFromStack(artifactDeck);
      if (randomArtifact === undefined) {
        console.error(`Unable to take a random artifact from the Artifact Deck`);
        return;
      }
      positionItemOnInvestigatorSheet(investigatorSheet, randomArtifact, itemsGiven++);
    }
  }

  if (
    (startingItems.clues && startingItems.clues > 0) ||
    (extras && extras.clues && extras.clues > 0)
  ) {
    const startingClues = startingItems.clues !== undefined ? startingItems.clues : 0;
    const extraClues = extras && extras.clues !== undefined ? extras.clues : 0;
    const clueCount = startingClues + extraClues;
    const clueToken = Util.takeRandomCardFromStack(getCluePool());
    if (clueToken === undefined) {
      console.error(`Unable to find a clue in Clue Pool`);
      return;
    } else {
      if (clueCount > 1) {
        for (let i = 1; i < clueCount; i++) {
          const extraClue = Util.takeRandomCardFromStack(getCluePool());
          if (extraClue === undefined) {
            console.error(`Unable to find a clue in Clue Pool`);
            return;
          }
          clueToken.addCards(extraClue);
        }
      }
    }

    positionItemOnInvestigatorSheet(investigatorSheet, clueToken, itemsGiven++);
  }

  if (
    (startingItems.focus && startingItems.focus > 0) ||
    (extras && extras.focus && extras.focus > 0)
  ) {
    const startingFocus = startingItems.focus !== undefined ? startingItems.focus : 0;
    const extraFocus = extras && extras.focus !== undefined ? extras.focus : 0;
    const focusCount = startingFocus + extraFocus;
    const focusTokens = GameUtil.takeFocusTokens(focusCount);
    positionItemOnInvestigatorSheet(investigatorSheet, focusTokens, itemsGiven++);
  }

  if (startingItems.shipTickets && startingItems.shipTickets > 0) {
    const shipTokens = GameUtil.takeShipTokens(startingItems.shipTickets);
    positionItemOnInvestigatorSheet(investigatorSheet, shipTokens, itemsGiven++);
  }

  if (extras && extras.strength && extras.strength > 0) {
    const improvementTokens = Util.createCard(
      strengthToken.getTemplateId(),
      strengthToken.getPosition().add(new Vector(0, 0, 2))
    );
    const takenStrengthToken = Util.takeCardNameFromStack(improvementTokens, "strength");
    improvementTokens.destroy();
    if (takenStrengthToken === undefined) {
      console.error(`Unable to find Strength token`);
      return;
    }

    if (extras.strength === 1) {
      Util.flip(takenStrengthToken);
    }

    positionItemOnInvestigatorSheet(investigatorSheet, takenStrengthToken, itemsGiven++);
  }

  if (
    (startingItems.will && startingItems.will > 0) ||
    (extras && extras.will && extras.will > 0)
  ) {
    const startingWill = startingItems.will !== undefined ? startingItems.will : 0;
    const extraWill = extras && extras.will !== undefined ? extras.will : 0;
    const willCount = startingWill + extraWill;
    const improvementTokens = Util.createCard(
      willToken.getTemplateId(),
      willToken.getPosition().add(new Vector(0, 0, 2))
    );
    const takenWillToken = Util.takeCardNameFromStack(improvementTokens, "will");
    improvementTokens.destroy();
    if (takenWillToken === undefined) {
      console.error(`Unable to find Will token`);
      return;
    }

    if (willCount === 1) {
      Util.flip(takenWillToken);
    }

    positionItemOnInvestigatorSheet(investigatorSheet, takenWillToken, itemsGiven++);
  }
}

/**
 * @param {Card} investigatorSheet
 * @param {Card} item
 * @param {number} offset
 */
function positionItemOnInvestigatorSheet(investigatorSheet, item, offset) {
  const sheetSize = investigatorSheet.getExtent(false);
  sheetSize.x *= -1;
  sheetSize.z = 0;

  const itemSize = item.getExtent(false);
  itemSize.x *= -1;
  itemSize.z = 0;

  item.setPosition(
    investigatorSheet
      .getPosition()
      .add(new Vector(0, 0, 1)) // raise it above the sheet
      .subtract(sheetSize) // starting pos is upper left corner
      .subtract(new Vector(0.6, 0, 0)) // removes the add UI height
      .add(new Vector(-0.5, 0.5, 0)) // margin
      .add(itemSize)
      .add(new Vector(-(offset * 2), offset * 2, offset)),
    1
  );
}

/**
 * @param {string} pawnTemplateId
 * @param {SnapPoint | Vector} startingLocation
 */
function setupPawn(pawnTemplateId, startingLocation) {
  const globalPosition =
    startingLocation instanceof SnapPoint ? startingLocation.getGlobalPosition() : startingLocation;
  const pawn = world.createObjectFromTemplate(
    pawnTemplateId,
    globalPosition.add(new Vector(0, 0, 2))
  );
  if (pawn) {
    const name = pawn.getTemplateName();
    pawn.setId(`${name}-pawn`);
    pawn.setName(name);

    if (startingLocation instanceof SnapPoint) {
      pawn.snap();
    } else {
      pawn.snapToGround();
    }
  }
  return pawn;
}

/** @param {keyof GameBoardLocations["space"]} startingLocation */
function getSnapPointForStartingLocation(startingLocation) {
  return gameBoardLocations.space[startingLocation];
}

/**
 * @param {SnapPoint | Vector} position
 * @param {number} health - hit points. Range 1-9
 */
function setupHealthToken(position, health) {
  const healthTemplateId = "346911D24251ACB6B7FEF0A14B49B614";
  const globalPosition = position instanceof SnapPoint ? position.getGlobalPosition() : position;
  const healthToken = Util.createMultistateObject(
    healthTemplateId,
    globalPosition.add(new Vector(0, 0, 1))
  );

  if (position instanceof SnapPoint) {
    healthToken.snap();
  } else {
    healthToken.snapToGround();
  }
  healthToken.setState(health - 1);

  return healthToken;
}

/**
 * @param {SnapPoint | Vector} position
 * @param {number} sanity - sanity points. Range 1-9
 */
function setupSanityToken(position, sanity) {
  const sanityTemplateId = "CD0FA9DC41E13E96DC743A8A30C2DD75";
  const globalPosition = position instanceof SnapPoint ? position.getGlobalPosition() : position;
  const sanityToken = Util.createMultistateObject(
    sanityTemplateId,
    globalPosition.add(new Vector(0, 0, 1))
  );
  if (position instanceof SnapPoint) {
    sanityToken.snap();
  } else {
    sanityToken.snapToGround();
  }
  sanityToken.setState(sanity - 1);

  return sanityToken;
}
