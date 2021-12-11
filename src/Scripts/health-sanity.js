const { refMultistate } = require("@tabletop-playground/api");

// aligns the number pressed with the number shown on the token
// without this, pressing 2 would show 3 on the token because states are 0 indexed
refMultistate.onNumberAction.add((healthOrSanity, _player, number) => {
  healthOrSanity.setState(number - 1);
});
