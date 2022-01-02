const { refCard } = require("@tabletop-playground/api");
const { GameUtil } = require("./game-util");

refCard.onRemoved.add((deck, card, position, player) => {
  if (player && GameUtil.getSavedData().ancientOne) {
    // if a player removes a Mythos card from the deck it should mean the end of round 1
    GameUtil.updateSavedData({ isGameBegun: true });
  }
});
