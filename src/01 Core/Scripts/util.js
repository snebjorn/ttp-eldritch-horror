const {
  world,
  GameObject,
  SnapPoint,
  Vector,
  Rotator,
  Card,
  Player,
  MultistateObject,
  CardHolder,
} = require("@tabletop-playground/api");

class Util {
  /**
   * @param {Card} cardStack
   * @param {string} cardName
   * @param {boolean} fromFront - If true, searches from the front of the stack instead of the back. Default: `false`.
   * @returns {number | undefined} Offset of the matching card name, relative to the search direction. If no match returns undefined
   */
  static findCardNameInStack(cardStack, cardName, fromFront = false) {
    const deckSize = cardStack.getStackSize();
    if (fromFront) {
      // search from the front
      for (let i = 0; i < deckSize; i++) {
        const cardDetails = cardStack.getCardDetails(i);
        if (cardDetails && cardDetails.name === cardName) {
          return i;
        }
      }
    } else {
      // search from the back
      for (let i = deckSize - 1; i >= 0; i--) {
        const cardDetails = cardStack.getCardDetails(i);
        if (cardDetails && cardDetails.name === cardName) {
          // flip offset
          return deckSize - 1 - i;
        }
      }
    }
  }

  /**
   * @param {Card} cardStack
   * @param {string} cardName
   * @param {number} count - Amount of cards with `cardName` to take. Default: `1`.
   * @param {boolean} fromFront - If true, take the cards from the front of the stack instead of the back. Default: `false`.
   * @returns {Card | undefined}
   */
  static takeCardNameFromStack(cardStack, cardName, count = 1, fromFront = false) {
    let stack;
    for (let i = 0; i < count; i++) {
      const foundCardIndex = this.findCardNameInStack(cardStack, cardName, fromFront);
      if (foundCardIndex === undefined) {
        break; // abort - no cards with this name is left in the deck
      }
      const foundCard = cardStack.takeCards(1, fromFront, foundCardIndex);
      if (foundCard) {
        const cardDetails = foundCard.getCardDetails();
        if (cardDetails && cardDetails.name !== cardName) {
          // put the incorrect card back
          cardStack.addCards(foundCard, fromFront, foundCardIndex);
          throw new Error(
            `Tried to fetch "${cardName}" from ${cardStack.getId()} but got "${
              cardDetails.name
            }" instead`
          );
        }
      }
      if (stack === undefined) {
        stack = foundCard;
      } else if (foundCard) {
        stack.addCards(foundCard);
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
   *
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
    // setting yaw rotation, alters roll. Strange...
    // also can't use exact 180 value when checking as it'll be something like 179.99996948242188
    if (object.getRotation().roll >= 179 || object.getRotation().roll <= -179) {
      object.setRotation(new Rotator(0, 0, 0), animationSpeed);
    } else {
      object.setRotation(new Rotator(0, 0, 180), animationSpeed);
    }
  }

  /**
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
   * @param {string} templateId
   * @param {Vector} position
   * @returns {CardHolder}
   */
  static createCardHolder(templateId, position) {
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

  /**
   * @param {Card} card
   * @param {string} cardStackId
   * @param {string} cardStackName
   * @param {string} cardDescription
   * @param {SnapPoint | Vector} [position]
   */
  static addToStack(card, cardStackId, cardStackName, cardDescription, position) {
    /** @type Card */
    // @ts-ignore
    const stack = world.getObjectById(cardStackId);
    if (!stack) {
      if (!position) {
        throw new Error(
          `No position was given to newly created card stack with id: ${cardStackId}`
        );
      }
      if (position instanceof SnapPoint) {
        if (position.getSnappedObject() !== undefined) {
          throw new Error(
            `Object already present at given SnapPoint for newly created card stack with id: ${cardStackId}`
          );
        }
        Util.setPositionAtSnapPoint(card, position);
      } else {
        card.setPosition(position, 1);
      }
      card.setId(cardStackId);
      card.setName(cardStackName);
      card.setDescription(cardDescription);
    } else {
      stack.addCards(card);
    }
  }

  /**
   * @param {Card} stack
   * @param {Card} removedCard
   */
  static addCloneToStack(stack, removedCard) {
    const clone = Util.cloneCard(removedCard, stack.getPosition());

    stack.addCards(clone, true);
  }

  /**
   * @param {Card} stack
   * @param {Card} _card
   * @param {number} offset
   * @param {Player} [player]
   */
  static removeInsertedCardFromStack(stack, _card, offset, player) {
    if (player === undefined) {
      return; // abort when a script is inserting
    }

    // card.destroy() doesn't work, so have to take() it from the stack first
    const insertedCard = stack.takeCards(1, true, offset);

    if (insertedCard) {
      insertedCard.destroy();
    }
  }
}

exports.Util = Util;
