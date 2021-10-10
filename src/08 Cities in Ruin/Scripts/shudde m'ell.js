const { refCard, world } = require("@tabletop-playground/api");
// @ts-ignore
const { Util } = require("../../940067/Scripts/util");
// @ts-ignore
const { GameUtil } = require("../../940067/Scripts/game-util");
// @ts-ignore
const { gameBoardLocations } = require("../../940067/Scripts/world-constants");

/** @type AncientOne */
const shudde = {
  name: "Shudde M'ell",
  doom: 15,
  sheetId: refCard.getId(),
  mysteryTemplateIds: ["A9F67DFE4139270360163DA4D8E6A760"],
  researchTemplateIds: ["FE43F82A4C780AF34FB3568735BA0A7D"],
  specialTemplateIds: {
    "Exploring G'harne": ["19658BC748B4908DFD3925AEFD8ABBF3"],
  },
  mythosDeck: {
    stage1: { green: 0, yellow: 2, blue: 2 },
    stage2: { green: 4, yellow: 2, blue: 0 },
    stage3: { green: 2, yellow: 4, blue: 0 },
  },
  customSetup: () => {
    // place 1 eldritch token on 2,5,8,11 of the doom track
    Util.moveOrAddObject(GameUtil.takeEldritchTokens(1), gameBoardLocations.doom[2]);
    Util.moveOrAddObject(GameUtil.takeEldritchTokens(1), gameBoardLocations.doom[5]);
    Util.moveOrAddObject(GameUtil.takeEldritchTokens(1), gameBoardLocations.doom[8]);
    Util.moveOrAddObject(GameUtil.takeEldritchTokens(1), gameBoardLocations.doom[11]);

    const devastationToken = GameUtil.takeDevastationTokens(1);
    Util.moveOrAddObject(devastationToken, gameBoardLocations.space.Rome);
    // TODO When a space is devastated, discard all Clues and defeated investigator tokens on that space, search the Expedition Encounter deck for each card that corresponds to that space and return them to the game box

    Util.logScriptAction(
      "SETUP (Shudde M'ell) placed 1 Eldritch token each on spaces 2,5,8,11 of the Doom track. Placed 1 Devastation token on Rome"
    );
  },
};

world.__eldritchHorror.ancientOnes.set(shudde.name, shudde);
