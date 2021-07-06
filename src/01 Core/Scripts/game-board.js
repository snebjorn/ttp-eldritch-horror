const { refObject, UIElement, Button, Vector } = require("@tabletop-playground/api");
const { Util } = require("./util");
const { assetDeck, conditionDeck, gameBoardLocations } = require("./world-constants");

const gameBoard = refObject;
drawRestockButtons();
drawDebtButton();

function drawRestockButtons() {
  for (const reserveSnapPoint of gameBoardLocations.reserve) {
    let ui = new UIElement();
    ui.position = reserveSnapPoint
      .getLocalPosition()
      // raise the ui ever so slightly, else the ui will flicker as you rotate the camera
      .add(new Vector(0, 0, 0.001));
    ui.scale = 0.12;
    let restockButton = new Button().setText("Restock").setFontSize(64);
    restockButton.onClicked.add(() => {
      const drawnAssetCard = assetDeck.takeCards(1);
      Util.flip(drawnAssetCard);
      Util.setPositionAtSnapPoint(drawnAssetCard, reserveSnapPoint);
    });
    ui.widget = restockButton;
    gameBoard.addUI(ui);
  }
}

function drawDebtButton() {
  let ui = new UIElement();
  ui.position = gameBoardLocations.bankLoan
    .getLocalPosition()
    // raise the ui ever so slightly, else the ui will flicker as you rotate the camera
    .add(new Vector(5.2, 0, 0.001));
  ui.scale = 0.1;
  let drawDebtButton = new Button().setText("Draw Debt").setFontSize(64);
  drawDebtButton.onClicked.add(() => {
    const drawnAssetCard = Util.takeCardNameFromStack(conditionDeck, "Debt");
    if (drawnAssetCard === undefined) {
      return;
    }

    Util.setPositionAtSnapPoint(drawnAssetCard, gameBoardLocations.bankLoan);
  });
  ui.widget = drawDebtButton;
  gameBoard.addUI(ui);
}
