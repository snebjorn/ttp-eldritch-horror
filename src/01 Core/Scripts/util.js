const { Card } = require("@tabletop-playground/api");

/**
 * @param {Card} cardStack
 * @param {string} cardName
 * @returns {number|undefined} index of the matching card name, if no match returns undefined
 */
function findCardNameInStack(cardStack, cardName) {
  for (let i = 0; i < cardStack.getStackSize(); i++) {
    const cardDetails = cardStack.getCardDetails(i);
    if (cardDetails.name === cardName) {
      return i;
    }
  }
}
exports.findCardNameInStack = findCardNameInStack;

/**
 * @param {Card} cardStack
 * @param {string} cardName
 * @returns {Card|undefined}
 */
function takeCardNameFromStack(cardStack, cardName) {
  const foundCardIndex = findCardNameInStack(cardStack, cardName);
  if (foundCardIndex !== undefined) {
    const offset = foundCardIndex;

    return cardStack.takeCards(1, true, offset);
  }
}
exports.takeCardNameFromStack = takeCardNameFromStack;

/**
 * @param {Card} cardStack
 * @returns {Card|undefined}
 */
function takeRandomCardFromStack(cardStack) {
  const randomOffset = randomIntFromInterval(0, cardStack.getStackSize() - 1);

  return cardStack.takeCards(1, true, randomOffset);
}
exports.takeRandomCardFromStack = takeRandomCardFromStack;

/**
 * min and max included
 * @author [source](https://stackoverflow.com/a/7228322/1220627)
 * @param {number} min
 * @param {number} max
 */
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
