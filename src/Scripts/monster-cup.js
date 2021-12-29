const { refCard } = require("@tabletop-playground/api");
const { Util } = require("./util");

refCard.setInheritScript(false);

// Rule: When Monster tokens are discarded, they are returned to the Monster cup, and the cup is randomized.
refCard.onInserted.add((stack, insertedCard, offset, player) => {
  if (player === undefined) {
    return; // abort when a script is inserting
  }

  if (offset !== 0) {
    return; // abort if not inserted on top of deck
  }

  stack.shuffle();

  const insertedCardNames = insertedCard.getAllCardDetails().map((card) => card.name);
  Util.logScriptAction(
    `${player.getName()} discarded "${insertedCardNames.join(
      '", "'
    )}". Shuffling ${stack.getName()}.`
  );
});
