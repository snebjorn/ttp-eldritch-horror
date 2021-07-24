const { UIElement, Vector, world, refHolder, Text } = require("@tabletop-playground/api");

refHolder.onInserted.add((_, iconReference) => {
  const cardDetails = iconReference.getCardDetails();
  if (cardDetails) {
    world.__eldritchHorror.activeIconReference = ToIconReference(cardDetails.name);

    if (!!world.__eldritchHorror.updateSetupUIFn) {
      world.__eldritchHorror.updateSetupUIFn();
    }
  }
});
refHolder.onRemoved.add(() => {
  world.__eldritchHorror.activeIconReference = undefined;

  if (!!world.__eldritchHorror.updateSetupUIFn) {
    world.__eldritchHorror.updateSetupUIFn();
  }
});

const ui = new UIElement();
ui.position = new Vector(0, 0, 0.11);
ui.widget = new Text().setFontSize(64).setText("        Active\nIcon Reference");
ui.scale = 0.1;
refHolder.addUI(ui);

/**
 * @param {string} name
 * @returns {IconReference | undefined}
 */
function ToIconReference(name) {
  switch (name) {
    case "1":
      return { numberOfPlayers: 1, spawnGates: 1, spawnClues: 1, monsterSurge: 1 };
    case "2":
      return { numberOfPlayers: 2, spawnGates: 1, spawnClues: 1, monsterSurge: 1 };
    case "3":
      return { numberOfPlayers: 3, spawnGates: 1, spawnClues: 2, monsterSurge: 2 };
    case "4":
      return { numberOfPlayers: 4, spawnGates: 1, spawnClues: 2, monsterSurge: 2 };
    case "5":
      return { numberOfPlayers: 5, spawnGates: 2, spawnClues: 3, monsterSurge: 2 };
    case "6":
      return { numberOfPlayers: 6, spawnGates: 2, spawnClues: 3, monsterSurge: 2 };
    case "7":
      return { numberOfPlayers: 7, spawnGates: 2, spawnClues: 4, monsterSurge: 3 };
    case "8":
      return { numberOfPlayers: 8, spawnGates: 2, spawnClues: 4, monsterSurge: 3 };
    case "v1":
      return { numberOfPlayers: 1, spawnGates: 1, spawnClues: 2, monsterSurge: 1 };
    case "v4":
      return { numberOfPlayers: 4, spawnGates: 2, spawnClues: 2, monsterSurge: 1 };
    case "v5":
      return { numberOfPlayers: 5, spawnGates: 2, spawnClues: 3, monsterSurge: 1 };
    case "v7":
      return { numberOfPlayers: 7, spawnGates: 3, spawnClues: 4, monsterSurge: 1 };
    case "v8":
      return { numberOfPlayers: 8, spawnGates: 3, spawnClues: 4, monsterSurge: 1 };
  }
}
