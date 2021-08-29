const { Card, Vector, world, GameObject, SnapPoint } = require("@tabletop-playground/api");
// @ts-ignore
const { Util } = require("../../940067/Scripts/util");

const egypt = {
  sideBoardMat: "6B6A6368464FC1EBD8FAA09411D3CD08",
  sideBoard: "00124F9744267FEFFBCF4EA4EE9F4D50",
  africaCards: "BE2E3D544FD451C638985AAB7EA9A5B6",
  egyptCards: "81835B8C413FA8292907DE8F594C2694",
  clues: "AE73159D4BCD49172E91AA912FD04AAF",
  gates: "070F974949AA03A11262EC9AB035B20C",
};

/**
 * @param {Vector} spawnPosition
 */
function setupSideBoard(spawnPosition) {
  if (world.__eldritchHorror.alreadyLoaded.includes(egypt.sideBoardMat)) {
    return; // abort - side board is already loaded
  }

  const sideBoardMat = Util.createGameObject(egypt.sideBoardMat, spawnPosition);
  const matSnaps = {
    board: sideBoardMat.getSnapPoint(0),
    africa: sideBoardMat.getSnapPoint(2),
    egypt: sideBoardMat.getSnapPoint(3),
    adventure: sideBoardMat.getSnapPoint(7),
    activeAdventure: sideBoardMat.getSnapPoint(8),
    monster1: sideBoardMat.getSnapPoint(9),
    monster2: sideBoardMat.getSnapPoint(10),
    monster3: sideBoardMat.getSnapPoint(11),
    monster4: sideBoardMat.getSnapPoint(12),
  };

  if (!matSnaps.board) {
    throw new Error("Cannot find position for egypt side board");
  }
  const sideBoard = Util.createGameObject(egypt.sideBoard, spawnPosition);
  Util.moveObject(sideBoard, matSnaps.board);

  const groupId = Util.getNextGroupId();
  sideBoardMat.setGroupId(groupId);
  sideBoard.setGroupId(groupId);

  registerSpaces(sideBoard, matSnaps);

  if (!matSnaps.africa) {
    throw new Error("Cannot find position for egypt mountain cards");
  }
  const africaCards = Util.createCard(egypt.africaCards, spawnPosition);
  Util.moveObject(africaCards, matSnaps.africa);
  africaCards.setName("Africa Encounters");
  africaCards.setId("encounter-africa-deck");
  africaCards.shuffle();

  if (!matSnaps.egypt) {
    throw new Error("Cannot find position for egypt outpost cards");
  }
  const egyptCards = Util.createCard(egypt.egyptCards, spawnPosition);
  Util.moveObject(egyptCards, matSnaps.egypt);
  egyptCards.setName("Egypt Encounters");
  egyptCards.setId("encounter-egypt-deck");
  egyptCards.shuffle();

  /** @type Card | undefined */
  // @ts-ignore
  const monsterCup = world.getObjectById("monster-cup");
  if (!monsterCup) {
    throw new Error("Cannot find monster cup");
  }
  const mummy = Util.takeCardNameFromStack(monsterCup, "Mummy");
  if (!mummy) {
    throw new Error("Cannot find Mummy in the monster cup");
  }
  if (!matSnaps.monster1) {
    throw new Error("Cannot find position for monster on egypt");
  }
  Util.moveObject(mummy, matSnaps.monster1);

  const sandDweller = Util.takeCardNameFromStack(monsterCup, "Sand Dweller");
  if (!sandDweller) {
    throw new Error("Cannot find Sand Dweller in the monster cup");
  }
  if (!matSnaps.monster2) {
    throw new Error("Cannot find position for monster on egypt");
  }
  Util.moveObject(sandDweller, matSnaps.monster2);

  const spawnOfSebak = Util.takeCardNameFromStack(monsterCup, "Spawn of Sebak");
  if (!spawnOfSebak) {
    throw new Error("Cannot find Spawn of Sebak in the monster cup");
  }
  if (!matSnaps.monster3) {
    throw new Error("Cannot find position for monster on egypt");
  }
  Util.moveObject(spawnOfSebak, matSnaps.monster3);

  /** @type Card | undefined */
  // @ts-ignore
  const gateStack = world.getObjectById("gate-stack");
  if (!gateStack) {
    throw new Error("Cannot find gate stack");
  }
  const gates = Util.createCard(egypt.gates, spawnPosition.add(new Vector(0, 0, 1)));
  gateStack.addCards(gates);

  /** @type Card | undefined */
  // @ts-ignore
  const cluePool = world.getObjectById("clue-pool");
  if (!cluePool) {
    throw new Error("Cannot find clue pool");
  }
  const clues = Util.createCard(egypt.clues, spawnPosition.add(new Vector(0, 0, 1)));
  cluePool.addCards(clues);

  world.__eldritchHorror.alreadyLoaded.push(egypt.sideBoardMat);
}
exports.setupSideBoard = setupSideBoard;

/**
 * @param {GameObject} sideBoard
 * @param {Record<string, SnapPoint | undefined>} matSnaps */
function registerSpaces(sideBoard, matSnaps) {
  const sideBoardSpaces = {
    "The Sahara Desert": sideBoard.getSnapPoint(0),
    Alexandria: sideBoard.getSnapPoint(1),
    "The Bent Pyramid": sideBoard.getSnapPoint(2),
    Cairo: sideBoard.getSnapPoint(3),
    "Tel el-Amarna": sideBoard.getSnapPoint(4),
    "The Nile River": sideBoard.getSnapPoint(5),
  };

  // @ts-ignore - don't try this at home kids
  const { gameBoardLocations } = require("../../Eldritch Horror/Scripts/world-constants");
  gameBoardLocations.space = { ...gameBoardLocations.space, ...sideBoardSpaces };
  gameBoardLocations.egyptSideBoard = matSnaps;
}
