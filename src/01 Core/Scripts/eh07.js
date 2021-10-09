const { world, Vector, Card } = require("@tabletop-playground/api");
const { Util } = require("./util");
const { GameUtil } = require("./game-util");
const {
  expansionSpawn,
  tableLocations,
  investigatorDeck,
  gameBoardLocations,
  mythosSetupDecks,
  gateStack,
} = require("./world-constants");
const { setupCrippledInvestigator, getInvestigatorData } = require("./setup-investigator");

/**
 * @param {string} templateId
 */
function createCard(templateId) {
  return Util.createCard(templateId, expansionSpawn);
}

/** @type Expansion.Items */
exports.expansionItems = {
  encounterCards: {
    otherWorld: createCard("399959FE4FCB8009BF01FCA54A79F97B"),
    america: createCard("148A2CBF4684B9DDCB14BF81D72A893E"),
    europe: createCard("491DB7914FEC80F31F6AC18D20027E42"),
    asia: createCard("4A35F5FD458A3C127F8E1E9B7A7F34BD"),
    general: createCard("C52260604C25205510F3AFBAEE3A8DE3"),
  },
  monsters: createCard("B55D53F143680E231D76F887E3BB8CB4"),
  epicMonsters: createCard("D8D376EB44AF8A1F199F0A8E3A8907C3"),
  assetCards: createCard("1F57E16C404279DA4975D49803C3C698"),
  uniqueAssetCards: createCard("624FD93447EBDDBA487D808E390C2AE8"),
  conditionCards: createCard("C6A5A3194965EE161E4EDD9641344A56"),
  artifactCards: createCard("0939CD574E47DBA0A593E2ACBD8DEB1D"),
  spellCards: createCard("3B061BB14220A39830F03AAD0EE07FFE"),
  preludeCards: createCard("AD26C4DD4F31C1BD8140CCACD734D29A"),
  focus: true,
  mythosCards: {
    green: {
      easy: createCard("7BAD50C34F6C6ADF4FFCDAB1AD136205"),
      medium: createCard("CC13F88D438898A93AABD3BEAEBEA699"),
      hard: createCard("71D170CD4C8533C608217090176B3B73"),
    },
    yellow: {
      easy: createCard("5EF46ACD4BBF001E83549EB961FD316A"),
      medium: createCard("ABAA4910446D3CD1BCE8AC8FE50DC4FE"),
      hard: createCard("26E95E40492725A7155786B190C6B130"),
    },
    blue: {
      easy: createCard("18FBB95840B132243E742B850C39F914"),
      medium: createCard("8A6F35994DE6C71E29FC0193118289FE"),
      hard: createCard("0086A8A6458EFEC030D363889BFBFA28"),
    },
  },
  investigators: createCard("0FBEB84546B38D7639AD3087B5EA5C72"),
  ancientOneSheets: [
    createCard("3899F85F40A3A59434D2108736680B04"),
    createCard("4A64269E4F10081FBF0DBD91D03F1C64"),
  ],
};

/** @type Record<string, Prelude> */
const preludes = {
  "Focused Training": {},
  "Lurker Among Us": {
    afterResolvingSetup: () => {
      GameUtil.advanceDoom(1);
      const investigatorDeckPosition = investigatorDeck.getPosition();
      const heightOfSheet = investigatorDeck.getExtent(false).x * 2;
      const separatorBuffer = 2;
      const investigator = Util.takeRandomCardFromStack(investigatorDeck);
      if (investigator) {
        const newPos = investigatorDeckPosition.add(
          new Vector(-heightOfSheet - separatorBuffer, 0, 2)
        );
        investigator.setPosition(newPos, 1);
        Util.flip(investigator);
        investigator.snapToGround();

        const investigatorData = getInvestigatorData(investigator);
        const startingPosition =
          investigatorData.startingLocation !== undefined
            ? gameBoardLocations.space[investigatorData.startingLocation]
            : investigator.getPosition();
        GameUtil.spawnEpicMonster("Doppelganger", startingPosition);

        setupCrippledInvestigator(investigator, { randomAssets: 1, clues: 1 });

        Util.logScriptAction(
          `SETUP (Prelude: Lurker Among Us) drew 1 random Investigator (${investigatorData.name}) and crippled it. Placed starting possessions, 1 random facedown Asset, and 1 Clue on his Investigator sheet. Spawned the Doppelganger Epic Monster on the same space as the defeated Investigator and advanced doom by 1.`
        );
      }
    },
  },
  "Otherworldly Dreams": {
    spawnsSideBoard: (ancientOne) => {
      if (ancientOne !== "Hypnos") {
        return "portrait";
      }

      return;
    },
    step5: (ancientOne, sideBoardSpawn) => {
      // setup dreamlands side board
      if (ancientOne !== "Hypnos") {
        // @ts-ignore - don't try this at home kids
        // prettier-ignore
        const { setupSideBoard } = require("../../1137339/Scripts/setup-side-board");
        return setupSideBoard(sideBoardSpawn);
      }
    },
    afterResolvingSetup: (ancientOne) => {
      if (ancientOne !== "Hypnos") {
        const randNum = Util.randomIntFromInterval(1, 3);
        const randomAdventureTemplateId =
          randNum === 1
            ? "8B79029944625A6941ACE6B0AC534469"
            : randNum === 2
            ? "465C147D4AECB3996A8006A2D00C0A76"
            : "BFA0FDE74C6318E8B058628433AA072D";
        const adventureDeck = createCard(randomAdventureTemplateId);

        adventureDeck.setId("adventure-otherworldly-dreams-deck");
        adventureDeck.setName("Otherworldly Dreams Adventures");
        Util.moveObject(
          adventureDeck,
          // @ts-ignore - dynamically added snap point on side board
          gameBoardLocations.dreamlandsSideBoard.adventure
        );

        const firstAdventureCard = adventureDeck.takeCards(1);
        if (!firstAdventureCard) {
          throw new Error("Unable to take the first card from the Museum Heist adventure deck");
        }
        const dreamlandsActiveAdventureSnapPoint =
          // @ts-ignore - dynamically added snap point on side board
          gameBoardLocations.dreamlandsSideBoard.activeAdventure;
        if (!dreamlandsActiveAdventureSnapPoint) {
          throw new Error("Unable to find snap point for active adventure on Egypt side board");
        }
        Util.moveObject(firstAdventureCard, dreamlandsActiveAdventureSnapPoint);
        Util.flip(firstAdventureCard);

        const adventureToken = createCard("BEEB07464B9819C2D6BAB883A88C9146");
        adventureToken.setId("adventure-otherworldly-dreams-token");
        adventureToken.setName("Adventure Token: Otherworldly Dreams");
        Util.moveObject(adventureToken, gameBoardLocations.space.Arkham);

        Util.logScriptAction(
          'SETUP (Prelude: Otherworldly Dreams) set aside Otherworldly Dreams Adventures; then drew the "A Chance Encounter" Adventure.'
        );
      }
    },
    investigatorSetup: (investigator, sheet, healthToken, sanityToken, pawn, ancientOne) => {
      if (ancientOne === "Hypnos") {
        healthToken.setState(healthToken.getState() - 1);
        sanityToken.setState(sanityToken.getState() - 1);

        Util.logScriptAction(
          `SETUP (Prelude: Otherworldly Dreams, Investigator: ${investigator.name}) lost 1 Health and 1 Sanity and gained 1 Focus.`
        );

        return { focus: 1 };
      }
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

        message += " Spawned the Nug Epic Monster on The Amazon.";
      }

      try {
        GameUtil.spawnEpicMonster("Nug", gameBoardLocations.space["The Amazon"]);
      } catch (error) {
        console.error(error.message);
      }

      // TODO if playing with forsaken lore
      try {
        GameUtil.spawnEpicMonster("Yeb", gameBoardLocations.space["The Amazon"]);
        // Yeb spawn effect: spawn 2 monsters on this space
        const monster1 = GameUtil.spawnMonster(gameBoardLocations.space["The Amazon"]);
        const monster2 = GameUtil.spawnMonster(gameBoardLocations.space["The Amazon"]);
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
      } catch (error) {
        console.error(error.message);
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
  "Web Between Worlds": {
    step4: (ancientOne) => {
      if (ancientOne !== "Atlach-Nacha") {
        // activate Web Between Worlds mythos card, before building the mythos deck
        const rumorMythos = Util.takeCardNameFromStack(
          mythosSetupDecks.blue.hard,
          "Web Between Worlds"
        );
        if (rumorMythos && tableLocations.activeMythos) {
          Util.moveObject(rumorMythos, tableLocations.activeMythos);
          Util.flip(rumorMythos);
          const eldritchTokens = GameUtil.takeEldritchTokens(4);
          Util.moveObject(eldritchTokens, tableLocations.activeMythos);
        }

        Util.logScriptAction(
          'SETUP (Prelude: Web Between Worlds) placed the "Web Between Worlds" Rumor Mythos card in play with 4 Eldritch tokens on it.'
        );
      }
    },
    afterResolvingSetup: (ancientOne, iconReference) => {
      if (ancientOne === "Atlach-Nacha" && iconReference) {
        const spawnedGates = GameUtil.spawnGates(iconReference.spawnGates);
        const spawnedGatesText = spawnedGates
          .map(([gateName, monsterName]) => `"${gateName}" with 1 monster (${monsterName})`)
          .join("; ");

        Util.logScriptAction(
          `SETUP (Prelude: Web Between Worlds) spawned ${iconReference.spawnGates} additional Gates (${spawnedGatesText}) as indicated by the Reference card.`
        );
      }
    },
  },
  "Written In the Stars": {
    afterResolvingSetup: () => {
      GameUtil.retreatDoom(3);
      // reveal top gate
      Util.flipInStack(gateStack);

      Util.logScriptAction(
        "SETUP (Prelude: Written In the Stars) retreated Doom by 3. Revealed the top Gate of the Gate stack."
      );
    },
  },
};

if (!world.__eldritchHorror.alreadyLoaded.includes("AD26C4DD4F31C1BD8140CCACD734D29A")) {
  for (const [name, prelude] of Object.entries(preludes)) {
    world.__eldritchHorror.preludes.set(name, prelude);
  }
  world.__eldritchHorror.alreadyLoaded.push("AD26C4DD4F31C1BD8140CCACD734D29A");
}

if (!world.__eldritchHorror.alreadyLoaded.includes("0FBEB84546B38D7639AD3087B5EA5C72")) {
  // @ts-ignore
  const { investigators } = require("../../1137339/Scripts/investigators");
  world.__eldritchHorror.investigators.push(...investigators);
  world.__eldritchHorror.alreadyLoaded.push("0FBEB84546B38D7639AD3087B5EA5C72");
}
