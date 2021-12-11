const { refContainer, Vector, Card } = require("@tabletop-playground/api");
const { Util } = require("./util");
const { tableLocations } = require("./world-constants");

const rebuildGateAction = "Re-build Gate Stack";

refContainer.onCustomAction.add((container, player, actionName) => {
  if (actionName === rebuildGateAction) {
    const gateStackPosition = tableLocations.gateStack;
    if (!gateStackPosition) {
      throw new Error("Unable to find gate stack position.");
    }
    let newGateStack;
    const positionAboveContainer = container.getPosition().add(new Vector(0, 0, 5));
    for (const gameObject of container.getItems()) {
      if (gameObject instanceof Card && gameObject.getTemplateName().startsWith("Gates")) {
        container.take(gameObject, positionAboveContainer, false);
        if (gameObject.isFaceUp()) {
          Util.flip(gameObject);
        }
        if (newGateStack) {
          newGateStack.addCards(gameObject);
        } else {
          newGateStack = gameObject;
        }
      }
    }

    if (newGateStack) {
      newGateStack.setId("gate-stack");
      newGateStack.setName("Gate Stack");
      newGateStack.setScript("gate-stack.js", "8A0B748B4DA2CE04CB79E4A02C7FD720");

      Util.moveOrAddObject(newGateStack, gateStackPosition);
    }

    Util.logScriptAction(
      `${player.getName()} placed the Gate tokens from the discard pile facedown in the Gate stack and randomize them.`,
      player
    );
  }
});

refContainer.addCustomAction(
  rebuildGateAction,
  "Place the Gate tokens from the discard pile facedown in the Gate stack and randomize them"
);
