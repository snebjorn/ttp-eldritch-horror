const { Card, world, refCard } = require("@tabletop-playground/api");
const { Util } = require("./util");

// on card removed add an identical card to the stack
refCard.onRemoved.add((stack, card) => {
  /** @type Card */
  // @ts-ignore
  let clone = world.createObjectFromTemplate(
    card.getTemplateId(),
    stack.getPosition()
  );

  // template clone is a stack
  if (clone.getStackSize() > 1) {
    let clonedCard = Util.takeCardNameFromStack(
      clone,
      card.getCardDetails().name
    );
    clone.destroy();
    if (clonedCard) {
      clone = clonedCard;
    }
  }

  stack.addCards(clone, true);
});

// on card inserted remove it from the stack and destroy it
refCard.onInserted.add((stack, _card, offset) => {
  let insertedCard = stack.takeCards(1, true, offset);
  insertedCard.destroy();
});
