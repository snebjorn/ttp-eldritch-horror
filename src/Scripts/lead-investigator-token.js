const {
  Card,
  UIElement,
  Text,
  world,
  Vector,
  refCard,
  TextJustification,
} = require("@tabletop-playground/api");
const { GameUtil } = require("./game-util");
const { Util } = require("./util");

/**
 * @param {string} name
 */
function formatName(name) {
  if (name.length > 13) {
    const splitIndex = name.lastIndexOf(" ");
    const givenName = name.substring(0, splitIndex);
    const surname = name.substring(splitIndex + 1);

    return `${givenName}\n${surname}`;
  }

  return name;
}

const extend = refCard.getExtent(false);

const ui = new UIElement();
const textUi = new Text()
  .setBold(true)
  .setFontSize(20)
  .setJustification(TextJustification.Center)
  .setText(formatName(GameUtil.getSavedData().leadInvestigator || ""));
ui.widget = textUi;
ui.position = new Vector(0, 0, extend.z + 0.02);
ui.scale = 0.2;
refCard.addUI(ui);

refCard.onMovementStopped.add((token) => {
  const foundObjects = world.boxOverlap(token.getPosition(), new Vector(6, 6, 2));
  const investigators = foundObjects.filter(
    (x) => x.getTemplateName() === "Investigators" && x instanceof Card && x.getStackSize() === 1
  );
  const tokenPosition = token.getPosition();
  const sortedInvestigators = investigators.sort(
    (a, b) => tokenPosition.distance(a.getPosition()) - tokenPosition.distance(b.getPosition())
  );
  const closestInvestigator = sortedInvestigators[0];
  if (closestInvestigator instanceof Card) {
    const investigatorName = closestInvestigator.getCardDetails().name;
    GameUtil.updateSavedData({ leadInvestigator: investigatorName });
    textUi.setText(formatName(investigatorName));

    Util.logScriptAction(`${investigatorName} is now the Lead Investigator!`);

    const owningPlayer = closestInvestigator.getOwningPlayer();
    if (owningPlayer) {
      owningPlayer.showMessage("You're now the Lead Investigator!");
    }
  } else {
    GameUtil.updateSavedData({ leadInvestigator: undefined });
    textUi.setText("");
  }

  refCard.updateUI(ui);

  world.__eldritchHorror.updateSetupUIFn?.();
});
