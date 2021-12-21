const { world, GameObject, Vector, SnapPoint, Card } = require("@tabletop-playground/api");
const { Util } = require("./util");
const {
  eldritchToken,
  gameBoardLocations,
  doomToken,
  getGateStack,
  getCluePool,
  monsterCup,
  getAssetDeck,
  conditionDeck,
  shipTicket,
  tableLocations,
  epicMonsterCup,
  omenToken,
  clueDiscardPile,
} = require("./world-constants");

class GameUtil {
  /**
   * @param {number} number
   */
  static advanceDoom(number = 1) {
    const doomCount = findDoomCount();
    if (doomCount) {
      // @ts-ignore
      const advancedDoomSnapShot = gameBoardLocations.doom[doomCount - number];
      if (advancedDoomSnapShot) {
        Util.moveObject(doomToken, advancedDoomSnapShot);
      }
    }
  }

  /**
   * @param {number} count
   */
  static retreatDoom(count = 1) {
    const doomCount = findDoomCount();
    if (doomCount) {
      // @ts-ignore
      const retreatedDoomSnapShot = gameBoardLocations.doom[doomCount + count];
      if (retreatedDoomSnapShot) {
        Util.moveObject(doomToken, retreatedDoomSnapShot);
      }
    }
  }

  /**
   * @param {number} count
   */
  static takeEldritchTokens(count = 1) {
    const stackPos = eldritchToken.getPosition().add(new Vector(0, 0, 3));
    /** @type {string[]} */
    const ids = Array(count).fill("2B59F5E24A16BA40DBA5DEB42AA14D89");
    const tokenStack = Util.createCard(stackPos, ...ids);

    return tokenStack;
  }

  /**
   * @param {number} count
   */
  static takeFocusTokens(count = 1) {
    const focusStack = world.getObjectById("focus-token");
    if (!focusStack) {
      throw new Error("Unable to find focus token");
    }
    const stackPos = focusStack.getPosition().add(new Vector(0, 0, 3));
    /** @type {string[]} */
    const ids = Array(count).fill("414DCAD946F6CCB38C7D8BB8F8838008");
    const focusToken = Util.createCard(stackPos, ...ids);

    return focusToken;
  }

  /**
   * @param {number} count
   */
  static takeResourceTokens(count = 1) {
    const resourceStack = world.getObjectById("resource-token");
    if (!resourceStack) {
      throw new Error("Unable to find resource token");
    }
    const stackPos = resourceStack.getPosition().add(new Vector(0, 0, 3));
    /** @type {string[]} */
    const ids = Array(count).fill("6B38AFF1442360922B6DCBBEFA072DAE");
    const resourceToken = Util.createCard(stackPos, ...ids);

    return resourceToken;
  }

  /**
   * @param {number} count
   */
  static takeRandomClueTokens(count = 1) {
    const cluePool = getCluePool();
    if (!cluePool) {
      throw new Error("Unable to find Clue pool");
    }

    const randomClues = Util.takeRandomCardsFromStack(cluePool, count);

    return randomClues;
  }

  /**
   * How do you determine a random Space?
   *
   * Whenever an effect refers to a random space, that space is determined by
   * drawing one Clue token from the Clue pool and using the space indicated
   * by the back of the token.
   * The drawn Clue token is then discarded.
   */
  static determineRandomSpace() {
    const randomClue = GameUtil.takeRandomClueTokens(1);
    if (!randomClue) {
      throw new Error("Unable to take a clue from the Clue Pile");
    }

    /** @type {keyof GameBoardLocations["space"]} */
    // @ts-ignore
    const spaceName = randomClue.getCardDetails().name;
    clueDiscardPile.addObjects([randomClue], 0);

    const snapPoint = gameBoardLocations.space[spaceName];
    if (!snapPoint) {
      throw new Error(`Unable to find a snap point for "${spaceName}" (space)`);
    }

    return { snapPoint, spaceName };
  }

  /**
   * @param {number} count
   */
  static takeDevastationTokens(count = 1) {
    const devastationStack = world.getObjectById("devastation-token");
    if (!devastationStack) {
      throw new Error("Unable to find devastation token");
    }
    const stackPos = devastationStack.getPosition().add(new Vector(0, 0, 3));
    /** @type {string[]} */
    const ids = Array(count).fill("41A12F664413E91443499C984A9A80F9");
    const devastationToken = Util.createCard(stackPos, ...ids);

    return devastationToken;
  }

  /**
   * @param {number} count
   * @throws If unable to take ship token from travel tickets template object
   */
  static takeShipTokens(count = 1) {
    const stackPos = shipTicket.getPosition().add(new Vector(0, 0, 3));
    const travelTickets = Util.createCard(stackPos, "934AA7324CE46C2AC3DF2999F5F3EFEB");
    const shipTokens = Util.takeCardNameFromStack(travelTickets, "Ship Ticket");
    travelTickets.destroy();

    if (!shipTokens) {
      throw new Error("Unable to take ship token");
    }

    if (count > 1) {
      const json = shipTokens.toJSONString();
      for (let i = 1; i < count; i++) {
        const copiedToken = Util.cloneCardFromJson(json, stackPos);
        shipTokens.addCards(copiedToken);
      }
    }

    return shipTokens;
  }

  /**
   * @param {number} number
   * @throws If unable to find snap point for spawned gate
   * @returns {[gateName: string, monsterName: string | undefined][]}
   */
  static spawnGates(number = 1) {
    /** @type {[gateName: string, monsterName: string | undefined][]} */
    const output = [];

    for (let i = 0; i < number; i++) {
      const gateToken = getGateStack().takeCards(1);

      if (gateToken) {
        if (!gateToken.isFaceUp()) {
          Util.flip(gateToken);
        }

        const gateName = gateToken.getCardDetails().name;
        // @ts-ignore
        let snapPoint = gameBoardLocations.space[gateName];
        if (!snapPoint) {
          throw new Error(`Cannot find snap point for gate location: ${gateName}`);
        }

        const locationName = findGateSpawnLocation(gateName, snapPoint);
        // @ts-ignore
        snapPoint = gameBoardLocations.space[locationName];
        if (!snapPoint) {
          throw new Error(`Cannot find snap point for gate location: ${locationName}`);
        }

        Util.moveObject(gateToken, snapPoint);

        const monster = GameUtil.spawnMonster(snapPoint);
        const monsterName = monster && monster.getCardDetails().name;

        output.push([gateName, monsterName]);
      }
    }

    return output;
  }

  /**
   * @param {number} number
   * @throws If unable to find snap point for spawned clue
   * @returns {string[]} Names of spawned clues
   */
  static spawnClues(number = 1) {
    const output = [];

    for (let i = 0; i < number; i++) {
      const clueToken = getCluePool().takeCards(1);
      if (clueToken) {
        const clueName = clueToken.getCardDetails().name;
        // @ts-ignore
        const snapPoint = gameBoardLocations.space[clueName];
        if (!snapPoint) {
          throw new Error(`Cannot find snap point for clue: ${clueName}`);
        }
        Util.moveOrAddObject(clueToken, snapPoint);

        output.push(clueName);
      }
    }

    return output;
  }

  /**
   * @param {SnapPoint} reserveSnapPoint
   */
  static restockReserve(reserveSnapPoint) {
    // WARN don't use default snap radius else it'll find the underlying table mat
    const isOccupied = reserveSnapPoint.getSnappedObject(1);
    if (isOccupied) {
      return; // abort - already a card here
    }
    const drawnAssetCard = getAssetDeck().takeCards(1);
    if (!drawnAssetCard) {
      throw new Error("Unable to draw card from the asset deck");
    }
    Util.flip(drawnAssetCard);
    Util.moveObject(drawnAssetCard, reserveSnapPoint);
  }

  static drawDebtCondition() {
    const drawnDebtCard = Util.takeCardNameFromStack(conditionDeck, "Debt");
    if (!drawnDebtCard) {
      throw new Error("Unable to draw Debt card from the conditions deck");
    }

    Util.moveOrAddObject(drawnDebtCard, gameBoardLocations.bankLoan);
  }

  static getActivePrelude() {
    if (world.__eldritchHorror.activePrelude) {
      return world.__eldritchHorror.preludes.get(world.__eldritchHorror.activePrelude);
    }
  }

  static getActiveAncientOne() {
    return GameUtil.getSavedData().ancientOne;
  }

  /**
   * @param {GameObject} deck
   */
  static addEncounterDeck(deck) {
    Util.insertObjectAt(deck, tableLocations.topDeckRow, 0);

    return tableLocations.topDeckRow[0];
  }

  /**
   * Takes {@link monsterName} from the monster cup and moves it near the ancient one sheet, this is considered "set aside"
   *
   * @param {string} monsterName
   * @param {number} [count]
   * @returns {[monsterStack: Card, snapPoint: SnapPoint]}
   */
  static setAsideMonster(monsterName, count = 1) {
    const monsterStack = Util.takeCardNameFromStack(monsterCup, monsterName, count);
    if (!monsterStack) {
      throw new Error(`Unable to find "${monsterName}" in the monster cup`);
    }
    const availablePosition = Util.getNextAvailableSnapPoint(tableLocations.ancientOneMonsters);
    Util.moveObject(monsterStack, availablePosition);

    return [monsterStack, availablePosition];
  }

  /**
   * Spawns a monster from the monster cup
   *
   * @param {SnapPoint | Vector} position
   */
  static spawnMonster(position) {
    const monster = monsterCup.takeCards(1);
    if (monster) {
      Util.moveOrAddObject(monster, position);
    }

    return monster;
  }

  /**
   * @param {string} monsterName
   * @param {SnapPoint | Vector} position
   * @throws If unable to find `monsterName`
   */
  static spawnEpicMonster(monsterName, position) {
    const epicMonster = Util.takeCardNameFromStack(epicMonsterCup, monsterName);
    if (!epicMonster) {
      throw new Error(`Unable to find "${monsterName}" in the epic monster cup`);
    }

    Util.moveOrAddObject(epicMonster, position);

    return epicMonster;
  }

  /**
   * @param {string} monsterName
   */
  static takeMonster(monsterName) {
    return (
      // first try the monster cup
      Util.takeCardNameFromStack(monsterCup, monsterName) ||
      // next try to find amongst Set Aside monsters
      GameUtil.takeSetAsideMonster(monsterName)
    );
  }

  /**
   * @param {string} monsterName
   */
  static takeSetAsideMonster(monsterName) {
    for (const snapPoint of tableLocations.ancientOneMonsters) {
      const snappedObject = snapPoint.getSnappedObject();
      if (snappedObject instanceof Card) {
        if (snappedObject.getStackSize() > 1) {
          const monster = Util.takeCardNameFromStack(snappedObject, monsterName);
          if (monster) {
            return monster;
          }
        } else {
          const snappedObjectName = snappedObject.getCardDetails().name;
          if (snappedObjectName === monsterName) {
            return snappedObject;
          }
        }
      }
    }
  }

  /**
   * @param {SavedData} data
   */
  static setSavedData(data) {
    Util.setSavedData(data);
  }

  /**
   * @param {Partial<SavedData>} data
   */
  static updateSavedData(data) {
    Util.setSavedData(Object.assign(GameUtil.getSavedData(), data));
  }

  /**
   * @returns {SavedData}
   */
  static getSavedData() {
    const data = Util.getSavedData();
    if (!data || !data.sets === undefined) {
      return { sets: [], isPersonalStory: false };
    }

    return data;
  }

  static getCurrentOmenColor() {
    if (gameBoardLocations.omen.green.getSnappedObject() === omenToken) {
      return "green";
    }
    if (gameBoardLocations.omen.blue1.getSnappedObject() === omenToken) {
      return "blue";
    }
    if (gameBoardLocations.omen.red.getSnappedObject() === omenToken) {
      return "red";
    }
    if (gameBoardLocations.omen.blue2.getSnappedObject() === omenToken) {
      return "blue";
    }

    throw new Error("Unable to find omen token");
  }

  /**
   * @param {number} number
   */
  static advanceOmen(number = 1) {
    const omenTrack = [
      gameBoardLocations.omen.green,
      gameBoardLocations.omen.blue1,
      gameBoardLocations.omen.red,
      gameBoardLocations.omen.blue2,
    ];

    const currentOmenIndex = omenTrack.findIndex((x) => x.getSnappedObject() === omenToken);
    const advancedOmenSnapShot = omenTrack[(currentOmenIndex + number) % 4];
    Util.moveObject(omenToken, advancedOmenSnapShot);

    // TODO advance doom for each matching gates
  }

  static getActiveIconReference() {
    return GameUtil.getSavedData().iconReference;
  }
}
exports.GameUtil = GameUtil;

function findDoomCount() {
  for (const [doom, snapPoint] of Object.entries(gameBoardLocations.doom)) {
    const snappedObject = snapPoint.getSnappedObject();
    if (snappedObject !== undefined) {
      if (snappedObject === doomToken) {
        return Number(doom);
      }
    }
  }
}

/**
 * Some effects cause a gate to spawn in a different location then normally,
 * this tries to find out where it's supposed to go instead.
 *
 * @param {string} gateName
 * @param {SnapPoint} snapPoint
 */
function findGateSpawnLocation(gateName, snapPoint) {
  const start = snapPoint.getGlobalPosition();
  const end = start.add(new Vector(0, 0, 20));
  const extend = new Vector(2, 2, 1);
  const foundObjects = world.boxTrace(start, end, extend);

  let kateWinthropFound = false;
  let dreamPortalLocation;

  for (const { object } of foundObjects) {
    // Kate Winthrop
    if (object.getTemplateId() === "3EF51A3C93174BCF804135ED733F84EE") {
      kateWinthropFound = true;
    }
    // Dream Portal
    if (object.getTemplateId() === "B03C56724E726EF0ECDFB2BCFF70742C" && object instanceof Card) {
      const cardName = object.getCardDetails().name;
      switch (cardName) {
        case "To The Moon":
          dreamPortalLocation = "The Moon";
          break;
        case "To The Underworld":
          dreamPortalLocation = "The Underworld";
          break;
        case "To Unknown Kadath":
          dreamPortalLocation = "Unknown Kadath";
          break;
      }
    }
  }

  // Q. What happens if Kate Winthrop is on a space containing a Dream Portal and a Gate would spawn on that space?
  // A. Both the Dream Portal effect and Kate Winthrop’s passive ability will attempt to replace the Gate spawn.
  // The active investigator decides which effect takes priority.
  // As such, he could have Kate’s passive ability cause the Gate to be discarded instead of spawning.
  if (dreamPortalLocation && !kateWinthropFound) {
    Util.logScriptAction(
      `Dream Portal found on "${gateName}"! Gate moved to "${dreamPortalLocation}".`
    );

    return dreamPortalLocation;
  } else if (dreamPortalLocation && kateWinthropFound) {
    Util.logScriptAction(
      `Dream Portal and Kate Winthrop found on "${gateName}"! The active investigator decides whether the Gate is discarded or moved to "${dreamPortalLocation}".`
    );

    return gateName;
  }

  return gateName;
}
