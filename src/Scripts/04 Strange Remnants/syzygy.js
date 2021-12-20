const { refCard, world, Vector } = require("@tabletop-playground/api");
const { expansionSpawn } = require("../world-constants");
const { GameUtil } = require("../game-util");
const { Util } = require("../util");

/** @type AncientOne */
const syzygy = {
  name: "Syzygy",
  doom: 13,
  sheetId: refCard.getId(),
  mysteryTemplateIds: ["B7245ACA4DCD5E87779AC5A9D01D5B34"],
  researchTemplateIds: ["16236B1B4CC9361020A5AE9DFF7C7F4F"],
  specialTemplateIds: {
    "Fortifying the Barrier": ["A453663741A6C1999DDB90B623576229"],
    "Sealing the Portal": ["BB0CC15A494EBA15BBFAC6B14D16DF4E"],
  },
  mythosDeck: {
    stage1: { green: 0, yellow: 2, blue: 2 },
    stage2: { green: 3, yellow: 3, blue: 0 },
    stage3: { green: 3, yellow: 5, blue: 0 },
  },
  customSetup: () => {
    const mysticRuinsDeck = Util.createCard("8477CAF347EE3FEB6BC15E827D79544B", expansionSpawn);
    Array.from(world.__eldritchHorror.mysticRuins)
      .filter((x) => x !== "8477CAF347EE3FEB6BC15E827D79544B")
      .forEach((id) => {
        mysticRuinsDeck.addCards(Util.createCard(id, expansionSpawn));
      });

    GameUtil.addEncounterDeck(mysticRuinsDeck);
    mysticRuinsDeck.setId("encounter-mystic-ruins-deck");
    mysticRuinsDeck.setName("Mystic Ruins Encounters");
    mysticRuinsDeck.shuffle();

    const mysticRuinsToken = Util.createCard("A9C452A442F9A36AC77CC1B68633FEEE", expansionSpawn);
    mysticRuinsToken.setId("mystic-ruins-token");
    mysticRuinsToken.setName("Mystic Ruins Token");
    Util.moveOnTopOfObject(mysticRuinsToken, mysticRuinsDeck);
    world.showPing(mysticRuinsToken.getPosition(), Util.Colors.WHITE, true);
  },
};

world.__eldritchHorror.ancientOnes.set(syzygy.name, syzygy);
