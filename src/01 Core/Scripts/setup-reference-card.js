const { Util } = require("./util");
const { gateStack, gameBoardLocations, cluePool, monsterCup } = require("./world-constants");

/**
 * @param {IconReference | undefined} iconReference
 */
function setupReferenceCard(iconReference) {
  if (!iconReference) {
    return;
  }

  spawnGates(iconReference.spawnGates);
  spawnClues(iconReference.spawnClues);
}
exports.setupReferenceCard = setupReferenceCard;

/**
 * @param {number} number
 */
function spawnGates(number) {
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
function spawnClues(number) {
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
