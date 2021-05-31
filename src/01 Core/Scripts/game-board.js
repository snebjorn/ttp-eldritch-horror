const {
  refObject,
  UIElement,
  Button,
  Rotator,
  Vector,
} = require("@tabletop-playground/api");
const {
  assetDeck,
  conditionDeck,
  gameBoardLocations,
} = require("./world-constants");
const { takeCardNameFromStack } = require("./util");

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
      const reservePosition = reserveSnapPoint.getGlobalPosition();
      drawnAssetCard.setRotation(new Rotator(0, 0, 180), 0); // flip, no animation
      drawnAssetCard.setPosition(reservePosition, 1);
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
    const drawnAssetCard = takeCardNameFromStack(conditionDeck, "Debt");
    if (drawnAssetCard === undefined) {
      return;
    }
    const reservePosition = gameBoardLocations.bankLoan.getGlobalPosition();
    drawnAssetCard.setPosition(reservePosition, 1);
  });
  ui.widget = drawDebtButton;
  gameBoard.addUI(ui);
}
