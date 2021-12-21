const { refCard, world } = require("@tabletop-playground/api");
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
    // TODO check if already created
    const mysticRuinsDeck = Util.createCard(
      expansionSpawn,
      ...Array.from(world.__eldritchHorror.mysticRuins)
    );
    GameUtil.addEncounterDeck(mysticRuinsDeck);
    mysticRuinsDeck.setId("encounter-mystic-ruins-deck");
    mysticRuinsDeck.setName("Mystic Ruins Encounters");
    mysticRuinsDeck.shuffle();

    const mysticRuinsToken = Util.createCard(expansionSpawn, "A9C452A442F9A36AC77CC1B68633FEEE");
    mysticRuinsToken.setId("mystic-ruins-token");
    mysticRuinsToken.setName("Mystic Ruins Token");
    Util.moveOnTopOfObject(mysticRuinsToken, mysticRuinsDeck);
    world.showPing(mysticRuinsToken.getPosition(), Util.Colors.WHITE, true);
  },
};

world.__eldritchHorror.ancientOnes.set(syzygy.name, syzygy);
