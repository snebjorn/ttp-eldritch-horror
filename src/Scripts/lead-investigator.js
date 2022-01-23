const {
  UIElement,
  Text,
  world,
  Vector,
  globalEvents,
  refCard,
  Player,
} = require("@tabletop-playground/api");
const { Util } = require("./util");

/**
 *
 * @param {Player} player
 */
function getActionText(player) {
  return `Make ${player.getName()} Lead Investigator`;
}

/**
 *
 * @param {string} text
 */
function getPlayerFromActionText(text) {
  const playerName = text.slice(5, -18);

  return world.getAllPlayers().find((x) => x.getName() === playerName);
}

globalEvents.onPlayerJoined.add((player) => {
  refCard.addCustomAction(getActionText(player));
});
globalEvents.onPlayerLeft.add((player) => {
  refCard.removeCustomAction(getActionText(player));
});
globalEvents.onPlayerSwitchedSlots.add((player, previousSlot) => {
  if (refCard.getOwningPlayerSlot() === previousSlot) {
    refCard.setOwningPlayerSlot(player.getSlot());
  }
});

const textUi = new Text().setBold(true).setFontSize(20);

refCard.onCustomAction.add((card, player, action) => {
  const actionPlayer = getPlayerFromActionText(action);
  if (actionPlayer) {
    refCard.setOwningPlayerSlot(actionPlayer.getSlot());
    textUi.setText(actionPlayer.getName()); // TODO alter font size based on name length

    actionPlayer.showMessage("You are now the Lead Investigator!");
    Util.logScriptAction(
      `${player.getName()} made ${actionPlayer.getName()} the Lead Investigator!`,
      player
    );
  }
});

for (const player of world.getAllPlayers()) {
  refCard.addCustomAction(getActionText(player));
}

const owningPlayer = refCard.getOwningPlayer();
if (owningPlayer) {
  textUi.setText(owningPlayer.getName());
}

const extend = refCard.getExtent(false);

const ui = new UIElement();
ui.widget = textUi;
ui.position = new Vector(0, 0, extend.z + 0.01);
ui.scale = 0.2;
refCard.addUI(ui);
