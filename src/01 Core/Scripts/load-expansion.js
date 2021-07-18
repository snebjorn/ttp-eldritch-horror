const { SnapPoint, Card, world, Vector } = require("@tabletop-playground/api");
const { Util } = require("./util");
const {
  encounterDecks,
  monsterCup,
  epicMonsterCup,
  artifactDeck,
  assetDeck,
  conditionDeck,
  spellDeck,
  mythosSetupDecks,
  ancientContainer,
  investigatorDeck,
  gateStack,
  expansionSpawn,
  tableLocations,
} = require("./world-constants");

/** @type string[] */
let alreadyLoaded = [];

/**
 * @param  {...string} expansions
 */
function loadExpansion(...expansions) {
  // sort so expansions are loaded in order
  expansions.sort();

  for (const expansion of expansions) {
    if (alreadyLoaded.includes(expansion)) {
      console.warn(`${expansion} is already loaded!`);
    } else {
      const expansionItems = loadScript(expansion);
      if (!expansionItems) {
        continue;
      }

      createAssets(expansionItems);
      alreadyLoaded.push(expansion);
    }
  }

  return alreadyLoaded;
}
exports.loadExpansion = loadExpansion;

/**
 * @param {string} expansion
 */
function loadScript(expansion) {
  switch (expansion) {
    case "eh02": {
      // @ts-ignore
      const { expansionItems, expandedAncientOnes } = require("./eh02");
      expandAncientOnes(expandedAncientOnes);

      return expansionItems;
    }
    case "eh03": {
      // @ts-ignore
      const { expansionItems } = require("./eh03");

      return expansionItems;
    }
  }
}

/**
 * @param {Expansion.Items} expansionItems
 */
function createAssets(expansionItems) {
  addAncientOneSheets(expansionItems.ancientOneSheets);
  addEncounterCards(expansionItems.encounterCards);
  addMythosCards(expansionItems.mythosCards);
  addExpansionCardsToDeck(gateStack, expansionItems.gates);
  addExpansionCardsToDeck(monsterCup, expansionItems.monsters);
  addExpansionCardsToDeck(epicMonsterCup, expansionItems.epicMonsters);
  addExpansionCardsToDeck(artifactDeck, expansionItems.artifactCards);
  addExpansionCardsToDeck(assetDeck, expansionItems.assetCards);
  addExpansionCardsToDeck(conditionDeck, expansionItems.conditionCards);
  addExpansionCardsToDeck(spellDeck, expansionItems.spellCards);
  addExpansionCardsToDeck(investigatorDeck, expansionItems.investigators);
  addExpansionCardsToExpansionDeck(
    "unique-asset-deck",
    expansionItems.uniqueAssetCards,
    tableLocations.uniqueAssets,
    true
  );
  addExpansionCardsToExpansionDeck(
    "prelude-deck",
    expansionItems.preludeCards,
    tableLocations.preludes
  );
  if (expansionItems.focus === true) {
    addFocus();
  }
}

/**
 * @param {Card[] | undefined} ancientOneSheets
 */
function addAncientOneSheets(ancientOneSheets) {
  if (!ancientOneSheets) {
    return;
  }

  ancientContainer.insert(ancientOneSheets, 0, false);
}

/**
 * @param {Expansion.AncientOne[] | undefined} expandedAncientOnes
 */
function expandAncientOnes(expandedAncientOnes) {
  if (!expandedAncientOnes) {
    return;
  }

  for (const ancientOne of expandedAncientOnes) {
    const ancientOneToExpand = world.__eldritchHorror.ancientOnes.find((x) => {
      return x.name === ancientOne.name;
    });
    if (ancientOneToExpand) {
      if (ancientOne.mysteryTemplateId) {
        ancientOneToExpand.mysteryTemplateIds.push(ancientOne.mysteryTemplateId);
      }
      if (ancientOne.researchTemplateId) {
        ancientOneToExpand.researchTemplateIds.push(ancientOne.researchTemplateId);
      }
      if (ancientOne.specialTemplateIds) {
        for (const [specialName, templateId] of Object.entries(ancientOne.specialTemplateIds)) {
          if (!ancientOneToExpand.specialTemplateIds) {
            ancientOneToExpand.specialTemplateIds = {};
          }
          if (ancientOneToExpand.specialTemplateIds[specialName]) {
            ancientOneToExpand.specialTemplateIds[specialName].push(templateId);
          } else {
            ancientOneToExpand.specialTemplateIds[specialName] = [templateId];
          }
        }
      }
    }
  }
}

/**
 * @param {Partial<EncounterCards> | undefined} encounterExpansions
 */
function addEncounterCards(encounterExpansions) {
  if (!encounterExpansions) {
    return;
  }

  /** @type [keyof EncounterCards, Card][] */
  // @ts-ignore
  let expansionEntries = Object.entries(encounterExpansions);
  for (const [encounter, cards] of expansionEntries) {
    addExpansionCardsToDeck(encounterDecks[encounter], cards);
  }
}

/**
 * @param {Partial<Expansion.MythosCards> | undefined} mythosExpansions
 */
function addMythosCards(mythosExpansions) {
  if (!mythosExpansions) {
    return;
  }

  /** @type [keyof Expansion.MythosCards, Partial<MythosCardDifficult>][] */
  // @ts-ignore
  let expansionEntries = Object.entries(mythosExpansions);
  for (const [color, difficulties] of expansionEntries) {
    /** @type [keyof MythosCardDifficult, Card][] */
    // @ts-ignore
    let difficultyEntries = Object.entries(difficulties);
    for (const [difficulty, cards] of difficultyEntries) {
      addExpansionCardsToDeck(mythosSetupDecks[color][difficulty], cards);
    }
  }
}

/**
 * @param {Card} deck
 * @param {Card | undefined} cards
 */
function addExpansionCardsToDeck(deck, cards) {
  if (!cards) {
    return;
  }

  const showAnimation = false;
  const toFront = true;
  deck.addCards(cards, toFront, 0, showAnimation);
}

/**
 * @param {string} deckId
 * @param {Card | undefined} cards
 * @param {SnapPoint | Vector} [position]
 * @param {boolean} flip
 */
function addExpansionCardsToExpansionDeck(deckId, cards, position, flip = false) {
  if (!cards) {
    return;
  }
  if (flip) {
    Util.flip(cards);
  }

  Util.addToStack(cards, deckId, position);
}

function addFocus() {
  if (world.__eldritchHorror.alreadyLoaded.includes("focus")) {
    return; // abort - focus is already loaded
  }

  const focusStack = Util.createCard("414DCAD946F6CCB38C7D8BB8F8838008", expansionSpawn);
  focusStack.addCards(Util.createCard("414DCAD946F6CCB38C7D8BB8F8838008", expansionSpawn));
  focusStack.setInheritScript(false);
  focusStack.onRemoved.add(Util.addCloneToStack);
  focusStack.onInserted.add(Util.removeInsertedCardFromStack);
  focusStack.setId("focus-token");
  focusStack.setName("Focus Token");

  if (!tableLocations.focus) {
    throw new Error("Cannot find position for focus token");
  }

  Util.setPositionAtSnapPoint(focusStack, tableLocations.focus);

  world.__eldritchHorror.alreadyLoaded.push("focus");
}
