const { world } = require("@tabletop-playground/api");
const { GameUtil } = require("./game-util");
const { drawSetupUi } = require("./setup-ui");

// MUST be first thing to happen!
initGlobalObject();

function initGlobalObject() {
  world.__eldritchHorror = {
    investigators: [],
    ancientOnes: new Map(),
    alreadyLoaded: [],
    preludes: new Map(),
    mysticRuins: new Set(),
  };
}

if (GameUtil.getSavedData().sets.length === 0) {
  world.broadcastChatMessage(`
#################
##  Eldritch  Horror  ##
#################

To get started follow the steps in the setup UI.

Note that cards marked with an Elder sign (star symbol) have been altered in the Errata and you'll have to refer to the "FAQ, errata and clarifications" PDF in the Rules bag.
`);
  drawSetupUi();
}
