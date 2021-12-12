const { refObject } = require("@tabletop-playground/api");
const { gameBoardLocations } = require("../world-constants");

const boardSnap = refObject.getSnapPoint(0);
if (!boardSnap) {
  throw new Error("Missing snap point on Egypt side board mat");
}
const africaSnap = refObject.getSnapPoint(2);
if (!africaSnap) {
  throw new Error("Missing snap point on Egypt side board mat");
}
const egyptSnap = refObject.getSnapPoint(3);
if (!egyptSnap) {
  throw new Error("Missing snap point on Egypt side board mat");
}
const adventureSnap = refObject.getSnapPoint(7);
if (!adventureSnap) {
  throw new Error("Missing snap point on Egypt side board mat");
}
const activeAdventureSnap = refObject.getSnapPoint(8);
if (!activeAdventureSnap) {
  throw new Error("Missing snap point on Egypt side board mat");
}
const monster1Snap = refObject.getSnapPoint(9);
if (!monster1Snap) {
  throw new Error("Missing snap point on Egypt side board mat");
}
const monster2Snap = refObject.getSnapPoint(10);
if (!monster2Snap) {
  throw new Error("Missing snap point on Egypt side board mat");
}
const monster3Snap = refObject.getSnapPoint(11);
if (!monster3Snap) {
  throw new Error("Missing snap point on Egypt side board mat");
}
const monster4Snap = refObject.getSnapPoint(12);
if (!monster4Snap) {
  throw new Error("Missing snap point on Egypt side board mat");
}

/** @type SideBoard.EgyptMat */
const matSnaps = {
  board: boardSnap,
  africa: africaSnap,
  egypt: egyptSnap,
  adventure: adventureSnap,
  activeAdventure: activeAdventureSnap,
  monster1: monster1Snap,
  monster2: monster2Snap,
  monster3: monster3Snap,
  monster4: monster4Snap,
};

gameBoardLocations.egyptSideBoard = matSnaps;
