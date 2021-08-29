const { refObject } = require("@tabletop-playground/api");
// @ts-ignore
const { gameBoardLocations } = require("../../940067/Scripts/world-constants");

const matSnaps = {
  board: refObject.getSnapPoint(0),
  africa: refObject.getSnapPoint(2),
  egypt: refObject.getSnapPoint(3),
  adventure: refObject.getSnapPoint(7),
  activeAdventure: refObject.getSnapPoint(8),
  monster1: refObject.getSnapPoint(9),
  monster2: refObject.getSnapPoint(10),
  monster3: refObject.getSnapPoint(11),
  monster4: refObject.getSnapPoint(12),
};

gameBoardLocations.antarcticaSideBoard = matSnaps;
