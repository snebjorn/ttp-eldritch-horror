const { refCard, world, Vector } = require("@tabletop-playground/api");

/** @type AncientOne */
const syzygy = {
  name: "Syzygy",
  doom: 13,
  sheetId: refCard.getId(),
  mysteryTemplateIds: ["B7245ACA4DCD5E87779AC5A9D01D5B34"],
  researchTemplateIds: ["16236B1B4CC9361020A5AE9DFF7C7F4F"],
  specialTemplateIds: {
    "Mystic Ruins Encounters": ["8477CAF347EE3FEB6BC15E827D79544B"],
    "Fortifying the Barrier": ["A453663741A6C1999DDB90B623576229"],
    "Sealing the Portal": ["BB0CC15A494EBA15BBFAC6B14D16DF4E"],
  },
  mythosDeck: {
    stage1: { green: 0, yellow: 2, blue: 2 },
    stage2: { green: 3, yellow: 3, blue: 0 },
    stage3: { green: 3, yellow: 5, blue: 0 },
  },
  customSetup: () => {
    // place mystic ruins token on deck
    const mysticRuinsDeck = world
      .getAllObjects()
      .find((x) => x.getTemplateId() === "8477CAF347EE3FEB6BC15E827D79544B");
    if (mysticRuinsDeck) {
      const mysticRuinsToken = world.createObjectFromTemplate(
        "A9C452A442F9A36AC77CC1B68633FEEE",
        mysticRuinsDeck.getPosition().add(new Vector(0, 0, 2))
      );
      if (mysticRuinsToken) {
        mysticRuinsToken.setName("Mystic Ruins Token");
        mysticRuinsToken.snap();
      }
    }
  },
};

if (!world.__eldritchHorror.alreadyLoaded.includes(refCard.getTemplateId())) {
  world.__eldritchHorror.ancientOnes.push(syzygy);
  world.__eldritchHorror.alreadyLoaded.push(refCard.getTemplateId());
}
