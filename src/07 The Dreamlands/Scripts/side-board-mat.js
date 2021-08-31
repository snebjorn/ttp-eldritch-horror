const { refObject } = require("@tabletop-playground/api");
// @ts-ignore
const { gameBoardLocations } = require("../../940067/Scripts/world-constants");

const matSnaps = {
  board: refObject.getSnapPoint(0),
  dreamQuest: refObject.getSnapPoint(1),
  dreamlands: refObject.getSnapPoint(2),
  adventure: refObject.getSnapPoint(9),
  activeAdventure: refObject.getSnapPoint(10),
  monster1: refObject.getSnapPoint(5),
  monster2: refObject.getSnapPoint(6),
  monster3: refObject.getSnapPoint(7),
  monster4: refObject.getSnapPoint(8),
};

gameBoardLocations.dreamlandsSideBoard = matSnaps;
