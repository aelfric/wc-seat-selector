"use strict"
var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');
var actions = require('./actions.js');
var reduce = require('./reducer.js');
var actionCreators = require('./actionCreators.js');
var modal = require("./modal.js");
var $ = require("jquery");

var initialize = function (numSeats, preSelected, unavailableSeats, parentElementId, inputId, modal) {
  var store = reduce({}, actionCreators.init(numSeats, preSelected, unavailableSeats, inputId));
  var tree = render(store); // We need an initial tree
  var rootNode = createElement(tree);
  document.getElementById(parentElementId).appendChild(rootNode); // ... and it should be in the document

  function dispatch(store, action) {
    store = reduce(store, action);
    update(store);
  }

  function update(store) {
    var newTree = render(store);
    var patches = diff(tree, newTree);
    tree = newTree;
    rootNode = patch(rootNode, patches);
    console.info(store);
  }

  function renderSeat(props) {
    var innerClassName = "seat";
    var action = actionCreators.select(props.seatNumber);

    if (props.isReserved) {
      innerClassName = "seat unavailable";
      action = null;
    } else if (props.isSelected) {
      innerClassName = "seat selected";
      action = actionCreators.deselect(props.seatNumber);
    }
    return h('li', {
      className : innerClassName,
      onclick : dispatch.bind(this, store, action)
    }, props.seatNumber);
  }

  function render(store) {

    var chart = store.seatingChart.map(function (row, i) {
        return h('ul', {
          className : 'seat-row'
        }, row.map(function (seatNumber) {
            return renderSeat({
              seatNumber : seatNumber,
              isSelected : store.selected[seatNumber] === true,
              isReserved : store.unavailable[seatNumber] === true
            });
          }));
        })
        return h('div', {
          className : "container"
        }, [
            h('p', {
              className : "instructions"
            }, [
                "Please select ",
                h('span', {
                  className : "selections-remaining"
                }, store.numSeats - store.numSelected),
                " more seats."]),
            h('div', {
              className : 'stage'
            }, "STAGE"),
            chart,
            h('a', {
              className : "btn-add-to-cart",
              href : "#",
              onclick : dispatch.bind(this, store, actionCreators.submit(store.selected, store.inputId, modal))
            }, "Add to Cart")]);
    }

  }

  $(document).ready(function () {
    $('.single_add_to_cart_button').click(function () {
      modal.open({
        content : "<div id='chooser' style='width: 960px; height: 500px;'></div>"
      });
	  var seatsChosenValue = document.getElementById('seatsChosen').value
	  var seatsChosen = [];
      if (seatsChosenValue.length > 0) {	
		seatsChosen = seatsChosenValue.split(',');
	  }
      console.info(seatsChosen);
      initialize(7, seatsChosen, ["C4", "C5", "C6", "C7"], 'chooser', 'seatsChosen', modal);
    })
  })

  // TODO
  //
  // 1. tie into woocommerce - this screen should come up after add-to-cart
  // 2. check for conflicts before submitting and if one is found, notify the user
  // 3. provide a report for the box office with names per seat.
