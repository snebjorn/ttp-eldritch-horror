const { refContainer, Vector, Card } = require("@tabletop-playground/api");
const { Util } = require("./util");
const { tableLocations } = require("./world-constants");

const rebuildClueAction = "Re-build Clue Pool";

refContainer.onCustomAction.add((container, player, actionName) => {
  if (actionName === rebuildClueAction) {
    const cluePoolPosition = tableLocations.cluePool;
    if (!cluePoolPosition) {
      throw new Error("Unable to find clue pool position.");
    }
    let newCluePool;
    const positionAboveContainer = container.getPosition().add(new Vector(0, 0, 5));
    for (const gameObject of container.getItems()) {
      if (gameObject instanceof Card && gameObject.getTemplateName().startsWith("Clues")) {
        container.take(gameObject, positionAboveContainer, false);
        if (gameObject.isFaceUp()) {
          Util.flip(gameObject);
        }
        if (newCluePool) {
          newCluePool.addCards(gameObject);
        } else {
          newCluePool = gameObject;
        }
      }
    }

    if (newCluePool) {
      newCluePool.setId("clue-pool");
      newCluePool.setName("Clue Pool");
      newCluePool.setScript("clue-pool.js", "8A0B748B4DA2CE04CB79E4A02C7FD720");

      Util.moveOrAddObject(newCluePool, cluePoolPosition);
    }

    Util.logScriptAction(
      `${player.getName()} placed all discarded Clue tokens facedown in the Clue pool and randomize them.`,
      player
    );
  }
});

refContainer.addCustomAction(
  rebuildClueAction,
  "Place all discarded Clue tokens facedown in the Clue pool and randomize them"
);
