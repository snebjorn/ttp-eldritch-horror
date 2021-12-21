const { Card, CardDetails, Vector, world } = require("@tabletop-playground/api");
const { Util } = require("../util");
const { gameBoardLocations } = require("../world-constants");

const dreamlands = {
  sideBoardMat: "33A380AD46E9529BD848B29ECFF1B395",
  sideBoard: "4AB1BCBF44703595CFA5C3BA8065B31D",
  dreamQuestCards: "FD5EF68E4E9C70CB44EE12B90847A5FA",
  dreamlandsCards: "E43119074B695DE785F3A7AD5478B7C0",
  clues: "8A7F1BD24B044410A1D8B6896DA9F9B8",
  gates: "EE16D089467E3080A6E19F86639B22A3",
  dreamPortals: "B03C56724E726EF0ECDFB2BCFF70742C",
  dreamQuestToken: "710BA23D4725688A0F5AAE9EA9B7313C",
};

/**
 * @param {Vector} spawnPosition
 */
function setupSideBoard(spawnPosition) {
  if (world.getObjectsByTemplateId(dreamlands.sideBoardMat).length > 0) {
    return; // abort - side board is already loaded
  }

  const sideBoardMat = Util.createGameObject(dreamlands.sideBoardMat, spawnPosition);
  if (!gameBoardLocations.dreamlandsMat) {
    throw new Error("Unable to find snap points for The Dreamlands side board mat");
  }

  const sideBoard = Util.createGameObject(dreamlands.sideBoard, spawnPosition);
  sideBoard.setId("side-board-dreamlands");
  Util.moveObject(sideBoard, gameBoardLocations.dreamlandsMat.board);

  const groupId = Util.getNextGroupId();
  sideBoardMat.setGroupId(groupId);
  sideBoard.setGroupId(groupId);

  const dreamQuestCards = Util.createCard(spawnPosition, dreamlands.dreamQuestCards);
  Util.moveObject(dreamQuestCards, gameBoardLocations.dreamlandsMat.dreamQuest);
  dreamQuestCards.setName("Dream-Quest Encounters");
  dreamQuestCards.setId("encounter-dream-quest-deck");
  dreamQuestCards.shuffle();

  const dreamQuestToken = Util.createCard(spawnPosition, dreamlands.dreamQuestToken);
  Util.moveObject(dreamQuestToken, gameBoardLocations.dreamlandsMat.dreamQuest);
  dreamQuestToken.setName("Dream-Quest Token");
  dreamQuestToken.setId("dream-quest-token");

  const dreamlandsCards = Util.createCard(spawnPosition, dreamlands.dreamlandsCards);
  Util.moveObject(dreamlandsCards, gameBoardLocations.dreamlandsMat.dreamlands);
  dreamlandsCards.setName("Dreamlands Encounters");
  dreamlandsCards.setId("encounter-dreamlands-deck");
  dreamlandsCards.shuffle();

  const monsterCup = Util.getCardObjectById("monster-cup");
  const ghoul = Util.takeCardNameFromStack(monsterCup, "Ghoul");
  if (!ghoul) {
    throw new Error("Cannot find Ghoul in the monster cup");
  }
  Util.moveObject(ghoul, gameBoardLocations.dreamlandsMat.monster1);

  const moonBeast = Util.takeCardNameFromStack(monsterCup, "Moon-beast");
  if (!moonBeast) {
    throw new Error("Cannot find Moon-beast in the monster cup");
  }
  Util.moveObject(moonBeast, gameBoardLocations.dreamlandsMat.monster2);

  const nightgaunt = Util.takeCardNameFromStack(monsterCup, "Nightgaunt");
  if (!nightgaunt) {
    throw new Error("Cannot find Nightgaunt in the monster cup");
  }
  Util.moveObject(nightgaunt, gameBoardLocations.dreamlandsMat.monster3);

  const zoog = Util.takeCardNameFromStack(monsterCup, "Zoog");
  if (!zoog) {
    throw new Error("Cannot find Zoog in the monster cup");
  }
  Util.moveObject(zoog, gameBoardLocations.dreamlandsMat.monster4);

  const gateStack = Util.getCardObjectById("gate-stack");
  const gates = Util.createCard(spawnPosition.add(new Vector(0, 0, 1)), dreamlands.gates);
  gateStack.addCards(gates);
  gateStack.shuffle();

  const cluePool = Util.getCardObjectById("clue-pool");
  const clues = Util.createCard(spawnPosition.add(new Vector(0, 0, 1)), dreamlands.clues);
  cluePool.addCards(clues);
  cluePool.shuffle();

  return () => {
    const dreamPortals = Util.createCard(spawnPosition, dreamlands.dreamPortals);
    dreamPortals.shuffle();
    spawnDreamPortals(gateStack, dreamPortals);
  };
}
exports.setupSideBoard = setupSideBoard;

const dreamlandGates = ["Celephaïs", "Dylath-Leen", "Ulthar"];

/**
 * Spawn Dream Portals
 *
 * Reveal Gates from the top of the Gate stack until three Gates are revealed that each
 * correspond to a space that is not on the Dreamlands side board.
 * Place the three Dream Portal tokens on those spaces. Leave each revealed Gate in
 * the Gate stack and do not randomize the Gate stack after spawning a Dream Portal.
 *
 * @param {Card} gateStack
 * @param {Card} dreamPortals
 */
function spawnDreamPortals(gateStack, dreamPortals) {
  let spawnedDreamPortals = 0;
  const portalsRevealed = [];
  for (let i = 0; i < gateStack.getStackSize(); i++) {
    /** @type {CardDetails | undefined} */
    const revealedGateDetails = Util.flipInStack(gateStack, 1, false, i);
    const revealedGateName = revealedGateDetails && revealedGateDetails.name;
    if (revealedGateName && !dreamlandGates.includes(revealedGateName)) {
      spawnedDreamPortals++;
      const dreamPortal = spawnedDreamPortals === 3 ? dreamPortals : dreamPortals.takeCards();
      if (dreamPortal) {
        Util.flip(dreamPortal);
        Util.moveObject(dreamPortal, gameBoardLocations.space[revealedGateName]);

        const dreamPortalName = dreamPortal.getCardDetails().name;
        portalsRevealed.push(`spawned "${dreamPortalName}" (Dream Portal) on ${revealedGateName}`);
      }
    } else {
      portalsRevealed.push(`revealed ${revealedGateName} (Gate)`);
    }

    if (spawnedDreamPortals === 3) {
      break;
    }
  }

  Util.logScriptAction(
    `SETUP (Side board: Dreamlands) revealed gates from the top of the Gate stack and spawned Dream Portals: ${portalsRevealed.join(
      "; "
    )}.`
  );
}
