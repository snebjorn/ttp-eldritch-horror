const { UIElement, Vector, world, refHolder, Text } = require("@tabletop-playground/api");
const { Util } = require("./util");

refHolder.onInserted.add(() => {
  world.__eldritchHorror.updateSetupUIFn?.();
});
refHolder.onRemoved.add(() => {
  world.__eldritchHorror.updateSetupUIFn?.();
});
refHolder.onCardFlipped.add(() => {
  world.__eldritchHorror.updateSetupUIFn?.();
});

const ui = new UIElement();
ui.position = new Vector(0, 0, 0.11);
ui.widget = new Text().setFontSize(60).setText(" Active\nPrelude");
ui.scale = 0.2;
refHolder.addUI(ui);

if (refHolder.getCards().length === 0) {
  world.showPing(refHolder.getPosition(), Util.Colors.WHITE, true);
}
