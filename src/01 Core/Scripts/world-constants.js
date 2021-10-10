// @ts-nocheck
const { world, Card, Container, Vector, SnapPoint } = require("@tabletop-playground/api");

/** @type {Card} */
exports.investigatorDeck = world.getObjectById("investigator-deck");
/** @type {() => Card} */
exports.getAssetDeck = () => world.getObjectById("asset-deck");
/** @type {Card} */
exports.conditionDeck = world.getObjectById("condition-deck");
/** @type {Card} */
exports.spellDeck = world.getObjectById("spell-deck");
/** @type {Card} */
exports.artifactDeck = world.getObjectById("artifact-deck");
/** @type {EncounterCards} */
exports.encounterDecks = {
  otherWorld: world.getObjectById("encounter-other-world-deck"),
  america: world.getObjectById("encounter-america-deck"),
  europe: world.getObjectById("encounter-europe-deck"),
  asia: world.getObjectById("encounter-asia-deck"),
  general: world.getObjectById("encounter-general-deck"),
  expedition: world.getObjectById("encounter-expedition-deck"),
};
/** @type {Container} */
exports.ancientContainer = world.getObjectById("ancient-container");

/** @type {MythosSetupDecks} */
exports.mythosSetupDecks = {
  green: {
    easy: world.getObjectById("mythos-green-easy-deck"),
    medium: world.getObjectById("mythos-green-medium-deck"),
    hard: world.getObjectById("mythos-green-hard-deck"),
  },
  yellow: {
    easy: world.getObjectById("mythos-yellow-easy-deck"),
    medium: world.getObjectById("mythos-yellow-medium-deck"),
    hard: world.getObjectById("mythos-yellow-hard-deck"),
  },
  blue: {
    easy: world.getObjectById("mythos-blue-easy-deck"),
    medium: world.getObjectById("mythos-blue-medium-deck"),
    hard: world.getObjectById("mythos-blue-hard-deck"),
  },
};

/** @type {Card} */
exports.shipTicket = world.getObjectById("ship-ticket");
/** @type {Card} */
exports.trainTicket = world.getObjectById("train-ticket");
/** @type {Card} */
exports.doomToken = world.getObjectById("doom-token");
/** @type {Card} */
exports.rumorToken = world.getObjectById("rumor-token");
/** @type {Card} */
exports.eldritchToken = world.getObjectById("eldritch-token");
/** @type {Card} */
exports.mysteryToken = world.getObjectById("mystery-token");
/** @type {Card} */
exports.loreToken = world.getObjectById("improve-lore-token");
/** @type {Card} */
exports.influenceToken = world.getObjectById("improve-influence-token");
/** @type {Card} */
exports.observationToken = world.getObjectById("improve-observation-token");
/** @type {Card} */
exports.strengthToken = world.getObjectById("improve-strength-token");
/** @type {Card} */
exports.willToken = world.getObjectById("improve-will-token");
/** @type {Card} */
exports.omenToken = world.getObjectById("omen-token");
/** @type {Card} */
exports.monsterCup = world.getObjectById("monster-cup");
/** @type {Card} */
exports.epicMonsterCup = world.getObjectById("epic-monster-cup");
/** @type {() => Card} */
exports.getCluePool = () => world.getObjectById("clue-pool");
/** @type {() => Card} */
exports.getGateStack = () => world.getObjectById("gate-stack");
/** @type {Card} */
exports.activeExpeditionToken = world.getObjectById("active-expedition-token");

const gameBoard = world.getObjectById("game-board");
exports.gameBoard = gameBoard;

/** @type {GameBoardLocations} */
const gameBoardLocations = {
  space: {
    Antarctica: gameBoard.getSnapPoint(15),
    Arkham: gameBoard.getSnapPoint(29),
    "Buenos Aires": gameBoard.getSnapPoint(34),
    Istanbul: gameBoard.getSnapPoint(22),
    London: gameBoard.getSnapPoint(26),
    Rome: gameBoard.getSnapPoint(25),
    "San Francisco": gameBoard.getSnapPoint(46),
    Shanghai: gameBoard.getSnapPoint(8),
    Sydney: gameBoard.getSnapPoint(12),
    "The Amazon": gameBoard.getSnapPoint(32),
    "The Heart of Africa": gameBoard.getSnapPoint(19),
    "The Himalayas": gameBoard.getSnapPoint(80),
    "The Pyramids": gameBoard.getSnapPoint(20),
    Tokyo: gameBoard.getSnapPoint(6),
    Tunguska: gameBoard.getSnapPoint(3),
    1: gameBoard.getSnapPoint(44),
    2: gameBoard.getSnapPoint(45),
    3: gameBoard.getSnapPoint(39),
    4: gameBoard.getSnapPoint(43),
    5: gameBoard.getSnapPoint(42),
    6: gameBoard.getSnapPoint(41),
    7: gameBoard.getSnapPoint(40),
    8: gameBoard.getSnapPoint(32),
    9: gameBoard.getSnapPoint(28),
    10: gameBoard.getSnapPoint(38),
    11: gameBoard.getSnapPoint(36),
    12: gameBoard.getSnapPoint(37),
    13: gameBoard.getSnapPoint(0),
    14: gameBoard.getSnapPoint(1),
    15: gameBoard.getSnapPoint(17),
    16: gameBoard.getSnapPoint(2),
    17: gameBoard.getSnapPoint(77),
    18: gameBoard.getSnapPoint(14),
    19: gameBoard.getSnapPoint(5),
    20: gameBoard.getSnapPoint(10),
    21: gameBoard.getSnapPoint(11),
  },
  bankLoan: gameBoard.getSnapPoint(79),
  reserve: [
    gameBoard.getSnapPoint(48),
    gameBoard.getSnapPoint(49),
    gameBoard.getSnapPoint(50),
    gameBoard.getSnapPoint(51),
  ],
  doom: {
    0: gameBoard.getSnapPoint(56),
    1: gameBoard.getSnapPoint(57),
    2: gameBoard.getSnapPoint(58),
    3: gameBoard.getSnapPoint(59),
    4: gameBoard.getSnapPoint(60),
    5: gameBoard.getSnapPoint(61),
    6: gameBoard.getSnapPoint(62),
    7: gameBoard.getSnapPoint(63),
    8: gameBoard.getSnapPoint(64),
    9: gameBoard.getSnapPoint(65),
    10: gameBoard.getSnapPoint(66),
    11: gameBoard.getSnapPoint(67),
    12: gameBoard.getSnapPoint(68),
    13: gameBoard.getSnapPoint(69),
    14: gameBoard.getSnapPoint(70),
    15: gameBoard.getSnapPoint(71),
    16: gameBoard.getSnapPoint(72),
    17: gameBoard.getSnapPoint(73),
    18: gameBoard.getSnapPoint(74),
    19: gameBoard.getSnapPoint(75),
    20: gameBoard.getSnapPoint(76),
  },
  omen: {
    green: gameBoard.getSnapPoint(52),
    blue1: gameBoard.getSnapPoint(53),
    red: gameBoard.getSnapPoint(54),
    blue2: gameBoard.getSnapPoint(55),
  },
};
exports.gameBoardLocations = gameBoardLocations;

const tableMat = world.getObjectById("table-mat");
exports.tableLocations = {
  ancientOne: tableMat.getSnapPoint(30),
  mythosDeck: tableMat.getSnapPoint(31),
  activeMythos: tableMat.getSnapPoint(32),
  /**
   * Snap points for Set Aside monsters
   *
   * @type {SnapPoint[]}
   * */
  ancientOneMonsters: [
    tableMat.getSnapPoint(33),
    tableMat.getSnapPoint(34),
    tableMat.getSnapPoint(35),
    tableMat.getSnapPoint(36),
    tableMat.getSnapPoint(37),
    tableMat.getSnapPoint(38),
  ],
  mysteryDeck: tableMat.getSnapPoint(39),
  activeMystery: tableMat.getSnapPoint(40),
  /** @type {SnapPoint} */
  research: tableMat.getSnapPoint(43),
  /** @type {SnapPoint[]} */
  specials: [tableMat.getSnapPoint(45), tableMat.getSnapPoint(62)],
  focus: tableMat.getSnapPoint(49),
  resource: tableMat.getSnapPoint(50),
  impairment: {
    lore: tableMat.getSnapPoint(51),
    influence: tableMat.getSnapPoint(52),
    observation: tableMat.getSnapPoint(53),
    strength: tableMat.getSnapPoint(54),
    will: tableMat.getSnapPoint(55),
  },
  devastationToken: tableMat.getSnapPoint(64),
  assetDeck: tableMat.getSnapPoint(26),
  assetDiscardPile: tableMat.getSnapPoint(22),
  uniqueAssets: tableMat.getSnapPoint(27),
  artifactDeck: tableMat.getSnapPoint(28),
  spellDeck: tableMat.getSnapPoint(29),
  conditionDeck: tableMat.getSnapPoint(27),
  preludes: new Vector(52, -78.5, 88),
  preludeCardHolder: new Vector(52.5, -86, 88),
  adventureDeck: tableMat.getSnapPoint(58),
  activeAdventure: tableMat.getSnapPoint(59),
  disasterDeck: tableMat.getSnapPoint(65),
  activeDisaster: tableMat.getSnapPoint(66),
  /** @type {SnapPoint[]} */
  topDeckRow: [
    tableMat.getSnapPoint(41),
    tableMat.getSnapPoint(17),
    tableMat.getSnapPoint(15),
    tableMat.getSnapPoint(13),
    tableMat.getSnapPoint(11),
    tableMat.getSnapPoint(9),
    tableMat.getSnapPoint(7),
    tableMat.getSnapPoint(57),
    tableMat.getSnapPoint(61),
  ],
  monsterCup: tableMat.getSnapPoint(67),
  epicMonsterCup: tableMat.getSnapPoint(68),
  cluePool: tableMat.getSnapPoint(69),
  clueDiscardPile: tableMat.getSnapPoint(70),
  gateStack: tableMat.getSnapPoint(71),
  gateDiscardPile: tableMat.getSnapPoint(72),
};

exports.expansionSpawn = gameBoard.getPosition().add(new Vector(0, 0, 10));

const gameBoardPaths = {
  Antarctica: { paths: [], snapPoint: gameBoardLocations.space.Antarctica },
  Arkham: { paths: [], snapPoint: gameBoardLocations.space.Arkham },
  "Buenos Aires": { paths: [], snapPoint: gameBoardLocations.space["Buenos Aires"] },
  Istanbul: { paths: [], snapPoint: gameBoardLocations.space.Istanbul },
  London: { paths: [], snapPoint: gameBoardLocations.space.London },
  Rome: { paths: [], snapPoint: gameBoardLocations.space.Rome },
  "San Francisco": { paths: [], snapPoint: gameBoardLocations.space["San Francisco"] },
  Shanghai: { paths: [], snapPoint: gameBoardLocations.space.Shanghai },
  Sydney: { paths: [], snapPoint: gameBoardLocations.space.Sydney },
  "The Amazon": { paths: [], snapPoint: gameBoardLocations.space["The Amazon"] },
  "The Heart of Africa": {
    paths: [],
    snapPoint: gameBoardLocations.space["The Heart of Africa"],
  },
  "The Himalayas": { paths: [], snapPoint: gameBoardLocations.space["The Himalayas"] },
  "The Pyramids": { paths: [], snapPoint: gameBoardLocations.space["The Pyramids"] },
  Tokyo: { paths: [], snapPoint: gameBoardLocations.space.Tokyo },
  Tunguska: { paths: [], snapPoint: gameBoardLocations.space.Tunguska },
  1: { paths: [], snapPoint: gameBoardLocations.space[1] },
  2: { paths: [], snapPoint: gameBoardLocations.space[2] },
  3: { paths: [], snapPoint: gameBoardLocations.space[3] },
  4: { paths: [], snapPoint: gameBoardLocations.space[4] },
  5: { paths: [], snapPoint: gameBoardLocations.space[5] },
  6: { paths: [], snapPoint: gameBoardLocations.space[6] },
  7: { paths: [], snapPoint: gameBoardLocations.space[7] },
  8: { paths: [], snapPoint: gameBoardLocations.space[8] },
  9: { paths: [], snapPoint: gameBoardLocations.space[9] },
  10: { paths: [], snapPoint: gameBoardLocations.space[10] },
  11: { paths: [], snapPoint: gameBoardLocations.space[11] },
  12: { paths: [], snapPoint: gameBoardLocations.space[12] },
  13: { paths: [], snapPoint: gameBoardLocations.space[13] },
  14: { paths: [], snapPoint: gameBoardLocations.space[14] },
  15: { paths: [], snapPoint: gameBoardLocations.space[15] },
  16: { paths: [], snapPoint: gameBoardLocations.space[16] },
  17: { paths: [], snapPoint: gameBoardLocations.space[17] },
  18: { paths: [], snapPoint: gameBoardLocations.space[18] },
  19: { paths: [], snapPoint: gameBoardLocations.space[19] },
  20: { paths: [], snapPoint: gameBoardLocations.space[20] },
  21: { paths: [], snapPoint: gameBoardLocations.space[21] },
};
gameBoardPaths.Antarctica.paths.push(gameBoardPaths[12], gameBoardPaths.Sydney);
gameBoardPaths.Arkham.paths.push(
  gameBoardPaths[5],
  gameBoardPaths[6],
  gameBoardPaths[8],
  gameBoardPaths[9],
  gameBoardPaths.London
);
gameBoardPaths["Buenos Aires"].paths.push(
  gameBoardPaths[3],
  gameBoardPaths[7],
  gameBoardPaths[8],
  gameBoardPaths[11],
  gameBoardPaths[12],
  gameBoardPaths["The Amazon"]
);
gameBoardPaths.Istanbul.paths.push(
  gameBoardPaths[16],
  gameBoardPaths[17],
  gameBoardPaths.Rome,
  gameBoardPaths["The Pyramids"]
);
gameBoardPaths.London.paths.push(gameBoardPaths[13], gameBoardPaths.Arkham, gameBoardPaths.Rome);
gameBoardPaths.Rome.paths.push(gameBoardPaths[10], gameBoardPaths[14], gameBoardPaths.London);
gameBoardPaths["San Francisco"].paths.push(
  gameBoardPaths[1],
  gameBoardPaths[2],
  gameBoardPaths[5],
  gameBoardPaths[6],
  gameBoardPaths[7]
);
gameBoardPaths.Shanghai.paths.push(
  gameBoardPaths[17],
  gameBoardPaths[19],
  gameBoardPaths[20],
  gameBoardPaths["The Himalayas"],
  gameBoardPaths.Tokyo
);
gameBoardPaths.Sydney.paths.push(
  gameBoardPaths[3],
  gameBoardPaths[18],
  gameBoardPaths[20],
  gameBoardPaths[21],
  gameBoardPaths.Antarctica
);
gameBoardPaths["The Amazon"].paths.push(gameBoardPaths[7], gameBoardPaths["Buenos Aires"]);
gameBoardPaths["The Heart of Africa"].paths.push(
  gameBoardPaths[15],
  gameBoardPaths["The Pyramids"]
);
gameBoardPaths["The Himalayas"].paths.push(gameBoardPaths[17], gameBoardPaths.Shanghai);
gameBoardPaths["The Pyramids"].paths.push(
  gameBoardPaths[10],
  gameBoardPaths.Rome,
  gameBoardPaths["The Heart of Africa"]
);
gameBoardPaths.Tokyo.paths.push(
  gameBoardPaths[2],
  gameBoardPaths[19],
  gameBoardPaths[20],
  gameBoardPaths.Shanghai
);
gameBoardPaths.Tunguska.paths.push(gameBoardPaths[16], gameBoardPaths[19]);
gameBoardPaths[1].paths.push(
  gameBoardPaths[4],
  gameBoardPaths[19],
  gameBoardPaths["San Francisco"]
);
gameBoardPaths[2].paths.push(gameBoardPaths.Tokyo, gameBoardPaths["San Francisco"]);
gameBoardPaths[3].paths.push(gameBoardPaths.Sydney, gameBoardPaths["Buenos Aires"]);
gameBoardPaths[4].paths.push(gameBoardPaths[1], gameBoardPaths[5]);
gameBoardPaths[5].paths.push(
  gameBoardPaths[4],
  gameBoardPaths["San Francisco"],
  gameBoardPaths.Arkham
);
gameBoardPaths[6].paths.push(
  gameBoardPaths[7],
  gameBoardPaths["San Francisco"],
  gameBoardPaths.Arkham
);
gameBoardPaths[7].paths.push(
  gameBoardPaths[6],
  gameBoardPaths[8],
  gameBoardPaths["San Francisco"],
  gameBoardPaths["The Amazon"]
);
gameBoardPaths[8].paths.push(
  gameBoardPaths[7],
  gameBoardPaths[10],
  gameBoardPaths.Arkham,
  gameBoardPaths["Buenos Aires"]
);
gameBoardPaths[9].paths.push(gameBoardPaths.Arkham);
gameBoardPaths[10].paths.push(
  gameBoardPaths[8],
  gameBoardPaths[15],
  gameBoardPaths.Rome,
  gameBoardPaths["The Pyramids"]
);
gameBoardPaths[11].paths.push(gameBoardPaths[15], gameBoardPaths["Buenos Aires"]);
gameBoardPaths[12].paths.push(gameBoardPaths["Buenos Aires"], gameBoardPaths.Antarctica);
gameBoardPaths[13].paths.push(gameBoardPaths.London);
gameBoardPaths[14].paths.push(gameBoardPaths[16], gameBoardPaths.Rome);
gameBoardPaths[15].paths.push(
  gameBoardPaths[10],
  gameBoardPaths[11],
  gameBoardPaths[17],
  gameBoardPaths[18],
  gameBoardPaths["The Heart of Africa"]
);
gameBoardPaths[16].paths.push(gameBoardPaths[14], gameBoardPaths.Rome, gameBoardPaths.Tunguska);
gameBoardPaths[17].paths.push(
  gameBoardPaths[15],
  gameBoardPaths[20],
  gameBoardPaths.Istanbul,
  gameBoardPaths["The Himalayas"],
  gameBoardPaths.Shanghai
);
gameBoardPaths[18].paths.push(gameBoardPaths[15], gameBoardPaths.Sydney);
gameBoardPaths[19].paths.push(
  gameBoardPaths[1],
  gameBoardPaths.Tunguska,
  gameBoardPaths.Shanghai,
  gameBoardPaths.Tokyo
);
gameBoardPaths[20].paths.push(
  gameBoardPaths[17],
  gameBoardPaths.Shanghai,
  gameBoardPaths.Tokyo,
  gameBoardPaths.Sydney
);
gameBoardPaths[21].paths.push(gameBoardPaths.Sydney);

exports.gameBoardPaths = gameBoardPaths;
