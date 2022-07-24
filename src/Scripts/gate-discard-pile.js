const { refCard } = require("@tabletop-playground/api");
const { GameUtil } = require("./game-util");
const { Util } = require("./util");

// disables the custom action for drawn gates
refCard.setInheritScript(false);
const spawnGateAction = "Spawn Gate";

refCard.onCustomAction.add((stack, player, actionName) => {
  if (actionName === spawnGateAction) {
    const result = GameUtil.spawnGates(1, stack, true);
    if (result.length > 0) {
      const [gateName, monsterName, spawnEffect] = result[0];
      Util.logScriptAction(
        `${player.getName()} spawned Gate on ${gateName} with ${monsterName} Monster.`,
        player
      );
      if (spawnEffect) {
        Util.logScriptAction(`Spawn Effect (${monsterName}): ${spawnEffect}.`);
      }
    }
  }
});

refCard.addCustomAction(spawnGateAction, "Spawns the top gate");
