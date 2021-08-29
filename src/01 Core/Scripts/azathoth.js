const { refCard, world } = require("@tabletop-playground/api");
const { eldritchToken, gameBoardLocations } = require("./world-constants");

/** @type AncientOne */
const azathoth = {
  name: "Azathoth",
  doom: 15,
  sheetId: refCard.getId(),
  mysteryTemplateIds: ["637C2CC449F83E478800AB8DED307776"],
  researchTemplateIds: ["1A588B41411FA81D2C80F7806EE4CBAF"],
  mythosDeck: {
    stage1: { green: 1, yellow: 2, blue: 1 },
    stage2: { green: 2, yellow: 3, blue: 1 },
    stage3: { green: 2, yellow: 4, blue: 0 },
  },
  customSetup: () => {
    world.createObjectFromTemplate(
      eldritchToken.getTemplateId(),
      gameBoardLocations.omen.green.getGlobalPosition()
    );
  },
};

world.__eldritchHorror.ancientOnes.set(azathoth.name, azathoth);
