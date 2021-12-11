const { refCard, world } = require("@tabletop-playground/api");

/** @type AncientOne */
const abhoth = {
  name: "Abhoth",
  doom: 14,
  sheetId: refCard.getId(),
  mysteryTemplateIds: ["C9550F824E43B9FCCD831780CADA4AFD"],
  researchTemplateIds: ["66D051CD43E4A0DB739E6AB413AF8BB8"],
  specialTemplateIds: {
    "Deep Caverns": ["1BA4EAE64BA878359051C980050DD7B8"],
    "Spawn of Abhoth": ["53D8611D425D5265863D51BC40FEC9C6"],
  },
  mythosDeck: {
    stage1: { green: 1, yellow: 2, blue: 1 },
    stage2: { green: 3, yellow: 2, blue: 1 },
    stage3: { green: 2, yellow: 4, blue: 0 },
  },
  monsters: {
    Cultist: 8,
  },
};

world.__eldritchHorror.ancientOnes.set(abhoth.name, abhoth);
