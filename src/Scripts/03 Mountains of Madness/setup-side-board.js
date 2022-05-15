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

  const researchCards = Util.createCard(spawnPosition, antarctica.researchCards);
  Util.moveObject(researchCards, gameBoardLocations.antarcticaMat.research);
  researchCards.setName("Antarctica Research Encounters");
  researchCards.setDescription(
    "- When an investigator encounters a Clue on the Antarctica side board, he does not resolve a Research Encounter for the chosen Ancient One. Instead, he draws and resolves an Antarctica Research Encounter.\n" +
      "- An Antarctica Research Encounter is considered a Research Encounter for all game effects."
  );
  researchCards.setId("encounter-antarctica-research-deck");
  researchCards.shuffle();

  const mountainCards = Util.createCard(spawnPosition, antarctica.mountainsCards);
  Util.moveObject(mountainCards, gameBoardLocations.antarcticaMat.mountains);
  mountainCards.setName("Mountains Encounters");
  mountainCards.setDescription(
    "During the Encounter Phase, an investigator on Snowy Mountains, City of the Elder Things, or Plateau of Leng may encounter that space by drawing a Mountain Encounter and resolving the effect that corresponds to his space."
  );
  mountainCards.setId("encounter-mountains-deck");
  mountainCards.shuffle();

  const outpostCards = Util.createCard(spawnPosition, antarctica.outpostCards);
  Util.moveObject(outpostCards, gameBoardLocations.antarcticaMat.outposts);
  outpostCards.setName("Outpost Encounters");
  outpostCards.setDescription(
    "During the Encounter Phase, an investigator on Miskatonic Outpost, Lake Camp, or Frozen Waste may encounter that space by drawing an Outpost Encounter and resolving the effect that corresponds to his space."
  );
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
  const gates = Util.createCard(spawnPosition.add(new Vector(0, 0, 1)), antarctica.gates);
  gateStack.addCards(gates);
  gateStack.shuffle();

  const cluePool = Util.getCardObjectById("clue-pool");
  if (!cluePool) {
    throw new Error("Cannot find clue pool");
  }
  const clues = Util.createCard(spawnPosition.add(new Vector(0, 0, 1)), antarctica.clues);
  cluePool.addCards(clues);
  cluePool.shuffle();
}
exports.setupSideBoard = setupSideBoard;
