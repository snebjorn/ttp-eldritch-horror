const { refObject } = require("@tabletop-playground/api");
const { gameBoardLocations } = require("../world-constants");

const matSnaps = {
  board: refObject.getSnapPoint(0),
  research: refObject.getSnapPoint(1),
  mountains: refObject.getSnapPoint(2),
  outposts: refObject.getSnapPoint(3),
  adventure: refObject.getSnapPoint(7),
  activeAdventure: refObject.getSnapPoint(8),
  monster1: refObject.getSnapPoint(9),
  monster2: refObject.getSnapPoint(10),
  monster3: refObject.getSnapPoint(11),
  monster4: refObject.getSnapPoint(12),
};

gameBoardLocations.antarcticaSideBoard = matSnaps;
