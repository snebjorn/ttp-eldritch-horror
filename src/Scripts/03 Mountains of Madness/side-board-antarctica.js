const { refObject } = require("@tabletop-playground/api");
const { gameBoardLocations } = require("../world-constants");

const sideBoardSpaces = {
  "Miskatonic Outpost": refObject.getSnapPoint(0),
  "Lake Camp": refObject.getSnapPoint(1),
  "Frozen Waste": refObject.getSnapPoint(2),
  "City of the Elder Things": refObject.getSnapPoint(3),
  "Plateau of Leng": refObject.getSnapPoint(4),
  "Snowy Mountains": refObject.getSnapPoint(5),
};

gameBoardLocations.space = { ...gameBoardLocations.space, ...sideBoardSpaces };
