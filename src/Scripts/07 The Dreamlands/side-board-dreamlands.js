const { refObject } = require("@tabletop-playground/api");
const { gameBoardLocations } = require("../world-constants");

const unknownKadathSnap = refObject.getSnapPoint(0);
if (!unknownKadathSnap) {
  throw new Error("Missing snap point on The Dreamlands side board");
}
const theEnchantedWoodSnap = refObject.getSnapPoint(1);
if (!theEnchantedWoodSnap) {
  throw new Error("Missing snap point on The Dreamlands side board");
}
const celephaisSnap = refObject.getSnapPoint(2);
if (!celephaisSnap) {
  throw new Error("Missing snap point on The Dreamlands side board");
}
const ultharSnap = refObject.getSnapPoint(3);
if (!ultharSnap) {
  throw new Error("Missing snap point on The Dreamlands side board");
}
const dylathLeenSnap = refObject.getSnapPoint(4);
if (!dylathLeenSnap) {
  throw new Error("Missing snap point on The Dreamlands side board");
}
const theUnderworldSnap = refObject.getSnapPoint(5);
if (!theUnderworldSnap) {
  throw new Error("Missing snap point on The Dreamlands side board");
}
const theMoonSnap = refObject.getSnapPoint(6);
if (!theMoonSnap) {
  throw new Error("Missing snap point on The Dreamlands side board");
}

/** @type {SideBoard.Dreamlands} */
const sideBoardSpaces = {
  "Unknown Kadath": unknownKadathSnap,
  "The Enchanted Wood": theEnchantedWoodSnap,
  Celephaïs: celephaisSnap,
  Ulthar: ultharSnap,
  "Dylath-Leen": dylathLeenSnap,
  "The Underworld": theUnderworldSnap,
  "The Moon": theMoonSnap,
};

gameBoardLocations.space = { ...gameBoardLocations.space, ...sideBoardSpaces };
