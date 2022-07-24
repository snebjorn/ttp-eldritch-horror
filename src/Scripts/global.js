const { world, globalEvents } = require("@tabletop-playground/api");
const { GameUtil } = require("./game-util");
const { drawSetupUi } = require("./setup-ui");
const { Util } = require("./util");

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

world.setShowDiceRollMessages(false);
globalEvents.onDiceRolled.add((player, dice) => {
  const summary = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    successes: 0,
  };
  for (const die of dice) {
    const dieFace = Number(die.getCurrentFaceName());
    // @ts-ignore
    summary[dieFace]++;

    const templateName = die.getTemplateName();
    if (templateName === "D6 Blessed" && dieFace >= 4) {
      summary.successes++;
    } else if (templateName === "D6 Normal" && dieFace >= 5) {
      summary.successes++;
    } else if (templateName === "D6 Cursed" && dieFace === 6) {
      summary.successes++;
    }
  }

  const playerName = player.getName();
  const summaryText = Object.entries(summary)
    .filter(([key, value]) => key !== "successes" && value > 0)
    .map(([key, value]) => `[${key} x ${value}]`)
    .join(" + ");

  const successPluralized = summary.successes > 1 ? "successes" : "success";

  if (summary.successes > 0) {
    world.broadcastChatMessage(
      `${playerName} rolled ${dice.length} dice ${summaryText} = ${summary.successes} ${successPluralized}`,
      Util.Colors.GREEN
    );
    player.showMessage(`You rolled ${summary.successes} ${successPluralized}!`);
  } else {
    world.broadcastChatMessage(
      `${playerName} rolled ${dice.length} dice ${summaryText} = ${summary.successes} successes`,
      Util.Colors.LIGHT_CORAL
    );
    player.showMessage("Your roll failed!");
  }
});
