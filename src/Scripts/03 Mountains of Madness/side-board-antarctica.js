const { refObject } = require("@tabletop-playground/api");
const { gameBoardLocations } = require("../world-constants");

const miskatonicOutpostSnap = refObject.getSnapPoint(0);
if (!miskatonicOutpostSnap) {
  throw new Error("Missing snap point on Antarctica side board");
}
const lakeCampSnap = refObject.getSnapPoint(1);
if (!lakeCampSnap) {
  throw new Error("Missing snap point on Antarctica side board");
}
const frozenWasteSnap = refObject.getSnapPoint(2);
if (!frozenWasteSnap) {
  throw new Error("Missing snap point on Antarctica side board");
}
const cityOfTheElderThingsSnap = refObject.getSnapPoint(3);
if (!cityOfTheElderThingsSnap) {
  throw new Error("Missing snap point on Antarctica side board");
}
const plateauOfLengSnap = refObject.getSnapPoint(4);
if (!plateauOfLengSnap) {
  throw new Error("Missing snap point on Antarctica side board");
}
const snowyMountainsSnap = refObject.getSnapPoint(5);
if (!snowyMountainsSnap) {
  throw new Error("Missing snap point on Antarctica side board");
}

/** @type SideBoard.Antarctica */
const sideBoardSpaces = {
  "Miskatonic Outpost": miskatonicOutpostSnap,
  "Lake Camp": lakeCampSnap,
  "Frozen Waste": frozenWasteSnap,
  "City of the Elder Things": cityOfTheElderThingsSnap,
  "Plateau of Leng": plateauOfLengSnap,
  "Snowy Mountains": snowyMountainsSnap,
};

gameBoardLocations.space = { ...gameBoardLocations.space, ...sideBoardSpaces };
