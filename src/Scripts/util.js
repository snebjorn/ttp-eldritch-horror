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
  Color,
  Container,
  ObjectType,
} = require("@tabletop-playground/api");

class Util {
  /**
   * @param {Card} cardStack - Card stack to search.
   * @param {string} cardName  Card name to search for.
   * @param {boolean} fromFront - If true, searches from the front of the stack instead of the back. Default: `false`.
   * @returns {number | undefined} Offset of the matching card name, relative to the search direction. If no match returns `undefined`.
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

      const foundCard = Util.takeCards(cardStack, 1, fromFront, foundCardOffset);

      const foundCardName = foundCard.getCardDetails().name;
      if (foundCardName !== cardName) {
        // put the incorrect card back
        cardStack.addCards(foundCard, fromFront, foundCardOffset);
        throw new Error(
          `Tried to fetch "${cardName}" from ${cardStack.getId()} but got "${foundCardName}" instead`
        );
      }

      if (stack === undefined) {
        stack = foundCard;
      } else {
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
      const foundCard = Util.takeCards(cardStack, 1, fromFront, foundCardOffset);

      const foundCardName = foundCard.getCardDetails().name;
      if (foundCardName !== cardName) {
        // put the incorrect card back
        cardStack.addCards(foundCard, fromFront, foundCardOffset);
        throw new Error(
          `Tried to fetch "${cardNames}" from ${cardStack.getId()} but got "${foundCardName}" instead`
        );
      }

      if (stack === undefined) {
        stack = foundCard;
      } else {
        stack.addCards(foundCard);
      }
    }

    return stack;
  }

  /**
   * @param {Card} cardStack - Card stack to take from.
   * @param {number} count - Amount of cards to take. Default: `1`.
   * @param {string[]} excludeCardNames - Card names to exclude from the random take. Default: `[]`.
   * @returns {Card | undefined}
   */
  static takeRandomCardsFromStack(cardStack, count = 1, excludeCardNames = []) {
    let stack;
    for (let i = 0; i < count; i++) {
      const includedIndexes = cardStack
        .getAllCardDetails()
        .reduce((/** @type {number[]} */ prev, next, index) => {
          if (!excludeCardNames.includes(next.name)) {
            prev.push(index);
          }
          return prev;
        }, []);

      const randomIncludedOffset =
        includedIndexes[this.randomIntFromInterval(0, includedIndexes.length - 1)];

      const randomCard = Util.takeCards(cardStack, 1, true, randomIncludedOffset);
      if (stack === undefined) {
        stack = randomCard;
      } else {
        stack.addCards(randomCard);
      }
    }

    return stack;
  }

  /**
   * Take a stack of cards from the stack. The new stack will be positioned directly above the original stack.
   * Returns the {@link cardStack} itself if this object is only a single card.
   *
   * @param {Card} cardStack - Card stack to take from.
   * @param {number} count - Amount of cards to take. Default: `1`.
   * @param {boolean} fromFront - If true, take the cards from the front of the stack instead of the back. Default: `false`.
   * @param {number} offset ??? Number of cards to leave at the back (or front when {@link fromFront} is `true`) before taking cards. Default: `0`.
   *
   * @throws If {@link count} is as large or larger than the stack (minus {@link offset}).
   *
   * @returns {Card} The taken cards. Returns the {@link cardStack} itself if it's only a single card.
   */
  static takeCards(cardStack, count = 1, fromFront = false, offset = 0) {
    const stackSize = cardStack.getStackSize();
    if (count < 1) {
      throw new RangeError(`Invalid number (${count}) of cards to take`);
    }
    const isOutOfBounds = stackSize - offset < count;
    if (isOutOfBounds) {
      throw new RangeError(
        `Cannot take ${count} card(s) from "${cardStack.getName()}" (id: ${cardStack.getId()}) as it exceeds the available number of cards`
      );
    }

    if (stackSize === 1) {
      //! there might be some strange behavior as the cardStack will have the id of the stack - not sure if it's a problem
      return cardStack;
    }

    if (stackSize === count) {
      // if the number of cards to take is as large as the stack or larger, one card will remain in the original stack
      const takenCards = cardStack.takeCards(count, fromFront, offset);
      if (takenCards === undefined) {
        throw new Error(
          `Unable to take cards from "${cardStack.getName()}" (id: ${cardStack.getId()})`
        );
      }
      // add the remaining card
      takenCards.addCards(cardStack);

      return takenCards;
    }

    const takenCards = cardStack.takeCards(count, fromFront, offset);
    if (takenCards === undefined) {
      throw new Error(
        `Unable to take cards from "${cardStack.getName()}" (id: ${cardStack.getId()})`
      );
    }

    return takenCards;
  }

  /**
   * @param {Card} cardStack - Card stack to take from.
   * @param {(metadata: unknown) => boolean} predicate - Predicate to determine if the card should be taken or not.
   * @param {number} count - Amount of cards to take. Default: `1`.
   * @param {string[]} excludeCardNames - Card names to exclude from the random take. Default: `[]`.
   * @param {boolean} fromFront - If true, take the cards from the front of the stack instead of the back. Default: `false`.
   */
  static takeCardMetadataFromStack(
    cardStack,
    predicate,
    count = 1,
    excludeCardNames = [],
    fromFront = false
  ) {
    let stack;
    for (let i = 0; i < count; i++) {
      const stackDetails = cardStack.getAllCardDetails();
      if (fromFront === false) {
        stackDetails.reverse();
      }

      const foundCard = stackDetails.find(
        (cardDetails) =>
          !excludeCardNames.includes(cardDetails.name) &&
          cardDetails.metadata !== "" &&
          predicate(JSON.parse(cardDetails.metadata))
      );

      if (foundCard === undefined) {
        break; // abort - no cards with this metadata is left in the stack
      }

      const takenCard = Util.takeCards(cardStack, 1, true, foundCard.stackIndex);

      if (stack === undefined) {
        stack = takenCard;
      } else {
        stack.addCards(takenCard);
      }
    }

    return stack;
  }

  /**
   * @param {Card} cardStack - Card stack to take from.
   * @param {string[]} tags - Tags on card to take.
   * @param {number} count - Amount of cards to take. Default: `1`.
   * @param {string[]} excludeCardNames - Card names to exclude from the random take. Default: `[]`.
   * @param {boolean} fromFront - If true, take the cards from the front of the stack instead of the back. Default: `false`.
   */
  static takeCardTagsFromStack(
    cardStack,
    tags,
    count = 1,
    excludeCardNames = [],
    fromFront = false
  ) {
    let stack;
    for (let i = 0; i < count; i++) {
      const stackDetails = cardStack.getAllCardDetails();
      if (fromFront === false) {
        stackDetails.reverse();
      }

      const foundCard = stackDetails.find(
        (cardDetails) =>
          !excludeCardNames.includes(cardDetails.name) &&
          tags.every((tag) => cardDetails.tags.includes(tag))
      );

      if (foundCard === undefined) {
        break; // abort - no cards with these tags is left in the stack
      }

      const takenCard = Util.takeCards(cardStack, 1, true, foundCard.stackIndex);

      if (stack === undefined) {
        stack = takenCard;
      } else {
        stack.addCards(takenCard);
      }
    }

    return stack;
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
    // also can't use exact 180 value when checking as it'll be something like 179.99996948242188
    if (object.getRotation().roll >= 179 || object.getRotation().roll <= -179) {
      object.setRotation(new Rotator(0, 0, 0), animationSpeed);
    } else {
      object.setRotation(new Rotator(0, 0, 180), animationSpeed);
    }
  }

  /**
   * Moves a GameObject to a given position.
   *
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
        .add(new Vector(0, 0, gameObject.getExtent(true).z))
        // add extra height so we're outside the bounding box
        .add(new Vector(0, 0, 0.01)),
      animationSpeed
    );

    // calling snap() right after calling setPosition() will take care of moving the object
    // on down onto the table without colliding, and the animation will still work.
    if (position instanceof SnapPoint) {
      const wasSnapped = !!gameObject.snap();
      if (!wasSnapped) {
        gameObject.snapToGround();
      }
    } else {
      gameObject.snapToGround();
    }
  }

  /**
   * Moves a GameObject on top of another GameObject.
   *
   * @param {GameObject} gameObject - Object to move, this can be a Card, Dice, etc
   * @param {GameObject} destinationObject - Object that {@link gameObject} should be moved on top of
   * @param {number} animationSpeed - If larger than 0, show animation. A value of 1 gives a reasonable, quick animation. Value range clamped to [0.1, 5.0]. Defaults to 1.
   */
  static moveOnTopOfObject(gameObject, destinationObject, animationSpeed = 1) {
    const destinationPosition = Util.getTopPosition(destinationObject);
    Util.moveObject(gameObject, destinationPosition, animationSpeed);
  }

  /**
   * Moves a GameObject to a given position.
   * If there are already GameObjects at the position it'll put it on top of these.
   *
   * @param {GameObject} gameObject - Object to move, this can be a Card, Dice, etc
   * @param {SnapPoint | Vector} position
   * @param {number} animationSpeed - If larger than 0, show animation. A value of 1 gives a reasonable, quick animation. Value range clamped to [0.1, 5.0]. Defaults to 1.
   */
  static moveOnTopOnPosition(gameObject, position, animationSpeed = 1) {
    const globalPosition = position instanceof SnapPoint ? position.getGlobalPosition() : position;
    const positionAboveGameObject = globalPosition.add(new Vector(0, 0, 20));
    const objectsAtPosition = world
      .lineTrace(globalPosition, positionAboveGameObject)
      // remove grounded objects like the game board
      .filter((x) => x.object.getObjectType() !== ObjectType.Ground);
    const topHit = objectsAtPosition.slice(-1)[0];
    if (topHit) {
      Util.moveOnTopOfObject(gameObject, topHit.object, animationSpeed);
    } else {
      Util.moveObject(gameObject, position, animationSpeed);
    }
  }

  /**
   * Moves a GameObject to a given position.
   * If there are already GameObjects at the position it'll try to add it to the already present GameObjects.
   * Else it'll just move the GameObject to the target position.
   *
   * @param {GameObject} gameObject - Object to move, this can be a Card, Dice, etc
   * @param {SnapPoint | Vector} position
   * @param {number} animationSpeed - If larger than 0, show animation. A value of 1 gives a reasonable, quick animation. Value range clamped to [0.1, 5.0]. Defaults to 1.
   */
  static moveOrAddObject(gameObject, position, animationSpeed = 1) {
    const globalPosition = position instanceof SnapPoint ? position.getGlobalPosition() : position;
    let isAddedToStack = false;
    const positionAboveGameObject = globalPosition.add(new Vector(0, 0, 20));
    const objectsAtPosition = world.lineTrace(globalPosition, positionAboveGameObject);
    for (const { object: foundObject } of objectsAtPosition) {
      if (foundObject instanceof Card && gameObject instanceof Card) {
        const showAnimation = animationSpeed > 0;
        isAddedToStack = Util.addCardsSafe(foundObject, gameObject, false, 0, showAnimation);
        if (isAddedToStack) {
          break;
        }
      }
    }

    if (isAddedToStack) {
      return; // the gameObject was added to a stack already on position
    }
    Util.moveObject(gameObject, position, animationSpeed);
  }

  /**
   * @param {SnapPoint | Vector} position
   * @param {...string} templateIds
   * @returns {Card}
   */
  static createCard(position, ...templateIds) {
    if (templateIds.length === 0) {
      throw new Error("Missing argument. TemplateIds is empty");
    }

    const vectorPosition = position instanceof SnapPoint ? position.getGlobalPosition() : position;

    let deck;
    for (const templateId of templateIds) {
      const card = world.createObjectFromTemplate(templateId, vectorPosition);
      if (!card) {
        throw new Error(`Something went wrong when trying to create ${templateIds}`);
      }
      if (!(card instanceof Card)) {
        throw new Error(
          `Tried to create ${templateIds} as a Card but it's a ${card.constructor.name}`
        );
      }

      if (!deck) {
        deck = card;
      } else {
        deck.addCards(card);
      }
    }

    return deck;
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
        `Tried to create ${templateId} as a MultistateObject but it's a ${multistateObject.constructor.name}`
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
        `Tried to create ${templateId} as a CardHolder but it's a ${cardHolder.constructor.name}`
      );
    }
    return cardHolder;
  }

  /**
   * @param {string} templateId
   * @param {Vector} position
   * @returns {Container}
   */
  static createContainer(templateId, position) {
    const container = world.createObjectFromTemplate(templateId, position);
    if (!container) {
      throw new Error(`Something went wrong when trying to create ${templateId}`);
    }
    if (!(container instanceof Container)) {
      throw new Error(
        `Tried to create ${templateId} as a Container but it's a ${container.constructor.name}`
      );
    }
    return container;
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
   * @param {string} [scriptName]
   */
  static addToOrCreateStack(
    card,
    cardStackId,
    cardStackName,
    cardDescription,
    position,
    scriptName
  ) {
    /** @type {Card | undefined} */
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
      if (scriptName) {
        card.setScript(scriptName, "8A0B748B4DA2CE04CB79E4A02C7FD720");
      }
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
    const insertedCard = stack.takeCards(card.getStackSize(), true, offset);
    insertedCard?.destroy();
  }

  /**
   * @param {Array<SnapPoint | undefined>} snapPoints
   * @throws If unable to find available snap point
   */
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
    return (
      object
        // getPosition returns the center of the object
        .getPosition()
        // add half of the height of the object
        .add(new Vector(0, 0, object.getExtent(true).z))
        // add a little extra height so we're outside the bounding box
        .add(new Vector(0, 0, 0.01))
    );
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
   * Add {@link cards} to the {@link cardStack} and safely lift GameObjects on top of the stack
   * to the height of the stack.
   *
   * @remarks
   * GameObjects on top a stack where cards were added would have their position inside the stack
   * as the newly added cards would add additional height to the stack.
   * The physics engine would eventually resolve this. But scripts run right after cards were added
   * would have to look for GameObjects on top of the stack inside it - which wasn't ideal.
   * Furthermore when the physics engine resolved the collision and the height difference was anything
   * but minor the GameObjects on top would be sent flying.
   *
   * @param {Card} cardStack - Card (stack) to add the {@link cards} to.
   * @param {Card} cards - Card (stack) to add to the {@link cardStack}.
   * @param {boolean} toFront - If `true`, add new cards to front of the stack. Default: `false`.
   * @param {number} offset - Number of cards to skip at the back (or front when {@link toFront} is `true`) before adding cards. Default: `0`
   * @param {boolean} animate - If `true`, play card drop sound and animate the new cards flying to the stack. The animation takes some time, so the new cards aren't added to the stack instantly. If you need to react when the cards are added, you can use onInserted. Default: `false`.
   * @param {boolean} flipped - If `true`, add the cards flipped compared to the front card of the stack. Only has an effect if all involved cards allow flipping in stacks. Default: `false`.
   * @param {Vector} direction - Direction to find objects in. Defaults to `Vector(0, 0, 2)`
   *
   * @returns {boolean} Whether the cards have been added successfully. Will not succeed if the shape or size of the cards does not match, or if this card is in a card holder.
   */
  static addCardsSafe(
    cardStack,
    cards,
    toFront = false,
    offset = 0,
    animate = false,
    flipped = false,
    direction = new Vector(0, 0, 2)
  ) {
    const foundObjects = Util.findObjectsOnTop(cardStack, direction);
    if (foundObjects.length > 0) {
      const buffer = 0.1;
      // adding the cards will add this much height to the cardStack
      const deltaHeight = cards.getSize().z;
      // to prevent tokens on top of the cardStack from flying off,
      // we move them up before adding new cards
      for (const { object: foundObject } of foundObjects) {
        const currentPosition = foundObject.getPosition();
        const elevatedPosition = currentPosition.add(new Vector(0, 0, deltaHeight + buffer));
        foundObject.setPosition(elevatedPosition, 0);
      }
    }

    const wasAdded = cardStack.addCards(cards, toFront, offset, animate, flipped);

    // snap objects on top in place. This should prevent objects from free falling
    for (const { object: foundObject } of foundObjects) {
      const wasSnapped = !!foundObject.snap();
      if (!wasSnapped) {
        foundObject.snapToGround();
      }
    }

    return wasAdded;
  }

  /**
   * @param {Card} card
   */
  static convertToInfiniteStack(card) {
    if (card.getStackSize() > 1) {
      throw new Error("Given card/token must not be a stack, but a single card/token");
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

      let objectToMoveOnTopOf = object;
      for (const objectHit of objectsFound) {
        Util.moveOnTopOfObject(objectHit.object, objectToMoveOnTopOf);
        objectToMoveOnTopOf = objectHit.object;
      }

      return;
    }

    Util.insertObjectAt(occupyingObject, snapPoints, index + 1);

    Util.insertObjectAt(object, snapPoints, index);
  }

  static Colors = Object.freeze({
    BLACK: new Color(0, 0, 0),
    WHITE: new Color(255, 255, 255),
  });

  /**
   * @param {object} data
   */
  static setSavedData(data) {
    const dataStr = JSON.stringify(data);
    if (dataStr.length > 1023) {
      throw new Error(
        `Provided data object is stringified to ${dataStr.length} chars which exceeds the allowed size of 1023`
      );
    }
    world.setSavedData(dataStr);
  }

  /**
   * @returns {any | undefined}
   */
  static getSavedData() {
    const dataStr = world.getSavedData();
    try {
      return JSON.parse(dataStr);
    } catch {
      return undefined;
    }
  }

  /**
   * @param {Card} stack
   * @param {number} count
   * @param {boolean} fromFront
   * @param {number} offset
   */
  static flipInStack(stack, count = 1, fromFront = false, offset = 0) {
    const card = stack.takeCards(count, fromFront, offset);
    if (card) {
      const details = card.getCardDetails();
      stack.addCards(card, fromFront, offset, false, true);

      return details;
    } else if (stack.getStackSize() === 1) {
      // Card.takeCards returns undefined if the stack is a single card
      Util.flip(stack);

      return stack.getCardDetails();
    }
  }

  /**
   * @param {string} message
   * @param {Player} [player]
   */
  static logScriptAction(message, player) {
    world.broadcastChatMessage(message);
  }

  /**
   * Return the {@link Card} with the specified {@link objectId}.
   *
   * @param {string} objectId
   * @returns {Card} The {@link Card} with the specified {@link objectId}.
   * @throws If unable to find {@link objectId}.
   * @throws If {@link objectId} isn't a {@link Card}.
   */
  static getCardObjectById(objectId) {
    const card = world.getObjectById(objectId);

    if (!card) {
      throw new Error(`Unable to find "${objectId}" on the table`);
    }
    if (!(card instanceof Card)) {
      throw new Error(`Found "${objectId}" but it isn't a Card it's a ${card.constructor.name}`);
    }
    return card;
  }

  /**
   * Return the {@link Card} with the specified {@link objectId}.
   *
   * @param {string} objectId
   * @returns {MultistateObject} The {@link Card} with the specified {@link objectId}.
   * @throws If unable to find {@link objectId}.
   * @throws If {@link objectId} isn't a {@link Card}.
   */
  static getMultistateObjectById(objectId) {
    const obj = world.getObjectById(objectId);

    if (!obj) {
      throw new Error(`Unable to find "${objectId}" on the table`);
    }
    if (!(obj instanceof MultistateObject)) {
      throw new Error(
        `Found "${objectId}" but it isn't a MultistateObject it's a ${obj.constructor.name}`
      );
    }
    return obj;
  }

  /**
   * Return the {@link CardHolder} with the specified {@link objectId}.
   *
   * @param {string} objectId
   * @returns {CardHolder} The {@link CardHolder} with the specified {@link objectId}.
   * @throws If unable to find {@link objectId}.
   * @throws If {@link objectId} isn't a {@link CardHolder}.
   */
  static getCardHolderById(objectId) {
    const obj = world.getObjectById(objectId);

    if (!obj) {
      throw new Error(`Unable to find "${objectId}" on the table`);
    }
    if (!(obj instanceof CardHolder)) {
      throw new Error(
        `Found "${objectId}" but it isn't a CardHolder it's a ${obj.constructor.name}`
      );
    }
    return obj;
  }
}

exports.Util = Util;
