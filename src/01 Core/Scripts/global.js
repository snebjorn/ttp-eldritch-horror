const { world } = require("@tabletop-playground/api");
const { drawSetupUi } = require("./setup-ui");

// MUST be first thing to happen!
initGlobalObject();

world.broadcastChatMessage(`
#################
##  Eldritch  Horror  ##
#################

To get started select the desired expansion(s), difficulty and ancient one in the UI.

###############
## Using tokens ##
###############

When you need to use the tokens (improvement/ticket/rumor/eldritch/mystery) don't pick them up. Simply copy and paste it (CTRL+C/CTRL+V)
Delete your copy when you no longer need it.
`);

function initGlobalObject() {
  world.__eldritchHorror = {
    investigators: [],
    ancientOnes: [],
    alreadyLoaded: [],
  };
}

drawSetupUi();
