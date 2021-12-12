const { refObject } = require("@tabletop-playground/api");
const { gameBoardLocations } = require("../world-constants");

const theSaharaDesertSnap = refObject.getSnapPoint(0);
if (!theSaharaDesertSnap) {
  throw new Error("Missing snap point on Egypt side board");
}
const alexandriaSnap = refObject.getSnapPoint(1);
if (!alexandriaSnap) {
  throw new Error("Missing snap point on Egypt side board");
}
const theBentPyramidSnap = refObject.getSnapPoint(2);
if (!theBentPyramidSnap) {
  throw new Error("Missing snap point on Egypt side board");
}
const cairoSnap = refObject.getSnapPoint(3);
if (!cairoSnap) {
  throw new Error("Missing snap point on Egypt side board");
}
const telElAmarnaSnap = refObject.getSnapPoint(4);
if (!telElAmarnaSnap) {
  throw new Error("Missing snap point on Egypt side board");
}
const theNileRiverSnap = refObject.getSnapPoint(5);
if (!theNileRiverSnap) {
  throw new Error("Missing snap point on Egypt side board");
}

/** @type SideBoard.Egypt */
const sideBoardSpaces = {
  "The Sahara Desert": theSaharaDesertSnap,
  Alexandria: alexandriaSnap,
  "The Bent Pyramid": theBentPyramidSnap,
  Cairo: cairoSnap,
  "Tel el-Amarna": telElAmarnaSnap,
  "The Nile River": theNileRiverSnap,
};

gameBoardLocations.space = { ...gameBoardLocations.space, ...sideBoardSpaces };
