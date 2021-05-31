const { world } = require("@tabletop-playground/api");
const {
  assetDeck,
  conditionDeck,
  spellDeck,
  artifactDeck,
  encounterDecks,
  cluePool,
  gateStack,
  monsterCup,
} = require("./world-constants");
const { setupAncient } = require("./setup-ancient");

// MUST be first thing to happen!
initGlobalObject();

world.broadcastChatMessage(`
#################
##  Eldritch  Horror  ##
#################

To get started open the "Scripting console" and follow the instructions.

###############
## Using tokens ##
###############

When you need to use the tokens (improvement/ticket/rumor/eldritch/mystery) don't pick them up. Simply copy and paste it (CTRL+C/CTRL+V)
Delete your copy when you no longer need it.
`);

console.log(`Run the setupGame function to setup the game with a specific ancient one.

Definition:
function setupGame(ancientName: string)

Example:
setupGame("Shub-Niggurath")

To see the available ancient ones type:
setupGame()`);

/**
 * @param {string} ancientName
 * @param {GameDifficulty} [difficulty]
 */
// @ts-ignore - temporary measures until a proper UI is implemented
setupGame = (ancientName, difficulty) => {
  let selectedDifficulty = {
    isEasy: true,
    isMedium: true,
    isHard: true,
    ...difficulty,
  };
  const foundAncientOne = world.__eldritchHorror.ancientOnes.find(
    (x) => x.name == ancientName
  );
  if (foundAncientOne) {
    setupAncient(foundAncientOne, selectedDifficulty);
    shuffleDecks();
    shuffleTokens();
  } else {
    var availableAncientOnes = world.__eldritchHorror.ancientOnes
      .map((x) => `"${x.name}"`)
      .join("\n");
    return `Unable to find "${ancientName}".

Available Ancient Ones are:
${availableAncientOnes}`;
  }
  // @ts-ignore
  setupGame = () => `${ancientName} have already be setup!`;
  return `${ancientName} have been setup!`;
};

function shuffleDecks() {
  assetDeck.shuffle();
  conditionDeck.shuffle();
  spellDeck.shuffle();
  artifactDeck.shuffle();
  Object.values(encounterDecks).forEach((encounterDeck) =>
    encounterDeck.shuffle()
  );
}

function shuffleTokens() {
  monsterCup.shuffle();
  cluePool.shuffle();
  gateStack.shuffle();
}

function initGlobalObject() {
  world.__eldritchHorror = {
    investigators: [],
    ancientOnes: [],
    alreadyLoaded: [],
  };
}
