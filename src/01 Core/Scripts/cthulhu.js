const { refCard, world } = require("@tabletop-playground/api");

/** @type AncientOne */
const cthulhu = {
  name: "Cthulhu",
  doom: 12,
  sheetId: refCard.getId(),
  mysteryTemplateIds: ["9F4F121C4296CCE0DDCDA6BD8B00FC72"],
  researchTemplateIds: ["46026ADD4F314D2A11EF43B5B00234DB"],
  specialTemplateIds: { "R'lyeh Risen": ["0F7E67F54F4BA6006CCD3E89A33B2274"] },
  mythosDeck: {
    stage1: { green: 0, yellow: 2, blue: 2 },
    stage2: { green: 1, yellow: 3, blue: 0 },
    stage3: { green: 3, yellow: 4, blue: 0 },
  },
  monsters: { "Deep One": 1, "Star Spawn": 1 },
};

world.__eldritchHorror.ancientOnes.set(cthulhu.name, cthulhu);
