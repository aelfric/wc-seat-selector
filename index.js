"use strict"
var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');
var actions = require('./actions.js');
var reduce = require('./reducer.js');
var actionCreators = require('./actionCreators.js');

(function () {

  function dispatch(store, action) {
    store = reduce(store, action);
    update(store);
  }

  var tree = h('div');
  var store = {};
  store = reduce(store, actionCreators.init(7, 0, ["C4", "C5", "C6", "C7"]));
  tree = render(store); // We need an initial tree
  var rootNode = createElement(tree);

  function update(store) {
    var newTree = render(store);
    var patches = diff(tree, newTree);
    tree = newTree;
    rootNode = patch(rootNode, patches);
  }

  function renderSeat(seatNumber) {
    var innerClassName = "seat";
    var action = actionCreators.select(seatNumber);

    if (store.unavailable[seatNumber] === true) { // seat is unavailable
      innerClassName = "seat unavailable";
      action = null;
    } else if (store.selected[seatNumber] === true) { // seat is already selected
      innerClassName = "seat selected";
      action = actionCreators.deselect(seatNumber);
    }
    return h('li', {
      className : innerClassName,
      onclick : dispatch.bind(this, store, action)
    }, seatNumber);
  }

  function render(store) {

    var chart = store.seatingChart.map(function (row, i) {
        return h('ul', {
          className : 'seat-row'
        }, row.map(renderSeat))
      })
      return h('div', {
        className : "container"
      }, [
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
          h('div', {
            className : 'stage'
          }, "STAGE"),
          chart,
          h('a', {
            className : "btn-add-to-cart",
            href : "#",
            onclick : dispatch.bind(this, store, actionCreators.submit(store.selected))
          }, "Add to Cart")]);
  }

  document.body.appendChild(rootNode); // ... and it should be in the document
})()

// TODO
//
// 1. tie into woocommerce - this screen should come up after add-to-cart
// 2. check for conflicts before submitting and if one is found, notify the user
// 3. provide a report for the box office with names per seat.
//
