const { world } = require("@tabletop-playground/api");
const { Util } = require("../util");
const { GameUtil } = require("../game-util");
const { expansionSpawn, mythosSetupDecks, tableLocations } = require("../world-constants");

/**
 * @param {...string} templateId
 */
function createCard(...templateId) {
  return Util.createCard(expansionSpawn, ...templateId);
}

/** @type {Expansion.Items} */
exports.expansionItems = {
  encounterCards: {
    otherWorld: createCard("DFBF9C99484CD1BA183C6F806296D53C"),
    america: createCard("029C8D4244301C1AE80746BDD39C8A94"),
    europe: createCard("6856FB9B4B2DFE6E04292688FE23C838"),
    asia: createCard("462D56F24E512B8D4BE1A280F671FC63"),
    general: createCard("9E5A4A42462FB676B50F6990B850103A"),
    expedition: createCard("9DFE1A234F6678A85437FB9920D2961A"),
  },
  monsters: createCard("0068A2EA411176718944BEB685D5C6C1"),
  epicMonsters: createCard("B5C945134B8C83F4594A02A34A1E5DCC"),
  assetCards: createCard("E493B2CB44337AFB7D67018783A2A2AE"),
  uniqueAssetCards: createCard("597D618A4F6B03F4D56CA3B2F2D49461"),
  conditionCards: createCard("50AD88454871FEE705093A8E27AD83A7"),
  artifactCards: createCard("D27F96F24539BB37C3BE87A380199979"),
  spellCards: createCard("B2D3E0254E1A718022ACAC9920C4B210"),
  impairment: true,
  preludeCards: createCard("90193EE849CC8F3DEC9FC8B1BF3A98CC"),
  mythosCards: {
    green: {
      easy: createCard("7793BC3347FA2D012237E0928E625F6B"),
      medium: createCard("2E6375CC4AEAD5CA706E539E5E35D977"),
      hard: createCard("7E380A3343D98C65F4E61DB7AEF5ADD7"),
    },
    yellow: {
      easy: createCard("D95CBFFE48EC054A2D54B2897ADBE6E4"),
      medium: createCard("9BA84E8044DB88C07192B88FC93F9E8C"),
      hard: createCard("572112E646642C19B81726ADC0CFFBB8"),
    },
    blue: {
      easy: createCard("1E93058D413AA98238B3BEB535EF62E4"),
      medium: createCard("C3FE70EE4187BE53331B6599906A7CFF"),
      hard: createCard("5F976E164C857DDF473AA6BF29741A50"),
    },
  },
  investigators: createCard("813886DF49292BFF7A90D1920024FD84"),
  ancientOneSheets: [createCard("32D83BF4486AAC2E52F93CADF97C2290")],
  personalStories: {
    missions: "5C2E995B4C7574B3D2E2EBB9D877DC63",
    rewards: "DDF4C47B4D18A4AAED862D9CA2249E33",
    consequences: "DDA2C6E04FC319BD0131748F347C95C6",
  },
};

/** @type {Record<string, Prelude>} */
const preludes = {
  "Silver Twilight Stockpile": {},
  "Sins of the Past": {},
  "The King In Yellow": {
    step4: (ancientOne) => {
      if (ancientOne !== "Hastur") {
        // activate The King In Yellow mythos card, before building the mythos deck
        const kingInYellowMythos = Util.takeCardNameFromStack(
          mythosSetupDecks.blue.medium,
          "The King In Yellow"
        );
        if (kingInYellowMythos && tableLocations.activeMythos) {
          Util.moveObject(kingInYellowMythos, tableLocations.activeMythos);
          Util.flip(kingInYellowMythos);
          const eldritchTokens = GameUtil.takeEldritchTokens(2);
          Util.moveOrAddObject(eldritchTokens, tableLocations.activeMythos);
        }

        Util.logScriptAction(
          'SETUP (Prelude: The King In Yellow) placed "The King In Yellow" Rumor Mythos card in play with 2 Eldritch tokens on it.'
        );
      }
    },
  },
  "Weakness to Strength": {},
};

if (!world.__eldritchHorror.alreadyLoaded.includes("90193EE849CC8F3DEC9FC8B1BF3A98CC")) {
  for (const [name, prelude] of Object.entries(preludes)) {
    world.__eldritchHorror.preludes.set(name, prelude);
  }
  world.__eldritchHorror.alreadyLoaded.push("90193EE849CC8F3DEC9FC8B1BF3A98CC");
}

if (!world.__eldritchHorror.alreadyLoaded.includes("813886DF49292BFF7A90D1920024FD84")) {
  const { investigators06 } = require("./investigators");
  world.__eldritchHorror.investigators.push(...investigators06);
  world.__eldritchHorror.alreadyLoaded.push("813886DF49292BFF7A90D1920024FD84");
}
