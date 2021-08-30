const { refCard } = require("@tabletop-playground/api");
const { GameUtil } = require("./game-util");

// disables the custom action for drawn gates
refCard.setInheritScript(false);
const spawnGateAction = "Spawn Gate";

refCard.onCustomAction.add((stack, player, actionName) => {
  if (actionName === spawnGateAction) {
    GameUtil.spawnGates(1);
  }
});

refCard.addCustomAction(spawnGateAction, "Spawns the top gate");
