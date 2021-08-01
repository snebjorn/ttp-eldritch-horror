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
        Util.setPositionAtSnapPoint(doomToken, advancedDoomSnapShot);
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
          Util.setPositionAtSnapPoint(gateToken, snapPoint);

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
          Util.setPositionAtSnapPoint(clueToken, snapPoint);
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
    Util.setPositionAtSnapPoint(drawnAssetCard, reserveSnapPoint);
  }

  static drawDebtCondition() {
    const drawnDebtCard = Util.takeCardNameFromStack(conditionDeck, "Debt");
    if (!drawnDebtCard) {
      throw new Error("Unable to draw Debt card from the conditions deck");
    }

    Util.setPositionAtSnapPoint(drawnDebtCard, gameBoardLocations.bankLoan);
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
