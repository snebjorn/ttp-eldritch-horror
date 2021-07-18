const {
  world,
  GameObject,
  SnapPoint,
  Vector,
  Rotator,
  Card,
  MultistateObject,
} = require("@tabletop-playground/api");

class Util {
  /**
   * @param {Card} cardStack
   * @param {string} cardName
   * @returns {number | undefined} index of the matching card name, if no match returns undefined
   */
  static findCardNameInStack(cardStack, cardName) {
    for (let i = 0; i < cardStack.getStackSize(); i++) {
      const cardDetails = cardStack.getCardDetails(i);
      if (cardDetails && cardDetails.name === cardName) {
        return i;
      }
    }
  }

  /**
   * @param {Card} cardStack
   * @param {string} cardName
   * @param {number} count - amount of cards with `cardName` to take. Defaults to 1.
   * @returns {Card | undefined}
   */
  static takeCardNameFromStack(cardStack, cardName, count = 1) {
    let stack;
    for (let i = 0; i < count; i++) {
      const foundCardIndex = this.findCardNameInStack(cardStack, cardName);
      if (foundCardIndex === undefined) {
        break;
      }
      const foundCard = cardStack.takeCards(1, true, foundCardIndex);
      if (stack === undefined) {
        stack = foundCard;
      } else if (foundCard) {
        stack.addCards(foundCard, true);
      }
    }

    return stack;
  }

  /**
   * @param {Card} cardStack
   * @returns {Card | undefined}
   */
  static takeRandomCardFromStack(cardStack) {
    const randomOffset = this.randomIntFromInterval(0, cardStack.getStackSize() - 1);

    return cardStack.takeCards(1, true, randomOffset);
  }

  /**
   * min and max included
   * @author [source](https://stackoverflow.com/a/7228322/1220627)
   * @param {number} min
   * @param {number} max
   */
  static randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * @param {GameObject} object - Object to flip, this can be a Card, Dice, etc
   * @param {number} animationSpeed - If larger than 0, show animation. A value of 1 gives a reasonable, quick animation. Value range clamped to [0.1, 5.0]. Defaults to 0.
   */
  static flip(object, animationSpeed = 0) {
    object.setRotation(new Rotator(0, 0, 180), animationSpeed);
  }

  /**
   *
   * @param {GameObject} gameObject - Object to move, this can be a Card, Dice, etc
   * @param {SnapPoint} snapPoint
   * @param {number} animationSpeed - If larger than 0, show animation. A value of 1 gives a reasonable, quick animation. Value range clamped to [0.1, 5.0]. Defaults to 1.
   */
  static setPositionAtSnapPoint(gameObject, snapPoint, animationSpeed = 1) {
    gameObject.setPosition(
      snapPoint
        .getGlobalPosition()
        // Snap points usually don't have any distance to the surface under them,
        // this will move the gameObject partly into the below surface.
        // That is more pronounced for larger objects or stacks.
        // The physics engine then takes care of resolving the collision,
        // but that happens somewhat randomly and can cause the objects to rotate or move away from their original location.
        //
        // To resolve this issue we need to offset the height (Z-axises) so it doesn't collide with the below surface.
        .add(new Vector(0, 0, 1)),
      animationSpeed
    );

    // calling snap() right after calling setPosition() will take care of moving the object
    // on down onto the table without colliding, and the animation will still work.
    gameObject.snap();
  }

  /**
   * @param {string} templateId
   * @param {Vector} position
   * @returns {Card}
   */
  static createCard(templateId, position) {
    // @ts-ignore
    return world.createObjectFromTemplate(templateId, position);
  }

  /**
   * @param {string} templateId
   * @param {Vector} position
   * @returns {GameObject}
   */
  static createGameObject(templateId, position) {
    // @ts-ignore
    return world.createObjectFromTemplate(templateId, position);
  }

  /**
   * @param {string} templateId
   * @param {Vector} position
   * @returns {MultistateObject}
   */
  static createMultistateObject(templateId, position) {
    // @ts-ignore
    return world.createObjectFromTemplate(templateId, position);
  }

  /**
   * @param {Card} card
   * @param {Vector} position
   * @returns {Card}
   */
  static cloneCard(card, position) {
    // @ts-ignore
    return world.createObjectFromJSON(card.toJSONString(), position);
  }

  static getNextGroupId() {
    return world.getObjectGroupIds().sort().slice(-1)[0] + 1;
  }
}

exports.Util = Util;
