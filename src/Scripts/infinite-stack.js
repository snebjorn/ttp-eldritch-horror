const { refCard } = require("@tabletop-playground/api");
const { Util } = require("./util");

refCard.setInheritScript(false);

// on card removed add an identical card to the stack
refCard.onRemoved.add(Util.addCloneToStack);

// on card inserted remove it from the stack and destroy it
refCard.onInserted.add(Util.removeInsertedCardFromStack);
