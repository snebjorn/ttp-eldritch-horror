const { refCard, world } = require("@tabletop-playground/api");
const { setupSideBoard } = require("./setup-side-board");

/** @type AncientOne */
const riseOfTheElderThings = {
  name: "Rise of the Elder Things",
  doom: 16,
  sheetId: refCard.getId(),
  mysteryTemplateIds: ["98A592DE4AAC14A176282EBB43D80B71"],
  researchTemplateIds: ["B77B2E3C4B58E3969F62C3AC0E431C16"],
  specialTemplateIds: {
    "A Dark God": ["8928E7814596E591617B76A5FBB528C7"],
    "Mysterious Disappearances": ["4D96394D4927D952954C86BABEF36AE7"],
  },
  mythosDeck: {
    stage1: { green: 2, yellow: 2, blue: 1 },
    stage2: { green: 3, yellow: 3, blue: 1 },
    stage3: { green: 4, yellow: 4, blue: 0 },
  },
  sideBoard: "landscape",
  customSetup: (sideBoardSpawn) => {
    if (!sideBoardSpawn) {
      throw new Error("No spawn location for the Antarctica side board was found");
    }
    setupSideBoard(sideBoardSpawn);
  },
};

world.__eldritchHorror.ancientOnes.set(riseOfTheElderThings.name, riseOfTheElderThings);
