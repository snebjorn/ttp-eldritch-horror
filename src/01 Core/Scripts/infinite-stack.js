const { refCard } = require("@tabletop-playground/api");
const { Util } = require("./util");

refCard.setInheritScript(false);

// on card removed add an identical card to the stack
refCard.onRemoved.add((stack, card) => {
  const clone = Util.cloneCard(card, stack.getPosition());

  stack.addCards(clone, true);
});

// on card inserted remove it from the stack and destroy it
refCard.onInserted.add((stack, _card, offset, player) => {
  if (player === undefined) {
    return; // abort when a script is inserting
  }

  // card.destroy() doesn't work, so have to take() it from the stack first
  const insertedCard = stack.takeCards(1, true, offset);

  if (insertedCard) {
    insertedCard.destroy();
  }
});
