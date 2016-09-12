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

// Collection of markers
var _markers = [];

function create(data) {
  var key = data.key
  _markers.push({
    key: data.id,
    position: data.position,
    name: data.name,
    location: data.location,
    website: data.website
  });
}

function destroy(id) {
  delete _markers[id];
}

var MarkerStore = assign({}, EventEmitter.prototype, {
  /**
   * Returns all markers.
   */
  getAll: function() {
    return _markers;
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
    }

    return true;
  })
});

module.exports = MarkerStore
