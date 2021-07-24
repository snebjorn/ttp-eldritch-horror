const { Vector } = require("@tabletop-playground/api");
const { Util } = require("./util");
const { eldritchToken, gameBoardLocations, doomToken } = require("./world-constants");

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
