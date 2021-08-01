const { GameUtil } = require("./game-util");

/**
 * @param {IconReference | undefined} iconReference
 */
function setupReferenceCard(iconReference) {
  if (!iconReference) {
    return;
  }

  GameUtil.spawnGates(iconReference.spawnGates);
  GameUtil.spawnClues(iconReference.spawnClues);
}
exports.setupReferenceCard = setupReferenceCard;
