const { refCard, world, Vector } = require("@tabletop-playground/api");
const { Util } = require("../util");
const { GameUtil } = require("../game-util");
const { gameBoardLocations, expansionSpawn } = require("../world-constants");

/** @type AncientOne */
const antediluvium = {
  name: "Antediluvium",
  doom: 13,
  sheetId: refCard.getId(),
  mysteryTemplateIds: ["DC242CDB4819715994290FA2AC8BD0E3"],
  researchTemplateIds: ["6F72E3A042DC42F7425F18AFD6D45085"],
  mythosDeck: {
    stage1: { green: 1, yellow: 2, blue: 1 },
    stage2: { green: 2, yellow: 3, blue: 1 },
    stage3: { green: 2, yellow: 4, blue: 0 },
  },
  customSetup: () => {
    // place sanity equal to player count on this sheet.
    const sanityToken = Util.createMultistateObject(
      "CD0FA9DC41E13E96DC743A8A30C2DD75",
      refCard.getPosition().add(new Vector(0, 0, 1))
    );
    sanityToken.setId("antediluvium-sanity");
    sanityToken.setName("Antediluvium sanity tracker");
    sanityToken.snapToGround();
    const iconReference = GameUtil.getActiveIconReference();
    if (iconReference) {
      sanityToken.setState(iconReference.numberOfPlayers - 1);
    }

    // set aside 5 cultist monsters and 1 deep one monster.
    try {
      GameUtil.setAsideMonster("Cultist", 5);
    } catch (error) {
      console.error(error.message);
    }
    try {
      GameUtil.setAsideMonster("Deep One");
    } catch (error) {
      console.error(error.message);
    }

    // set up the mystic ruins encounter deck.
    const mysticRuinsIds = Array.from(world.__eldritchHorror.mysticRuins);
    if (!mysticRuinsIds.some((x) => world.__eldritchHorror.alreadyLoaded.includes(x))) {
      const mysticRuinsDeck = Util.createCard(expansionSpawn, ...mysticRuinsIds);
      GameUtil.addEncounterDeck(mysticRuinsDeck);
      mysticRuinsDeck.setId("encounter-mystic-ruins-deck");
      mysticRuinsDeck.setName("Mystic Ruins Encounters");
      mysticRuinsDeck.shuffle();

      const mysticRuinsToken = Util.createCard(expansionSpawn, "A9C452A442F9A36AC77CC1B68633FEEE");
      mysticRuinsToken.setId("mystic-ruins-token");
      mysticRuinsToken.setName("Mystic Ruins Token");
      GameUtil.positionEncounterToken(mysticRuinsDeck, mysticRuinsToken);

      world.__eldritchHorror.alreadyLoaded.push(...mysticRuinsIds);
    }

    // place 1 eldritch token on each blue space of the omen track
    Util.moveOrAddObject(GameUtil.takeEldritchTokens(1), gameBoardLocations.omen.blue1);
    Util.moveOrAddObject(GameUtil.takeEldritchTokens(1), gameBoardLocations.omen.blue2);

    Util.logScriptAction(
      "SETUP (Antediluvium) set aside 5 Cultist Monsters and 1 Deep One Monster. " +
        "Set up the Mystic Ruins Encounter deck. " +
        `Placed 1 Eldritch token on each blue space of the Omen track and Sanity equal to player count on Antediluvium's sheet.`
    );
  },
};

world.__eldritchHorror.ancientOnes.set(antediluvium.name, antediluvium);
