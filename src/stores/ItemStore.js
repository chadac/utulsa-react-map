/**
 * From https://facebook.github.io/flux/docs/todo-list.html
 *
 * Stores state information for all items on the map. The bulk of the
 * logic will happen through this script.
 **/
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ItemConstants = require('../constants/ItemConstants');
var assign = require('object-assign');
var itemData = require('../data/items.json');

var CHANGE_EVENT = 'change';

function parseKMLCoords(msg) {
  var msgSplit = msg.split(' ');
  return msgSplit.map((coordStr) => {
    var coords = coordStr.split(',')
    return { lng: coords[0], lat: coords[1] };
  });
}

// Collection of markers
var _items = {};

var _markers = [];
var _routes = [];

var _selectedItem = null;

function isMarker(id) {
  return _items[id].type == 'marker';
}

function isRoute(id) {
  return _items[id].type == 'route';
}

function create(data, isActive) {
  var id = data.id
  _items[id] = data;
  _items[id].$active = isActive;
  _items[id].$selected = false;

  if(isMarker(id)) {
    _markers.push(id);
  }
  else if(isRoute(id)) {
    _routes.push(id);
    _items[id].route.path = parseKMLCoords(_items[id].route.path);
  }
}

function destroy(id) {
  delete _items[id];
}

function select(id) {
  if(_selectedItem != null) {
    _items[_selectedItem].$selected = false;
  }
  _selectedItem = id;
  _items[_selectedItem].$selected = true;
}

function deselect(id) {
  if(_selectedItem == id) {
    _item[id].$selected = false;
    _selectedItem = null;
  }
}

function marksActive(ids) {
  Object.keys(_items).forEach((id) => {
    _items[id].$active = (ids.indexOf(id) != -1);
  });
}

var ItemStore = assign({}, EventEmitter.prototype, {
  /**
   * Returns all markers.
   */
  getAll: function() {
    return Object.keys(_items).map((id) => _items[id]);
  },

  getMarkers: function() {
    return _markers.map((id) => _items[id]);
  },

  getRoutes: function() {
    return _routes.map((id) => _items[id]);
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
      case ItemConstants.ITEM_CREATE:
        create(action.data);
        ItemStore.emitChange();
        break;

      case ItemConstants.ITEM_DESTROY:
        destroy(action.id);
        ItemStore.emitChange();
        break;

      case ItemConstants.ITEMS_MARK_ACTIVE:
        marksActive(action.ids);
        ItemStore.emitChange();
        break;

      default:
        return false;
    }

    return true;
  })

});

// Import JSON data
itemData.forEach((item) => create(item, true));
ItemStore.emitChange();

module.exports = ItemStore
