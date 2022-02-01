const { UIElement, Button, refCard, Vector, Rotator } = require("@tabletop-playground/api");
const { setupInvestigator } = require("./setup-investigator");
const { tableLocations } = require("./world-constants");

const sheetSize = refCard.getExtent(false);
const ui = new UIElement();
ui.position = new Vector(sheetSize.x + 0.63, sheetSize.y / 2, 0);
ui.rotation = new Rotator(180, 180, 0);
ui.scale = 0.1;

const setupButton = new Button().setText("Setup").setFontSize(64);
setupButton.onClicked.add((_btn, player) => {
  setupInvestigator(refCard, player);
  refCard.removeUIElement(ui);
  refCard.setScript("");
});

const ancientOneSnap = tableLocations.ancientOne;
if (ancientOneSnap) {
  if (ancientOneSnap.getSnappedObject(2) === undefined) {
    setupButton.setEnabled(false);

    refCard.onTick.add(() => {
      const isOccupied = ancientOneSnap.getSnappedObject(2) !== undefined;
      if (isOccupied) {
        setupButton.setEnabled(true);
        refCard.onTick.clear();
      }
    });
  }
}

refCard.onInserted.add(() => refCard.removeUIElement(ui));
ui.widget = setupButton;
refCard.addUI(ui);
