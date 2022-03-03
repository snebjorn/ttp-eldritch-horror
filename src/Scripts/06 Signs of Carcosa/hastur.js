const { refCard, world } = require("@tabletop-playground/api");

/** @type {AncientOne} */
const hastur = {
  name: "Hastur",
  doom: 11,
  sheetId: refCard.getId(),
  mysteryTemplateIds: ["EF8E489B408FDA84A8AD5A8C59F82D69"],
  researchTemplateIds: ["8EA4A5E54F5EC0141263FBB81A42DA72"],
  specialTemplateIds: {
    "Cities on the Lake": ["589824D945A9C6782A1309B733729186"],
    "King In Yellow": ["7E21FEC84C37A0EF8007748AAF1FE106"],
    "Unspeakable One": ["59E108814FE3EA8720A2DCB58231C81F"],
  },
  mythosDeck: {
    stage1: { green: 0, yellow: 2, blue: 2 },
    stage2: { green: 2, yellow: 3, blue: 0 },
    stage3: { green: 3, yellow: 5, blue: 0 },
  },
  monsters: {
    Byakhee: 1,
  },
};

world.__eldritchHorror.ancientOnes.set(hastur.name, hastur);
