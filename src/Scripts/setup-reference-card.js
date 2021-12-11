const { GameUtil } = require("./game-util");
const { Util } = require("./util");

/**
 * @param {IconReference | undefined} iconReference
 */
function setupReferenceCard(iconReference) {
  if (!iconReference) {
    return;
  }

  const spawnedGates = GameUtil.spawnGates(iconReference.spawnGates);
  if (spawnedGates.length > 0) {
    const spawnedGatesText = spawnedGates
      .map(([gateName, monsterName]) => `"${gateName}" with 1 monster (${monsterName})`)
      .join("; ");
    Util.logScriptAction(`SETUP spawned ${spawnedGates.length} gates; ${spawnedGatesText}.`);
  }

  const spawnedClues = GameUtil.spawnClues(iconReference.spawnClues);
  if (spawnedClues.length > 0) {
    const spawnedCluesText = spawnedClues.join('", "');
    Util.logScriptAction(
      `SETUP spawned ${spawnedClues.length} clues on spaces "${spawnedCluesText}".`
    );
  }
}
exports.setupReferenceCard = setupReferenceCard;
