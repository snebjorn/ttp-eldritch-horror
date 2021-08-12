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
      const foundCardOffset = this.findCardNameInStack(cardStack, cardName, fromFront);
      if (foundCardOffset === undefined) {
        break; // abort - no cards with this name is left in the stack
      }
      let foundCard = cardStack.takeCards(1, fromFront, foundCardOffset);
      if (!foundCard && cardStack.getStackSize() === 1) {
        // takeCards returns undefined if there's only 1 card left
        // that means the card we want is the stack
        //! there might be some strange behavior as the foundCard will have the id of the stack - not sure if it's a problem
        foundCard = cardStack;
      }
      if (foundCard) {
        const cardDetails = foundCard.getCardDetails();
        if (cardDetails && cardDetails.name !== cardName) {
          // put the incorrect card back
          cardStack.addCards(foundCard, fromFront, foundCardOffset);
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
   * @param {string[]} cardNames
   * @param {boolean} fromFront - If true, take the cards from the front of the stack instead of the back. Default: `false`.
   * @returns {Card | undefined}
   */
  static takeCardNamesFromStack(cardStack, cardNames, fromFront = false) {
    let stack;
    for (const cardName of cardNames) {
      const foundCardOffset = this.findCardNameInStack(cardStack, cardName, fromFront);
      if (foundCardOffset === undefined) {
        continue; // card not found, try next
      }
      let foundCard = cardStack.takeCards(1, fromFront, foundCardOffset);
      if (!foundCard && cardStack.getStackSize() === 1) {
        // takeCards returns undefined if there's only 1 card left
        // that means the card we want is the stack
        //! there might be some strange behavior as the foundCard will have the id of the stack - not sure if it's a problem
        foundCard = cardStack;
      }
      if (foundCard) {
        const cardDetails = foundCard.getCardDetails();
        if (cardDetails && cardDetails.name !== cardName) {
          // put the incorrect card back
          cardStack.addCards(foundCard, fromFront, foundCardOffset);
          throw new Error(
            `Tried to fetch "${cardNames}" from ${cardStack.getId()} but got "${
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
   * @param {SnapPoint | Vector} position
   * @param {number} animationSpeed - If larger than 0, show animation. A value of 1 gives a reasonable, quick animation. Value range clamped to [0.1, 5.0]. Defaults to 1.
   */
  static moveObject(gameObject, position, animationSpeed = 1) {
    const globalPosition = position instanceof SnapPoint ? position.getGlobalPosition() : position;
    gameObject.setPosition(
      globalPosition
        // Snap points usually don't have any distance to the surface under them,
        // this will move the gameObject partly into the below surface.
        // That is more pronounced for larger objects or stacks.
        // The physics engine then takes care of resolving the collision,
        // but that happens somewhat randomly and can cause the objects to rotate or move away from their original location.
        //
        // To resolve this issue we need to offset the height (Z-axises) so it doesn't collide with the below surface.
        .add(new Vector(0, 0, gameObject.getExtent(true).z)),
      animationSpeed
    );

    // calling snap() right after calling setPosition() will take care of moving the object
    // on down onto the table without colliding, and the animation will still work.
    if (position instanceof SnapPoint) {
      gameObject.snap();
    } else {
      gameObject.snapToGround();
    }
  }

  /**
   * @param {string} templateId
   * @param {Vector} position
   * @returns {Card}
   */
  static createCard(templateId, position) {
    const card = world.createObjectFromTemplate(templateId, position);
    if (!card) {
      throw new Error(`Something went wrong when trying to create ${templateId}`);
    }
    if (!(card instanceof Card)) {
      throw new Error(
        `Tried to created ${templateId} as a Card but it's a ${card.constructor.name}`
      );
    }
    return card;
  }

  /**
   * @param {string} templateId
   * @param {Vector} position
   * @returns {GameObject}
   */
  static createGameObject(templateId, position) {
    const gameObject = world.createObjectFromTemplate(templateId, position);
    if (!gameObject) {
      throw new Error(`Something went wrong when trying to create ${templateId}`);
    }
    return gameObject;
  }

  /**
   * @param {string} templateId
   * @param {Vector} position
   * @returns {MultistateObject}
   */
  static createMultistateObject(templateId, position) {
    const multistateObject = world.createObjectFromTemplate(templateId, position);
    if (!multistateObject) {
      throw new Error(`Something went wrong when trying to create ${templateId}`);
    }
    if (!(multistateObject instanceof MultistateObject)) {
      throw new Error(
        `Tried to created ${templateId} as a MultistateObject but it's a ${multistateObject.constructor.name}`
      );
    }
    return multistateObject;
  }

  /**
   * @param {string} templateId
   * @param {Vector} position
   * @returns {CardHolder}
   */
  static createCardHolder(templateId, position) {
    const cardHolder = world.createObjectFromTemplate(templateId, position);
    if (!cardHolder) {
      throw new Error(`Something went wrong when trying to create ${templateId}`);
    }
    if (!(cardHolder instanceof CardHolder)) {
      throw new Error(
        `Tried to created ${templateId} as a CardHolder but it's a ${cardHolder.constructor.name}`
      );
    }
    return cardHolder;
  }

  /**
   * @param {Card} card
   * @param {Vector} position
   * @returns {Card}
   */
  static cloneCard(card, position) {
    if (card instanceof Card === false) {
      throw new Error(`Tried to clone a Card but the given card was a ${card.constructor.name}`);
    }

    return Util.cloneCardFromJson(card.toJSONString(), position);
  }

  /**
   * @param {string} json
   * @param {Vector} position
   * @returns {Card}
   */
  static cloneCardFromJson(json, position) {
    const clonedCard = world.createObjectFromJSON(json, position);
    if (!clonedCard) {
      throw new Error(`Something went wrong when trying to create object from JSON`);
    }
    if (!(clonedCard instanceof Card)) {
      throw new Error(`Cloned card is not a Card, but a ${clonedCard.constructor.name}`);
    }
    return clonedCard;
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
        Util.moveObject(card, position);
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
   * @param {Card} card
   * @param {number} offset
   * @param {Player} [player]
   */
  static removeInsertedCardFromStack(stack, card, offset, player) {
    if (player === undefined) {
      return; // abort when a script is inserting
    }

    // card.destroy() doesn't work, so have to take() it from the stack first
    const insertedCard = stack.takeCards(1, true, offset);

    if (insertedCard) {
      insertedCard.destroy();
    }
  }

  /** @param {Array<SnapPoint | undefined>} snapPoints */
  static getNextAvailableSnapPoint(snapPoints) {
    for (const snapPoint of snapPoints) {
      if (!snapPoint) {
        continue;
      }
      const isOccupied = snapPoint.getSnappedObject();
      if (!isOccupied) {
        return snapPoint;
      }
    }

    throw new Error("Unable to find unoccupied snap point");
  }

  /**
   * Returns the closest `SnapPoint` from the `snapPoints` array to the `originSnapPoint` in the 2D plane.
   * Meaning that all snap points will be treated as if they were at the same Z-axises
   *
   * @param {SnapPoint} originSnapPoint
   * @param {SnapPoint[]} snapPoints
   */
  static findClosestSnapPoint2D(originSnapPoint, snapPoints) {
    if (snapPoints.length === 0) {
      throw new Error("No snap points to compare distance to was provided");
    }

    const originGlobal = originSnapPoint.getGlobalPosition();
    originGlobal.z = 0;
    const snapPointsGlobal = snapPoints.map((x) => {
      const globalPos = x.getGlobalPosition();
      globalPos.z = 0;

      return globalPos;
    });
    const foundIndex = this.findIndexOfShortestDistance(originGlobal, snapPointsGlobal);
    const closetsSnapPoint = snapPoints[foundIndex];

    return closetsSnapPoint;
  }

  /**
   * Returns the closest `SnapPoint` from the `snapPoints` array to the `originSnapPoint`
   *
   * @param {SnapPoint} originSnapPoint
   * @param {SnapPoint[]} snapPoints
   */
  static findClosestSnapPoint(originSnapPoint, snapPoints) {
    if (snapPoints.length === 0) {
      throw new Error("No snap points to compare distance to was provided");
    }

    const originGlobal = originSnapPoint.getGlobalPosition();
    const snapPointsGlobal = snapPoints.map((x) => x.getGlobalPosition());
    const foundIndex = this.findIndexOfShortestDistance(originGlobal, snapPointsGlobal);
    const closetsSnapPoint = snapPoints[foundIndex];

    return closetsSnapPoint;
  }

  /**
   * Returns the index of the point with the shortest distance to `origin`.
   * If multiple points have the same shortest distance the first is returned.
   *
   * @param {Vector} origin
   * @param {Vector[]} points
   */
  static findIndexOfShortestDistance(origin, points) {
    if (points.length === 0) {
      throw new Error("No points to compare distance to was provided");
    }

    let indexOfClosetsPoint;
    let shortestDistance;
    for (let index = 0; index < points.length; index++) {
      const point = points[index];
      const distance = origin.distance(point);
      if (shortestDistance === undefined || shortestDistance > distance) {
        shortestDistance = distance;
        indexOfClosetsPoint = index;
      }
    }

    if (indexOfClosetsPoint === undefined) {
      throw new Error("No closets points to origin was found - this should never happen");
    }

    return indexOfClosetsPoint;
  }

  /**
   * Returns the top position of an object.
   *
   * @param {GameObject} object
   */
  static getTopPosition(object) {
    return object.getPosition().add(new Vector(0, 0, object.getExtent(true).z));
  }

  /**
   * @param {GameObject} object
   * @param {Vector} direction - direction to find objects in. Defaults to `Vector(0, 0, 2)`
   */
  static findObjectsOnTop(object, direction = new Vector(0, 0, 2)) {
    const topPosition = Util.getTopPosition(object);
    return world.lineTrace(topPosition, topPosition.add(direction));
  }

  /**
   * @param {Card} card
   */
  static convertToInfiniteStack(card) {
    if (card.getStackSize() > 1) {
      throw new Error("Given card/token must be a stack, but a single card/token");
    }
    const position = card.getPosition();

    card.addCards(Util.cloneCard(card, position));
    card.setInheritScript(false);
    card.onRemoved.add(Util.addCloneToStack);
    card.onInserted.add(Util.removeInsertedCardFromStack);

    return card;
  }

  /**
   * @param {GameObject} object
   * @param {SnapPoint[]} snapPoints
   * @param {number} index
   */
  static insertObjectAt(object, snapPoints, index) {
    const snapPoint = snapPoints[index];
    const occupyingObject = snapPoint.getSnappedObject();
    if (!occupyingObject) {
      const objectsFound = Util.findObjectsOnTop(object);
      Util.moveObject(object, snapPoint);

      for (const objectHit of objectsFound) {
        Util.moveObject(objectHit.object, snapPoint);
      }

      return;
    }

    Util.insertObjectAt(occupyingObject, snapPoints, index + 1);

    Util.insertObjectAt(object, snapPoints, index);
  }
}

exports.Util = Util;
