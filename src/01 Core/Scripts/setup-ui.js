const {
  Border,
  Button,
  Card,
  CheckBox,
  Color,
  HorizontalBox,
  Player,
  Text,
  UIElement,
  Vector,
  VerticalBox,
  world,
  ImageButton,
} = require("@tabletop-playground/api");
const { GameUtil } = require("./game-util");
const { loadExpansion } = require("./load-expansion");
const { setupAncient } = require("./setup-ancient");
const { setupReferenceCard } = require("./setup-reference-card");
const {
  assetDeck,
  conditionDeck,
  spellDeck,
  artifactDeck,
  encounterDecks,
  cluePool,
  gateStack,
  monsterCup,
} = require("./world-constants");

function drawSetupUi() {
  const ui = new UIElement();
  const border = new Border().setColor(new Color(0, 0, 0, 1));
  ui.widget = border;
  ui.position = new Vector(10, 0, 100);

  let step = 1;

  const vBox = new VerticalBox();
  vBox.setChildDistance(6);
  border.setChild(vBox);
  vBox.addChild(new Text().setText("Setup"));
  vBox.addChild(new Text().setText(""));
  vBox.addChild(new Text().setText(`${step++}. Select Icon Reference Card`));
  const iconRefBox = new HorizontalBox();
  vBox.addChild(iconRefBox);
  const noIconRefText =
    'No Icon Reference card selected\nPlace an Icon Reference card on the "Active Icon Reference" to select one';
  const iconRefTextBox = new Text().setText(noIconRefText);
  iconRefBox.addChild(iconRefTextBox);

  /**
   * @param {IconReference} [iconReference]
   */
  function updateIconReference(iconReference) {
    if (iconReference) {
      iconRefTextBox.setText(`Number of Players: ${iconReference.numberOfPlayers}`);
    } else {
      iconRefTextBox.setText(noIconRefText);
    }
  }

  vBox.addChild(new Text().setText(""));
  vBox.addChild(new Text().setText(`${step++}. Select Expansions`));

  /** @type string[] */
  let activeExpansions = ["eh02", "eh03", "eh04", "eh05", "eh06"];
  const expansionBox1 = new HorizontalBox();
  expansionBox1.setChildDistance(6);
  vBox.addChild(expansionBox1);
  const eh02 = new CheckBox().setText("Forsaken Lore").setIsChecked(true);
  eh02.onCheckStateChanged.add((_button, _player, isChecked) => {
    if (isChecked) {
      activeExpansions.push("eh02");
      ancientYig.setEnabled(true);
    } else {
      activeExpansions = activeExpansions.filter((x) => x !== "eh02");
      ancientYig.setEnabled(false);
    }
  });
  expansionBox1.addChild(eh02);

  const eh03 = new CheckBox().setText("Mountains of Madness").setIsChecked(true);
  eh03.onCheckStateChanged.add((_button, _player, isChecked) => {
    if (isChecked) {
      activeExpansions.push("eh03");
      ancientElderThings.setEnabled(true);
      ancientIthaqua.setEnabled(true);
    } else {
      activeExpansions = activeExpansions.filter((x) => x !== "eh03");
      ancientElderThings.setEnabled(false);
      ancientIthaqua.setEnabled(false);
    }
  });
  expansionBox1.addChild(eh03);

  const eh04 = new CheckBox().setText("Strange Remnants").setIsChecked(true);
  eh04.onCheckStateChanged.add((_button, _player, isChecked) => {
    if (isChecked) {
      activeExpansions.push("eh04");
      ancientSyzygy.setEnabled(true);
    } else {
      activeExpansions = activeExpansions.filter((x) => x !== "eh04");
      ancientSyzygy.setEnabled(false);
    }
  });
  expansionBox1.addChild(eh04);

  const expansionBox2 = new HorizontalBox();
  expansionBox2.setChildDistance(6);
  vBox.addChild(expansionBox2);

  const eh05 = new CheckBox().setText("Under the Pyramids").setIsChecked(true);
  eh05.onCheckStateChanged.add((_button, _player, isChecked) => {
    if (isChecked) {
      activeExpansions.push("eh05");
      ancientAbhoth.setEnabled(true);
      ancientNephrenKa.setEnabled(true);
    } else {
      activeExpansions = activeExpansions.filter((x) => x !== "eh05");
      ancientAbhoth.setEnabled(false);
      ancientNephrenKa.setEnabled(false);
    }
  });
  expansionBox2.addChild(eh05);

  const eh06 = new CheckBox().setText("Signs of Carcosa").setIsChecked(true);
  eh06.onCheckStateChanged.add((_button, _player, isChecked) => {
    if (isChecked) {
      activeExpansions.push("eh06");
      ancientHastur.setEnabled(true);
    } else {
      activeExpansions = activeExpansions.filter((x) => x !== "eh06");
      ancientHastur.setEnabled(false);
    }
  });
  expansionBox2.addChild(eh06);

  const loadExpansionBtn = new Button().setText("Load Selected Expansion(s)");
  let isExpansionsLoaded = false;
  loadExpansionBtn.onClicked.add(() => {
    loadExpansion(...activeExpansions);
    eh02.setEnabled(false);
    eh03.setEnabled(false);
    eh04.setEnabled(false);
    eh05.setEnabled(false);
    eh06.setEnabled(false);
    loadExpansionBtn.setEnabled(false);
    isExpansionsLoaded = true;
  });
  vBox.addChild(loadExpansionBtn);

  vBox.addChild(new Text().setText(""));

  vBox.addChild(new Text().setText(`${step++}. Select Prelude (optional)`));
  const preludeBox = new HorizontalBox();
  vBox.addChild(preludeBox);
  const noPreludeText =
    'No prelude selected\nPlace a prelude card on the "Active Prelude" to select one';
  const preludeTextBox = new Text().setText(noPreludeText);
  preludeBox.addChild(preludeTextBox);

  /**
   * @param {string} [preludeName]
   */
  function updatePrelude(preludeName) {
    if (preludeName) {
      preludeTextBox.setText(preludeName);
    } else {
      preludeTextBox.setText(noPreludeText);
    }
  }

  vBox.addChild(new Text().setText(""));

  vBox.addChild(new Text().setText(`${step++}. Select Mythos Difficulty`));
  const difficultyBox = new HorizontalBox();
  difficultyBox.setChildDistance(6);
  vBox.addChild(difficultyBox);
  const difficultyEasy = new CheckBox().setText("Easy").setIsChecked(true);
  difficultyBox.addChild(difficultyEasy);
  const difficultyMedium = new CheckBox().setText("Medium").setIsChecked(true);
  difficultyBox.addChild(difficultyMedium);
  const difficultyHard = new CheckBox().setText("Hard").setIsChecked(true);
  difficultyBox.addChild(difficultyHard);

  function getMythosDifficulty() {
    return {
      isEasy: difficultyEasy.isChecked(),
      isMedium: difficultyMedium.isChecked(),
      isHard: difficultyHard.isChecked(),
    };
  }

  vBox.addChild(new Text().setText(""));

  vBox.addChild(new Text().setText(`${step++}. Select Ancient One`));
  const ancientBox = new HorizontalBox();
  ancientBox.setChildDistance(6);
  vBox.addChild(ancientBox);

  /**
   * @param {AncientOneName} ancientOne
   * @param {Player} player
   */
  function ancientClickFn(ancientOne, player) {
    if (!isExpansionsLoaded) {
      player.showMessage("You must load expansions first!");
      return;
    }

    setupGame(
      ancientOne,
      getMythosDifficulty(),
      world.__eldritchHorror.activeIconReference,
      GameUtil.getActivePrelude()
    );
    world.removeUIElement(ui);
    world.__eldritchHorror.updateSetupUIFn = undefined;

    const preludeDeck = world.getObjectById("prelude-deck");
    if (preludeDeck) {
      preludeDeck.destroy();
    }

    GameUtil.updateSavedData({ sets: ["eh01", ...activeExpansions] });
  }

  const ancientAzathoth = new ImageButton()
    .setImage("Azathoth - button.jpg")
    .setImageSize(157, 100);
  ancientAzathoth.onClicked.add((_, player) => ancientClickFn("Azathoth", player));
  ancientBox.addChild(ancientAzathoth);

  const ancientCthulhu = new ImageButton().setImage("Cthulhu - button.jpg").setImageSize(157, 100);
  ancientCthulhu.onClicked.add((_, player) => ancientClickFn("Cthulhu", player));
  ancientBox.addChild(ancientCthulhu);

  const ancientShub = new ImageButton()
    .setImage("Shub-Niggurath - button.jpg")
    .setImageSize(157, 100);
  ancientShub.onClicked.add((_, player) => ancientClickFn("Shub-Niggurath", player));
  ancientBox.addChild(ancientShub);

  const ancientYog = new ImageButton().setImage("Yog-Sothoth - button.jpg").setImageSize(157, 100);
  ancientYog.onClicked.add((_, player) => ancientClickFn("Yog-Sothoth", player));
  ancientBox.addChild(ancientYog);

  const ancientBox2 = new HorizontalBox();
  ancientBox2.setChildDistance(6);
  vBox.addChild(ancientBox2);

  const ancientYig = new ImageButton()
    .setImage("Yig - button.jpg", "130B328D4406AF72FC49A084D6233047")
    .setImageSize(157, 100);
  ancientYig.onClicked.add((_, player) => ancientClickFn("Yig", player));
  ancientBox2.addChild(ancientYig);

  const ancientElderThings = new ImageButton()
    .setImage("Rise of the Elder Things - button.jpg", "A74E87E147F5306BED0009A00769FD3D")
    .setImageSize(157, 100);
  ancientElderThings.onClicked.add((_, player) =>
    ancientClickFn("Rise of the Elder Things", player)
  );
  ancientBox2.addChild(ancientElderThings);

  const ancientIthaqua = new ImageButton()
    .setImage("Ithaqua - button.jpg", "A74E87E147F5306BED0009A00769FD3D")
    .setImageSize(157, 100);
  ancientIthaqua.onClicked.add((_, player) => ancientClickFn("Ithaqua", player));
  ancientBox2.addChild(ancientIthaqua);

  const ancientSyzygy = new ImageButton()
    .setImage("Syzygy - button.jpg", "6D4D7DA94E7F5895D4B50E811371CF4E")
    .setImageSize(157, 100);
  ancientSyzygy.onClicked.add((_, player) => ancientClickFn("Syzygy", player));
  ancientBox2.addChild(ancientSyzygy);

  const ancientBox3 = new HorizontalBox();
  ancientBox3.setChildDistance(6);
  vBox.addChild(ancientBox3);

  const ancientAbhoth = new ImageButton()
    .setImage("Abhoth - button.jpg", "2A8B01234A81FD4420D94E830E798C43")
    .setImageSize(157, 100);
  ancientAbhoth.onClicked.add((_, player) => ancientClickFn("Abhoth", player));
  ancientBox3.addChild(ancientAbhoth);

  const ancientNephrenKa = new ImageButton()
    .setImage("Nephren-Ka - button.jpg", "2A8B01234A81FD4420D94E830E798C43")
    .setImageSize(157, 100);
  ancientNephrenKa.onClicked.add((_, player) => ancientClickFn("Nephren-Ka", player));
  ancientBox3.addChild(ancientNephrenKa);

  const ancientHastur = new ImageButton()
    .setImage("Hastur - button.jpg", "5D3D0A334942E73C34962BB193CEE87B")
    .setImageSize(157, 100);
  ancientHastur.onClicked.add((_, player) => ancientClickFn("Hastur", player));
  ancientBox3.addChild(ancientHastur);

  vBox.addChild(new Text().setText(""));

  vBox.addChild(new Text().setText(`${step++}. Select Investigators`));
  vBox.addChild(new Text().setText("Choose and setup investigators from the investigator deck."));
  vBox.addChild(new Text().setText("Do not do this before previous steps."));

  world.__eldritchHorror.updateSetupUIFn = () => {
    updateIconReference(world.__eldritchHorror.activeIconReference);
    updatePrelude(world.__eldritchHorror.activePrelude);
  };

  world.addUI(ui);
}
exports.drawSetupUi = drawSetupUi;

/**
 * @param {AncientOneName} ancientName
 * @param {MythosDifficulty} mythosDifficulty
 * @param {IconReference | undefined} iconReference
 * @param {Prelude | undefined} prelude
 */
function setupGame(ancientName, mythosDifficulty, iconReference, prelude) {
  const foundAncientOne = world.__eldritchHorror.ancientOnes.get(ancientName);
  if (!foundAncientOne) {
    throw new Error(`Unable to find ancient one data for ${ancientName}`);
  }

  const sideBoardSpawns = calcSideBoardSpawns(prelude, foundAncientOne);

  if (prelude && !!prelude.step2) {
    prelude.step2(ancientName);
  }
  if (prelude && !!prelude.step3) {
    prelude.step3(ancientName);
  }
  if (prelude && !!prelude.step4) {
    prelude.step4(ancientName);
  }
  if (prelude && !!prelude.step5) {
    if (!!prelude.spawnsSideBoard && prelude.spawnsSideBoard(foundAncientOne.name)) {
      prelude.step5(ancientName, sideBoardSpawns.shift());
    } else {
      prelude.step5(ancientName);
    }
  }

  setupAncient(foundAncientOne, mythosDifficulty, sideBoardSpawns.shift());

  if (prelude && !!prelude.step6) {
    prelude.step6(ancientName);
  }
  if (prelude && !!prelude.step7) {
    prelude.step7(ancientName);
  }
  if (prelude && !!prelude.step8) {
    prelude.step8(ancientName);
  }

  shuffleDecks();
  shuffleTokens();

  if (prelude && !!prelude.afterResolvingSetup) {
    prelude.afterResolvingSetup(ancientName);
  }

  if (!prelude) {
    const preludeCardHolder = world.getObjectById("prelude-card-holder");
    if (preludeCardHolder) {
      preludeCardHolder.destroy();
    }
  }

  setupReferenceCard(iconReference);
}

function shuffleDecks() {
  assetDeck.shuffle();
  conditionDeck.shuffle();
  spellDeck.shuffle();
  artifactDeck.shuffle();
  /** @type Card | undefined */
  // @ts-ignore
  const uniqueAssetDeck = world.getObjectById("unique-asset-deck");
  if (uniqueAssetDeck) {
    uniqueAssetDeck.shuffle();
  }
  Object.values(encounterDecks).forEach((encounterDeck) => encounterDeck.shuffle());
}

function shuffleTokens() {
  monsterCup.shuffle();
  cluePool.shuffle();
  gateStack.shuffle();
}

/**
 * @param {Prelude | undefined} prelude
 * @param {AncientOne} ancientOne
 */
function calcSideBoardSpawns(prelude, ancientOne) {
  /** @type {("landscape" | "portrait")[]} */
  const sideBoards = [];
  if (prelude && !!prelude.spawnsSideBoard) {
    const preludeSideBoard = prelude.spawnsSideBoard(ancientOne.name);
    if (preludeSideBoard) {
      sideBoards.push(preludeSideBoard);
    }
  }
  if (ancientOne.sideBoard) {
    sideBoards.push(ancientOne.sideBoard);
  }

  const startSpawn = new Vector(-19, 0, 87);
  const padding = 2;
  const totalPadding = sideBoards.length * padding;
  const sideBoardsWidth = sideBoards.reduce((prev, next) => (prev += convertToWidth(next)), 0);
  const totalWidth = totalPadding + sideBoardsWidth;

  let leftStart = startSpawn.subtract(new Vector(0, totalWidth / 2, 0));
  const positions = sideBoards.map((orientation) => {
    const sideBoardWidth = convertToWidth(orientation);
    const spawnPoint = leftStart.add(new Vector(0, sideBoardWidth / 2, 0));
    leftStart = leftStart.add(new Vector(0, sideBoardWidth + padding, 0));

    return spawnPoint;
  });

  return positions;
}

/**
 * @param {"landscape" | "portrait"} orientation
 */
function convertToWidth(orientation) {
  return orientation === "landscape" ? 65 : 32;
}
