const { Vector, world } = require("@tabletop-playground/api");
const { Util } = require("../util");
const { gameBoardLocations } = require("../world-constants");

const antarctica = {
  sideBoardMat: "0FAFCD8F49500E5B3847E2BD614CD1EA",
  sideBoard: "81A3E587438DA465FB364A8476CE442A",
  mountainsCards: "BA471CBC4CD1FABC83909A82E5CBC570",
  outpostCards: "D38BD349493879A1F44133A01F4FF624",
  researchCards: "40C43F79483764E3A5A28DAACA196287",
  clues: "8BB70410401011B9B592F39A0112E6BD",
  gates: "64DDD78441EB50FEA0064EBD2770E1FF",
};

/**
 * @param {Vector} spawnPosition
 */
function setupSideBoard(spawnPosition) {
  if (world.getObjectsByTemplateId(antarctica.sideBoardMat).length > 0) {
    return; // abort - side board is already loaded
  }

  const sideBoardMat = Util.createGameObject(antarctica.sideBoardMat, spawnPosition);
  if (!gameBoardLocations.antarcticaMat) {
    throw new Error("Unable to find snap points for Antarctica side board mat");
  }

  const sideBoard = Util.createGameObject(antarctica.sideBoard, spawnPosition);
  sideBoard.setId("side-board-antarctica");
  Util.moveObject(sideBoard, gameBoardLocations.antarcticaMat.board);

  const groupId = Util.getNextGroupId();
  sideBoardMat.setGroupId(groupId);
  sideBoard.setGroupId(groupId);

  const researchCards = Util.createCard(antarctica.researchCards, spawnPosition);
  Util.moveObject(researchCards, gameBoardLocations.antarcticaMat.research);
  researchCards.setName("Antarctica Research Encounters");
  researchCards.setId("encounter-antarctica-research-deck");
  researchCards.shuffle();

  const mountainCards = Util.createCard(antarctica.mountainsCards, spawnPosition);
  Util.moveObject(mountainCards, gameBoardLocations.antarcticaMat.mountains);
  mountainCards.setName("Mountains Encounters");
  mountainCards.setId("encounter-mountains-deck");
  mountainCards.shuffle();

  const outpostCards = Util.createCard(antarctica.outpostCards, spawnPosition);
  Util.moveObject(outpostCards, gameBoardLocations.antarcticaMat.outposts);
  outpostCards.setName("Outpost Encounters");
  outpostCards.setId("encounter-outpost-deck");
  outpostCards.shuffle();

  const monsterCup = Util.getCardObjectById("monster-cup");
  const elderThing = Util.takeCardNameFromStack(monsterCup, "Elder Thing");
  if (!elderThing) {
    throw new Error("Cannot find Elder Thing in the monster cup");
  }
  Util.moveObject(elderThing, gameBoardLocations.antarcticaMat.monster1);

  const giantPenguin = Util.takeCardNameFromStack(monsterCup, "Giant Penguin");
  if (!giantPenguin) {
    throw new Error("Cannot find Elder Thing in the monster cup");
  }
  Util.moveObject(giantPenguin, gameBoardLocations.antarcticaMat.monster2);

  const protoShoggoth = Util.takeCardNameFromStack(monsterCup, "Proto-Shoggoth");
  if (!protoShoggoth) {
    throw new Error("Cannot find Proto-Shoggoth in the monster cup");
  }
  Util.moveObject(protoShoggoth, gameBoardLocations.antarcticaMat.monster3);

  const shoggoth = Util.takeCardNameFromStack(monsterCup, "Shoggoth");
  if (!shoggoth) {
    throw new Error("Cannot find Shoggoth in the monster cup");
  }
  Util.moveObject(shoggoth, gameBoardLocations.antarcticaMat.monster4);

  const gateStack = Util.getCardObjectById("gate-stack");
  const gates = Util.createCard(antarctica.gates, spawnPosition.add(new Vector(0, 0, 1)));
  gateStack.addCards(gates);
  gateStack.shuffle();

  const cluePool = Util.getCardObjectById("clue-pool");
  if (!cluePool) {
    throw new Error("Cannot find clue pool");
  }
  const clues = Util.createCard(antarctica.clues, spawnPosition.add(new Vector(0, 0, 1)));
  cluePool.addCards(clues);
  cluePool.shuffle();
}
exports.setupSideBoard = setupSideBoard;
