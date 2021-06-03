// @ts-nocheck
const {
  world,
  Card,
  Container,
  SnapPoint,
} = require("@tabletop-playground/api");

/** @type Card */
exports.assetDeck = world.getObjectById("asset-deck");
/** @type Card */
exports.conditionDeck = world.getObjectById("condition-deck");
/** @type Card */
exports.spellDeck = world.getObjectById("spell-deck");
/** @type Card */
exports.artifactDeck = world.getObjectById("artifact-deck");
/** @type EncounterCards */
exports.encounterDecks = {
  otherWorld: world.getObjectById("encounter-other-world-deck"),
  america: world.getObjectById("encounter-america-deck"),
  europe: world.getObjectById("encounter-europe-deck"),
  asia: world.getObjectById("encounter-asia-deck"),
  general: world.getObjectById("encounter-general-deck"),
  expedition: world.getObjectById("encounter-expedition-deck"),
};
/** @type Container */
exports.ancientContainer = world.getObjectById("ancient-container");

/** @type MythosSetupDecks */
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

/** @type Card */
exports.shipTicket = world.getObjectById("ship-ticket");
/** @type Card */
exports.trainTicket = world.getObjectById("train-ticket");
/** @type Card */
exports.doomToken = world.getObjectById("doom-token");
/** @type Card */
exports.rumorToken = world.getObjectById("rumor-token");
/** @type Card */
exports.eldritchToken = world.getObjectById("eldritch-token");
/** @type Card */
exports.mysteryToken = world.getObjectById("mystery-token");
/** @type Card */
exports.omenToken = world.getObjectById("omen-token");
/** @type Card */
exports.monsterCup = world.getObjectById("monster-cup");
/** @type Card */
exports.epicMonsterCup = world.getObjectById("epic-monster-cup");
/** @type Card */
exports.cluePool = world.getObjectById("clue-pool");
/** @type Card */
exports.gateStack = world.getObjectById("gate-stack");

const gameBoard = world.getObjectById("game-board");
exports.gameBoard = gameBoard;

/** @type GameBoardLocations */
exports.gameBoardLocations = {
  space: {
    Antarctica: gameBoard.getSnapPoint(15),
    Arkham: gameBoard.getSnapPoint(29),
    "Buenos Aries": gameBoard.getSnapPoint(34),
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

const tableMat = world.getObjectById("table-mat");
exports.tableLocations = {
  ancientOne: tableMat.getSnapPoint(30),
  mythosDeck: tableMat.getSnapPoint(31),
  /** @type Record<number, SnapPoint> */
  ancientOneMonsters: {
    0: tableMat.getSnapPoint(33),
    1: tableMat.getSnapPoint(34),
    2: tableMat.getSnapPoint(35),
  },
  mysteryDeck: tableMat.getSnapPoint(39),
  activeMystery: tableMat.getSnapPoint(40),
  research: tableMat.getSnapPoint(41),
  /** @type Record<number, SnapPoint> */
  specials: {
    0: tableMat.getSnapPoint(43),
    1: tableMat.getSnapPoint(45),
  },
};

exports.expansionSpawn = gameBoard.getPosition().add(new Vector(0, 0, 10));
