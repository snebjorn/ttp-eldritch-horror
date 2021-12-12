const { world, Vector } = require("@tabletop-playground/api");
const { Util } = require("../util");
const { GameUtil } = require("../game-util");
const {
  expansionSpawn,
  encounterDecks,
  gameBoardLocations,
  activeExpeditionToken,
  getGateStack,
} = require("../world-constants");

/**
 * @param {string} templateId
 */
function createCard(templateId) {
  return Util.createCard(templateId, expansionSpawn);
}

/** @type Expansion.Items */
exports.expansionItems = {
  encounterCards: {
    otherWorld: createCard("AF29D43843DDDFE0D52BB58250145A4A"),
    america: createCard("28428CAE4460AD6572B02D8D8E5D47D9"),
    europe: createCard("42265BDD46C92EFA4B2310A703934D82"),
    asia: createCard("6D50D9714055A792BE64C1942D799AD3"),
    general: createCard("8372619A4BF9486D8F0B7B9E3A4CD492"),
    expedition: createCard("A50218294FEE949F4C99039C5CB979C4"),
  },
  monsters: createCard("8809C3AC4548F7B29F534F9D7D17EA95"),
  epicMonsters: createCard("B4CA6695405FD1A9C7C9D4925D27CA5D"),
  assetCards: createCard("9494417444504EAD27ADBB90D26294F9"),
  uniqueAssetCards: createCard("F89B3B98472889A4931CBD9EE17C496A"),
  conditionCards: createCard("9BD24E764AE9CCE84A31B1BD246CA1F5"),
  artifactCards: createCard("0F101D7E43383815D5585F85FC59C823"),
  spellCards: createCard("308BE7254B8653275C2953A609A476CE"),
  gates: createCard("060EEE214B3FA8158DA5A4A9B2B44CF2"),
  focus: true,
  impairment: true,
  preludeCards: createCard("0105BF814CE91E975EA44E98DC0B5936"),
  mythosCards: {
    green: {
      easy: createCard("4A68D5854F6D3111084F8DA836F65B6A"),
      medium: createCard("2785CABF438F26E3EC5C7C9D93BE7B1A"),
      hard: createCard("6C21506F41D8284AE5A5659167886C39"),
    },
    yellow: {
      easy: createCard("7A4D90A041EED1D9CB93DEBA19F456EE"),
      medium: createCard("333FE9F94CB0CF0F664BEFA6EBD79FDB"),
      hard: createCard("D99CB0404FB7960B7F4CBE9B8CAA52F1"),
    },
    blue: {
      easy: createCard("7CDFDF304871B8CE34284EB2F2654C73"),
      medium: createCard("DF37F8C04447B4BE7DDCE59C8CED27C3"),
      hard: createCard("8B7F393B4ED14530A4C97D8A8AC24EAE"),
    },
  },
  investigators: createCard("8DAC8A0A49992180769CC4969AD6AABA"),
  ancientOneSheets: [
    createCard("07008765436F90A58D15EF9519F80FF4"),
    createCard("B40356624630EF164CB29196B784CA87"),
  ],
};

/** @type Record<string, Prelude> */
const preludes = {
  "Call of Cthulhu": {
    afterResolvingSetup: (ancientOne) => {
      if (ancientOne !== "Cthulhu") {
        // set aside 1 Deep One
        try {
          GameUtil.setAsideMonster("Deep One");
        } catch (error) {
          console.error(error.message);
        }

        // spawn Cthylla epic monster on space 3
        try {
          GameUtil.spawnEpicMonster("Cthylla", gameBoardLocations.space[3]);
        } catch (error) {
          console.error(error.message);
        }

        Util.logScriptAction(
          "SETUP (Prelude: Call of Cthulhu) set aside 1 Deep One Monster and spawned the Cthylla Epic Monster on space 3."
        );
      }
    },
    investigatorSetup: (
      investigator,
      sheet,
      healthToken,
      sanityToken,
      pawn,
      ancientOne,
      player
    ) => {
      // TODO move to nearest sea space and lose 1 sanity
      if (ancientOne === "Cthulhu") {
        // TODO place 1 eldritch token on nearest sea space that does not contain an eldritch token

        // for now just put it on the investigator sheet
        const eldritchToken = GameUtil.takeEldritchTokens(1);
        eldritchToken.setPosition(sheet.getPosition().add(new Vector(0, -3, 1)), 1);

        Util.logScriptAction(
          `SETUP (Prelude: Call of Cthulhu, Investigator: ${investigator.name}) placed 1 Eldritch token on Investigator sheet.`
        );
        player.sendChatMessage(
          `You received an Eldritch token. Place it on the nearest sea space that does not contain an Eldritch token. Also move your Investigator to the nearest sea space and lose 1 sanity.`,
          player.getPlayerColor()
        );
      }
    },
  },
  "Drastic Measures": {},
  Epidemic: {
    investigatorSetup: (
      investigator,
      sheet,
      healthToken,
      sanityToken,
      pawn,
      ancientOne,
      player
    ) => {
      if (ancientOne === "Abhoth") {
        // each investigator spawns 1 cultist on a wilderness that does not contain a cultist
        // for now put a cultist monster with the starting items
        const cultist = GameUtil.takeSetAsideMonster("Cultist");
        if (cultist) {
          cultist.setPosition(sheet.getPosition().add(new Vector(0, -3, 1)), 1);
        }

        Util.logScriptAction(
          `SETUP (Prelude: Epidemic, Investigator: ${investigator.name}) placed 1 Cultist Monster on Investigator sheet.`
        );
        player.sendChatMessage(
          `You received a Cultist Monster. Place it on a Wilderness space that does not contain a Cultist Monster.`,
          player.getPlayerColor()
        );
      } else {
        // TODO need to figure out how to find lead investigator
        // lead investigator spawns Child of Abhoth epic monster on nearest wilderness
        // then each investigator gains 1 illness condition and 1 clue
      }
    },
  },
  "Ghost From the Past": {
    afterResolvingSetup: () => {
      // TODO need to figure out how to find lead investigator
      // draw random investigator, discard it, give starting items to lead investigator
      // give haunted condition to lead investigator

      // advance doom 1
      GameUtil.advanceDoom(1);
      Util.logScriptAction("SETUP (Prelude: Ghost From the Past) advanced doom by 1.");
    },
  },
  "Litany of Secrets": {
    step5: () => {
      // split expedition deck into 2, and place token on top
      encounterDecks.expedition.shuffle();
      const size = encounterDecks.expedition.getStackSize();
      const secondDeck = encounterDecks.expedition.takeCards(Math.floor(size / 2));
      if (!secondDeck) {
        throw new Error("Unable to split expedition deck");
      }
      // move it out of the way so it doesn't interfere with the algorithm searching snap points
      secondDeck.setPosition(expansionSpawn, 0);
      secondDeck.setId("encounter-expedition-deck2");
      secondDeck.setName("Expedition Encounters");

      const deckSnapPoint = GameUtil.addEncounterDeck(secondDeck);

      const activeExpeditionToken = createCard("BD2E757C40F92C8EC8429193D862F47C");
      activeExpeditionToken.setId("active-expedition-token2");
      activeExpeditionToken.setName("Active Expedition Token");
      Util.moveObject(activeExpeditionToken, deckSnapPoint);
      world.showPing(activeExpeditionToken.getPosition(), Util.Colors.WHITE, true);
      secondDeck.shuffle();

      Util.logScriptAction(
        "SETUP (Prelude: Litany of Secrets) shuffled the Expedition Encounter deck then split it into two decks."
      );
    },
  },
  "Under the Pyramids": {
    spawnsSideBoard: (ancientOne) => {
      if (ancientOne !== "Nephren-Ka") {
        return "landscape";
      }

      return;
    },
    step5: (ancientOne, sideBoardSpawn) => {
      // setup egypt side board
      if (ancientOne !== "Nephren-Ka") {
        const { setupSideBoard } = require("./setup-side-board");
        if (!sideBoardSpawn) {
          throw new Error("Missing sideBoardSpawn argument");
        }
        setupSideBoard(sideBoardSpawn);
      }
    },
    afterResolvingSetup: (ancientOne) => {
      if (ancientOne === "Nephren-Ka") {
        // put egypt gates on top
        const egyptGates = Util.takeCardNamesFromStack(getGateStack(), [
          "The Sahara Desert",
          "Cairo",
          "The Nile River",
        ]);
        if (egyptGates) {
          egyptGates.shuffle();
          getGateStack().addCards(egyptGates);
        }

        // spawn 1 monster on active expedition
        const activeExpeditionMonster = GameUtil.spawnMonster(activeExpeditionToken.getPosition());
        const activeExpeditionMonsterName =
          activeExpeditionMonster && activeExpeditionMonster.getCardDetails().name;

        // spawn 1 monster on The Bent Pyramid
        const bentPyramid = gameBoardLocations.space["The Bent Pyramid"];
        if (!bentPyramid) {
          throw new Error("Unable to find The Bent Pyramid space");
        }
        const bentPyramidMonster = GameUtil.spawnMonster(bentPyramid);
        const bentPyramidMonsterName =
          bentPyramidMonster && bentPyramidMonster.getCardDetails().name;

        Util.logScriptAction(
          `SETUP (Prelude: Under the Pyramids) randomized the Gate stack then placed the Egypt side board Gates on top in random order. Then spawned 1 Monster (${activeExpeditionMonsterName}) on the Active Expedition space and 1 Monster (${bentPyramidMonsterName}) on The Bent Pyramid.`
        );
      } else {
        if (!gameBoardLocations.egyptSideBoard) {
          throw new Error("The Egypt side board mat is missing snap points");
        }

        // setup museum heist adventure
        const randomAdventureTemplateId =
          Util.randomIntFromInterval(1, 2) === 1
            ? "179EBAE14902BB741B04EA9F55CC88D1"
            : "F53E28644CF8AAB3E5EA0489CD399D67";
        const adventureDeck = createCard(randomAdventureTemplateId);
        const egyptAdventureSnapPoint = gameBoardLocations.egyptSideBoard.adventure;
        if (!egyptAdventureSnapPoint) {
          throw new Error(
            "Unable to find snap point for Museum Heist adventure deck on Egypt side board"
          );
        }
        Util.moveObject(adventureDeck, egyptAdventureSnapPoint);
        adventureDeck.setId("adventure-museum-heist-deck");
        adventureDeck.setName("Museum Heist Adventures");
        const firstAdventureCard = adventureDeck.takeCards(1);
        if (!firstAdventureCard) {
          throw new Error("Unable to take the first card from the Museum Heist adventure deck");
        }
        const egyptActiveAdventureSnapPoint = gameBoardLocations.egyptSideBoard.activeAdventure;
        if (!egyptActiveAdventureSnapPoint) {
          throw new Error("Unable to find snap point for active adventure on Egypt side board");
        }
        Util.moveObject(firstAdventureCard, egyptActiveAdventureSnapPoint);
        Util.flip(firstAdventureCard);

        const adventureToken = createCard("BEEB07464B9819C2D6BAB883A88C9146");
        adventureToken.setId("adventure-museum-heist-token");
        adventureToken.setName("Adventure Token: Museum Heist");

        const cairoSnapPoint = gameBoardLocations.space.Cairo;
        if (!cairoSnapPoint) {
          throw new Error("Unable to find snap point for Cairo (space)");
        }

        Util.moveObject(adventureToken, cairoSnapPoint);

        Util.logScriptAction(
          'SETUP (Prelude: Under the Pyramids) set aside Museum Heist Adventures; then drew the "Framed for Theft" Adventure.'
        );
      }
    },
  },
};

if (!world.__eldritchHorror.alreadyLoaded.includes("0105BF814CE91E975EA44E98DC0B5936")) {
  for (const [name, prelude] of Object.entries(preludes)) {
    world.__eldritchHorror.preludes.set(name, prelude);
  }
  world.__eldritchHorror.alreadyLoaded.push("0105BF814CE91E975EA44E98DC0B5936");
}

if (!world.__eldritchHorror.alreadyLoaded.includes("8DAC8A0A49992180769CC4969AD6AABA")) {
  const { investigators } = require("./investigators");
  world.__eldritchHorror.investigators.push(...investigators);
  world.__eldritchHorror.alreadyLoaded.push("8DAC8A0A49992180769CC4969AD6AABA");
}
