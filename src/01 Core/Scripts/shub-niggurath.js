const { refCard, world } = require("@tabletop-playground/api");

/** @type AncientOne */
const shubNiggurath = {
  name: "Shub-Niggurath",
  doom: 13,
  sheetId: refCard.getId(),
  mysteryTemplateIds: ["B261271E468AE695C3121FB860E6E442"],
  researchTemplateIds: ["3E47FCC6489A9DE60EA032B6E2A46E33"],
  monsters: { Ghoul: 2, "Goat Spawn": 2, "Dark Young": 1 },
  mythosDeck: {
    stage1: { green: 1, yellow: 2, blue: 1 },
    stage2: { green: 3, yellow: 2, blue: 1 },
    stage3: { green: 2, yellow: 4, blue: 0 },
  },
};

if (!world.__eldritchHorror.alreadyLoaded.includes(refCard.getTemplateId())) {
  world.__eldritchHorror.ancientOnes.push(shubNiggurath);
  world.__eldritchHorror.alreadyLoaded.push(refCard.getTemplateId());
}
