const { world } = require("@tabletop-playground/api");
const { Card } = require("@tabletop-playground/api");
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
} = require("./world-constants");

/** @type string[] */
let alreadyLoaded = [];

/**
 * @param  {...string} expansions
 */
function loadExpansion(...expansions) {
  for (const expansion of expansions) {
    if (alreadyLoaded.includes(expansion)) {
      console.warn(`${expansion} is already loaded!`);
    } else {
      let isLoaded = createAssets(expansion);
      if (isLoaded) {
        alreadyLoaded.push(expansion);
      }
    }
  }

  return alreadyLoaded;
}
exports.loadExpansion = loadExpansion;

/**
 * @param {string} expansion
 */
function createAssets(expansion) {
  switch (expansion) {
    case "eh02":
      const {
        expansionItems,
        ancientOneSheets,
        expandedAncientOnes,
      } = require("./eh02");

      addAncientOneSheets(ancientOneSheets);
      expandAncientOnes(expandedAncientOnes);
      addEncounterCards(expansionItems.encounterCards);
      addMythosCards(expansionItems.mythosCards);
      addExpansionCardsToDeck(monsterCup, expansionItems.monsters);
      addExpansionCardsToDeck(epicMonsterCup, expansionItems.epicMonsters);
      addExpansionCardsToDeck(artifactDeck, expansionItems.artifactCards);
      addExpansionCardsToDeck(assetDeck, expansionItems.assetCards);
      addExpansionCardsToDeck(conditionDeck, expansionItems.conditionCards);
      addExpansionCardsToDeck(spellDeck, expansionItems.spellCards);

      return true;
    default:
      return false;
  }
}

/**
 * @param {Card[]} ancientOneSheets
 */
function addAncientOneSheets(ancientOneSheets) {
  ancientContainer.insert(ancientOneSheets, 0, false);
}

/**
 * @param {Expansion.AncientOne[]} expandedAncientOnes
 */
function expandAncientOnes(expandedAncientOnes) {
  for (const ancientOne of expandedAncientOnes) {
    const ancientOneToExpand = world.__eldritchHorror.ancientOnes.find((x) => {
      return x.name === ancientOne.name;
    });
    if (ancientOneToExpand) {
      if (ancientOne.mysteryTemplateId) {
        ancientOneToExpand.mysteryTemplateIds.push(
          ancientOne.mysteryTemplateId
        );
      }
      if (ancientOne.researchTemplateId) {
        ancientOneToExpand.researchTemplateIds.push(
          ancientOne.researchTemplateId
        );
      }
      if (ancientOne.specialTemplateIds) {
        for (const [specialName, templateId] of Object.entries(
          ancientOne.specialTemplateIds
        )) {
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
 * @param {EncounterCards} encounterExpansions
 */
function addEncounterCards(encounterExpansions) {
  /** @type [keyof EncounterCards, Card][] */
  // @ts-ignore
  let expansionEntries = Object.entries(encounterExpansions);
  for (const [encounter, cards] of expansionEntries) {
    addExpansionCardsToDeck(encounterDecks[encounter], cards);
  }
}

/**
 * @param {Expansion.MythosCards} mythosExpansions
 */
function addMythosCards(mythosExpansions) {
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
 * @param {Card} cards
 */
function addExpansionCardsToDeck(deck, cards) {
  const showAnimation = false;
  const toFront = true;
  deck.addCards(cards, toFront, 0, showAnimation);
}
