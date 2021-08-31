const { world } = require("@tabletop-playground/api");
const { Util } = require("./util");
const { GameUtil } = require("./game-util");
const { expansionSpawn, mythosSetupDecks, tableLocations } = require("./world-constants");

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
  "Lurker Among Us": {},
  "Otherworldly Dreams": {},
  "Twin Blasphemies of the Black Goat": {},
  "Web Between Worlds": {},
  "Written In the Stars": {},
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
