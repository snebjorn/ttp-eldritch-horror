const { Vector, world } = require("@tabletop-playground/api");
const { Util } = require("../util");
const { gameBoardLocations } = require("../world-constants");

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
  if (world.getObjectsByTemplateId(egypt.sideBoardMat).length > 0) {
    return; // abort - side board is already loaded
  }

  const sideBoardMat = Util.createGameObject(egypt.sideBoardMat, spawnPosition);
  if (!gameBoardLocations.egyptMat) {
    throw new Error("Unable to find snap points for Egypt side board mat");
  }

  const sideBoard = Util.createGameObject(egypt.sideBoard, spawnPosition);
  sideBoard.setId("side-board-egypt");
  Util.moveObject(sideBoard, gameBoardLocations.egyptMat.board);

  const groupId = Util.getNextGroupId();
  sideBoardMat.setGroupId(groupId);
  sideBoard.setGroupId(groupId);

  const africaCards = Util.createCard(egypt.africaCards, spawnPosition);
  Util.moveObject(africaCards, gameBoardLocations.egyptMat.africa);
  africaCards.setName("Africa Encounters");
  africaCards.setId("encounter-africa-deck");
  africaCards.shuffle();

  const egyptCards = Util.createCard(egypt.egyptCards, spawnPosition);
  Util.moveObject(egyptCards, gameBoardLocations.egyptMat.egypt);
  egyptCards.setName("Egypt Encounters");
  egyptCards.setId("encounter-egypt-deck");
  egyptCards.shuffle();

  const monsterCup = Util.getCardObjectById("monster-cup");
  const mummy = Util.takeCardNameFromStack(monsterCup, "Mummy");
  if (!mummy) {
    throw new Error("Cannot find Mummy in the monster cup");
  }
  Util.moveObject(mummy, gameBoardLocations.egyptMat.monster1);

  const sandDweller = Util.takeCardNameFromStack(monsterCup, "Sand Dweller");
  if (!sandDweller) {
    throw new Error("Cannot find Sand Dweller in the monster cup");
  }
  Util.moveObject(sandDweller, gameBoardLocations.egyptMat.monster2);

  const spawnOfSebak = Util.takeCardNameFromStack(monsterCup, "Spawn of Sebak");
  if (!spawnOfSebak) {
    throw new Error("Cannot find Spawn of Sebak in the monster cup");
  }
  Util.moveObject(spawnOfSebak, gameBoardLocations.egyptMat.monster3);

  const gateStack = Util.getCardObjectById("gate-stack");
  const gates = Util.createCard(egypt.gates, spawnPosition.add(new Vector(0, 0, 1)));
  gateStack.addCards(gates);
  gateStack.shuffle();

  const cluePool = Util.getCardObjectById("clue-pool");
  const clues = Util.createCard(egypt.clues, spawnPosition.add(new Vector(0, 0, 1)));
  cluePool.addCards(clues);
  cluePool.shuffle();
}
exports.setupSideBoard = setupSideBoard;
