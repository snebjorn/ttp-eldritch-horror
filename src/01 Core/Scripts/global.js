const { world } = require("@tabletop-playground/api");
const { drawSetupUi } = require("./setup-ui");

// MUST be first thing to happen!
initGlobalObject();

world.broadcastChatMessage(`
#################
##  Eldritch  Horror  ##
#################

To get started select the desired expansion(s), difficulty and Ancient One in the UI.
`);

function initGlobalObject() {
  world.__eldritchHorror = {
    investigators: [],
    ancientOnes: [],
    alreadyLoaded: [],
  };
}

drawSetupUi();
