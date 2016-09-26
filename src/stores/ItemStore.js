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

const CHANGE_EVENT = 'change';
const SELECT_EVENT = 'select';

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
var _infoWindow = null;

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
  _items[id].$infoWindow = false;

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
  var oldSelect = _selectedItem;
  if(_selectedItem != null) {
    _items[_selectedItem].$selected = false;
  }
  _selectedItem = id;
  _items[_selectedItem].$selected = true;
  openInfoWindow(_selectedItem);
  return oldSelect;
}

function deselect() {
  var oldSelectedItem = _selectedItem;
  _items[_selectedItem].$selected = false;
  closeInfoWindow(_selectedItem);
  _selectedItem = null;
  return oldSelectedItem;
}

function marksActive(ids) {
  Object.keys(_items).forEach((id) => {
    _items[id].$active = (ids.indexOf(id) != -1);
  });
}

function openInfoWindow(id) {
  if(_infoWindow != null) _items[_infoWindow].$infoWindow = false;
  _items[id].$infoWindow = true;
  _infoWindow = id;
}

function closeInfoWindow(id) {
  if(_infoWindow != null) _items[_infoWindow].$infoWindow = false;
  _infoWindow = null;
}

var ItemStore = assign({}, EventEmitter.prototype, {
  /**
   * Imports JSON data.
   */
  load: () => {
    itemData.forEach((item) => create(item, true));
    ItemStore.emitChange();
  },

  /**
   * Returns all markers.
   */
  getAll: function() {
    return Object.keys(_items).map((id) => _items[id]);
  },

  getItem: (id) => {
    return _items[id];
  },

  hasItem: (id) => {
    return _items[id] != undefined;
  },

  getMarkers: function() {
    return _markers.map((id) => _items[id]);
  },

  getRoutes: function() {
    return _routes.map((id) => _items[id]);
  },

  getInfoWindow: function() {
    return _infoWindow;
  },

  getSelected: function() {
    return _selectedItem;
  },

  /**
   * Called when anything about this object is changed.
   */
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * Called when the item with `id` is selected.
   */
  emitSelect: function(id) {
    this.emit([SELECT_EVENT, id]);
  },

  /**
   * Allows functions to listen on when changes are made.
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  addSelectListener: function(id, callback) {
    this.on([SELECT_EVENT, id], callback);
  },

  /**
   * This is the tool that handles receiving actions.
   */
  dispatcherIndex: AppDispatcher.register(function(payload) {
    var action = payload.action;
    var data;

    switch(action.actionType) {
      case ItemConstants.ITEM_CREATE:
        create(action.data, false);
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

      case ItemConstants.ITEM_SELECT:
        var oldSelect = select(action.id);
        if(oldSelect != null && oldSelect != action.id) {
          ItemStore.emitSelect(oldSelect);
        }
        ItemStore.emitSelect(action.id);
        ItemStore.emitChange();
        break;

      case ItemConstants.ITEM_DESELECT:
        var oldSelectedItem = deselect();
        ItemStore.emitSelect(oldSelectedItem);
        ItemStore.emitChange();
        break;

      case ItemConstants.ITEM_OPEN_INFOWINDOW:
        openInfoWindow(action.id);
        ItemStore.emitChange();
        break;

      case ItemConstants.ITEM_CLOSE_INFOWINDOW:
        closeInfoWindow();
        ItemStore.emitChange();
        break;

      default:
        return false;
    }

    return true;
  })

});

// We may need to create hundreds to thousands of events
ItemStore.setMaxListeners(0);

module.exports = ItemStore
