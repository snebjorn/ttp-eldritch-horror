const {
  world,
  Card,
  UIElement,
  Button,
  refCard,
  Vector,
  Rotator,
} = require("@tabletop-playground/api");
const { investigators } = require("./investigators");
const { setupInvestigator } = require("./setup-investigator");

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
  setupButton.onClicked.add(() => {
    setupInvestigator(investigatorSheet);
    investigatorSheet.removeUIElement(ui);
  });
  investigatorSheet.onInserted.add(() => investigatorSheet.removeUIElement(ui));
  ui.widget = setupButton;
  investigatorSheet.addUI(ui);
}
