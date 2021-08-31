const { refCard } = require("@tabletop-playground/api");
const { GameUtil } = require("./game-util");
const { Util } = require("./util");

// disables the custom action for drawn gates
refCard.setInheritScript(false);
const spawnGateAction = "Spawn Gate";
const revealGateAction = "Reveal Gate";

refCard.onCustomAction.add((stack, player, actionName) => {
  if (actionName === spawnGateAction) {
    GameUtil.spawnGates(1);
  }
  if (actionName === revealGateAction) {
    Util.flipInStack(stack);
  }
});

refCard.addCustomAction(spawnGateAction, "Spawns the top gate");
refCard.addCustomAction(revealGateAction, "Reveals the top gate");
