/**
 * From https://facebook.github.io/flux/docs/todo-list.html
 *
 * Stores state information for all items on the map. The bulk of the
 * logic will happen through this script.
 **/
const AppDispatcher = require('../dispatcher/AppDispatcher');
const EventEmitter = require('events').EventEmitter;
const ItemConstants = require('../constants/ItemConstants');
const assign = require('object-assign');

const GMapsStore = require('./GMapsStore');
const GMapsConstants = require('../constants/GMapsConstants');
const AppStateConstants = require('../constants/AppStateConstants');

const Trie = require('../util/Trie');

const placeData = require('../data/places.json');
const routeData = require('../data/routes.json');
const parkingData = require('../data/parking_lots.json');
const parkingPolyData = require('../data/parking_polygons.json');
const markerData = require('../data/markers.json');
const categoryData = require('../data/categories.json');

const CHANGE_EVENT = 'change';
const SELECT_EVENT = 'select';

function parseKMLCoords(msg, offset) {
  if(offset == null) offset = 0;
  var msgSplit = msg.split(' ');
  return msgSplit.map((coordStr) => {
    var coords = coordStr.split(',')
    return { lng: Number(coords[0])+offset, lat: Number(coords[1])+offset };
  });
}

// Collection of items
var _items = {};

var _itemTrie = new Trie();
var _searchKey = null;

// Marker IDs
var _markers = [];
// Route IDs
var _routes = [];
// Parking Lot IDs
var _parking_lots = [];

var _categories = {};
var _activeCategories = {};

// Current selected item
var _selectedItem = null;
// Current item with active InfoWindow
var _infoWindow = null;
// Current item in focus
var _focusedItem = null;

var _zoomLevels = {max: {}, min: {}}

function isMarker(id) {
  return _items[id].type == 'place' || _items[id].type == 'simple_marker';
}

function isRoute(id) {
  return _items[id].type == 'route';
}

function isParkingLot(id) {
  return _items[id].type == 'parking_lot';
}

function _addZoom(id, min_zoom, max_zoom) {
  if(max_zoom !== undefined) {
    if(_zoomLevels.max[max_zoom] == undefined)
      _zoomLevels.max[max_zoom] = [];
    _zoomLevels.max[max_zoom].push(id);
  }
  if(min_zoom !== undefined) {
    if(_zoomLevels.min[min_zoom] == undefined)
      _zoomLevels.min[min_zoom] = [];
    _zoomLevels.min[min_zoom].push(id);
  }
}

function _addSearchTerm(name, id) {
  _itemTrie.add(name, id);
  for(var i = 1; i < name.length; i++) {
    if(name[i] == ' ') {
      _itemTrie.add(name.slice(i+1), id);
    }
  }
}

function _addCategory(category, id) {
  _categories[category].push(_items[id]);
}

function loadCategories(data) {
  data.forEach((category) => {
    _categories[category.name] = [];
    if(category.active == '1')
      _activeCategories[category.name] = category.name;
  });
}

function create(data) {
  var id = data.id;
  _items[id] = data;
  _items[id].$selected = false;
  _items[id].$infoWindow = false;
  _items[id].$searchKey = null;
  _items[id].$searchTerms = null;

  //Search terms
  if(data.name !== undefined) {
    _addSearchTerm(data.name, data.id);
  }
  if(data.tags !== undefined) {
    data.tags.forEach((term) => _addSearchTerm(term, data.id));
  }
  if(data.alternate_names !== undefined) {
    data.alternate_names.forEach((term) => _addSearchTerm(term, [data.id, term]));
  }
  if(data.departments !== undefined) {
    data.departments.forEach((term) => _addSearchTerm(term, [data.id, term]));
  }
  if(data.rooms !== undefined) {
    data.rooms.forEach((term) => _addSearchTerm(term, [data.id, term]));
  }

  if(data.category !== undefined) {
    // Add category
    _addCategory(data.category, data.id);
  }

  const currentZoom = GMapsStore.getZoom();
  _items[id].$inZoom =
    (data.gmaps.min_zoom == undefined || currentZoom >= data.gmaps.min_zoom)
    && (data.gmaps.max_zoom == undefined || currentZoom <= data.gmaps.max_zoom);
  _addZoom(data.id, data.gmaps.min_zoom, data.gmaps.max_zoom);

  if(isMarker(id)) {
    _markers.push(id);
  }
  else if(isRoute(id)) {
    _routes.push(id);
    _items[id].route.path = parseKMLCoords(_items[id].route.path,
                                           _items[id].route.offset);
  }
  else if(isParkingLot(id)) {
    _parking_lots.push(id);
    _items[id].parking_lot.layer = parkingPolyData[id];
    /* _items[id].parking_lot.layer = data
     *   .parking_lot.layer
     *   .filter((data) => data != undefined)
     *   .map((data) => {
     *     data = data.replace(/[\u201C\u201D]/g, '"');
     *     if(data[0] == '[') {
     *       var layer = JSON.parse(data);
     *       return layer.map((poly) => parseKMLCoords(poly));
     *     }
     *     else {
     *       return parseKMLCoords(data);
     *     }
     *   });*/
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

function openInfoWindow(id) {
  if(_infoWindow != null) _items[_infoWindow].$infoWindow = false;
  _items[id].$infoWindow = true;
  _infoWindow = id;
}

function closeInfoWindow(id) {
  if(_infoWindow != null) _items[_infoWindow].$infoWindow = false;
  _infoWindow = null;
}

function mapUpdateZoom() {
  const czoom = GMapsStore.getZoom(),
        ozoom = GMapsStore.getOldZoom(),
        inc = czoom > ozoom ? 1 : -1;
  for(var i = ozoom; i != czoom; i += inc) {
    _mapUpdateZoomLevel(i + inc, i);
  }
}

function _mapUpdateZoomLevel(czoom, ozoom) {
  if(czoom > ozoom) {
    if(_zoomLevels.max[ozoom] != undefined) {
      _zoomLevels.max[ozoom]
                 .forEach((id) => _items[id].$inZoom = false);
    }
    if(_zoomLevels.min[czoom] != undefined) {
      _zoomLevels.min[czoom]
                 .forEach((id) => _items[id].$inZoom = true);
    }
  } else {
    if(_zoomLevels.max[czoom] != undefined) {
      _zoomLevels.max[czoom]
                 .forEach((id) => _items[id].$inZoom = true);
    }
    if(_zoomLevels.min[ozoom] != undefined) {
      _zoomLevels.min[ozoom]
                 .forEach((id) => _items[id].$inZoom = false);
    }
  }
}

function search(w) {
  if(w.length <= 0) {
    _searchKey = null;
    return;
  }
  _searchKey = Math.random();
  _itemTrie.search(w).forEach((item) => {
    var key, term;
    if(item instanceof Array) {
      key = item[0];
      term = item[1];
    } else {
      key = item;
      term = null;
    }
    if(_items[key].$searchKey != _searchKey) {
      _items[key].$searchKey = _searchKey;
      _items[key].$searchTerms = [];
    }
    if(term && _items[key].$searchTerms.indexOf(term) < 0) {
      _items[key].$searchTerms.push(term);
    }
  });
};

function resetSearch() {
  _searchKey = null;
}

function addCategory(category) {
  _activeCategories[category] = category;
}

function remCategory(category) {
  delete _activeCategories[category];
}

function resetCategories() {
  _activeCategories = {'TU MAIN CAMPUS': 'TU MAIN CAMPUS'};
}

function focus(id) {
  _selectedItem = id;
  _focusedItem = id;
}

function unfocus() {
  _focusedItem = null;
}

var ItemStore = assign({}, EventEmitter.prototype, {
  /**
   * Imports JSON data.
   */
  load() {
    loadCategories(categoryData);
    placeData.forEach((item) => create(item));
    routeData.forEach((item) => create(item));
    parkingData.forEach((item) => create(item));
    markerData.forEach((item) => create(item));
    this.emitChange();
  },

  /**
   * Returns all markers.
   */
  getAll() {
    return Object.keys(_items).map((id) => _items[id]);
  },

  getItem(id) {
    return _items[id];
  },

  hasItem(id) {
    return _items[id] != undefined;
  },

  getMarkers() {
    return _markers.map((id) => _items[id]);
  },

  getRoutes() {
    return _routes.map((id) => _items[id]);
  },

  getInfoWindow() {
    return _infoWindow;
  },

  getSelected() {
    return _selectedItem;
  },

  getFocused() {
    return _items[_focusedItem];
  },

  getSearchKey() {
    return _searchKey;
  },

  getCategories() {
    return Object.keys(_categories);
  },

  getItemsByCategory() {
    return _categories;
  },

  getActiveCategories() {
    return Object.keys(_activeCategories);
  },

  /**
   * Called when anything about this object is changed.
   */
  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * Called when the item with `id` is selected.
   */
  emitSelect(id) {
    this.emit([SELECT_EVENT, id]);
  },

  /**
   * Allows functions to listen on when changes are made.
   */
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  addSelectListener(id, callback) {
    this.on([SELECT_EVENT, id], callback);
  },

  /**
   * This is the tool that handles receiving actions.
   */
  dispatcherIndex: AppDispatcher.register((action) => {
    switch(action.actionType) {
      case ItemConstants.ITEM_CREATE:
        create(action.data, false);
        ItemStore.emitChange();
        break;

      case ItemConstants.ITEM_DESTROY:
        destroy(action.id);
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

      case ItemConstants.ITEM_FOCUS:
        focus(action.id);
        ItemStore.emitChange();
        break;

      case AppStateConstants.CLOSE_MODAL:
      case ItemConstants.ITEM_UNFOCUS:
        unfocus();
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

      case ItemConstants.ITEM_SEARCH:
        search(action.word);
        ItemStore.emitChange();
        break;

      case ItemConstants.ITEM_RESET_SEARCH:
        resetSearch();
        ItemStore.emitChange();
        break;

      case ItemConstants.ADD_CATEGORY:
        addCategory(action.category);
        ItemStore.emitChange();
        break;

      case ItemConstants.REM_CATEGORY:
        remCategory(action.category);
        ItemStore.emitChange();
        break;

      case ItemConstants.RESET_CATEGORIES:
        resetCategories();
        break;

      case GMapsConstants.MAP_ZOOM:
        AppDispatcher.waitFor([
          GMapsStore.dispatcherIndex,
        ]);
        mapUpdateZoom();
        ItemStore.emitChange();
        break;
    }

    return true;
  })
});

// We may need to create hundreds to thousands of events
ItemStore.setMaxListeners(0);

module.exports = ItemStore
