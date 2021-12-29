const { refCard } = require("@tabletop-playground/api");
const { Util } = require("./util");

refCard.setInheritScript(false);

// Rule: When a double-sided card is discarded, it is immediately shuffled back into its respective deck
// https://boardgames.stackexchange.com/questions/56319/clarification-on-shuffled-back-into-deck-for-double-sided-cards
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
    )}". Shuffling ${stack.getName()} deck.`
  );

  // keeping for now, just in case I need to insert a card at a random location
  // const insertedCards = stack.takeCards(insertedCard.getStackSize(), true);
  // if (insertedCards) {
  //   for (let i = 0; i < insertedCard.getStackSize(); i++) {
  //     const card = insertedCards.getStackSize() > 1 ? insertedCards.takeCards() : insertedCards;
  //     if (card) {
  //       const randomOffset = Util.randomIntFromInterval(0, stack.getStackSize() - 1);
  //       stack.addCards(card, true, randomOffset);
  //     }
  //   }
  // }
});
