const { Card, world, refCard } = require("@tabletop-playground/api");

refCard.setInheritScript(false);

// on card removed add an identical card to the stack
refCard.onRemoved.add((stack, card) => {
  /** @type Card */
  // @ts-ignore
  const clone = world.createObjectFromJSON(
    card.toJSONString(),
    stack.getPosition()
  );

  stack.addCards(clone, true);
});

// on card inserted remove it from the stack and destroy it
refCard.onInserted.add((stack, _card, offset) => {
  // card.destroy() doesn't work, so have to take() it from the stack first
  const insertedCard = stack.takeCards(1, true, offset);
  insertedCard.destroy();
});
