const { Util } = require("../util");
const { expansionSpawn } = require("../world-constants");

/**
 * @param {...string} templateId
 */
function createCard(...templateId) {
  return Util.createCard(expansionSpawn, ...templateId);
}

/** @type {Expansion.Items} */
exports.expansionItems = {
  encounterCards: {
    otherWorld: createCard("03EC6E794E859419A279739D98BDB799"),
    america: createCard("42695E444612AC3D4CC7DFA580E82BEA"),
    europe: createCard("F9F3A5124777A0B2A45D65862F7FA21B"),
    asia: createCard("866504ED4A751E05D89F02AE4A143A37"),
    general: createCard("A42AA21248E20C7096D9C491770A4ADE"),
    expedition: createCard("A21793024D25B0192CFDF18D12A752B6"),
  },
  monsters: createCard("52834DDB43778F4B61F8B0BCBC9AF8F5"),
  epicMonsters: createCard("8B784C4E41C499438972A081A17EA538"),
  assetCards: createCard("68911FDF43E1C5334590C1ADF8FE7AEA"),
  conditionCards: createCard("B338467D43F082BDAE12FD810ABAA1A5"),
  artifactCards: createCard("379B133E40E64495E221BE95C1973749"),
  spellCards: createCard("47920FD04B3F8F0BD77036AF77BF8693"),
  mythosCards: {
    green: {
      medium: createCard("26EE131647DCB1A1E3EC4A8EC4518746"),
      hard: createCard("C63DAF5D40045F93BF42DBBE9020FAF7"),
    },
    yellow: {
      medium: createCard("454A00B34DB8B632099E4088A798E378"),
      hard: createCard("15E42D4F42F40455EE1FD98A460E47F8"),
    },
    blue: {
      medium: createCard("F54AAF454B0D16488A33D6B2C1491355"),
      hard: createCard("D2566221443E0D319FF3EFB992EE29E4"),
    },
  },
  ancientOneSheets: [createCard("81D962174B099996EBAE3EA12905FDDC")],
};

/** @type {Expansion.AncientOne[]} */
exports.expandedAncientOnes = [
  {
    name: "Azathoth",
    mysteryTemplateId: "89D86DB2484FAF60B7ACDEBD90FCC69C",
    researchTemplateId: "B719B1B64A66DB1A95604193842FBD5F",
  },
  {
    name: "Cthulhu",
    mysteryTemplateId: "EA2A0D3C47B4DDD67D59188FF2DEBF34",
    researchTemplateId: "F5AD4971437F5D9261BAB5958D58FD89",
    specialTemplateIds: {
      "R'lyeh Risen": "93B60E634A2613118F742599F4FC1F9F",
    },
  },
  {
    name: "Shub-Niggurath",
    mysteryTemplateId: "0F8D22C441846E89BDB247A1AF5A1A79",
    researchTemplateId: "9EBDF20249D14E7C9BA358BF12E1B8BF",
  },
  {
    name: "Yog-Sothoth",
    mysteryTemplateId: "C9C74AFE4F327616A3F6F194FF2C0874",
    researchTemplateId: "19531A854536D4146D867FA801142F7E",
    specialTemplateIds: {
      "The Key and the Gate": "024A047B404B611A5273089785F362F1",
      "Void Between Worlds": "2FEFA89E42B7D69E91F0A58C4E0198CC",
    },
  },
];
