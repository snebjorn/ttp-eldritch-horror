const { refObject } = require("@tabletop-playground/api");
// @ts-ignore
const { gameBoardLocations } = require("../../940067/Scripts/world-constants");

const sideBoardSpaces = {
  "Unknown Kadath": refObject.getSnapPoint(0),
  "The Enchanted Wood": refObject.getSnapPoint(1),
  Celephais: refObject.getSnapPoint(2),
  Ulthar: refObject.getSnapPoint(3),
  "Dylath-Leen": refObject.getSnapPoint(4),
  "The Underworld": refObject.getSnapPoint(5),
  "The Moon": refObject.getSnapPoint(6),
};

gameBoardLocations.space = { ...gameBoardLocations.space, ...sideBoardSpaces };
