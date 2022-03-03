const { refCard, world } = require("@tabletop-playground/api");

/** @type {AncientOne} */
const yig = {
  name: "Yig",
  doom: 10,
  sheetId: refCard.getId(),
  mysteryTemplateIds: ["D3AAA13B4ABE379B1898ED88BC157857"],
  researchTemplateIds: ["060A47CC4476B75FEA03B2BA3A8B9513"],
  specialTemplateIds: {
    "K'n-Yan Unearthed": ["4940BFCD4BD047688B26B894983C82CB"],
  },
  mythosDeck: {
    stage1: { green: 1, yellow: 2, blue: 1 },
    stage2: { green: 2, yellow: 3, blue: 1 },
    stage3: { green: 2, yellow: 4, blue: 0 },
  },
  monsters: { Cultist: 6, "Serpent People": 1 },
};

world.__eldritchHorror.ancientOnes.set(yig.name, yig);
