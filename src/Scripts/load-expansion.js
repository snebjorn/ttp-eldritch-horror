const { SnapPoint, Card, world, Vector } = require("@tabletop-playground/api");
const { Util } = require("./util");
const {
  encounterDecks,
  monsterCup,
  epicMonsterCup,
  artifactDeck,
  getAssetDeck,
  conditionDeck,
  spellDeck,
  mythosSetupDecks,
  ancientContainer,
  investigatorDeck,
  getGateStack,
  expansionSpawn,
  tableLocations,
} = require("./world-constants");

/** @type string[] */
const alreadyLoaded = [];

/**
 * @param {string[]} expansions - the selected expansions
 * @param {{ isFocus: boolean; isResource: boolean; isPersonalStory: boolean }} mechanics
 */
function loadExpansion(expansions, mechanics) {
  // sort so expansions are loaded in order
  expansions.sort();

  if (mechanics.isFocus) {
    addFocusTokens();
  }
  if (mechanics.isResource) {
    addResourceTokens();
  }
  if (mechanics.isPersonalStory) {
    addPersonalStories();
  }

  for (const expansion of expansions) {
    if (alreadyLoaded.includes(expansion)) {
      console.warn(`${expansion} is already loaded!`);
    } else {
      let expansionItems = loadScript(expansion);
      if (!expansionItems) {
        continue;
      } else if (typeof expansionItems === "function") {
        expansionItems = expansionItems(expansions);
      }

      if (!mechanics.isPersonalStory) {
        delete expansionItems.personalStories;
      }

      createAssets(expansionItems);
      alreadyLoaded.push(expansion);
    }
  }
}
exports.loadExpansion = loadExpansion;

/**
 * @param {string} expansion
 * @returns {Expansion.Items | ((expansions: string[]) => Expansion.Items) | undefined}
 */
function loadScript(expansion) {
  switch (expansion) {
    case "eh02": {
      const { expansionItems, expandedAncientOnes } = require("./02 Forsaken Lore/eh02");
      expandAncientOnes(expandedAncientOnes);

      return expansionItems;
    }
    case "eh03": {
      const { expansionItems } = require("./03 Mountains of Madness/eh03");

      return expansionItems;
    }
    case "eh04": {
      const { expansionItems } = require("./04 Strange Remnants/eh04");

      return expansionItems;
    }
    case "eh05": {
      const { expansionItems } = require("./05 Under the Pyramids/eh05");

      return expansionItems;
    }
    case "eh06": {
      const { expansionItems } = require("./06 Signs of Carcosa/eh06");

      return expansionItems;
    }
    case "eh07": {
      const { expansionItems } = require("./07 The Dreamlands/eh07");

      return expansionItems;
    }
    case "eh08": {
      const { expansionItems } = require("./08 Cities in Ruin/eh08");

      return expansionItems;
    }
    case "eh09": {
      const { expansionItems } = require("./09 Masks of Nyarlathotep/eh09");

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
  addExpansionCardsToDeck(getGateStack(), expansionItems.gates);
  addExpansionCardsToDeck(monsterCup, expansionItems.monsters);
  addExpansionCardsToDeck(epicMonsterCup, expansionItems.epicMonsters);
  addExpansionCardsToDeck(artifactDeck, expansionItems.artifactCards);
  addExpansionCardsToDeck(getAssetDeck(), expansionItems.assetCards);
  addExpansionCardsToDeck(conditionDeck, expansionItems.conditionCards);
  addExpansionCardsToDeck(spellDeck, expansionItems.spellCards);
  addExpansionCardsToDeck(investigatorDeck, expansionItems.investigators);
  addExpansionCardsToExpansionDeck(
    "unique-asset-deck",
    "Unique Assets",
    `Unique Assets are double-sided cards. An investigator cannot look at the back of Unique Assets unless an effect allows him to.
- Unique Assets are possessions and may be traded using the Trade action. There is no limit to the number of Unique Assets an investigator can have.
- “Asset” refers to both Assets and Unique Assets. “Non-Unique Asset” refers to Assets but not Unique Assets.
- When a Unique Asset is discarded, also discard all tokens on it.
- If an effect says, “gain 1 random Asset from the deck,” the investigator gains the Asset from the Asset deck, not the Unique Asset deck. An investigator gains a Unique Asset only if the effect specifically calls for a Unique Asset.`,
    expansionItems.uniqueAssetCards,
    tableLocations.uniqueAssets,
    true,
    "double-sided-deck.js"
  );
  addExpansionCardsToExpansionDeck(
    "prelude-deck",
    "Preludes",
    "",
    expansionItems.preludeCards,
    tableLocations.preludes
  );
  if (expansionItems.personalStories) {
    addExpansionCardsToDeck(
      Util.getCardObjectById("personal-mission-deck"),
      Util.createCard(expansionSpawn, expansionItems.personalStories.missions)
    );
    addExpansionCardsToDeck(
      Util.getCardObjectById("personal-reward-deck"),
      Util.createCard(expansionSpawn, expansionItems.personalStories.rewards)
    );
    addExpansionCardsToDeck(
      Util.getCardObjectById("personal-consequence-deck"),
      Util.createCard(expansionSpawn, expansionItems.personalStories.consequences)
    );
  }
  if (expansionItems.preludeCards) {
    addPreludeCardHolder();
  }
  if (expansionItems.focus === true) {
    addFocusTokens();
  }
  if (expansionItems.impairment === true) {
    addImpairmentTokens();
  }
  if (expansionItems.resource === true) {
    addResourceTokens();
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
    const ancientOneToExpand = world.__eldritchHorror.ancientOnes.get(ancientOne.name);
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
    const encounterDeck = encounterDecks[encounter];
    addExpansionCardsToDeck(encounterDeck, cards);
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

  Util.addCardsSafe(deck, cards);
}

/**
 * @param {string} deckId
 * @param {string} deckName
 * @param {string} deckDescription
 * @param {Card | undefined} cards
 * @param {SnapPoint | Vector} [position]
 * @param {boolean} flip
 * @param {string} [scriptName]
 */
function addExpansionCardsToExpansionDeck(
  deckId,
  deckName,
  deckDescription,
  cards,
  position,
  flip = false,
  scriptName
) {
  if (!cards) {
    return;
  }
  if (flip) {
    Util.flip(cards);
  }

  Util.addToOrCreateStack(cards, deckId, deckName, deckDescription, position, scriptName);
}

function addFocusTokens() {
  if (world.getObjectById("focus-token")) {
    return; // abort - focus is already loaded
  }

  const focusToken = Util.createCard(expansionSpawn, "414DCAD946F6CCB38C7D8BB8F8838008");
  const focusStack = Util.convertToInfiniteStack(focusToken);
  focusStack.setId("focus-token");
  focusStack.setName("Focus Token");
  focusStack.setDescription(`As an action, an investigator on any space gains one Focus token.
- An investigator may spend one Focus token to reroll one die when resolving a test. There is no limit to the number of Focus tokens he can spend to reroll dice.
- An investigator cannot have more than two Focus tokens.`);

  if (!tableLocations.focus) {
    throw new Error("Cannot find position for focus token");
  }

  Util.moveObject(focusStack, tableLocations.focus);
}

function addResourceTokens() {
  if (world.getObjectById("resource-token")) {
    return; // abort - resource is already loaded
  }

  const resourceToken = Util.createCard(expansionSpawn, "6B38AFF1442360922B6DCBBEFA072DAE");
  const resourceStack = Util.convertToInfiniteStack(resourceToken);
  resourceStack.setId("resource-token");
  resourceStack.setName("Resource Token");
  resourceStack.setDescription(`As an action on any space, you gain one Resource token.
- As part of a Rest action, you may spend any number of Resources to recover 1 additional Health or 1 additional Sanity for each Resource spent.
- As part of an Acquire Assets action, you may spend any number of Resources to add 1 success to your test result for each Resource spent.
- Resources are possessions and may be traded using the Trade action. You cannot have more than two Resources.`);

  if (!tableLocations.resource) {
    throw new Error("Cannot find position for resource token");
  }

  Util.moveObject(resourceStack, tableLocations.resource);
}

function addImpairmentTokens() {
  if (world.getObjectsByTemplateId("682F0E47464E6B57ECD299908D2C1035").length > 0) {
    return; // abort - impairment tokens are already loaded
  }

  const impairmentStack = Util.createCard(expansionSpawn, "682F0E47464E6B57ECD299908D2C1035");

  /**
   * @param {string} name
   * @param {SnapPoint} [snapPoint]
   */
  function setupImpairmentToken(name, snapPoint) {
    const impairmentToken = Util.takeCardNameFromStack(impairmentStack, name);
    if (impairmentToken) {
      const infiniteStack = Util.convertToInfiniteStack(impairmentToken);
      infiniteStack.setId(`impair-${name}-token`);
      const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
      infiniteStack.setName(`Impair ${capitalizedName}`);
      if (!snapPoint) {
        throw new Error(`Cannot find snap point for ${name} impairment token`);
      }
      Util.moveObject(infiniteStack, snapPoint);
    }
  }

  setupImpairmentToken("lore", tableLocations.impairment.lore);
  setupImpairmentToken("influence", tableLocations.impairment.influence);
  setupImpairmentToken("observation", tableLocations.impairment.observation);
  setupImpairmentToken("will", tableLocations.impairment.will);
  setupImpairmentToken("strength", tableLocations.impairment.strength);
}

function addPreludeCardHolder() {
  if (world.getObjectById("prelude-card-holder")) {
    return; // abort - card holder is already loaded
  }

  const cardHolder = Util.createCardHolder(
    "1B65237440585C62CF5B7F96F660E75A",
    tableLocations.preludeCardHolder
  );

  cardHolder.setName("Active Prelude");
  cardHolder.setId("prelude-card-holder");
  cardHolder.snapToGround();
  cardHolder.toggleLock();
  cardHolder.setScript("prelude-card-holder.js", "8A0B748B4DA2CE04CB79E4A02C7FD720");
}

function addPersonalStories() {
  if (world.getObjectById("personal-mission-deck")) {
    return; // abort - personal stories are already loaded
  }

  const investigatorDeck = world.getObjectById("investigator-deck");
  if (!investigatorDeck) {
    throw new Error('Unable to find "investigator-deck"');
  }

  const topCenter = investigatorDeck
    .getPosition()
    .add(new Vector(investigatorDeck.getExtent(true).x, 0, 0))
    // spacing
    .add(new Vector(0.5, 0, 0))
    // ½ height of personal story cards
    .add(new Vector(3.15, 0, 0));

  const personalMissions = Util.createCard(topCenter, "5AA0264443FAD6BA1A8015B49EC54E45");
  personalMissions.setId("personal-mission-deck");
  personalMissions.setName("Personal Missions");
  Util.flip(personalMissions);

  if (world.getObjectById("personal-reward-deck")) {
    return; // abort - personal stories are already loaded
  }

  const topRight = topCenter
    // spacing
    .add(new Vector(0, 0.5, 0))
    // width of personal story cards
    .add(new Vector(0, 4, 0));

  const personalRewards = Util.createCard(topRight, "D5C6DBE24E3409D4C9E87D9FA8F0C5AD");
  personalRewards.setId("personal-reward-deck");
  personalRewards.setName("Personal Rewards");
  Util.flip(personalRewards);

  if (world.getObjectById("personal-consequence-deck")) {
    return; // abort - personal stories are already loaded
  }

  const topLeft = topCenter
    // spacing
    .subtract(new Vector(0, 0.5, 0))
    // width of personal story cards
    .subtract(new Vector(0, 4, 0));

  const personalConsequences = Util.createCard(topLeft, "DA9D39E94D7179ACB513869A4730D3E5");
  personalConsequences.setId("personal-consequence-deck");
  personalConsequences.setName("Personal Consequences");
  Util.flip(personalConsequences);
}
