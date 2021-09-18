const { refCard } = require("@tabletop-playground/api");
const { GameUtil } = require("./game-util");
const { Util } = require("./util");

// disables the custom action for drawn clues
refCard.setInheritScript(false);
const spawnClueAction = "Spawn Clue";

refCard.onCustomAction.add((stack, player, actionName) => {
  if (actionName === spawnClueAction) {
    const [spawnedClue] = GameUtil.spawnClues(1);
    Util.logScriptAction(`${player.getName()} spawned clue on "${spawnedClue}".`, player);
  }
});

refCard.addCustomAction(spawnClueAction, "Spawns the top clue");
