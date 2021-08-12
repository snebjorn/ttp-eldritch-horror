const { world, Card, Vector, SnapPoint, Rotator } = require("@tabletop-playground/api");
const {
  assetDeck,
  spellDeck,
  conditionDeck,
  cluePool,
  gameBoardLocations,
  willToken,
} = require("./world-constants");
const { Util } = require("./util");
const { GameUtil } = require("./game-util");

/** @param {Card} investigatorSheet */
function setupInvestigator(investigatorSheet) {
  const foundInvestigator = getInvestigatorData(investigatorSheet);
  if (foundInvestigator) {
    setupStartingItems(investigatorSheet, foundInvestigator.startingItems);
    const healthSnapPoint = investigatorSheet.getSnapPoint(0);
    if (healthSnapPoint) {
      setupHealthToken(healthSnapPoint, foundInvestigator.health);
    } else {
      console.error(
        `Unable to find health snap point on investigator (${foundInvestigator.name}])`
      );
    }
    const sanitySnapPoint = investigatorSheet.getSnapPoint(1);
    if (sanitySnapPoint) {
      setupSanityToken(sanitySnapPoint, foundInvestigator.sanity);
    } else {
      console.error(
        `Unable to find sanity snap point on investigator (${foundInvestigator.name}])`
      );
    }
    const startingLocation = getSnapPointForStartingLocation(foundInvestigator.startingLocation);
    setupPawn(foundInvestigator.pawnTemplateId, startingLocation);

    const activePrelude = GameUtil.getActivePrelude();
    const activeAncientOne = GameUtil.getActiveAncientOne();
    if (activeAncientOne && activePrelude && !!activePrelude.investigatorSetup) {
      activePrelude.investigatorSetup(foundInvestigator, investigatorSheet, activeAncientOne.name);
    }
  }
}
exports.setupInvestigator = setupInvestigator;

/**
 * @param {Card} investigatorSheet
 * @param {Card} artifact
 */
function setupDeadInvestigator(investigatorSheet, artifact) {
  const foundInvestigator = getInvestigatorData(investigatorSheet);
  if (foundInvestigator) {
    setupStartingItems(investigatorSheet, foundInvestigator.startingItems, artifact);
    const startingLocation = getSnapPointForStartingLocation(foundInvestigator.startingLocation);
    const pawn = setupPawn(foundInvestigator.pawnTemplateId, startingLocation);
    if (pawn) {
      const pawnHeight = pawn.getExtent(false).z;
      pawn.setPosition(pawn.getPosition().add(new Vector(-pawnHeight, 0, 0)), 1);
      pawn.setRotation(new Rotator(-90, 0, 0), 1);
      pawn.snapToGround();
    }
    setupHealthToken(startingLocation, 1);
  }
}
exports.setupDeadInvestigator = setupDeadInvestigator;

/**
 * @param {Card} investigatorSheet
 * @param {Card} artifact
 */
function setupInsaneInvestigator(investigatorSheet, artifact) {
  const foundInvestigator = getInvestigatorData(investigatorSheet);
  if (foundInvestigator) {
    setupStartingItems(investigatorSheet, foundInvestigator.startingItems, artifact);
    const startingLocation = getSnapPointForStartingLocation(foundInvestigator.startingLocation);
    const pawn = setupPawn(foundInvestigator.pawnTemplateId, startingLocation);
    if (pawn) {
      const pawnHeight = pawn.getExtent(false).z;
      pawn.setPosition(pawn.getPosition().add(new Vector(-pawnHeight, 0, 0)), 1);
      pawn.setRotation(new Rotator(-90, 0, 0), 1);
      pawn.snapToGround();
    }
    setupSanityToken(startingLocation, 1);
  }
}
exports.setupInsaneInvestigator = setupInsaneInvestigator;

/** @param {Card} investigatorSheet */
function getInvestigatorData(investigatorSheet) {
  const cardDetails = investigatorSheet.getCardDetails();
  if (!cardDetails) {
    throw new Error("Missing investigator card details");
  }
  const investigatorName = cardDetails.name;
  const foundInvestigator = world.__eldritchHorror.investigators.find(
    (investigator) => investigator.name === investigatorName
  );

  return foundInvestigator;
}

/**
 * @param {Card} investigatorSheet
 * @param {Investigator["startingItems"]} startingItems
 * @param {Card | undefined} [artifact]
 */
function setupStartingItems(investigatorSheet, startingItems, artifact) {
  let itemsGiven = 0;

  if (startingItems.assets && startingItems.assets.length > 0) {
    startingItems.assets.forEach((asset) => {
      const takenAsset = Util.takeCardNameFromStack(assetDeck, asset);
      if (takenAsset === undefined) {
        console.error(`Unable to find "${asset}" in Asset Deck`);
        return;
      }

      Util.flip(takenAsset);
      positionItemOnInvestigatorSheet(investigatorSheet, takenAsset, itemsGiven++);
    });
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

  if (artifact) {
    positionItemOnInvestigatorSheet(investigatorSheet, artifact, itemsGiven++);
  }

  if (startingItems.clues && startingItems.clues > 0) {
    const clueToken = Util.takeRandomCardFromStack(cluePool);
    if (clueToken === undefined) {
      console.error(`Unable to find a clue in Clue Pool`);
      return;
    }

    positionItemOnInvestigatorSheet(investigatorSheet, clueToken, itemsGiven++);
  }

  if (startingItems.will && startingItems.will > 0) {
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

    if (startingItems.will === 1) {
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
 * @param {SnapPoint} startingLocation
 */
function setupPawn(pawnTemplateId, startingLocation) {
  const pawn = world.createObjectFromTemplate(
    pawnTemplateId,
    startingLocation.getGlobalPosition().add(new Vector(0, 0, 2))
  );
  if (pawn) {
    pawn.snap();
  }
  return pawn;
}

/** @param {keyof GameBoardLocations["space"]} startingLocation */
function getSnapPointForStartingLocation(startingLocation) {
  return gameBoardLocations.space[startingLocation];
}

/**
 * @param {SnapPoint} snapPoint
 * @param {number} health - hit points. Range 1-9
 */
function setupHealthToken(snapPoint, health) {
  const healthTemplateId = "346911D24251ACB6B7FEF0A14B49B614";
  const healthToken = Util.createMultistateObject(
    healthTemplateId,
    snapPoint.getGlobalPosition().add(new Vector(0, 0, 1))
  );
  healthToken.snap();
  healthToken.setState(health - 1);
}

/**
 * @param {SnapPoint} snapPoint
 * @param {number} sanity - sanity points. Range 1-9
 */
function setupSanityToken(snapPoint, sanity) {
  const sanityTemplateId = "CD0FA9DC41E13E96DC743A8A30C2DD75";
  const sanityToken = Util.createMultistateObject(
    sanityTemplateId,
    snapPoint.getGlobalPosition().add(new Vector(0, 0, 1))
  );
  sanityToken.snap();
  sanityToken.setState(sanity - 1);
}
