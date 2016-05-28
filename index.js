"use strict"
var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');

(function () {

  function init() {
    return {
      numSeats : 7,
      numSelected : 0,
      seats : [["A1", "A2", "A3"],
        ["B1", "B2", "B3", "B4"],
        ["C1", "C2", "C3"],
        ["D1", "D2", "D3", "D4", "D5"]
      ],
      selected : {},
      unavailable : {
        "B3" : true,
      }
    };

  }

  function select(seatNumber, store) {
    if (store.numSelected < store.numSeats) {

      store.selected[seatNumber] = true;
      store.numSelected += 1;
      update(store);
    }
  }

  function deselect(seatNumber, store) {
    store.selected[seatNumber] = false;
    store.numSelected -= 1;
    update(store);
  }

  function update(store) {
    var newTree = render(store);
    var patches = diff(tree, newTree);
    tree = newTree;
    rootNode = patch(rootNode, patches);
  }

  function render(store) {
    var chart = store.seats.map(function (row, i) {
        return h('ul', {
          className : 'seat-row'
        }, row.map(function (seatNumber, j) {
            var innerClassName = "seat";
            var clickHandler = select.bind(this, seatNumber, store);

            if (store.unavailable[seatNumber] === true) { // seat is unavailable
              innerClassName = "seat unavailable";
              clickHandler = null;
            } else if (store.selected[seatNumber] === true) { // seat is already selected
              innerClassName = "seat selected";
              clickHandler = deselect.bind(this, seatNumber, store);
            }
            return h('li', {
              className : innerClassName,
              onclick : clickHandler
            }, seatNumber);

          }))
      })
      return h('div', [
          h('p', {
            className : "show-title"
          }, "[Title of Show]"),
          h('p', {
            className : "show-date"
          }, "July 3, 2016"),
          h('p', {
            className : "instructions"
          }, [
              "Please select ",
              h('span', {
                className : "selections-remaining"
              }, store.numSeats - store.numSelected),
              " more seats."]),
          chart]);
  }

  var tree = render(init()); // We need an initial tree
  var rootNode = createElement(tree); // Create an initial root DOM node ...
  document.body.appendChild(rootNode); // ... and it should be in the document
})()
