var actions = require('./actions.js');

module.exports = {

  init : function (numSeats, numSelected = 0, unavailableSeats = []) {
    var unavailableObj = {};
    unavailableSeats.forEach(function (seatNumber) {
      unavailableObj[seatNumber] = true;
    })
    return {
      type : actions.INIT,
      payload : {
        numSeats : numSeats,
        numSelected : numSelected,
        seatingChart : [
          ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A11'],
          ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'B11', 'B12'],
          ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13'],
          ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13'],
          ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10', 'E11', 'E12', 'E14'],
          ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
          ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'G11']

        ],
        selected : {},
        unavailable : unavailableObj
      }
    };

  },

  submit : function (selectedObj) {
    var arr = [];
    for (var i in selectedObj) {
      if (selectedObj[i] === true) {
        arr.push(i);
      }
    }
    return {
      type : actions.SUBMIT,
      payload : {
        selectedSeats : arr
      }
    }
  },

  select : function (seatNumber) {
    return {
      type : actions.SELECT,
      payload : {
        seatNumber : seatNumber
      }
    };
  },

  deselect : function (seatNumber) {
    return {
      type : actions.DESELECT,
      payload : {
        seatNumber : seatNumber
      }
    };
  }

}
