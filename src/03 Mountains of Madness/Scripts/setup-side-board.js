const { Card, Vector, world } = require("@tabletop-playground/api");
// @ts-ignore
const { Util } = require("../../940067/Scripts/util");

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
  const matSnaps = {
    board: sideBoardMat.getSnapPoint(0),
    research: sideBoardMat.getSnapPoint(1),
    mountains: sideBoardMat.getSnapPoint(2),
    outposts: sideBoardMat.getSnapPoint(3),
    adventure: sideBoardMat.getSnapPoint(7),
    activeAdventure: sideBoardMat.getSnapPoint(8),
    monster1: sideBoardMat.getSnapPoint(9),
    monster2: sideBoardMat.getSnapPoint(10),
    monster3: sideBoardMat.getSnapPoint(11),
    monster4: sideBoardMat.getSnapPoint(12),
  };

  if (!matSnaps.board) {
    throw new Error("Cannot find position for antarctica side board");
  }
  const sideBoard = Util.createGameObject(antarctica.sideBoard, spawnPosition);
  sideBoard.setId("side-board-antarctica");
  Util.moveObject(sideBoard, matSnaps.board);

  const groupId = Util.getNextGroupId();
  sideBoardMat.setGroupId(groupId);
  sideBoard.setGroupId(groupId);

  if (!matSnaps.research) {
    throw new Error("Cannot find position for antarctica research cards");
  }
  const researchCards = Util.createCard(antarctica.researchCards, spawnPosition);
  Util.moveObject(researchCards, matSnaps.research);
  researchCards.setName("Antarctica Research Encounters");
  researchCards.setId("encounter-antarctica-research-deck");
  researchCards.shuffle();

  if (!matSnaps.mountains) {
    throw new Error("Cannot find position for antarctica mountain cards");
  }
  const mountainCards = Util.createCard(antarctica.mountainsCards, spawnPosition);
  Util.moveObject(mountainCards, matSnaps.mountains);
  mountainCards.setName("Mountains Encounters");
  mountainCards.setId("encounter-mountains-deck");
  mountainCards.shuffle();

  if (!matSnaps.outposts) {
    throw new Error("Cannot find position for antarctica outpost cards");
  }
  const outpostCards = Util.createCard(antarctica.outpostCards, spawnPosition);
  Util.moveObject(outpostCards, matSnaps.outposts);
  outpostCards.setName("Outpost Encounters");
  outpostCards.setId("encounter-outpost-deck");
  outpostCards.shuffle();

  /** @type Card | undefined */
  // @ts-ignore
  const monsterCup = world.getObjectById("monster-cup");
  if (!monsterCup) {
    throw new Error("Cannot find monster cup");
  }
  const elderThing = Util.takeCardNameFromStack(monsterCup, "Elder Thing");
  if (!elderThing) {
    throw new Error("Cannot find Elder Thing in the monster cup");
  }
  if (!matSnaps.monster1) {
    throw new Error("Cannot find position for monster on antarctica");
  }
  Util.moveObject(elderThing, matSnaps.monster1);

  const giantPenguin = Util.takeCardNameFromStack(monsterCup, "Giant Penguin");
  if (!giantPenguin) {
    throw new Error("Cannot find Elder Thing in the monster cup");
  }
  if (!matSnaps.monster2) {
    throw new Error("Cannot find position for monster on antarctica");
  }
  Util.moveObject(giantPenguin, matSnaps.monster2);

  const protoShoggoth = Util.takeCardNameFromStack(monsterCup, "Proto-Shoggoth");
  if (!protoShoggoth) {
    throw new Error("Cannot find Proto-Shoggoth in the monster cup");
  }
  if (!matSnaps.monster3) {
    throw new Error("Cannot find position for monster on antarctica");
  }
  Util.moveObject(protoShoggoth, matSnaps.monster3);

  const shoggoth = Util.takeCardNameFromStack(monsterCup, "Shoggoth");
  if (!shoggoth) {
    throw new Error("Cannot find Shoggoth in the monster cup");
  }
  if (!matSnaps.monster4) {
    throw new Error("Cannot find position for monster on antarctica");
  }
  Util.moveObject(shoggoth, matSnaps.monster4);

  /** @type Card | undefined */
  // @ts-ignore
  const gateStack = world.getObjectById("gate-stack");
  if (!gateStack) {
    throw new Error("Cannot find gate stack");
  }
  const gates = Util.createCard(antarctica.gates, spawnPosition.add(new Vector(0, 0, 1)));
  gateStack.addCards(gates);
  gateStack.shuffle();

  /** @type Card | undefined */
  // @ts-ignore
  const cluePool = world.getObjectById("clue-pool");
  if (!cluePool) {
    throw new Error("Cannot find clue pool");
  }
  const clues = Util.createCard(antarctica.clues, spawnPosition.add(new Vector(0, 0, 1)));
  cluePool.addCards(clues);
  cluePool.shuffle();
}
exports.setupSideBoard = setupSideBoard;
