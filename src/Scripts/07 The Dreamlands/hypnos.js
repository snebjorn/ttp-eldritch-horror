const { refCard, world } = require("@tabletop-playground/api");
const { setupSideBoard } = require("./setup-side-board");

/** @type {AncientOne} */
const hypnos = {
  name: "Hypnos",
  doom: 12,
  sheetId: refCard.getId(),
  mysteryTemplateIds: ["006461194136D63EB595A38866BA880F"],
  researchTemplateIds: ["A5A57D3544599A43D12DDD86F65503F1"],
  specialTemplateIds: {
    "Corona Borealis": ["459EF5634FE25E8C88AC239692DDAD49"],
    "Dream Within a Dream": ["5C4A523B441933024667A18E036A4DEC"],
    Dreamwalker: ["F9BC3DD8498E80272D2E55A3FC644686"],
  },
  mythosDeck: {
    stage1: { green: 0, yellow: 2, blue: 1 },
    stage2: { green: 2, yellow: 3, blue: 1 },
    stage3: { green: 3, yellow: 4, blue: 0 },
  },
  sideBoard: "portrait",
  customSetup: (sideBoardSpawn) => {
    if (!sideBoardSpawn) {
      throw new Error("No spawn location for the Dreamlands side board was found");
    }
    const spawnDreamPortalsFn = setupSideBoard(sideBoardSpawn);
    spawnDreamPortalsFn?.();
  },
};

world.__eldritchHorror.ancientOnes.set(hypnos.name, hypnos);
