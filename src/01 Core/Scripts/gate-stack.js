const { refCard } = require("@tabletop-playground/api");
const { GameUtil } = require("./game-util");
const { Util } = require("./util");

// disables the custom action for drawn gates
refCard.setInheritScript(false);
const spawnGateAction = "Spawn Gate";
const revealGateAction = "Reveal Gate";

refCard.onCustomAction.add((stack, player, actionName) => {
  if (actionName === spawnGateAction) {
    const result = GameUtil.spawnGates(1);
    if (result.length > 0) {
      const [gateName, monsterName] = result[0];
      Util.logScriptAction(
        `${player.getName()} spawned "${gateName}" Gate with a "${monsterName}" Monster.`,
        player
      );
    }
  }
  if (actionName === revealGateAction) {
    const revealedGate = Util.flipInStack(stack);
    if (revealedGate) {
      Util.logScriptAction(
        `${player.getName()} revealed the top Gate to be "${revealedGate.name}".`,
        player
      );
    }
  }
});

refCard.addCustomAction(spawnGateAction, "Spawns the top gate");
refCard.addCustomAction(revealGateAction, "Reveals the top gate");
