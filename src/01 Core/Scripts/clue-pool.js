const { refCard } = require("@tabletop-playground/api");
const { GameUtil } = require("./game-util");

// disables the custom action for drawn clues
refCard.setInheritScript(false);
const spawnClueAction = "Spawn Clue";

refCard.onCustomAction.add((stack, player, actionName) => {
  if (actionName === spawnClueAction) {
    GameUtil.spawnClues(1);
  }
});

refCard.addCustomAction(spawnClueAction, "Spawns the top clue");
