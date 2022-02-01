const {
  world,
  Card,
  UIElement,
  Button,
  refCard,
  Vector,
  Rotator,
} = require("@tabletop-playground/api");
const { GameUtil } = require("./game-util");
const { setupInvestigator } = require("./setup-investigator");
const { tableLocations } = require("./world-constants");

// on reload we need to repopulate the metadata about the investigators
// this can refactored to use the new CardDetails.metadata but the data would have to be converted into stringified json - a not so nice format :(
if (!world.__eldritchHorror.alreadyLoaded.includes(refCard.getTemplateId())) {
  const { investigators01 } = require("./01 Core/investigators");
  world.__eldritchHorror.investigators.push(...investigators01);
  world.__eldritchHorror.alreadyLoaded.push(refCard.getTemplateId());

  for (const expansion of GameUtil.getSavedData().sets) {
    if (expansion === "eh03") {
      const { investigators03 } = require("./03 Mountains of Madness/investigators");
      world.__eldritchHorror.investigators.push(...investigators03);
    }
    if (expansion === "eh04") {
      const { investigators04 } = require("./04 Strange Remnants/investigators");
      world.__eldritchHorror.investigators.push(...investigators04);
    }
    if (expansion === "eh05") {
      const { investigators05 } = require("./05 Under the Pyramids/investigators");
      world.__eldritchHorror.investigators.push(...investigators05);
    }
    if (expansion === "eh06") {
      const { investigators06 } = require("./06 Signs of Carcosa/investigators");
      world.__eldritchHorror.investigators.push(...investigators06);
    }
    if (expansion === "eh07") {
      const { investigators07 } = require("./07 The Dreamlands/investigators");
      world.__eldritchHorror.investigators.push(...investigators07);
    }
    if (expansion === "eh08") {
      const { investigators08 } = require("./08 Cities in Ruin/investigators");
      world.__eldritchHorror.investigators.push(...investigators08);
    }
    if (expansion === "eh09") {
      const { investigators09 } = require("./09 Masks of Nyarlathotep/investigators");
      world.__eldritchHorror.investigators.push(...investigators09);
    }
  }
}

refCard.onRemoved.add((stack, removedInvestigator) => {
  drawSetupButton(removedInvestigator);

  // if the source stack only have 1 card left we also need to draw the UI on that card
  if (stack.getStackSize() === 1) {
    drawSetupButton(stack);
  }
});

/**
 * @param {Card} investigatorSheet
 */
function drawSetupButton(investigatorSheet) {
  const sheetSize = investigatorSheet.getExtent(false);
  const ui = new UIElement();
  ui.position = new Vector(sheetSize.x + 0.63, sheetSize.y / 2, 0);
  ui.rotation = new Rotator(180, 180, 0);
  ui.scale = 0.1;
  const setupButton = new Button().setText("Setup").setFontSize(64);
  setupButton.onClicked.add((_btn, player) => {
    setupInvestigator(investigatorSheet, player);
    investigatorSheet.removeUIElement(ui);
  });

  const ancientOneSnap = tableLocations.ancientOne;
  if (ancientOneSnap) {
    if (ancientOneSnap.getSnappedObject(2) === undefined) {
      setupButton.setEnabled(false);

      investigatorSheet.onTick.add(() => {
        const isOccupied = ancientOneSnap.getSnappedObject(2) !== undefined;
        if (isOccupied) {
          setupButton.setEnabled(true);
          investigatorSheet.onTick.clear();
        }
      });
    }
  }

  investigatorSheet.onInserted.add(() => investigatorSheet.removeUIElement(ui));
  ui.widget = setupButton;
  investigatorSheet.addUI(ui);
}
