var actions = require('./actions.js');

module.exports = function (store, action) {
  switch (action.type) {
  case actions.SELECT:
    if (store.numSelected < store.numSeats) {
      store.selected[action.payload.seatNumber] = true;
      store.numSelected += 1;
    }
    break;
  case actions.DESELECT:
    store.selected[action.payload.seatNumber] = false;
    store.numSelected -= 1;
    break;
  case actions.SUBMIT:
    console.info(action);
    break;
  case actions.INIT:
    store = action.payload;
    break;
  default:
    return store;
    break;
  }
  return store;
}
