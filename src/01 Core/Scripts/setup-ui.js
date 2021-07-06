const {
  world,
  Border,
  Color,
  Text,
  CheckBox,
  Button,
  Vector,
  UIElement,
  HorizontalBox,
  VerticalBox,
} = require("@tabletop-playground/api");
const { loadExpansion } = require("./load-expansion");
const { setupAncient } = require("./setup-ancient");
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
  let border = new Border().setColor(new Color(0, 0, 0, 1));
  let ui = new UIElement();
  ui.widget = border;
  ui.position = new Vector(0, 0, 100);

  let vBox = new VerticalBox();
  vBox.setChildDistance(6);
  border.setChild(vBox);
  vBox.addChild(new Text().setText("Setup"));
  vBox.addChild(new Text().setText("Expansions"));

  /** @type string[] */
  let activeExpansions = ["eh02"];
  let expansionBox = new HorizontalBox();
  vBox.addChild(expansionBox);
  let eh02 = new CheckBox().setText("Forsaken Lore").setIsChecked(true);
  eh02.onCheckStateChanged.add((_button, _player, isChecked) => {
    if (isChecked) {
      activeExpansions.push("eh02");
      ancientBox2.addChild(ancientYig);
    } else {
      activeExpansions = activeExpansions.filter((x) => x !== "eh02");
      ancientBox2.removeChild(ancientYig);
    }
  });
  expansionBox.addChild(eh02);

  vBox.addChild(new Text().setText(""));

  vBox.addChild(new Text().setText("Mythos Difficulty"));
  let difficultyBox = new HorizontalBox();
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

  vBox.addChild(new Text().setText("Official Ancient Ones"));
  let ancientBox = new HorizontalBox();
  ancientBox.setChildDistance(6);
  vBox.addChild(ancientBox);

  /**
   * @param {Button} button
   */
  function ancientClickFn(button) {
    loadExpansion(...activeExpansions);

    setupGame(button.getText(), getMythosDifficulty());
    world.removeUIElement(ui);
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

  let ancientBox2 = new HorizontalBox();
  ancientBox2.setChildDistance(6);
  vBox.addChild(ancientBox2);

  let ancientYig = new Button().setText("Yig");
  ancientYig.onClicked.add(ancientClickFn);
  ancientBox2.addChild(ancientYig);

  world.addUI(ui);
}
exports.drawSetupUi = drawSetupUi;

/**
 * @param {string} ancientName
 * @param {MythosDifficulty} mythosDifficulty
 */
function setupGame(ancientName, mythosDifficulty) {
  const foundAncientOne = world.__eldritchHorror.ancientOnes.find((x) => x.name == ancientName);
  if (foundAncientOne) {
    setupAncient(foundAncientOne, mythosDifficulty);
    shuffleDecks();
    shuffleTokens();
  }
}

function shuffleDecks() {
  assetDeck.shuffle();
  conditionDeck.shuffle();
  spellDeck.shuffle();
  artifactDeck.shuffle();
  Object.values(encounterDecks).forEach((encounterDeck) => encounterDeck.shuffle());
}

function shuffleTokens() {
  monsterCup.shuffle();
  cluePool.shuffle();
  gateStack.shuffle();
}
