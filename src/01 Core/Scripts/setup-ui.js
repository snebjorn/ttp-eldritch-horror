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
  Widget,
  ImageWidget,
} = require("@tabletop-playground/api");
const { GameUtil } = require("./game-util");
const { loadExpansion } = require("./load-expansion");
const { setupAncient } = require("./setup-ancient");
const { setupReferenceCard } = require("./setup-reference-card");
const { Util } = require("./util");
const {
  assetDeck,
  conditionDeck,
  spellDeck,
  artifactDeck,
  encounterDecks,
  cluePool,
  gateStack,
  monsterCup,
  activeExpeditionToken,
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
  const expansionBox1 = new HorizontalBox().setChildDistance(10);
  vBox.addChild(expansionBox1);
  const expansionBox2 = new HorizontalBox().setChildDistance(10);
  vBox.addChild(expansionBox2);

  /**
   * GOTO below to see the code for Select Expansions
   * @see activeExpansions
   */

  const loadExpansionBtn = new Button().setText("Load Selected Expansion(s)");
  vBox.addChild(loadExpansionBtn);
  let isExpansionsLoaded = false;
  loadExpansionBtn.onClicked.add(() => {
    loadExpansion(...activeExpansions);
    eh02.setEnabled(false);
    eh03.setEnabled(false);
    eh04.setEnabled(false);
    eh05.setEnabled(false);
    eh06.setEnabled(false);
    eh07.setEnabled(false);
    loadExpansionBtn.setEnabled(false);
    isExpansionsLoaded = true;
  });

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

  //#region ancient one selection
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
      GameUtil.getActiveIconReference(),
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

  const ancientAtlachNacha = new ImageButton()
    .setImage("Atlach-Nacha - button.jpg", "6D2E6A2B46804C2CA23E47BB78299639")
    .setImageSize(157, 100);
  ancientAtlachNacha.onClicked.add((_, player) => ancientClickFn("Atlach-Nacha", player));
  ancientBox3.addChild(ancientAtlachNacha);

  const ancientBox4 = new HorizontalBox();
  ancientBox4.setChildDistance(6);
  vBox.addChild(ancientBox4);

  const ancientHypnos = new ImageButton()
    .setImage("Hypnos - button.jpg", "6D2E6A2B46804C2CA23E47BB78299639")
    .setImageSize(157, 100);
  ancientHypnos.onClicked.add((_, player) => ancientClickFn("Hypnos", player));
  ancientBox4.addChild(ancientHypnos);
  //#endregion ancient one selection

  //#region expansion selection
  /** @type string[] */
  let activeExpansions = ["eh02", "eh03", "eh04", "eh05", "eh06", "eh07"];

  /**
   * @param {string} expansion
   * @param {string} title
   * @param {ImageButton[]} ancientOnes
   * @param {string} packageId
   * @returns {Widget}
   */
  function expansionWidget(expansion, title, ancientOnes, packageId) {
    const expBox = new HorizontalBox();
    const expIcon = new ImageWidget().setImage(`${expansion} - symbol.png`, packageId);
    const expCheckBox = new CheckBox().setText(title).setIsChecked(true);

    expBox.addChild(expIcon).addChild(expCheckBox);

    expCheckBox.onCheckStateChanged.add((_button, _player, isChecked) => {
      if (isChecked) {
        activeExpansions.push(expansion);
      } else {
        activeExpansions = activeExpansions.filter((x) => x !== expansion);
      }
      expIcon.setEnabled(isChecked);
      ancientOnes.forEach((x) => x.setEnabled(isChecked));
    });

    return expBox;
  }

  const eh02 = expansionWidget(
    "eh02",
    "Forsaken Lore",
    [ancientYig],
    "130B328D4406AF72FC49A084D6233047"
  );
  expansionBox1.addChild(eh02);

  const eh03 = expansionWidget(
    "eh03",
    "Mountains of Madness",
    [ancientElderThings, ancientIthaqua],
    "A74E87E147F5306BED0009A00769FD3D"
  );
  expansionBox1.addChild(eh03);

  const eh04 = expansionWidget(
    "eh04",
    "Strange Remnants",
    [ancientSyzygy],
    "6D4D7DA94E7F5895D4B50E811371CF4E"
  );
  expansionBox1.addChild(eh04);

  const eh05 = expansionWidget(
    "eh05",
    "Under the Pyramids",
    [ancientAbhoth, ancientNephrenKa],
    "2A8B01234A81FD4420D94E830E798C43"
  );
  expansionBox2.addChild(eh05);

  const eh06 = expansionWidget(
    "eh06",
    "Signs of Carcosa",
    [ancientHastur],
    "5D3D0A334942E73C34962BB193CEE87B"
  );
  expansionBox2.addChild(eh06);

  const eh07 = expansionWidget(
    "eh07",
    "The Dreamlands",
    [ancientAtlachNacha, ancientHypnos],
    "6D2E6A2B46804C2CA23E47BB78299639"
  );
  expansionBox2.addChild(eh07);
  //#endregion expansion selection

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
    prelude.step2(ancientName, iconReference);
  }
  if (prelude && !!prelude.step3) {
    prelude.step3(ancientName, iconReference);
  }
  if (prelude && !!prelude.step4) {
    prelude.step4(ancientName, iconReference);
  }

  shuffleTokens();

  let sideBoardFn;
  if (prelude && !!prelude.step5) {
    if (!!prelude.spawnsSideBoard && prelude.spawnsSideBoard(foundAncientOne.name)) {
      sideBoardFn = prelude.step5(ancientName, sideBoardSpawns.shift(), iconReference);
    } else {
      prelude.step5(ancientName, undefined, iconReference);
    }
  }

  setupAncient(foundAncientOne, mythosDifficulty, sideBoardSpawns.shift());

  if (!!sideBoardFn) {
    sideBoardFn();
  }

  if (prelude && !!prelude.step6) {
    prelude.step6(ancientName, iconReference);
  }
  if (prelude && !!prelude.step7) {
    prelude.step7(ancientName, iconReference);
  }
  if (prelude && !!prelude.step8) {
    prelude.step8(ancientName, iconReference);
  }

  shuffleDecks();
  setupReferenceCard(iconReference);

  if (prelude && !!prelude.afterResolvingSetup) {
    prelude.afterResolvingSetup(ancientName, iconReference);
  }

  if (!prelude) {
    const preludeCardHolder = world.getObjectById("prelude-card-holder");
    if (preludeCardHolder) {
      preludeCardHolder.destroy();
    }
  }

  world.showPing(activeExpeditionToken.getPosition(), Util.Colors.WHITE, true);
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

  const startSpawn = new Vector(0, 0, 87);
  const padding = 2;
  const totalPadding = sideBoards.length * padding;
  const sideBoardsWidth = sideBoards.reduce((prev, next) => (prev += convertToWidth(next)), 0);
  const totalWidth = totalPadding + sideBoardsWidth;

  let leftStart = startSpawn.subtract(new Vector(0, totalWidth / 2, 0));
  const positions = sideBoards.map((orientation) => {
    const sideBoardWidth = convertToWidth(orientation);
    let spawnPoint = leftStart.add(new Vector(0, sideBoardWidth / 2, 0));
    leftStart = leftStart.add(new Vector(0, sideBoardWidth + padding, 0));

    // adjust for the height of the side board
    if (orientation === "landscape") {
      spawnPoint = spawnPoint.subtract(new Vector(19, 0, 0));
    } else {
      spawnPoint = spawnPoint.subtract(new Vector(26.6, 0, 0));
    }

    return spawnPoint;
  });

  return positions;
}

/**
 * @param {"landscape" | "portrait"} orientation
 */
function convertToWidth(orientation) {
  return orientation === "landscape" ? 65 : 40;
}
