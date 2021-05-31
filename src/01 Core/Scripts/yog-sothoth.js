const { refCard, world } = require("@tabletop-playground/api");

/** @type AncientOne */
const yogSothoth = {
  name: "Yog Sothoth",
  doom: 14,
  sheetId: refCard.getId(),
  mysteryTemplateId: ["9B3FF1674E9A8DE8C2F489B1ED765855"],
  researchTemplateIds: ["3306B56C4867F2A08D82C79317F77404"],
  specialTemplateIds: {
    "The Key and the Gate": ["DA67FE474F6B081FFD2DEF89F64F0330"],
  },
  mythosDeck: {
    stage1: { green: 0, yellow: 2, blue: 1 },
    stage2: { green: 2, yellow: 3, blue: 1 },
    stage3: { green: 3, yellow: 4, blue: 0 },
  },
};

if (!world.__eldritchHorror.alreadyLoaded.includes(refCard.getTemplateId())) {
  world.__eldritchHorror.ancientOnes.push(yogSothoth);
  world.__eldritchHorror.alreadyLoaded.push(refCard.getTemplateId());
}
