const { refObject } = require("@tabletop-playground/api");
const { gameBoardLocations } = require("../world-constants");

const boardSnap = refObject.getSnapPoint(0);
if (!boardSnap) {
  throw new Error("Missing snap point on The Dreamlands side board mat");
}
const dreamQuestSnap = refObject.getSnapPoint(1);
if (!dreamQuestSnap) {
  throw new Error("Missing snap point on The Dreamlands side board mat");
}
const dreamlandsSnap = refObject.getSnapPoint(2);
if (!dreamlandsSnap) {
  throw new Error("Missing snap point on The Dreamlands side board mat");
}
const adventureSnap = refObject.getSnapPoint(9);
if (!adventureSnap) {
  throw new Error("Missing snap point on The Dreamlands side board mat");
}
const activeAdventureSnap = refObject.getSnapPoint(10);
if (!activeAdventureSnap) {
  throw new Error("Missing snap point on The Dreamlands side board mat");
}
const monster1Snap = refObject.getSnapPoint(5);
if (!monster1Snap) {
  throw new Error("Missing snap point on The Dreamlands side board mat");
}
const monster2Snap = refObject.getSnapPoint(6);
if (!monster2Snap) {
  throw new Error("Missing snap point on The Dreamlands side board mat");
}
const monster3Snap = refObject.getSnapPoint(7);
if (!monster3Snap) {
  throw new Error("Missing snap point on The Dreamlands side board mat");
}
const monster4Snap = refObject.getSnapPoint(8);
if (!monster4Snap) {
  throw new Error("Missing snap point on The Dreamlands side board mat");
}

/** @type {SideBoard.DreamlandsMat} */
const matSnaps = {
  board: boardSnap,
  dreamQuest: dreamQuestSnap,
  dreamlands: dreamlandsSnap,
  adventure: adventureSnap,
  activeAdventure: activeAdventureSnap,
  monster1: monster1Snap,
  monster2: monster2Snap,
  monster3: monster3Snap,
  monster4: monster4Snap,
};

gameBoardLocations.dreamlandsMat = matSnaps;
