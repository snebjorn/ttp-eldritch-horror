const { refObject } = require("@tabletop-playground/api");
// @ts-ignore
const { gameBoardLocations } = require("../../940067/Scripts/world-constants");

const sideBoardSpaces = {
  "The Sahara Desert": refObject.getSnapPoint(0),
  Alexandria: refObject.getSnapPoint(1),
  "The Bent Pyramid": refObject.getSnapPoint(2),
  Cairo: refObject.getSnapPoint(3),
  "Tel el-Amarna": refObject.getSnapPoint(4),
  "The Nile River": refObject.getSnapPoint(5),
};

gameBoardLocations.space = { ...gameBoardLocations.space, ...sideBoardSpaces };
