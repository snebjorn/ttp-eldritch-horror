const { world, Card } = require("@tabletop-playground/api");
const { Util } = require("../util");
const { GameUtil } = require("../game-util");
const {
  expansionSpawn,
  gameBoardLocations,
  getGateStack,
  tableLocations,
} = require("../world-constants");
const { Vector } = require("@tabletop-playground/api");

/**
 * @param {...string} templateId
 */
function createCard(...templateId) {
  return Util.createCard(expansionSpawn, ...templateId);
}

/**
 * @param {string[]} expansions
 */
function createPreludeCard(expansions) {
  const preludeCards = createCard("372C546449CBC4EEDAB6F9823A0BF81B");
  // if playing without a specific expansion mentioned in the card's metadata then remove it
  for (const cardDetails of preludeCards.getAllCardDetails()) {
    if (cardDetails.metadata && !expansions.includes(cardDetails.metadata)) {
      const removedPrelude = Util.takeCardNameFromStack(preludeCards, cardDetails.name);
      removedPrelude?.destroy();
    }
  }

  // Four Preludes in this expansion (Beginning of the End, The Dunwich Horror,
  // Twin Blasphemies of the Black Goat, and Call of Cthulhu) originally appeared
  // in previous expansions (Mountains of Madness, Strange Remnants, The Dreamlands,
  // and Under the Pyramids respectively).
  // If playing with those expansions, do not include the duplicate Preludes in the Prelude deck.
  const duplicatePreludeCards = createCard("FA536D4F4E17FADD1A453CA3B4C4A149");
  for (const cardDetails of duplicatePreludeCards.getAllCardDetails()) {
    if (!expansions.includes(cardDetails.metadata)) {
      const preludeName = cardDetails.name;
      const prelude = Util.takeCardNameFromStack(duplicatePreludeCards, preludeName);
      if (prelude) {
        preludeCards.addCards(prelude);

        world.__eldritchHorror.preludes.set(preludeName, duplicatePrelude[preludeName]);
      }
    }
  }
  duplicatePreludeCards.destroy();

  return preludeCards;
}

/**
 * @param {string[]} expansions - the selected expansions
 * @returns {Expansion.Items}
 */
exports.expansionItems = (expansions) => ({
  encounterCards: {
    otherWorld: createCard("56ED519947E6CD6DAD397AB55F9B0550"),
    america: createCard("076EF20F49443C005FB7E89D3E38DFAC"),
    europe: createCard("207AEA164F28815FF3C92EA5F2CDA4A4"),
    asia: createCard("D97D163D42D5D11EE5F3EB87C713E7F6"),
    general: createCard("FD1267FA47FD4A5AD32CA6B59F531E16"),
  },
  monsters: createCard("A3D097FE45BD69ED095EB79CB4A8B6BF"),
  epicMonsters: createCard("6D19EB2B4C5F87E8F421FEBD9A237AD2"),
  assetCards: createCard("D3C1D52945B1BC7037C818AF05DE9C95"),
  uniqueAssetCards: createCard("573ADE914289F4FBED1D39AE18AE44A3"),
  conditionCards: createCard("6B02962145681D9122D2928E4CFFFB3D"),
  artifactCards: createCard("0E91BA9849AE68F2B14C9BA63B071080"),
  spellCards: createCard("8F02030F49D235CCCB05D1B7325436B2"),
  gates: createCard("0E111291469DF678D0B8A191A0AF3E5C"),
  focus: true,
  resource: true,
  preludeCards: createPreludeCard(expansions),
  mythosCards: {
    green: {
      medium: createCard("84EBFC5A4CB02668F32B43A80049E789"),
      hard: createCard("9E3D2A6946E3711EA241B797E1D9E410"),
    },
    yellow: {
      easy: createCard("1B4402BF4FEA0921FC8247A5620BE120"),
      medium: createCard("75DF0C574EA9753CC0951092E9D06F9A"),
      hard: createCard("4551942C4FF091E75D672392722613CB"),
    },
    blue: {
      easy: createCard("E745EF574BD4B04EA9E1A9AFDEE8E0F3"),
      hard: createCard("1CCC7AE64567FC7B2827AF977F68829D"),
    },
  },
  investigators: createCard("03836300451A90F12399F0BD53AF56C7"),
  ancientOneSheets: [
    createCard("C4206F944AA8BFB16B61F5BA88879AFB"),
    createCard("ECFAAE5B4AF22229E521C5AAB3D6DD92"),
  ],
  personalStories: {
    missions: "9525B60B4F1B9F0FF9757E96447977E4",
    rewards: "9C404CF745F98007393C8DAA8707A95B",
    consequences: "6A21EFB74EB0871027D3279D54AEAD64",
  },
});

world.__eldritchHorror.mysticRuins.add("78E0B3CC45F78684110FE9B5B8EEF5D9");

/** @type {Record<string, Prelude>} */
const preludes = {
  "Aid of the Elder Gods": {
    spawnsSideBoard: (ancientOne) => {
      if (ancientOne !== "Hypnos") {
        return "portrait";
      }
    },
    step5: (ancientOne, sideBoardSpawn) => {
      if (ancientOne !== "Hypnos") {
        // setup dreamlands side board
        const { setupSideBoard } = require("../07 The Dreamlands/setup-side-board");
        if (!sideBoardSpawn) {
          throw new Error("Missing sideBoardSpawn argument");
        }
        return setupSideBoard(sideBoardSpawn);
      }
    },
    afterResolvingSetup: (ancientOne) => {
      if (!gameBoardLocations.dreamlandsMat) {
        throw new Error("The Dreamlands side board mat is missing snap points");
      }

      const ultharSpace = gameBoardLocations.space.Ulthar;
      if (!ultharSpace) {
        throw new Error("Unable to find Ulthar (space) on The Dreamlands side board");
      }

      Util.moveObject(GameUtil.takeFocusTokens(1), ultharSpace);

      const celephaisSpace = gameBoardLocations.space.Celephaïs;
      if (!celephaisSpace) {
        throw new Error("Unable to find Celephaïs (space) on The Dreamlands side board");
      }

      Util.moveObject(GameUtil.takeFocusTokens(1), celephaisSpace);

      const dreamQuestToken = Util.getCardObjectById("dream-quest-token");
      Util.moveOnTopOfObject(GameUtil.takeFocusTokens(1), dreamQuestToken);

      let dreamQuestSpace;
      try {
        const dreamQuestDeck = Util.getCardObjectById("encounter-dream-quest-deck");
        dreamQuestSpace = dreamQuestDeck.getAllCardDetails().slice(-1)[0].name;
      } catch {
        dreamQuestSpace = "ERROR";
      }

      Util.logScriptAction(
        `SETUP (Prelude: Aid of the Elder Gods) placed 1 Focus token on Ulthar and Celephaïs and 1 Focus token on the Dream-Quest token (${dreamQuestSpace}).`
      );
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
      if (ancientOne === "Nyarlathotep") {
        // each investigator gains 1 Eldritch token
        Util.logScriptAction(
          `SETUP (Prelude: Aid of the Elder Gods, Investigator: ${investigator.name}) gained 1 Eldritch token.`
        );

        return {
          eldritchTokens: 1,
        };
      } else {
        // each investigator gains a Corruption Condition and 1 Clue
        Util.logScriptAction(
          `SETUP (Prelude: Aid of the Elder Gods, Investigator: ${investigator.name}) gained a Corruption Condition and 1 Clue.`
        );

        return {
          condition: "Corruption",
          clues: 1,
        };
      }
    },
  },
  "Army of Darkness": {
    afterResolvingSetup: (ancientOne) => {
      GameUtil.setAsideMonster("Zombie");
      const { snapPoint, spaceName } = GameUtil.determineRandomSpace();
      const zombie = GameUtil.takeMonster("Zombie");
      if (zombie) {
        Util.moveOrAddObject(zombie, snapPoint);

        Util.logScriptAction(
          `SETUP (Prelude: Army of Darkness) placed a Zombie Monster on "${spaceName}" (random space).`
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
      // lead investigator loses 2 health and gains 1 Chainsaw Asset
      const gameState = GameUtil.getSavedData();
      if (gameState.leadInvestigator === investigator.name) {
        Util.logScriptAction(
          `SETUP (Prelude: Army of Darkness, Investigator: ${investigator.name}) lost 2 Health and gained 1 Chainsaw Asset.`
        );

        healthToken.setState(healthToken.getState() - 2);

        return { asset: "Chainsaw" };
      }
    },
  },
  "Father of Serpents": {
    afterResolvingSetup: (ancientOne) => {
      if (ancientOne === "Yig") {
        const expeditionSpaces = [
          gameBoardLocations.space.Antarctica,
          gameBoardLocations.space.Tunguska,
          gameBoardLocations.space["The Amazon"],
          gameBoardLocations.space["The Heart of Africa"],
          gameBoardLocations.space["The Himalayas"],
          gameBoardLocations.space["The Pyramids"],
        ];

        const spawnedMonsters = expeditionSpaces.map((space) => GameUtil.spawnMonster(space));
        const spawnedMonsterText = spawnedMonsters.map(([monster, spawnEffect]) => [
          monster?.getCardDetails().name,
          spawnEffect,
        ]);

        Util.logScriptAction(
          "SETUP (Prelude: Father of Serpents) set aside 1 Serpent People Monster and spawned 1 Monster on each Expedition space."
        );
        for (const [monsterName, spawnEffect] of spawnedMonsterText) {
          if (spawnEffect) {
            Util.logScriptAction(`Spawn Effect (${monsterName}): ${spawnEffect}.`);
          }
        }
      } else {
        const monster = GameUtil.takeMonster("Serpent People");
        if (monster) {
          Util.moveOrAddObject(monster, gameBoardLocations.space["The Amazon"]);

          Util.logScriptAction(
            "SETUP (Prelude: Father of Serpents) spawned 1 Serpent People Monster on The Amazon."
          );
        }
      }
    },
  },
  "Harbinger of the Outer Gods": {
    investigatorSetup: (
      investigator,
      sheet,
      healthToken,
      sanityToken,
      pawn,
      ancientOne,
      player
    ) => {
      if (ancientOne === "Nyarlathotep") {
        Util.logScriptAction(
          `SETUP (Prelude: Harbinger of the Outer Gods, Investigator: ${investigator.name}) gained 1 Eldritch token.`
        );

        player.sendChatMessage(`You must improve 1 skill of your choice.`, player.getPlayerColor());

        return {
          eldritchTokens: 1,
        };
      } else {
        Util.logScriptAction(
          `SETUP (Prelude: Harbinger of the Outer Gods, Investigator: ${investigator.name}) gained a Corruption Condition.`
        );
        player.sendChatMessage(
          `You must improve 2 skills of your choice.`,
          player.getPlayerColor()
        );

        return {
          condition: "Corruption",
        };
      }
    },
  },
  "In the Lightless Chamber": {
    spawnsSideBoard: (ancientOne) => {
      if (ancientOne !== "Nephren-Ka") {
        return "landscape";
      }
    },
    step5: (ancientOne, sideBoardSpawn) => {
      if (ancientOne !== "Nephren-Ka") {
        // setup dreamlands side board
        const { setupSideBoard } = require("../05 Under the Pyramids/setup-side-board");
        if (!sideBoardSpawn) {
          throw new Error("Missing sideBoardSpawn argument");
        }
        return setupSideBoard(sideBoardSpawn);
      }
    },
    afterResolvingSetup: (ancientOne) => {
      if (!gameBoardLocations.egyptMat) {
        throw new Error("The Egypt side board mat is missing snap points");
      }

      const egyptGateNames = ["Cairo", "The Nile River", "The Sahara Desert"];
      const egyptGates = Util.takeCardNamesFromStack(getGateStack(), egyptGateNames);
      if (egyptGates) {
        egyptGates.shuffle();
        getGateStack().addCards(egyptGates);
      }

      if (ancientOne === "Nyarlathotep") {
        const mysteryDeck = world.getObjectById("mystery-deck");
        if (!mysteryDeck || !(mysteryDeck instanceof Card)) {
          throw new Error("Unable to find mystery deck");
        }

        const activeMysterySnapPoint = tableLocations.activeMystery;
        if (activeMysterySnapPoint) {
          const activeMystery = activeMysterySnapPoint.getSnappedObject(2);
          if (activeMystery instanceof Card) {
            const activeMysteryName = activeMystery.getCardDetails().name;
            if (activeMysteryName !== "Brotherhood of the Dark Pharaoh") {
              mysteryDeck.addCards(activeMystery);

              const activeMysteryCard = Util.takeCardNameFromStack(
                mysteryDeck,
                "Brotherhood of the Dark Pharaoh"
              );
              if (!activeMysteryCard) {
                throw new Error('Unable to find "Brotherhood of the Dark Pharaoh" in mystery deck');
              }

              if (!tableLocations.activeMystery) {
                throw new Error("Unable to find active mystery snap point");
              }
              Util.moveObject(activeMysteryCard, tableLocations.activeMystery);
              Util.flip(activeMysteryCard);
            }
          }
        }

        const bentPyramid = gameBoardLocations.space["The Bent Pyramid"];
        if (!bentPyramid) {
          throw new Error('Unable to find snap point for "The Bent Pyramid" (space)');
        }
        GameUtil.spawnEpicMonster("The Beast", bentPyramid);

        // TODO then resolved the "when this card enters play" effect.
        Util.logScriptAction(
          'SETUP (Prelude: In the Lightless Chamber) drew the "Brotherhood of the Dark Pharaoh" Mystery instead of a random Mystery. ' +
            "Spawned The Beast Epic Monster on The Bent Pyramid. " +
            "Put all Egypt side board gates on top of the Gate stack in randomized order."
        );
      } else {
        Util.logScriptAction(
          "SETUP (Prelude: In the Lightless Chamber) put all Egypt side board gates on top of the Gate stack in randomized order."
        );
      }
    },
  },
  Temptation: {},
  "The Archives": {},
  "The Stars Align": {
    afterResolvingSetup: (ancientOne, iconReference) => {
      if (ancientOne === "Antediluvium") {
        // place additional sanity equal to ½ players on the ancient one sheet
        if (iconReference) {
          const halfNumPlayers = Math.ceil(iconReference.numberOfPlayers / 2);

          const sanityToken = Util.getMultistateObjectById("antediluvium-sanity");
          if (sanityToken) {
            const newState = sanityToken.getState() + halfNumPlayers;
            const stateOverflow = newState % 8;
            if (stateOverflow) {
              sanityToken.setState(8);

              if (!tableLocations.ancientOne) {
                throw new Error("Unable to find snap point for ancient one");
              }

              const additionalSanityToken = Util.createMultistateObject(
                "CD0FA9DC41E13E96DC743A8A30C2DD75",
                tableLocations.ancientOne.getGlobalPosition().add(new Vector(-1, 1, 1))
              );
              additionalSanityToken.setName("The Stars Align sanity tracker");
              additionalSanityToken.snapToGround();
              additionalSanityToken.setState(stateOverflow - 1);
            } else {
              sanityToken.setState(newState);
            }
          }

          Util.logScriptAction(
            `SETUP (Prelude: The Stars Align) placed additional Sanity (+${halfNumPlayers}) on the Ancient One sheet.`
          );
        }
      } else {
        const mysticRuinsIds = Array.from(world.__eldritchHorror.mysticRuins);
        if (!mysticRuinsIds.some((x) => world.__eldritchHorror.alreadyLoaded.includes(x))) {
          // setup mystic ruins deck
          const mysticRuinsDeck = createCard(...mysticRuinsIds);
          mysticRuinsDeck.setId("encounter-mystic-ruins-deck");
          mysticRuinsDeck.setName("Mystic Ruins Encounters");
          GameUtil.addEncounterDeck(mysticRuinsDeck);
          mysticRuinsDeck.shuffle();

          const mysticRuinsToken = createCard("A9C452A442F9A36AC77CC1B68633FEEE");
          mysticRuinsToken.setId("mystic-ruins-token");
          mysticRuinsToken.setName("Mystic Ruins Token");
          GameUtil.positionEncounterToken(mysticRuinsDeck, mysticRuinsToken);

          world.__eldritchHorror.alreadyLoaded.push(...mysticRuinsIds);
        }

        // place 1 eldritch token on each blue space of the omen track
        Util.moveOrAddObject(GameUtil.takeEldritchTokens(1), gameBoardLocations.omen.blue1);
        Util.moveOrAddObject(GameUtil.takeEldritchTokens(1), gameBoardLocations.omen.blue2);

        if (!tableLocations.ancientOne) {
          throw new Error("Unable to find snap point for ancient one");
        }
        // place sanity equal to player count on this sheet.
        const sanityToken = Util.createMultistateObject(
          "CD0FA9DC41E13E96DC743A8A30C2DD75",
          tableLocations.ancientOne.getGlobalPosition().add(new Vector(0, 0, 1))
        );
        sanityToken.setName("The Stars Align sanity tracker");
        sanityToken.snapToGround();
        if (iconReference) {
          sanityToken.setState(iconReference.numberOfPlayers - 1);
        }

        Util.logScriptAction(
          "SETUP (Prelude: The Stars Align) set up the Mystic Ruins Encounter deck. " +
            `Placed 1 Eldritch token on each blue space of the Omen track and Sanity equal to player count on Antediluvium's sheet.`
        );
      }
    },
  },
  "Unto the Breach": {
    afterResolvingSetup: (ancientOne) => {
      if (ancientOne === "Azathoth" || ancientOne === "Syzygy") {
        GameUtil.advanceDoom(3);
      }
    },
  },
  "Wondrous Curios": {},
};

/** @type {Record<string, Prelude>} */
const duplicatePrelude = {
  "Beginning of the End": {
    afterResolvingSetup: () => {
      // place eldritch token on green omen
      const eldritchToken = GameUtil.takeEldritchTokens(1);

      Util.moveOrAddObject(eldritchToken, gameBoardLocations.omen.green);

      Util.logScriptAction(
        "SETUP (Prelude: Beginning of the End) placed 1 Eldritch token on the green space of the Omen track."
      );
    },
  },
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

        Util.logScriptAction(
          `SETUP (Prelude: Call of Cthulhu, Investigator: ${investigator.name}) gained 1 Eldritch token.`
        );
        player.sendChatMessage(
          `You received an Eldritch token. Place it on the nearest sea space that does not contain an Eldritch token. Also move your Investigator to the nearest sea space and lose 1 sanity.`,
          player.getPlayerColor()
        );

        return {
          eldritchTokens: 1,
        };
      }
    },
  },
  "The Dunwich Horror": {
    afterResolvingSetup: (ancientOne) => {
      // if Yog-Sothoth make "Spawn of Yog-Sothoth" the active mystery
      // always spawn the Dunwich Horror epic monster on Arkham
      if (ancientOne === "Yog-Sothoth") {
        const mysteryDeck = world.getObjectById("mystery-deck");
        if (!mysteryDeck || !(mysteryDeck instanceof Card)) {
          throw new Error("Unable to find mystery deck");
        }

        const activeMysterySnapPoint = tableLocations.activeMystery;
        if (activeMysterySnapPoint) {
          const activeMystery = activeMysterySnapPoint.getSnappedObject(2);
          if (activeMystery instanceof Card) {
            const activeMysteryName = activeMystery.getCardDetails().name;
            if (activeMysteryName !== "Spawn of Yog-Sothoth") {
              mysteryDeck.addCards(activeMystery);

              const activeMysteryCard = Util.takeCardNameFromStack(
                mysteryDeck,
                "Spawn of Yog-Sothoth"
              );
              if (!activeMysteryCard) {
                throw new Error('Unable to find "Spawn of Yog-Sothoth" in mystery deck');
              }

              if (!tableLocations.activeMystery) {
                throw new Error("Unable to find active mystery snap point");
              }
              Util.moveObject(activeMysteryCard, tableLocations.activeMystery);
              Util.flip(activeMysteryCard);
            }
          }
        }

        Util.logScriptAction(
          'SETUP (Prelude: The Dunwich Horror) drew the "Spawn of Yog-Sothoth" Mystery instead of a random Mystery then resolved the "when this card enters play" effect.'
        );
      } else {
        Util.logScriptAction(
          'SETUP (Prelude: The Dunwich Horror) spawned the "Dunwich Horror" Epic Monster on Arkham.'
        );
      }

      try {
        GameUtil.spawnEpicMonster("Dunwich Horror", gameBoardLocations.space.Arkham);
      } catch (error) {
        console.error(error.message);
      }
    },
    investigatorSetup: (investigator, sheet, healthToken, sanityToken, pawn, ancientOne) => {
      Util.logScriptAction(
        `SETUP (Prelude: The Dunwich Horror, Investigator: ${investigator.name}) gained 1 Spell.`
      );

      return {
        // random spell differs from original where it's a Glamour Spell
        randomSpells: 1,
      };
    },
  },
  "Twin Blasphemies of the Black Goat": {
    afterResolvingSetup: (ancientOne) => {
      let message =
        "SETUP (Prelude: Twin Blasphemies of the Black Goat) set aside 2 Ghoul Monsters.";

      if (ancientOne === "Shub-Niggurath") {
        const mysteryDeck = world.getObjectById("mystery-deck");
        if (!mysteryDeck || !(mysteryDeck instanceof Card)) {
          throw new Error("Unable to find mystery deck");
        }

        const activeMysterySnapPoint = tableLocations.activeMystery;
        if (activeMysterySnapPoint) {
          const activeMystery = activeMysterySnapPoint.getSnappedObject(2);
          if (activeMystery instanceof Card) {
            const activeMysteryName = activeMystery.getCardDetails().name;
            // Spawn of the Black Goat is correct, it was corrected in the Errata
            if (activeMysteryName !== "Spawn of the Black Goat") {
              mysteryDeck.addCards(activeMystery);

              const activeMysteryCard = Util.takeCardNameFromStack(
                mysteryDeck,
                "Spawn of the Black Goat"
              );
              if (!activeMysteryCard) {
                throw new Error('Unable to find "Spawn of the Black Goat" in mystery deck');
              }

              if (!tableLocations.activeMystery) {
                throw new Error("Unable to find active mystery snap point");
              }
              Util.moveObject(activeMysteryCard, tableLocations.activeMystery);
              Util.flip(activeMysteryCard);

              message +=
                ' Drew the "Spawn of the Black Goat" (Errata) Mystery instead of a random Mystery then resolved the "when this card enters play" effect.';
            }
          }
        }
      } else {
        GameUtil.setAsideMonster("Ghoul", 2);

        try {
          GameUtil.spawnEpicMonster("Nug", gameBoardLocations.space["The Amazon"]);
        } catch (error) {
          console.error(error.message);
        }

        message += " Spawned the Nug Epic Monster on The Amazon.";
      }

      // if playing with forsaken lore
      if (GameUtil.getSavedData().sets.includes("eh02")) {
        GameUtil.spawnEpicMonster("Yeb", gameBoardLocations.space["The Amazon"]);
        // Yeb spawn effect: spawn 2 monsters on this space
        const [monster1, spawnEffect1] = GameUtil.spawnMonster(
          gameBoardLocations.space["The Amazon"]
        );
        const [monster2, spawnEffect2] = GameUtil.spawnMonster(
          gameBoardLocations.space["The Amazon"]
        );
        const spawnedMonsters = [monster1, monster2].map((monster) => {
          if (monster) {
            const monsterName = monster.getCardDetails().name;

            return monsterName;
          }
          return "";
        });

        message += ` Spawned the Yeb Epic Monster on The Amazon then resolved its spawn effect (${spawnedMonsters.join(
          ", "
        )})`;
        if (spawnEffect1) {
          message += `\nSpawn Effect (${spawnedMonsters[0]}): ${spawnEffect1}.`;
        }
        if (spawnEffect2) {
          message += `\nSpawn Effect (${spawnedMonsters[1]}): ${spawnEffect2}.`;
        }
      }

      Util.logScriptAction(message);
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
      Util.logScriptAction(
        `SETUP (Prelude: Twin Blasphemies of the Black Goat, Investigator: ${investigator.name}) improved strength and will.`
      );

      return { strength: 1, will: 1 };
    },
  },
};

if (!world.__eldritchHorror.alreadyLoaded.includes("372C546449CBC4EEDAB6F9823A0BF81B")) {
  for (const [name, prelude] of Object.entries(preludes)) {
    world.__eldritchHorror.preludes.set(name, prelude);
  }
  world.__eldritchHorror.alreadyLoaded.push("372C546449CBC4EEDAB6F9823A0BF81B");
}

if (!world.__eldritchHorror.alreadyLoaded.includes("03836300451A90F12399F0BD53AF56C7")) {
  const { investigators09 } = require("./investigators");
  world.__eldritchHorror.investigators.push(...investigators09);
  world.__eldritchHorror.alreadyLoaded.push("03836300451A90F12399F0BD53AF56C7");
}
