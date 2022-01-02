const { world, Card, Vector, SnapPoint, Rotator, Player } = require("@tabletop-playground/api");
const {
  getAssetDeck,
  spellDeck,
  conditionDeck,
  gameBoardLocations,
  willToken,
  artifactDeck,
  strengthToken,
  getAssetDiscardPile,
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
  const startingLocation = getStartingLocation(investigatorSheet, foundInvestigator);
  const pawn = setupPawn(foundInvestigator.pawnTemplateId, startingLocation);

  let extraItems;
  const activePrelude = GameUtil.getActivePrelude();
  const activeAncientOne = GameUtil.getActiveAncientOne();
  if (
    !GameUtil.getSavedData().isGameBegun &&
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
      activeAncientOne,
      player
    );
    if (preludeItems) {
      extraItems = preludeItems;
    }
  }

  const personalStory = GameUtil.getSavedData().isPersonalStory
    ? foundInvestigator.personalStory
    : undefined;

  setupStartingItems(investigatorSheet, foundInvestigator.startingItems, extraItems, personalStory);
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
    const startingLocation = getStartingLocation(investigatorSheet, foundInvestigator);
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
 * @param {string} [personalStory]
 */
function setupStartingItems(investigatorSheet, startingItems, extras, personalStory) {
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
      let takenAsset = Util.takeCardNameFromStack(getAssetDeck(), asset);
      if (takenAsset === undefined) {
        // search reserve

        /** @type {Card | undefined} */
        // @ts-ignore
        const foundCardInReserve = gameBoardLocations.reserve
          .map((x) => x.getSnappedObject())
          .find((x) => {
            if (x instanceof Card) {
              return x.getCardDetails().name === asset;
            }
          });
        if (foundCardInReserve) {
          takenAsset = foundCardInReserve;
        } else {
          // search discard pile
          const assetDiscardPile = getAssetDiscardPile();
          if (assetDiscardPile) {
            takenAsset = Util.takeCardNameFromStack(assetDiscardPile, asset);
          }
        }
      }

      if (takenAsset === undefined) {
        console.error(`Unable to find "${asset}" in Asset Deck/Reserve/Discard pile`);
        return;
      }

      if (!takenAsset.isFaceUp()) {
        Util.flip(takenAsset);
      }
      positionItemOnInvestigatorSheet(investigatorSheet, takenAsset, itemsGiven++);
    });
  }

  if (extras && extras.randomAssets !== undefined && extras.randomAssets > 0) {
    for (let i = 0; i < extras.randomAssets; i++) {
      const randomAsset = Util.takeRandomCardsFromStack(getAssetDeck());
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

  /**
   * This array is used to keep track of spells given to an investigator so we can adhere to the following rule.
   *
   * > **Gaining a Random Card:**
   * >
   * > If an investigator gains a Spell or Condition that he already has, he discards it and draws a replacement,
   * > repeating this process until he draws a card he does not already have (if able).
   *
   * @type string[] */
  const givenSpells = [];
  if (startingItems.spells && startingItems.spells.length > 0) {
    startingItems.spells.forEach((spell) => {
      const spellCard = Util.takeCardNameFromStack(spellDeck, spell);
      if (spellCard === undefined) {
        console.error(`Unable to find "${spell}" in Spell Deck`);
        return;
      }
      givenSpells.push(spellCard.getCardDetails().name);

      positionItemOnInvestigatorSheet(investigatorSheet, spellCard, itemsGiven++);
    });
  }

  if (extras && extras.randomSpells !== undefined && extras.randomSpells > 0) {
    for (let i = 0; i < extras.randomSpells; i++) {
      const randomSpell = Util.takeRandomCardsFromStack(spellDeck, 1, givenSpells);
      if (randomSpell === undefined) {
        console.error(`Unable to take a random spell from the Spell Deck`);
        return;
      }
      positionItemOnInvestigatorSheet(investigatorSheet, randomSpell, itemsGiven++);
    }
  }

  if (extras && extras.condition) {
    if (
      startingItems.conditions &&
      // An investigator cannot have multiple copies of the same Condition.
      // If he would gain a Condition that he already has a copy of, he does not gain another copy of that Condition.
      !startingItems.conditions.includes(extras.condition)
    ) {
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
      const randomArtifact = Util.takeRandomCardsFromStack(artifactDeck);
      if (randomArtifact === undefined) {
        console.error(`Unable to take a random artifact from the Artifact Deck`);
        return;
      }
      positionItemOnInvestigatorSheet(investigatorSheet, randomArtifact, itemsGiven++);
    }
  }

  if (personalStory && personalStory.length > 0) {
    const personalMissionDeck = Util.getCardObjectById("personal-mission-deck");
    const personalMission = Util.takeCardNameFromStack(personalMissionDeck, personalStory);
    if (personalMission) {
      Util.flip(personalMission);
      positionItemOnInvestigatorSheet(investigatorSheet, personalMission, itemsGiven++);
    }
  }

  if (
    (startingItems.clues && startingItems.clues > 0) ||
    (extras && extras.clues && extras.clues > 0)
  ) {
    const startingClues = startingItems.clues !== undefined ? startingItems.clues : 0;
    const extraClues = extras && extras.clues !== undefined ? extras.clues : 0;
    const clueCount = startingClues + extraClues;
    const clueToken = GameUtil.takeRandomClueTokens(clueCount);
    if (clueToken === undefined) {
      console.error(`Unable to find a clue in Clue Pool`);
      return;
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

  if (
    (startingItems.resources && startingItems.resources > 0) ||
    (extras && extras.resources && extras.resources > 0)
  ) {
    const startingResources = startingItems.resources !== undefined ? startingItems.resources : 0;
    const extraResources = extras && extras.resources !== undefined ? extras.resources : 0;
    const resourceCount = startingResources + extraResources;
    const resourceTokens = GameUtil.takeResourceTokens(resourceCount);
    positionItemOnInvestigatorSheet(investigatorSheet, resourceTokens, itemsGiven++);
  }

  if (startingItems.shipTickets && startingItems.shipTickets > 0) {
    const shipTokens = GameUtil.takeShipTokens(startingItems.shipTickets);
    positionItemOnInvestigatorSheet(investigatorSheet, shipTokens, itemsGiven++);
  }

  if (extras && extras.strength && extras.strength > 0) {
    const improvementTokens = Util.createCard(
      strengthToken.getPosition().add(new Vector(0, 0, 2)),
      strengthToken.getTemplateId()
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
      willToken.getPosition().add(new Vector(0, 0, 2)),
      willToken.getTemplateId()
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

  if (extras && extras.eldritchTokens && extras.eldritchTokens > 0) {
    const eldritchTokens = GameUtil.takeEldritchTokens(extras.eldritchTokens);
    if (eldritchTokens === undefined) {
      console.error(`Unable to find Eldritch token`);
      return;
    }

    positionItemOnInvestigatorSheet(investigatorSheet, eldritchTokens, itemsGiven++);
  }

  if (extras && extras.monster && extras.monster.length > 0) {
    const monsterToken = GameUtil.takeMonster(extras.monster);
    if (monsterToken === undefined) {
      console.error(`Unable to find ${extras.monster} Monster`);
      return;
    }

    positionItemOnInvestigatorSheet(investigatorSheet, monsterToken, itemsGiven++);
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
      .subtract(new Vector(0.6, 0, 0)) // removes the added UI height
      .add(new Vector(-0.5, 0.5, 0)) // margin
      .add(itemSize)
      .add(new Vector(-offset, offset, 1 + offset / 5)),
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
 *
 * @param {Card} investigatorSheet
 * @param {Investigator} foundInvestigator
 */
function getStartingLocation(investigatorSheet, foundInvestigator) {
  const fallbackLocation = investigatorSheet.getPosition();

  if (foundInvestigator.startingLocation === undefined) {
    return fallbackLocation;
  }
  const snapPointLocation = getSnapPointForStartingLocation(foundInvestigator.startingLocation);
  if (snapPointLocation === undefined) {
    return fallbackLocation;
  }

  return snapPointLocation;
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
