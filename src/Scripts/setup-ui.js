const { TextJustification } = require("@tabletop-playground/api");
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
  getAssetDeck,
  conditionDeck,
  spellDeck,
  artifactDeck,
  encounterDecks,
  getCluePool,
  getGateStack,
  monsterCup,
  activeExpeditionToken,
} = require("./world-constants");

function drawSetupUi() {
  const ui = new UIElement();
  const border = new Border().setColor(new Color(0, 0, 0, 1));
  ui.widget = border;
  ui.position = new Vector(10, 0, 100);

  const arkhamBoldFont = "Arkham_bold.ttf";
  const arkhamRegFont = "Arkham_reg.ttf";

  let step = 1;

  const vBox = new VerticalBox();
  vBox.setChildDistance(6);
  border.setChild(vBox);
  vBox.addChild(
    new Text()
      .setText("Setup")
      .setJustification(TextJustification.Center)
      .setFont(arkhamBoldFont)
      .setFontSize(40)
  );
  vBox.addChild(new Text());
  vBox.addChild(
    new Text()
      .setText(`${step++}. Select Icon Reference Card`)
      .setFont(arkhamRegFont)
      .setFontSize(20)
  );
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

  vBox.addChild(new Text());
  vBox.addChild(
    new Text()
      .setText(`${step++}. Select Expansions`)
      .setFont(arkhamRegFont)
      .setFontSize(20)
  );
  const expansionBox1 = new HorizontalBox().setChildDistance(10);
  vBox.addChild(expansionBox1);
  const expansionBox2 = new HorizontalBox().setChildDistance(10);
  vBox.addChild(expansionBox2);
  const expansionBox3 = new HorizontalBox().setChildDistance(10);
  vBox.addChild(expansionBox3);

  vBox.addChild(new Text());

  vBox.addChild(new Text().setText("Expansion Mechanics").setFont(arkhamRegFont).setFontSize(15));
  vBox.addChild(
    new Text().setText(
      "Players can choose to use mechanics not explicitly required by the selected expansion(s)."
    )
  );
  const mechanicsBox = new HorizontalBox();
  mechanicsBox.setChildDistance(12);
  vBox.addChild(mechanicsBox);

  const focusTokenBox = new HorizontalBox().setChildDistance(3);
  const focusIcon = new ImageWidget().setImage(`Focus Token Icon.png`).setImageSize(50, 50);
  const focusCheckBox = new CheckBox().setText("Focus Token").setIsChecked(true).setEnabled(false);
  focusTokenBox.addChild(focusIcon).addChild(focusCheckBox);
  mechanicsBox.addChild(focusTokenBox);

  const resourceTokenBox = new HorizontalBox().setChildDistance(3);
  const resourceIcon = new ImageWidget().setImage(`Resource Token Icon.png`).setImageSize(50, 50);
  const resourceCheckBox = new CheckBox()
    .setText("Resource Token")
    .setIsChecked(true)
    .setEnabled(false);
  resourceTokenBox.addChild(resourceIcon).addChild(resourceCheckBox);
  mechanicsBox.addChild(resourceTokenBox);

  const personalStoryBox = new HorizontalBox().setChildDistance(3);
  const personalStoryIcon = new ImageWidget()
    .setImage(`Personal Story Icon.png`)
    .setImageSize(50, 50);
  const personalStoryCheckBox = new CheckBox().setText("Personal Stories").setIsChecked(false);
  personalStoryBox.addChild(personalStoryIcon).addChild(personalStoryCheckBox);
  mechanicsBox.addChild(personalStoryBox);

  function getChosenMechanics() {
    return {
      isFocus: focusCheckBox.isChecked(),
      isResource: resourceCheckBox.isChecked(),
      isPersonalStory: personalStoryCheckBox.isChecked(),
    };
  }

  /**
   * GOTO below to see the code for Select Expansions
   * @see activeExpansions
   */

  vBox.addChild(new Text());
  const loadExpansionBtn = new Button().setText("Load Selected Expansion(s)");
  vBox.addChild(loadExpansionBtn);
  let isExpansionsLoaded = false;
  loadExpansionBtn.onClicked.add(() => {
    loadExpansion(activeExpansions, getChosenMechanics());
    eh02.setEnabled(false);
    eh03.setEnabled(false);
    eh04.setEnabled(false);
    eh05.setEnabled(false);
    eh06.setEnabled(false);
    eh07.setEnabled(false);
    eh08.setEnabled(false);
    eh09.setEnabled(false);

    focusCheckBox.setEnabled(false);
    resourceCheckBox.setEnabled(false);
    personalStoryCheckBox.setEnabled(false);

    loadExpansionBtn.setEnabled(false);
    isExpansionsLoaded = true;
  });

  vBox.addChild(new Text());
  vBox.addChild(
    new Text()
      .setText(`${step++}. Select Prelude (optional)`)
      .setFont(arkhamRegFont)
      .setFontSize(20)
  );
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

  vBox.addChild(new Text());

  const gameDifficultyBox = new VerticalBox();
  vBox.addChild(gameDifficultyBox);
  gameDifficultyBox.setChildDistance(6);

  gameDifficultyBox.addChild(
    new Text()
      .setText(`${step++}. Adjust Game Difficulty`)
      .setFont(arkhamRegFont)
      .setFontSize(20)
  );

  gameDifficultyBox.addChild(
    new Text().setText("Mythos Deck Difficulty").setFont(arkhamRegFont).setFontSize(15)
  );
  gameDifficultyBox.addChild(
    new Text().setText(
      "Players can alter the game's difficulty when building the Mythos deck.\n" +
        "Players can make the game easier by not using the hard Mythos cards.\n" +
        "Likewise, players can make the game harder by not using the easy Mythos cards."
    )
  );
  gameDifficultyBox.addChild(
    new Text().setText("Choose what Mythos cards are used to build the Mythos deck:")
  );
  const mythosDifficultyBox = new HorizontalBox();
  mythosDifficultyBox.setChildDistance(12);
  gameDifficultyBox.addChild(mythosDifficultyBox);
  const difficultyEasy = new CheckBox().setText("Easy Mythos cards").setIsChecked(true);
  mythosDifficultyBox.addChild(difficultyEasy);
  const difficultyMedium = new CheckBox().setText("Medium Mythos cards").setIsChecked(true);
  mythosDifficultyBox.addChild(difficultyMedium);
  const difficultyHard = new CheckBox().setText("Hard Mythos cards").setIsChecked(true);
  mythosDifficultyBox.addChild(difficultyHard);

  function getMythosDifficulty() {
    return {
      isEasy: difficultyEasy.isChecked(),
      isMedium: difficultyMedium.isChecked(),
      isHard: difficultyHard.isChecked(),
    };
  }

  //#region ancient one selection
  vBox.addChild(new Text());
  vBox.addChild(
    new Text()
      .setText(`${step++}. Select Ancient One`)
      .setFont(arkhamRegFont)
      .setFontSize(20)
  );
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
      GameUtil.getActivePrelude(),
      getChosenMechanics()
    );
    world.removeUIElement(ui);
    world.__eldritchHorror.updateSetupUIFn = undefined;

    const preludeDeck = world.getObjectById("prelude-deck");
    if (preludeDeck) {
      preludeDeck.destroy();
    }

    GameUtil.updateSavedData({
      sets: ["eh01", ...activeExpansions],
      ancientOne: ancientOne,
      isPersonalStory: getChosenMechanics().isPersonalStory,
    });
  }

  const ancientAzathoth = new ImageButton()
    .setImage("01 Core/Azathoth - button.jpg")
    .setImageSize(157, 100);
  ancientAzathoth.onClicked.add((_, player) => ancientClickFn("Azathoth", player));
  ancientBox.addChild(ancientAzathoth);

  const ancientCthulhu = new ImageButton()
    .setImage("01 Core/Cthulhu - button.jpg")
    .setImageSize(157, 100);
  ancientCthulhu.onClicked.add((_, player) => ancientClickFn("Cthulhu", player));
  ancientBox.addChild(ancientCthulhu);

  const ancientShub = new ImageButton()
    .setImage("01 Core/Shub-Niggurath - button.jpg")
    .setImageSize(157, 100);
  ancientShub.onClicked.add((_, player) => ancientClickFn("Shub-Niggurath", player));
  ancientBox.addChild(ancientShub);

  const ancientYog = new ImageButton()
    .setImage("01 Core/Yog-Sothoth - button.jpg")
    .setImageSize(157, 100);
  ancientYog.onClicked.add((_, player) => ancientClickFn("Yog-Sothoth", player));
  ancientBox.addChild(ancientYog);

  const ancientBox2 = new HorizontalBox();
  ancientBox2.setChildDistance(6);
  vBox.addChild(ancientBox2);

  const ancientYig = new ImageButton()
    .setImage("02 Forsaken Lore/Yig - button.jpg")
    .setImageSize(157, 100);
  ancientYig.onClicked.add((_, player) => ancientClickFn("Yig", player));
  ancientBox2.addChild(ancientYig);

  const ancientElderThings = new ImageButton()
    .setImage("03 Mountains of Madness/Rise of the Elder Things - button.jpg")
    .setImageSize(157, 100);
  ancientElderThings.onClicked.add((_, player) =>
    ancientClickFn("Rise of the Elder Things", player)
  );
  ancientBox2.addChild(ancientElderThings);

  const ancientIthaqua = new ImageButton()
    .setImage("03 Mountains of Madness/Ithaqua - button.jpg")
    .setImageSize(157, 100);
  ancientIthaqua.onClicked.add((_, player) => ancientClickFn("Ithaqua", player));
  ancientBox2.addChild(ancientIthaqua);

  const ancientSyzygy = new ImageButton()
    .setImage("04 Strange Remnants/Syzygy - button.jpg")
    .setImageSize(157, 100);
  ancientSyzygy.onClicked.add((_, player) => ancientClickFn("Syzygy", player));
  ancientBox2.addChild(ancientSyzygy);

  const ancientBox3 = new HorizontalBox();
  ancientBox3.setChildDistance(6);
  vBox.addChild(ancientBox3);

  const ancientAbhoth = new ImageButton()
    .setImage("05 Under the Pyramids/Abhoth - button.jpg")
    .setImageSize(157, 100);
  ancientAbhoth.onClicked.add((_, player) => ancientClickFn("Abhoth", player));
  ancientBox3.addChild(ancientAbhoth);

  const ancientNephrenKa = new ImageButton()
    .setImage("05 Under the Pyramids/Nephren-Ka - button.jpg")
    .setImageSize(157, 100);
  ancientNephrenKa.onClicked.add((_, player) => ancientClickFn("Nephren-Ka", player));
  ancientBox3.addChild(ancientNephrenKa);

  const ancientHastur = new ImageButton()
    .setImage("06 Signs of Carcosa/Hastur - button.jpg")
    .setImageSize(157, 100);
  ancientHastur.onClicked.add((_, player) => ancientClickFn("Hastur", player));
  ancientBox3.addChild(ancientHastur);

  const ancientAtlachNacha = new ImageButton()
    .setImage("07 The Dreamlands/Atlach-Nacha - button.jpg")
    .setImageSize(157, 100);
  ancientAtlachNacha.onClicked.add((_, player) => ancientClickFn("Atlach-Nacha", player));
  ancientBox3.addChild(ancientAtlachNacha);

  const ancientBox4 = new HorizontalBox();
  ancientBox4.setChildDistance(6);
  vBox.addChild(ancientBox4);

  const ancientHypnos = new ImageButton()
    .setImage("07 The Dreamlands/Hypnos - button.jpg")
    .setImageSize(157, 100);
  ancientHypnos.onClicked.add((_, player) => ancientClickFn("Hypnos", player));
  ancientBox4.addChild(ancientHypnos);

  const ancientShuddeMell = new ImageButton()
    .setImage("08 Cities in Ruin/Shudde M'ell - button.jpg")
    .setImageSize(157, 100);
  ancientShuddeMell.onClicked.add((_, player) => ancientClickFn("Shudde M'ell", player));
  ancientBox4.addChild(ancientShuddeMell);

  const ancientAntediluvium = new ImageButton()
    .setImage("09 Masks of Nyarlathotep/Antediluvium - button.jpg")
    .setImageSize(157, 100);
  ancientAntediluvium.onClicked.add((_, player) => ancientClickFn("Antediluvium", player));
  ancientBox4.addChild(ancientAntediluvium);

  const ancientNyarlathotep = new ImageButton()
    .setImage("09 Masks of Nyarlathotep/Nyarlathotep - button.jpg")
    .setImageSize(157, 100);
  ancientNyarlathotep.onClicked.add((_, player) => ancientClickFn("Nyarlathotep", player));
  ancientBox4.addChild(ancientNyarlathotep);
  //#endregion ancient one selection

  //#region expansion selection
  /** @type string[] */
  let activeExpansions = ["eh02", "eh03", "eh04", "eh05", "eh06", "eh07", "eh08", "eh09"];

  function updateMechanics() {
    const focusExp = ["eh03", "eh04", "eh05", "eh07", "eh09"];
    const resourceExp = "eh09";

    if (focusExp.some((x) => activeExpansions.includes(x))) {
      focusCheckBox.setIsChecked(true).setEnabled(false);
    } else {
      focusCheckBox.setIsChecked(false).setEnabled(true);
    }

    if (activeExpansions.includes(resourceExp)) {
      resourceCheckBox.setIsChecked(true).setEnabled(false);
    } else {
      resourceCheckBox.setIsChecked(false).setEnabled(true);
    }
  }

  /**
   * @param {string} expansion
   * @param {string} title
   * @param {ImageButton[]} ancientOnes
   * @param {string} path
   * @returns {Widget}
   */
  function expansionWidget(expansion, title, ancientOnes, path) {
    const expBox = new HorizontalBox();
    const expIcon = new ImageWidget().setImage(`${path}/${expansion} - symbol.png`);
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
      updateMechanics();
    });

    return expBox;
  }

  const eh02 = expansionWidget("eh02", "Forsaken Lore", [ancientYig], "02 Forsaken Lore");
  expansionBox1.addChild(eh02);

  const eh03 = expansionWidget(
    "eh03",
    "Mountains of Madness",
    [ancientElderThings, ancientIthaqua],
    "03 Mountains of Madness"
  );
  expansionBox1.addChild(eh03);

  const eh04 = expansionWidget("eh04", "Strange Remnants", [ancientSyzygy], "04 Strange Remnants");
  expansionBox1.addChild(eh04);

  const eh05 = expansionWidget(
    "eh05",
    "Under the Pyramids",
    [ancientAbhoth, ancientNephrenKa],
    "05 Under the Pyramids"
  );
  expansionBox2.addChild(eh05);

  const eh06 = expansionWidget("eh06", "Signs of Carcosa", [ancientHastur], "06 Signs of Carcosa");
  expansionBox2.addChild(eh06);

  const eh07 = expansionWidget(
    "eh07",
    "The Dreamlands",
    [ancientAtlachNacha, ancientHypnos],
    "07 The Dreamlands"
  );
  expansionBox2.addChild(eh07);

  const eh08 = expansionWidget("eh08", "Cities in Ruin", [ancientShuddeMell], "08 Cities in Ruin");
  expansionBox3.addChild(eh08);

  const eh09 = expansionWidget(
    "eh09",
    "Masks of Nyarlathotep",
    [ancientAntediluvium, ancientNyarlathotep],
    "09 Masks of Nyarlathotep"
  );
  expansionBox3.addChild(eh09);
  //#endregion expansion selection

  world.__eldritchHorror.updateSetupUIFn = () => {
    updateIconReference(GameUtil.getActiveIconReference());
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
  getAssetDeck().shuffle();
  conditionDeck.shuffle();
  spellDeck.shuffle();
  artifactDeck.shuffle();
  const uniqueAssetDeck = world.getObjectById("unique-asset-deck");
  if (uniqueAssetDeck instanceof Card) {
    uniqueAssetDeck.shuffle();
  }
  Object.values(encounterDecks).forEach((encounterDeck) => encounterDeck.shuffle());
}

function shuffleTokens() {
  monsterCup.shuffle();
  getCluePool().shuffle();
  getGateStack().shuffle();
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
