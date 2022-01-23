const {
  world,
  refObject,
  UIElement,
  Vector,
  ImageWidget,
  Card,
} = require("@tabletop-playground/api");
const { Util } = require("./util");
const { tableLocations } = require("./world-constants");

const tableMat = refObject;
const matSurfaceZ = Util.getTopPosition(tableMat).z;

const assetDiscardPileSnap = tableLocations.assetDiscardPile;
if (assetDiscardPileSnap) {
  const assetDiscardPileSnapZ = assetDiscardPileSnap.getGlobalPosition().z;
  const zDifference = assetDiscardPileSnapZ - matSurfaceZ;

  const ui = new UIElement();
  ui.position = assetDiscardPileSnap
    .getLocalPosition()
    .subtract(new Vector(0, 0, zDifference))
    // 0.03 is the magic height that raises the UI so it's visible
    .add(new Vector(0, 0, 0.03));
  // need to scale so images are not pixilated
  ui.scale = 0.1; // at scale 1, one pixel corresponds to one millimeter

  const image = new ImageWidget().setImage("Asset - discard.png").setImageSize(400, 630);

  ui.widget = image;

  tableMat.addUI(ui);
}

const assetDeckZone = world.getZoneById("asset-deck-zone");
if (assetDeckZone) {
  assetDeckZone.onBeginOverlap.add((zone, object) => {
    if (
      object instanceof Card &&
      object.getTemplateName() === "Assets" &&
      world.getObjectById("asset-deck") === undefined
    ) {
      object.setId("asset-deck");
      object.setName("Assets");
    }
  });
  assetDeckZone.onEndOverlap.add((zone, object) => {
    if (
      object instanceof Card &&
      object.getTemplateName() === "Assets" &&
      object.getId() === "asset-deck"
    ) {
      let randomStr;
      do {
        randomStr = Math.random().toString(36).substring(2, 5);
      } while (object.setId(randomStr) === false);
      if (object.getName() === "Assets") {
        object.setName("");
      }
    }
  });
}

const assetDiscardZone = world.getZoneById("asset-discard-zone");
if (assetDiscardZone) {
  assetDiscardZone.onBeginOverlap.add((zone, object) => {
    if (
      object instanceof Card &&
      object.getTemplateName() === "Assets" &&
      world.getObjectById("asset-discard-pile") === undefined
    ) {
      object.setId("asset-discard-pile");
      object.setName("Asset Discard Pile");
      if (!object.isFaceUp()) {
        Util.flip(object);
      }
    }
  });
  assetDiscardZone.onEndOverlap.add((zone, object) => {
    if (
      object instanceof Card &&
      object.getTemplateName() === "Assets" &&
      object.getId() === "asset-discard-pile"
    ) {
      let randomStr;
      do {
        randomStr = Math.random().toString(36).substring(2, 5);
      } while (object.setId(randomStr) === false);
      if (object.getName() === "Asset Discard Pile") {
        object.setName("");
      }
    }
  });
}

const clueDiscardPileSnap = tableLocations.clueDiscardPile;
if (clueDiscardPileSnap) {
  const clueDiscardPileSnapZ = clueDiscardPileSnap.getGlobalPosition().z;
  const zDifference = clueDiscardPileSnapZ - matSurfaceZ;

  const ui = new UIElement();
  ui.position = clueDiscardPileSnap
    .getLocalPosition()
    .subtract(new Vector(0, 0, zDifference))
    // 0.03 is the magic height that raises the UI so it's visible
    .add(new Vector(0, 0, 0.03));
  // need to scale so images are not pixilated
  ui.scale = 0.1; // at scale 1, one pixel corresponds to one millimeter

  const image = new ImageWidget().setImage("Clues - discard.png").setImageSize(200, 200);

  ui.widget = image;

  tableMat.addUI(ui);
}

const cluePoolZone = world.getZoneById("clue-pool-zone");
if (cluePoolZone) {
  cluePoolZone.onBeginOverlap.add((zone, object) => {
    if (
      object instanceof Card &&
      object.getTemplateName().startsWith("Clues") &&
      world.getObjectById("clue-pool") === undefined
    ) {
      object.setId("clue-pool");
      object.setName("Clue Pool");
      object.setScript("clue-pool.js", "8A0B748B4DA2CE04CB79E4A02C7FD720");
    }
  });
  cluePoolZone.onEndOverlap.add((zone, object) => {
    if (
      object instanceof Card &&
      object.getTemplateName().startsWith("Clues") &&
      object.getId() === "clue-pool"
    ) {
      let randomStr;
      do {
        randomStr = Math.random().toString(36).substring(2, 5);
      } while (object.setId(randomStr) === false);
      if (object.getName() === "Clue Pool") {
        object.setName("");
      }
      if (object.getScriptFilename() === "clue-pool.js") {
        object.setScript("");
      }
    }
  });
}

const clueDiscardZone = world.getZoneById("clue-discard-zone");
if (clueDiscardZone) {
  clueDiscardZone.onBeginOverlap.add((zone, object) => {
    if (
      object instanceof Card &&
      object.getTemplateName().startsWith("Clues") &&
      world.getObjectById("clue-discard-pile") === undefined
    ) {
      object.setId("clue-discard-pile");
      object.setName("Clue Discard Pile");
      if (!object.isFaceUp()) {
        Util.flip(object);
      }
    }
  });
  clueDiscardZone.onEndOverlap.add((zone, object) => {
    if (
      object instanceof Card &&
      object.getTemplateName().startsWith("Clues") &&
      object.getId() === "clue-discard-pile"
    ) {
      if (object.getName() === "Clue Discard Pile") {
        object.setName("");
      }
    }
  });
}

const gateDiscardPileSnap = tableLocations.gateDiscardPile;
if (gateDiscardPileSnap) {
  const gateDiscardPileSnapZ = gateDiscardPileSnap.getGlobalPosition().z;
  const zDifference = gateDiscardPileSnapZ - matSurfaceZ;

  const ui = new UIElement();
  ui.position = gateDiscardPileSnap
    .getLocalPosition()
    .subtract(new Vector(0, 0, zDifference))
    // 0.03 is the magic height that raises the UI so it's visible
    .add(new Vector(0, 0, 0.03));
  // need to scale so images are not pixilated
  ui.scale = 0.1; // at scale 1, one pixel corresponds to one millimeter

  const image = new ImageWidget().setImage("gates - discard.png").setImageSize(550, 550);

  ui.widget = image;

  tableMat.addUI(ui);
}

const gateStackZone = world.getZoneById("gate-stack-zone");
if (gateStackZone) {
  gateStackZone.onBeginOverlap.add((zone, object) => {
    if (
      object instanceof Card &&
      object.getTemplateName().startsWith("Gates") &&
      world.getObjectById("gate-stack") === undefined
    ) {
      object.setId("gate-stack");
      object.setName("Gate Stack");
      object.setScript("gate-stack.js", "8A0B748B4DA2CE04CB79E4A02C7FD720");
    }
  });
  gateStackZone.onEndOverlap.add((zone, object) => {
    if (
      object instanceof Card &&
      object.getTemplateName().startsWith("Gates") &&
      object.getId() === "gate-stack"
    ) {
      let randomStr;
      do {
        randomStr = Math.random().toString(36).substring(2, 5);
      } while (object.setId(randomStr) === false);
      if (object.getName() === "Gate Stack") {
        object.setName("");
      }
      if (object.getScriptFilename() === "gate-stack.js") {
        object.setScript("");
      }
    }
  });
}

const gateDiscardZone = world.getZoneById("gate-discard-zone");
if (gateDiscardZone) {
  gateDiscardZone.onBeginOverlap.add((zone, object) => {
    if (
      object instanceof Card &&
      object.getTemplateName().startsWith("Gates") &&
      world.getObjectById("gate-discard-pile") === undefined
    ) {
      object.setId("gate-discard-pile");
      object.setName("Gate Discard Pile");
      if (!object.isFaceUp()) {
        Util.flip(object);
      }
    }
  });
  gateDiscardZone.onEndOverlap.add((zone, object) => {
    if (
      object instanceof Card &&
      object.getTemplateName().startsWith("Gates") &&
      object.getId() === "gate-discard-pile"
    ) {
      let randomStr;
      do {
        randomStr = Math.random().toString(36).substring(2, 5);
      } while (object.setId(randomStr) === false);
      if (object.getName() === "Gate Discard Pile") {
        object.setName("");
      }
    }
  });
}
