const { refCard } = require("@tabletop-playground/api");
const { GameUtil } = require("./game-util");
const { Util } = require("./util");

const advanceOmenAction = "Advance the Omen clockwise by one";

refCard.onCustomAction.add((card, player, actionName) => {
  if (actionName === advanceOmenAction) {
    const [currentOmenColor, matchingGateNames] = GameUtil.advanceOmen(1);
    const matchingGateCount = matchingGateNames.length;
    let message = `${player.getName()} advanced Omen by 1.`;
    message += `\n\t- Omen (${currentOmenColor}) matched ${matchingGateCount} gates`;
    if (matchingGateCount === 0) {
      message += ".";
    } else {
      message += `: ${matchingGateNames.join(", ")}.`;
      message += `\n\t\t- Doom advanced by ${matchingGateCount} accordingly.`;
    }
    Util.logScriptAction(message);
  }
});

refCard.addCustomAction(advanceOmenAction);
