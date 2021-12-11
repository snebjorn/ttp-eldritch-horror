const { refObject, Vector } = require("@tabletop-playground/api");

const becomeDelayedAction = "Become Delayed";

refObject.onCustomAction.add((obj, player, actionName) => {
  if (actionName === becomeDelayedAction) {
    const rotation = obj.getRotation();
    if (rotation.pitch < -89 && rotation.pitch > -91) {
      return; // abort already on its side
    }
    const position = obj.getPosition();
    const height = obj.getExtent(false).z;
    obj.setPosition(position.add(new Vector(-height, 0, 1)), 1);

    rotation.pitch = -90;
    obj.setRotation(rotation, 1);

    obj.snapToGround();
  }
});

refObject.addCustomAction(becomeDelayedAction);
