const {
  world,
  Card,
  UIElement,
  Button,
  refCard,
  Vector,
  Rotator,
  MultistateObject,
} = require("@tabletop-playground/api");
const {
  assetDeck,
  spellDeck,
  conditionDeck,
  cluePool,
  gameBoardLocations,
} = require("./world-constants");
const { investigators } = require("./investigators");
const { takeCardNameFromStack, takeRandomCardFromStack } = require("./util");

if (!world.__eldritchHorror.alreadyLoaded.includes(refCard.getTemplateId())) {
  world.__eldritchHorror.investigators.push(...investigators);
  world.__eldritchHorror.alreadyLoaded.push(refCard.getTemplateId());
}

refCard.onRemoved.add((stack, removedInvestigator) => {
  drawSetupButton(removedInvestigator);

  // if the source stack only have 1 card left we also need to draw the UI on that card
  if (stack.getStackSize() === 1) {
    drawSetupButton(stack);
  }
});

/** @param {Card} investigatorSheet */
function setupInvestigator(investigatorSheet) {
  const investigatorName = investigatorSheet.getCardDetails().name;
  const foundInvestigator = world.__eldritchHorror.investigators.find(
    (investigator) => investigator.name === investigatorName
  );
  if (foundInvestigator) {
    getStartingItems(investigatorSheet, foundInvestigator.startingItems);
    getHealthToken(investigatorSheet, foundInvestigator.health);
    getSanityToken(investigatorSheet, foundInvestigator.sanity);
    getPawn(
      foundInvestigator.pawnTemplateId,
      foundInvestigator.startingLocation
    );
  }
}

/**
 * @param {Card} investigatorSheet
 */
function drawSetupButton(investigatorSheet) {
  const sheetSize = investigatorSheet.getExtent(false);
  let ui = new UIElement();
  ui.position = new Vector(sheetSize.x + 0.63, sheetSize.y / 2, 0);
  ui.rotation = new Rotator(180, 180, 0);
  ui.scale = 0.1;
  let setupButton = new Button().setText("Setup").setFontSize(64);
  setupButton.onClicked.add(() => {
    setupInvestigator(investigatorSheet);
    investigatorSheet.removeUIElement(ui);
  });
  investigatorSheet.onInserted.add(() => investigatorSheet.removeUIElement(ui));
  ui.widget = setupButton;
  investigatorSheet.addUI(ui);
}

/**
 * @param {Card} investigatorSheet
 * @param {Investigator["startingItems"]} startingItems
 */
function getStartingItems(investigatorSheet, startingItems) {
  let itemsGiven = 0;

  if (startingItems.assets && startingItems.assets.length > 0) {
    startingItems.assets.forEach((asset) => {
      var takenAsset = takeCardNameFromStack(assetDeck, asset);
      if (takenAsset === undefined) {
        return;
      }

      takenAsset.setRotation(new Rotator(0, 0, 180), 0); // flip it
      positionItemOnInvestigatorSheet(
        investigatorSheet,
        takenAsset,
        itemsGiven++
      );
    });
  }

  if (startingItems.spells && startingItems.spells.length > 0) {
    startingItems.spells.forEach((spell) => {
      const spellCard = takeCardNameFromStack(spellDeck, spell);
      if (spellCard === undefined) {
        return;
      }

      positionItemOnInvestigatorSheet(
        investigatorSheet,
        spellCard,
        itemsGiven++
      );
    });
  }

  if (startingItems.conditions && startingItems.conditions.length > 0) {
    startingItems.conditions.forEach((condition) => {
      const conditionCard = takeCardNameFromStack(conditionDeck, condition);
      if (conditionCard === undefined) {
        return;
      }

      positionItemOnInvestigatorSheet(
        investigatorSheet,
        conditionCard,
        itemsGiven++
      );
    });
  }

  if (startingItems.clues && startingItems.clues > 0) {
    const clueToken = takeRandomCardFromStack(cluePool);
    if (clueToken === undefined) {
      return;
    }

    positionItemOnInvestigatorSheet(investigatorSheet, clueToken, itemsGiven++);
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
 * @param {keyof GameBoardLocations["space"]} startingLocation
 */
function getPawn(pawnTemplateId, startingLocation) {
  const startingLocationSnapPoint = gameBoardLocations.space[startingLocation];
  world.createObjectFromTemplate(
    pawnTemplateId,
    startingLocationSnapPoint.getGlobalPosition()
  );
}

/**
 * @param {Card} investigatorSheet
 * @param {number} health
 */
function getHealthToken(investigatorSheet, health) {
  const healthTemplateId = "346911D24251ACB6B7FEF0A14B49B614";
  const healthSnapPoint = investigatorSheet.getSnapPoint(0);
  /** @type MultistateObject */
  // @ts-ignore
  const healthToken = world.createObjectFromTemplate(
    healthTemplateId,
    healthSnapPoint.getGlobalPosition()
  );
  healthToken.setState(health - 1);
}

/**
 * @param {Card} investigatorSheet
 * @param {number} sanity
 */
function getSanityToken(investigatorSheet, sanity) {
  const sanityTemplateId = "CD0FA9DC41E13E96DC743A8A30C2DD75";
  const sanitySnapPoint = investigatorSheet.getSnapPoint(1);
  /** @type MultistateObject */
  // @ts-ignore
  const sanityToken = world.createObjectFromTemplate(
    sanityTemplateId,
    sanitySnapPoint.getGlobalPosition()
  );
  sanityToken.setState(sanity - 1);
}
