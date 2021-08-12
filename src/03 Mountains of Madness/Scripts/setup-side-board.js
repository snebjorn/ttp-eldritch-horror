const { Card, Vector, world, GameObject, SnapPoint } = require("@tabletop-playground/api");
const { UtilCopy } = require("./util-copy");

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
  if (world.__eldritchHorror.alreadyLoaded.includes(antarctica.sideBoardMat)) {
    return; // abort - side board is already loaded
  }

  const sideBoardMat = UtilCopy.createGameObject(antarctica.sideBoardMat, spawnPosition);
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
  const sideBoard = UtilCopy.createGameObject(antarctica.sideBoard, spawnPosition);
  UtilCopy.setPositionAtSnapPoint(sideBoard, matSnaps.board);

  const groupId = UtilCopy.getNextGroupId();
  sideBoardMat.setGroupId(groupId);
  sideBoard.setGroupId(groupId);

  registerSpaces(sideBoard, matSnaps);

  if (!matSnaps.research) {
    throw new Error("Cannot find position for antarctica research cards");
  }
  const researchCards = UtilCopy.createCard(antarctica.researchCards, spawnPosition);
  UtilCopy.setPositionAtSnapPoint(researchCards, matSnaps.research);
  researchCards.setName("Antarctica Research Encounters");
  researchCards.setId("encounter-antarctica-research-deck");
  researchCards.shuffle();

  if (!matSnaps.mountains) {
    throw new Error("Cannot find position for antarctica mountain cards");
  }
  const mountainCards = UtilCopy.createCard(antarctica.mountainsCards, spawnPosition);
  UtilCopy.setPositionAtSnapPoint(mountainCards, matSnaps.mountains);
  mountainCards.setName("Mountains Encounters");
  mountainCards.setId("encounter-mountains-deck");
  mountainCards.shuffle();

  if (!matSnaps.outposts) {
    throw new Error("Cannot find position for antarctica outpost cards");
  }
  const outpostCards = UtilCopy.createCard(antarctica.outpostCards, spawnPosition);
  UtilCopy.setPositionAtSnapPoint(outpostCards, matSnaps.outposts);
  outpostCards.setName("Outpost Encounters");
  outpostCards.setId("encounter-outpost-deck");
  outpostCards.shuffle();

  /** @type Card | undefined */
  // @ts-ignore
  const monsterCup = world.getObjectById("monster-cup");
  if (!monsterCup) {
    throw new Error("Cannot find monster cup");
  }
  const elderThing = UtilCopy.takeCardNameFromStack(monsterCup, "Elder Thing");
  if (!elderThing) {
    throw new Error("Cannot find Elder Thing in the monster cup");
  }
  if (!matSnaps.monster1) {
    throw new Error("Cannot find position for monster on antarctica");
  }
  UtilCopy.setPositionAtSnapPoint(elderThing, matSnaps.monster1);

  const giantPenguin = UtilCopy.takeCardNameFromStack(monsterCup, "Giant Penguin");
  if (!giantPenguin) {
    throw new Error("Cannot find Elder Thing in the monster cup");
  }
  if (!matSnaps.monster2) {
    throw new Error("Cannot find position for monster on antarctica");
  }
  UtilCopy.setPositionAtSnapPoint(giantPenguin, matSnaps.monster2);

  const protoShoggoth = UtilCopy.takeCardNameFromStack(monsterCup, "Proto-Shoggoth");
  if (!protoShoggoth) {
    throw new Error("Cannot find Proto-Shoggoth in the monster cup");
  }
  if (!matSnaps.monster3) {
    throw new Error("Cannot find position for monster on antarctica");
  }
  UtilCopy.setPositionAtSnapPoint(protoShoggoth, matSnaps.monster3);

  const shoggoth = UtilCopy.takeCardNameFromStack(monsterCup, "Shoggoth");
  if (!shoggoth) {
    throw new Error("Cannot find Shoggoth in the monster cup");
  }
  if (!matSnaps.monster4) {
    throw new Error("Cannot find position for monster on antarctica");
  }
  UtilCopy.setPositionAtSnapPoint(shoggoth, matSnaps.monster4);

  /** @type Card | undefined */
  // @ts-ignore
  const gateStack = world.getObjectById("gate-stack");
  if (!gateStack) {
    throw new Error("Cannot find gate stack");
  }
  const gates = UtilCopy.createCard(antarctica.gates, spawnPosition.add(new Vector(0, 0, 1)));
  gateStack.addCards(gates);

  /** @type Card | undefined */
  // @ts-ignore
  const cluePool = world.getObjectById("clue-pool");
  if (!cluePool) {
    throw new Error("Cannot find clue pool");
  }
  const clues = UtilCopy.createCard(antarctica.clues, spawnPosition.add(new Vector(0, 0, 1)));
  cluePool.addCards(clues);

  world.__eldritchHorror.alreadyLoaded.push(antarctica.sideBoardMat);
}
exports.setupSideBoard = setupSideBoard;

/**
 * @param {GameObject} sideBoard
 * @param {Record<string, SnapPoint | undefined>} matSnaps */
function registerSpaces(sideBoard, matSnaps) {
  const sideBoardSpaces = {
    "Miskatonic Outpost": sideBoard.getSnapPoint(0),
    "Lake Camp": sideBoard.getSnapPoint(1),
    "Frozen Waste": sideBoard.getSnapPoint(2),
    "City of the Elder Things": sideBoard.getSnapPoint(3),
    "Plateau of Leng": sideBoard.getSnapPoint(4),
    "Snowy Mountains": sideBoard.getSnapPoint(5),
  };

  // @ts-ignore - don't try this at home kids
  const { gameBoardLocations } = require("../../Eldritch Horror/Scripts/world-constants");
  gameBoardLocations.space = { ...gameBoardLocations.space, ...sideBoardSpaces };
  gameBoardLocations.antarcticaSideBoard = matSnaps;
}
