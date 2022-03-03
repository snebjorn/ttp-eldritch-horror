const { refCard, world } = require("@tabletop-playground/api");

/** @type {AncientOne} */
const ithaqua = {
  name: "Ithaqua",
  doom: 13,
  sheetId: refCard.getId(),
  mysteryTemplateIds: ["55D3B3FD435B4E63C8AEDEA12DDB6D2B"],
  researchTemplateIds: ["0F4897A944081B404E6F32B84EC0DBB0"],
  specialTemplateIds: {
    "Exploring Hyperborea": ["FBE88B9A4E500E832EF2EEAD4FD3640D"],
  },
  monsters: {
    "Gnoph-Keh": 1,
    Wendigo: 1,
  },
  mythosDeck: {
    stage1: { green: 0, yellow: 2, blue: 2 },
    stage2: { green: 4, yellow: 2, blue: 0 },
    stage3: { green: 2, yellow: 4, blue: 0 },
  },
};

world.__eldritchHorror.ancientOnes.set(ithaqua.name, ithaqua);
