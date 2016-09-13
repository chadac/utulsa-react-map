/**
 * From https://facebook.github.io/flux/docs/todo-list.html
 *
 * Stores state information for all markers on the map. The bulk of the
 * logic will happen through this script.
 **/
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var MarkerConstants = require('../constants/MarkerConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
var CLICK_EVENT = 'click';

// Collection of markers
var _markers = {};

// ID of clicked marker
var _clickedMarker = null;

function create(data) {
  var key = data.id
  _markers[key] = data;
  _markers[key].$clicked = false;
  _markers[key].$hover = false;
}

function destroy(id) {
  delete _markers[id];
}

function click(id) {
  if(_clickedMarker == id) {
    _clickedMarker = null;
    _markers[id].$clicked = false;
  }
  else {
    if(_clickedMarker != null) {
      _markers[_clickedMarker].$clicked = false
    }
    _clickedMarker = id;
    _markers[id].$clicked = true;
  }
}

function unClick() {
  _clickedMarker = null;
}

function mouseEnter(id) {
  _markers[id].$hover = true;
}

function mouseLeave(id) {
  _markers[id].$hover = false;
}

var MarkerStore = assign({}, EventEmitter.prototype, {
  /**
   * Returns all markers.
   */
  getAll: function() {
    return _markers;
  },

  getClickedMarkerID: function() {
    return _clickedMarker;
  },

  /**
   * Called when anything about this object is changed.
   */
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * Allows functions to listen on when changes are made.
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  addClickListener: function(id, callback) {
    this.on([CLICK_EVENT, id], callback);
  },

  /**
   * This is the tool that handles receiving actions.
   */
  dispatcherIndex: AppDispatcher.register(function(payload) {
    var action = payload.action;
    var data;

    switch(action.actionType) {
      case MarkerConstants.MARKER_CREATE:
        create(action.data);
        MarkerStore.emitChange();
        break;

      case MarkerConstants.MARKER_DESTROY:
        destroy(action.id);
        MarkerStore.emitChange();
        break;

      case MarkerConstants.MARKER_CLICK:
        click(action.id);
        MarkerStore.emitChange();
        break;

      case MarkerConstants.MARKER_MOUSE_ENTER:
        mouseEnter(action.id);
        MarkerStore.emitChange();
        break;

      case MarkerConstants.MARKER_MOUSE_LEAVE:
        mouseLeave(action.id);
        MarkerStore.emitChange();
        break;
    }

    return true;
  })

});

// Probably bad
MarkerStore.setMaxListeners(1000);

module.exports = MarkerStore
