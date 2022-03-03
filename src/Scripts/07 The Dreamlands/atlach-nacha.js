const { refCard, world } = require("@tabletop-playground/api");

/** @type {AncientOne} */
const hypnos = {
  name: "Atlach-Nacha",
  doom: 9,
  sheetId: refCard.getId(),
  mysteryTemplateIds: ["117455C94331FABC12977EA5D3346A80"],
  researchTemplateIds: ["5AE70B9F40F66E5FA0E475BA6A378DB8"],
  mythosDeck: {
    stage1: { green: 1, yellow: 2, blue: 1 },
    stage2: { green: 3, yellow: 2, blue: 1 },
    stage3: { green: 2, yellow: 4, blue: 0 },
  },
  monsters: {
    "Leng Spider": 1,
  },
};

world.__eldritchHorror.ancientOnes.set(hypnos.name, hypnos);
