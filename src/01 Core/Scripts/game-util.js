const { Vector, SnapPoint } = require("@tabletop-playground/api");
const { Util } = require("./util");
const {
  eldritchToken,
  gameBoardLocations,
  doomToken,
  gateStack,
  cluePool,
  monsterCup,
  assetDeck,
  conditionDeck,
} = require("./world-constants");

class GameUtil {
  /**
   * @param {number} number
   */
  static advanceDoom(number) {
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
   * @param {number} number
   */
  static takeEldritchTokens(number) {
    const stackPos = eldritchToken.getPosition().add(new Vector(0, 0, 3));
    const tokenStack = Util.createCard("2B59F5E24A16BA40DBA5DEB42AA14D89", stackPos);

    if (number > 1) {
      for (let i = 1; i < number; i++) {
        tokenStack.addCards(Util.createCard("2B59F5E24A16BA40DBA5DEB42AA14D89", stackPos));
      }
    }

    return tokenStack;
  }

  /**
   * @param {number} number
   * @throws If unable to take ship token from travel tickets template object
   */
  static takeShipTokens(number) {
    const stackPos = shipTicket.getPosition().add(new Vector(0, 0, 3));
    const travelTickets = Util.createCard("934AA7324CE46C2AC3DF2999F5F3EFEB", stackPos);
    const shipTokens = Util.takeCardNameFromStack(travelTickets, "ship");
    travelTickets.destroy();

    if (!shipTokens) {
      throw new Error("Unable to take ship token");
    }

    if (number > 1) {
      const json = shipTokens.toJSONString();
      for (let i = 1; i < number; i++) {
        const copiedToken = Util.cloneCardFromJson(json, stackPos);
        shipTokens.addCards(copiedToken);
      }
    }

    return shipTokens;
  }

  /**
   * @param {number} number
   * @throws If unable to find snap point for spawned gate
   */
  static spawnGates(number) {
    for (let i = 0; i < number; i++) {
      const gateToken = gateStack.takeCards(1);
      if (gateToken) {
        const cardDetails = gateToken.getCardDetails();
        if (cardDetails) {
          Util.flip(gateToken);
          const gateName = cardDetails.name;
          // @ts-ignore
          const snapPoint = gameBoardLocations.space[gateName];
          if (!snapPoint) {
            throw new Error(`Cannot find snap point for gate: ${gateName}`);
          }
          Util.moveObject(gateToken, snapPoint);

          const monsterToken = monsterCup.takeCards(1);
          if (monsterToken) {
            Util.setPositionAtSnapPoint(monsterToken, snapPoint);
          }
        }
      }
    }
  }

  /**
   * @param {number} number
   */
  static spawnClues(number) {
    for (let i = 0; i < number; i++) {
      const clueToken = cluePool.takeCards(1);
      if (clueToken) {
        const cardDetails = clueToken.getCardDetails();
        if (cardDetails) {
          const clueName = cardDetails.name;
          // @ts-ignore
          const snapPoint = gameBoardLocations.space[clueName];
          if (!snapPoint) {
            throw new Error(`Cannot find snap point for clue: ${clueName}`);
          }
          Util.moveObject(clueToken, snapPoint);
        }
      }
    }
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
    const drawnAssetCard = assetDeck.takeCards(1);
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

    Util.moveObject(drawnDebtCard, gameBoardLocations.bankLoan);
  }

  static getActivePrelude() {
    if (world.__eldritchHorror.activePrelude) {
      return world.__eldritchHorror.preludes.get(world.__eldritchHorror.activePrelude);
    }
  }

  static getActiveAncientOne() {
    return world.__eldritchHorror.activeAncientOne;
  }

  /**
   * @param {GameObject} deck
   */
  static addEncounterDeck(deck) {
    Util.insertObjectAt(deck, tableLocations.topDeckRow, 0);

    return tableLocations.topDeckRow[0];
  }

  /**
   * Moves the given monster stack near the ancient one sheet, this is considered "set aside"
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
      Util.moveObject(monster, position);
    }

    return monster;
  }

  /**
   * @param {string} monsterName
   * @param {SnapPoint} snapPoint
   * @throws If unable to find `monsterName`
   */
  static spawnEpicMonster(monsterName, snapPoint) {
    const epicMonster = Util.takeCardNameFromStack(epicMonsterCup, monsterName);
    if (!epicMonster) {
      throw new Error(`Unable to find "${monsterName}" in the epic monster cup`);
    }

    Util.moveObject(epicMonster, snapPoint);

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
          const cardDetails = snappedObject.getCardDetails();
          if (cardDetails && cardDetails.name === monsterName) {
            return snappedObject;
          }
        }
      }
    }
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
