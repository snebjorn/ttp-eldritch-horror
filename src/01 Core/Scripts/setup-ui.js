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
} = require("@tabletop-playground/api");
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
  let activeExpansions = ["eh02", "eh03", "eh04"];
  const expansionBox = new HorizontalBox();
  expansionBox.setChildDistance(6);
  vBox.addChild(expansionBox);
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
  expansionBox.addChild(eh02);

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
  expansionBox.addChild(eh03);

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
  expansionBox.addChild(eh04);

  const loadExpansionBtn = new Button().setText("Load Selected Expansion(s)");
  let isExpansionsLoaded = false;
  loadExpansionBtn.onClicked.add(() => {
    loadExpansion(...activeExpansions);
    eh02.setEnabled(false);
    eh03.setEnabled(false);
    eh04.setEnabled(false);
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
   * @param {Button} button
   * @param {Player} player
   */
  function ancientClickFn(button, player) {
    if (!isExpansionsLoaded) {
      player.showMessage("You must load expansions first!");
      return;
    }

    setupGame(
      button.getText(),
      getMythosDifficulty(),
      world.__eldritchHorror.activeIconReference,
      getActivePrelude()
    );
    world.removeUIElement(ui);
    world.__eldritchHorror.updateSetupUIFn = undefined;

    const preludeDeck = world.getObjectById("prelude-deck");
    if (preludeDeck) {
      preludeDeck.destroy();
    }
  }

  const ancientAzathoth = new Button().setText("Azathoth");
  ancientAzathoth.onClicked.add(ancientClickFn);
  ancientBox.addChild(ancientAzathoth);
  const ancientCthulhu = new Button().setText("Cthulhu");
  ancientCthulhu.onClicked.add(ancientClickFn);
  ancientBox.addChild(ancientCthulhu);
  const ancientShub = new Button().setText("Shub-Niggurath");
  ancientShub.onClicked.add(ancientClickFn);
  ancientBox.addChild(ancientShub);
  const ancientYog = new Button().setText("Yog-Sothoth");
  ancientYog.onClicked.add(ancientClickFn);
  ancientBox.addChild(ancientYog);

  const ancientBox2 = new HorizontalBox();
  ancientBox2.setChildDistance(6);
  vBox.addChild(ancientBox2);

  const ancientYig = new Button().setText("Yig");
  ancientYig.onClicked.add(ancientClickFn);
  ancientBox2.addChild(ancientYig);

  const ancientElderThings = new Button().setText("Rise of the Elder Things");
  ancientElderThings.onClicked.add(ancientClickFn);
  ancientBox2.addChild(ancientElderThings);

  const ancientIthaqua = new Button().setText("Ithaqua");
  ancientIthaqua.onClicked.add(ancientClickFn);
  ancientBox2.addChild(ancientIthaqua);

  const ancientSyzygy = new Button().setText("Syzygy");
  ancientSyzygy.onClicked.add(ancientClickFn);
  ancientBox2.addChild(ancientSyzygy);

  world.__eldritchHorror.updateSetupUIFn = () => {
    updateIconReference(world.__eldritchHorror.activeIconReference);
    updatePrelude(world.__eldritchHorror.activePrelude);
  };

  world.addUI(ui);
}
exports.drawSetupUi = drawSetupUi;

function getActivePrelude() {
  if (world.__eldritchHorror.activePrelude) {
    return world.__eldritchHorror.preludes.get(world.__eldritchHorror.activePrelude);
  }
}

/**
 * @param {string} ancientName
 * @param {MythosDifficulty} mythosDifficulty
 * @param {IconReference | undefined} iconReference
 * @param {Prelude | undefined} prelude
 */
function setupGame(ancientName, mythosDifficulty, iconReference, prelude) {
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
    prelude.step5(ancientName);
  }
  const foundAncientOne = world.__eldritchHorror.ancientOnes.find((x) => x.name == ancientName);
  if (foundAncientOne) {
    setupAncient(foundAncientOne, mythosDifficulty);
  }
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

  setupReferenceCard(iconReference);

  if (prelude && !!prelude.afterResolvingSetup) {
    prelude.afterResolvingSetup(ancientName);
  }

  if (!prelude) {
    const preludeCardHolder = world.getObjectById("prelude-card-holder");
    if (preludeCardHolder) {
      preludeCardHolder.destroy();
    }
  }
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
