const { refCard, world } = require("@tabletop-playground/api");
const { setupSideBoard } = require("./setup-side-board");

/** @type AncientOne */
const nephrenKa = {
  name: "Nephren-Ka",
  doom: 12,
  sheetId: refCard.getId(),
  mysteryTemplateIds: ["7A28539C41F028C591A2E9B19207D353"],
  researchTemplateIds: ["E321C4594D8B50127B790EA407DB460D"],
  specialTemplateIds: {
    "Black Wind": ["44C8E4C2447A6BA23D6B0CBAC21D968F"],
    "Dark Pharaoh": ["B6943D3945C7A47F54A8FA905B00B98E"],
  },
  mythosDeck: {
    stage1: { green: 0, yellow: 2, blue: 2 },
    stage2: { green: 1, yellow: 3, blue: 0 },
    stage3: { green: 3, yellow: 4, blue: 0 },
  },
  sideBoard: "landscape",
  customSetup: (sideBoardSpawn) => {
    if (!sideBoardSpawn) {
      throw new Error("No spawn location for the Egypt side board was found");
    }
    setupSideBoard(sideBoardSpawn);
  },
};

if (!world.__eldritchHorror.alreadyLoaded.includes(refCard.getTemplateId())) {
  world.__eldritchHorror.ancientOnes.push(nephrenKa);
  world.__eldritchHorror.alreadyLoaded.push(refCard.getTemplateId());
}
