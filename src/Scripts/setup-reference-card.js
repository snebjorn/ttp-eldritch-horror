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
  if (spawnedGates.length === 1) {
    const [gateName, monsterName, spawnEffect] = spawnedGates[0];
    Util.logScriptAction(
      `SETUP (Step 9E) spawned 1 Gate on ${gateName} with ${monsterName} Monster.`
    );
    if (spawnEffect) {
      Util.logScriptAction(`Spawn Effect (${monsterName}): ${spawnEffect}.`);
    }
  } else if (spawnedGates.length > 1) {
    const spawnedGatesText = spawnedGates
      .map(
        ([gateName, monsterName, spawnEffect]) =>
          `\t- ${gateName} with ${monsterName} Monster. ${
            spawnEffect ? `\n\t\t- Spawn Effect (${monsterName}): ${spawnEffect}.` : ""
          }`
      )
      .join("\n");
    Util.logScriptAction(
      `SETUP (Step 9E) spawned ${spawnedGates.length} Gates on:\n${spawnedGatesText}`
    );
  }

  const spawnedClues = GameUtil.spawnClues(iconReference.spawnClues);
  if (spawnedClues.length > 0) {
    const spawnedCluesText = spawnedClues.join(", ");
    Util.logScriptAction(
      `SETUP (Step 9G) spawned ${spawnedClues.length} Clues on spaces: ${spawnedCluesText}.`
    );
  }
}
exports.setupReferenceCard = setupReferenceCard;
