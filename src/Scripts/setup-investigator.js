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
  investigatorSheet.setOwningPlayerSlot(player.getSlot());
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

  itemsGiven = fetchAssets(investigatorSheet, itemsGiven, startingItems, extras);
  itemsGiven = fetchUniqueAssets(investigatorSheet, itemsGiven, startingItems, extras);
  itemsGiven = fetchSpells(investigatorSheet, itemsGiven, startingItems, extras);
  itemsGiven = fetchConditions(investigatorSheet, itemsGiven, startingItems, extras);

  if (personalStory !== undefined && personalStory.length > 0) {
    const personalMissionDeck = Util.getCardObjectById("personal-mission-deck");
    const personalMission = Util.takeCardNameFromStack(personalMissionDeck, personalStory);
    if (personalMission === undefined) {
      console.error(`Unable to find "${personalStory}" in Personal Mission Deck`);
    } else {
      Util.flip(personalMission);
      positionItemOnInvestigatorSheet(investigatorSheet, personalMission, itemsGiven++);
    }
  }

  if (extras?.randomArtifacts !== undefined && extras.randomArtifacts > 0) {
    for (let i = 0; i < extras.randomArtifacts; i++) {
      const randomArtifact = Util.takeRandomCardsFromStack(artifactDeck);
      if (randomArtifact === undefined) {
        console.error(`Unable to take a random artifact from the Artifact Deck`);
      } else {
        positionItemOnInvestigatorSheet(investigatorSheet, randomArtifact, itemsGiven++);
      }
    }
  }

  const startingClues = startingItems.clues ?? 0;
  const extraClues = extras?.clues ?? 0;
  const clueCount = startingClues + extraClues;
  if (clueCount > 0) {
    const clueToken = GameUtil.takeRandomClueTokens(clueCount);
    if (clueToken === undefined) {
      console.error(`Unable to find a clue in Clue Pool`);
    } else {
      positionItemOnInvestigatorSheet(investigatorSheet, clueToken, itemsGiven++);
    }
  }
  const startingFocus = startingItems.focus ?? 0;
  const extraFocus = extras?.focus ?? 0;
  const focusCount = startingFocus + extraFocus;
  if (focusCount > 0) {
    const focusTokens = GameUtil.takeFocusTokens(focusCount);
    positionItemOnInvestigatorSheet(investigatorSheet, focusTokens, itemsGiven++);
  }

  const startingResources = startingItems.resources ?? 0;
  const extraResources = extras?.resources ?? 0;
  const resourceCount = startingResources + extraResources;
  if (resourceCount > 0) {
    const resourceTokens = GameUtil.takeResourceTokens(resourceCount);
    positionItemOnInvestigatorSheet(investigatorSheet, resourceTokens, itemsGiven++);
  }

  if (startingItems.shipTickets !== undefined && startingItems.shipTickets > 0) {
    const shipTokens = GameUtil.takeShipTokens(startingItems.shipTickets);
    positionItemOnInvestigatorSheet(investigatorSheet, shipTokens, itemsGiven++);
  }

  if (extras?.strength !== undefined && extras.strength > 0) {
    if (extras.strength > 2) {
      // improving skills: An investigator cannot improve a single skill more than twice
      extras.strength = 2;
    }
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

  const startingWill = startingItems.will ?? 0;
  const extraWill = extras?.will ?? 0;
  let willCount = startingWill + extraWill;
  if (willCount > 0) {
    if (willCount > 2) {
      // improving skills: An investigator cannot improve a single skill more than twice
      willCount = 2;
    }
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

  if (extras?.eldritchTokens !== undefined && extras.eldritchTokens > 0) {
    const eldritchTokens = GameUtil.takeEldritchTokens(extras.eldritchTokens);
    if (eldritchTokens === undefined) {
      console.error(`Unable to find Eldritch token`);
    } else {
      positionItemOnInvestigatorSheet(investigatorSheet, eldritchTokens, itemsGiven++);
    }
  }

  if (extras?.monster !== undefined && extras.monster.length > 0) {
    const monsterToken = GameUtil.takeMonster(extras.monster);
    if (monsterToken === undefined) {
      console.error(`Unable to find ${extras.monster} Monster`);
    } else {
      positionItemOnInvestigatorSheet(investigatorSheet, monsterToken, itemsGiven++);
    }
  }

  if (extras?.epicMonster !== undefined && extras.epicMonster.length > 0) {
    const monsterToken = GameUtil.takeEpicMonster(extras.epicMonster);
    if (monsterToken === undefined) {
      console.error(`Unable to find ${extras.epicMonster} Epic Monster`);
    } else {
      positionItemOnInvestigatorSheet(investigatorSheet, monsterToken, itemsGiven++);
    }
  }
}

/**
 * **Gaining a Specific Card**
 *
 * Some effects instruct an investigator to gain a specific card by name (for example, “Gain an Axe Asset”).
 * The investigator searches that card type’s deck then discard pile for the first card matching the
 * specified name and gains that card.
 * - If the named card is in the reserve, the investigator gains that card instead.
 * - If the specified card is not found while searching, he does not gain a card.
 *
 * For instance, if other investigators or defeated investigators possess all copies of the card or
 * all copies of the card have been returned to the game box.
 *
 * @param {Card} investigatorSheet
 * @param {number} itemsGiven
 * @param {Investigator["startingItems"]} startingItems
 * @param {ExtraItems} [extras]
 * @returns {number}
 */
function fetchAssets(investigatorSheet, itemsGiven, startingItems, extras) {
  if (extras && extras.asset) {
    if (startingItems.assets) {
      startingItems.assets.push(extras.asset);
    } else {
      startingItems.assets = [extras.asset];
    }
  }

  if (startingItems.assets !== undefined && startingItems.assets.length > 0) {
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

  if (extras?.randomAssets !== undefined && extras.randomAssets > 0) {
    for (let i = 0; i < extras.randomAssets; i++) {
      const randomAsset = Util.takeRandomCardsFromStack(getAssetDeck());
      if (randomAsset === undefined) {
        console.error(`Unable to take a random asset from the Asset Deck`);
      } else {
        positionItemOnInvestigatorSheet(investigatorSheet, randomAsset, itemsGiven++);
      }
    }
  }

  return itemsGiven;
}

/**
 * From FAQ in EH03 rulebook
 *
 * Q. Can an investigator have multiple copies of the same Unique Asset?
 * A. Yes. There is no limit to the number of Unique Assets an investigator can have.
 *
 * @param {Card} investigatorSheet
 * @param {number} itemsGiven
 * @param {Investigator["startingItems"]} startingItems
 * @param {ExtraItems} [extras]
 * @returns {number}
 */
function fetchUniqueAssets(investigatorSheet, itemsGiven, startingItems, extras) {
  if (startingItems.uniqueAssets !== undefined && startingItems.uniqueAssets.length > 0) {
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

  if (extras?.uniqueAsset !== undefined && extras.uniqueAsset.length > 0) {
    /** @type Card | undefined */
    // @ts-ignore
    const uniqueAssetDeck = world.getObjectById("unique-asset-deck");
    if (!uniqueAssetDeck) {
      console.error("Unable to find Unique Asset Deck");
    } else {
      const takenAsset = Util.takeCardNameFromStack(uniqueAssetDeck, extras.uniqueAsset);
      if (takenAsset === undefined) {
        console.error(`Unable to find "${extras.uniqueAsset}" in Unique Asset Deck`);
      } else {
        positionItemOnInvestigatorSheet(investigatorSheet, takenAsset, itemsGiven++);
      }
    }
  }

  if (extras?.uniqueAssetTrait !== undefined && extras.uniqueAssetTrait.length > 0) {
    /** @type Card | undefined */
    // @ts-ignore
    const uniqueAssetDeck = world.getObjectById("unique-asset-deck");
    if (!uniqueAssetDeck) {
      console.error("Unable to find Unique Asset Deck");
    } else {
      const uniqueAssetWithTrait = GameUtil.takeCardTraitFromStack(uniqueAssetDeck, [
        extras.uniqueAssetTrait,
      ]);
      if (uniqueAssetWithTrait === undefined) {
        console.error(
          `Unable to take a Unique Asset with trait ${extras.uniqueAssetTrait} from the Unique Asset Deck`
        );
      } else {
        positionItemOnInvestigatorSheet(investigatorSheet, uniqueAssetWithTrait, itemsGiven++);
      }
    }
  }

  return itemsGiven;
}

/**
 * **Gaining a Random Card**
 *
 * If an investigator gains a Spell or Condition that he already has, he discards it and draws a replacement,
 * repeating this process until he draws a card he does not already have (if able).
 *
 * **Gaining a Card with a Specific Trait**
 *
 * An investigator that gains a Spell or Condition in this way searches the deck for the first card matching
 * the specified trait he does not already have and gains that card.
 *
 * @param {Card} investigatorSheet
 * @param {number} itemsGiven
 * @param {Investigator["startingItems"]} startingItems
 * @param {ExtraItems} [extras]
 * @returns {number}
 */
function fetchSpells(investigatorSheet, itemsGiven, startingItems, extras) {
  /** @type string[] */
  const givenSpells = [];
  if (startingItems.spells !== undefined && startingItems.spells.length > 0) {
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

  if (extras?.spellTrait !== undefined && extras.spellTrait.length > 0) {
    const spellWithTrait = GameUtil.takeCardTraitFromStack(
      spellDeck,
      [extras.spellTrait],
      1,
      givenSpells
    );
    if (spellWithTrait === undefined) {
      console.error(`Unable to take a spell with trait ${extras.spellTrait} from the Spell Deck`);
    } else {
      givenSpells.push(spellWithTrait.getCardDetails().name);

      positionItemOnInvestigatorSheet(investigatorSheet, spellWithTrait, itemsGiven++);
    }
  }

  if (extras?.randomSpells !== undefined && extras.randomSpells > 0) {
    for (let i = 0; i < extras.randomSpells; i++) {
      const randomSpell = Util.takeRandomCardsFromStack(spellDeck, 1, givenSpells);
      if (randomSpell === undefined) {
        console.error(`Unable to take a random spell from the Spell Deck`);
      } else {
        givenSpells.push(randomSpell.getCardDetails().name);

        positionItemOnInvestigatorSheet(investigatorSheet, randomSpell, itemsGiven++);
      }
    }
  }

  return itemsGiven;
}

/**
 * **Gaining a Specific Card**
 *
 * Some effects instruct an investigator to gain a specific card by name (for example, “Gain an Axe Asset”).
 * The investigator searches that card type’s deck then discard pile for the first card matching the
 * specified name and gains that card.
 * - If the named card is in the reserve, the investigator gains that card instead.
 * - If the specified card is not found while searching, he does not gain a card.
 *
 * For instance, if other investigators or defeated investigators possess all copies of the card or
 * all copies of the card have been returned to the game box.
 *
 * @param {Card} investigatorSheet
 * @param {number} itemsGiven
 * @param {Investigator["startingItems"]} startingItems
 * @param {ExtraItems} [extras]
 * @returns {number}
 */
function fetchConditions(investigatorSheet, itemsGiven, startingItems, extras) {
  /** @type string[] */
  const givenConditions = [];

  if (startingItems.conditions !== undefined && startingItems.conditions.length > 0) {
    startingItems.conditions.forEach((condition) => {
      const conditionCard = Util.takeCardNameFromStack(conditionDeck, condition);
      if (conditionCard === undefined) {
        console.error(`Unable to find "${condition}" in Condition Deck`);
      } else {
        givenConditions.push(conditionCard.getCardDetails().name);

        positionItemOnInvestigatorSheet(investigatorSheet, conditionCard, itemsGiven++);
      }
    });
  }

  if (extras?.condition !== undefined && extras.condition.length > 0) {
    if (
      startingItems.conditions !== undefined &&
      // An investigator cannot have multiple copies of the same Condition.
      // If he would gain a Condition that he already has a copy of, he does not gain another copy of that Condition.
      !givenConditions.includes(extras.condition)
    ) {
      const conditionCard = Util.takeCardNameFromStack(conditionDeck, extras.condition);
      if (conditionCard === undefined) {
        console.error(`Unable to find "${extras.condition}" in Condition Deck`);
      } else {
        givenConditions.push(conditionCard.getCardDetails().name);

        positionItemOnInvestigatorSheet(investigatorSheet, conditionCard, itemsGiven++);
      }
    }
  }

  if (extras?.conditionTrait !== undefined && extras.conditionTrait.length > 0) {
    const conditionWithTrait = GameUtil.takeCardTraitFromStack(
      conditionDeck,
      [extras.conditionTrait],
      1,
      givenConditions
    );
    if (conditionWithTrait === undefined) {
      console.error(
        `Unable to take a condition with trait ${extras.conditionTrait} from the Condition Deck`
      );
    } else {
      givenConditions.push(conditionWithTrait.getCardDetails().name);

      positionItemOnInvestigatorSheet(investigatorSheet, conditionWithTrait, itemsGiven++);
    }
  }

  return itemsGiven;
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
