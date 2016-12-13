/**
 * From https://facebook.github.io/flux/docs/todo-list.html
 *
 * Stores state information for all items on the map. The bulk of the
 * logic will happen through this script.
 **/
const AppDispatcher = require('../dispatcher/AppDispatcher');
const EventEmitter = require('events').EventEmitter;
const assign = require('object-assign');

const ItemConstants = require('../constants/ItemConstants');

const GMapsStore = require('./GMapsStore');
const GMapsConstants = require('../constants/GMapsConstants');

const Trie = require('../util/Trie');

const placeData = require('../data/places.json');
const routeData = require('../data/routes.json');
const parkingData = require('../data/parking_lots.json');
const parkingPolyData = require('../data/parking_polygons.json');
const markerData = require('../data/markers.json');
const categoryData = require('../data/categories.json');

const CHANGE_EVENT = 'c';
const CATEGORY_CHANGE_EVENT = 'cat';
const STATE_CHANGE_EVENT = 's';
const SELECT_EVENT = 'e';

function parseKMLCoords(msg, offset) {
  if(offset === null) offset = 0;
  var msgSplit = msg.split(' ');
  return msgSplit.map((coordStr) => {
    var coords = coordStr.split(',');
    return { lng: Number(coords[0]) + offset, lat: Number(coords[1]) + offset };
  });
}

// Collection of items
var _items = {};
var _state = {};

var _itemTrie = new Trie();
var _searched = [];

// Marker IDs
var _markers = [];
// Route IDs
var _routes = [];
// Parking Lot IDs
var _parking_lots = [];

var _cats = {};
var _activeCats = new Set([]);

// Current selected item
var _selectedItem = null;
// Current item with active InfoWindow
var _infoWindow = null;

var _zoomLevels = {max: {}, min: {}}

function isMarker(id) {
  return _items[id].type === 'place' || _items[id].type === 'simple_marker';
}

function isRoute(id) {
  return _items[id].type === 'route';
}

function isParkingLot(id) {
  return _items[id].type === 'parking_lot';
}

function _addZoom(id, min_zoom, max_zoom) {
  if(typeof max_zoom !== "undefined") {
    if(typeof _zoomLevels.max[max_zoom] === "undefined")
      _zoomLevels.max[max_zoom] = [];
    _zoomLevels.max[max_zoom].push(id);
  }
  if(typeof min_zoom !== "undefined") {
    if(typeof _zoomLevels.min[min_zoom] === "undefined")
      _zoomLevels.min[min_zoom] = [];
    _zoomLevels.min[min_zoom].push(id);
  }
}

function _addSearchTerm(name, id) {
  _itemTrie.add(name, id);
  for(var i = 1; i < name.length; i++) {
    if(name[i] === ' ') {
      _itemTrie.add(name.slice(i + 1), id);
    }
  }
}

function _addCategory(category, id) {
  _cats[category].push(id);
  /* _activeCats.add(category); */
}

function loadCategories(data) {
  data.forEach((category) => {
    _cats[category.name] = [];
    if(category.active === 1) {
      _activeCats.add(category.name);
    }
  });
}

/**
 * Saves an item to the store.
 *
 * @param {Object} data - The item information.
 *
 * @returns {undefined}
 */
function create(data) {
  var id = data.id;
  _items[id] = data;

  // State information
  _state[id] = {
    $infoWindow: false,
    $selected: false,

    filter: {
      $active: _activeCats.has(data.category),
    },

    search: {
      $active: false,
      terms: [],
    }
  };

  //Search terms
  if(typeof data.name !== "undefined") {
    _addSearchTerm(data.name, data.id);
  }
  if(typeof data.tags !== "undefined") {
    data.tags.forEach((term) => _addSearchTerm(term, data.id));
  }
  if(typeof data.alternate_names !== "undefined") {
    data.alternate_names.forEach((term) => _addSearchTerm(term, [data.id, term]));
  }
  if(typeof data.departments !== "undefined") {
    data.departments.forEach((term) => _addSearchTerm(term, [data.id, term]));
  }
  if(typeof data.rooms !== "undefined") {
    data.rooms.forEach((term) => _addSearchTerm(term, [data.id, term]));
  }

  if(typeof data.category !== "undefined") {
    // Add category
    _addCategory(data.category, data.id);
  }

  // Zoom levels
  const currentZoom = GMapsStore.getZoom();
  _state[id].$zoom =
    (typeof data.gmaps.min_zoom !== "undefined" && currentZoom < data.gmaps.min_zoom) ? 1 :
    (typeof data.gmaps.max_zoom !== "undefined" && currentZoom > data.gmaps.max_zoom) ? -1 : 0;
  _addZoom(data.id, data.gmaps.min_zoom, data.gmaps.max_zoom);

  if(isMarker(id)) {
    _markers.push(id);
    _items[id].focus = {
      center: {lat: data.marker.lat, lng: data.marker.lng},
      zoom: Math.max(data.gmaps.min_zoom || 16, 18),
    };
  }
  else if(isRoute(id)) {
    _routes.push(id);
    const path = parseKMLCoords(_items[id].route.path, _items[id].route.offset);
    _items[id].route.path = path;
    _items[id].focus = {
      center: path[Math.ceil(path.length / 2)],
      zoom: 16,
    };
  }
  else if(isParkingLot(id)) {
    _parking_lots.push(id);
    const path = parkingPolyData[id];
    _items[id].parking_lot.layer = path;
    let center = data.parking_lot.center;
    if(center.lat === 1 && center.lng === 1) {
      center = {lat: 0, lng: 0};
      path[0].forEach((coord) => {
        center.lat += coord.lat;
        center.lng += coord.lng;
      });
    }
    center.lat /= path[0].length;
    center.lng /= path[0].length;
    _items[id].parking_lot.center = center;
    _items[id].focus = {
      center: _items[id].parking_lot.center,
      zoom: 18,
    }
  }
}

function destroy(id) {
  delete _items[id];
}

function openInfoWindow(id) {
  if(_infoWindow !== null) _state[_infoWindow].$infoWindow = false;
  _state[id].$infoWindow = true;
  _infoWindow = id;
}

function closeInfoWindow() {
  let oldInfoWindow = _infoWindow;
  if(_infoWindow !== null) _state[_infoWindow].$infoWindow = false;
  _infoWindow = null;
  return oldInfoWindow;
}

function select(id) {
  var oldSelect = _selectedItem;
  if(_selectedItem !== null) {
    _state[_selectedItem].$selected = false;
  }
  _selectedItem = id;
  _state[id].$selected = true;
  openInfoWindow(id);
  return oldSelect;
}

function deselect() {
  var oldSelectedItem = _selectedItem;
  _state[_selectedItem].$selected = false;
  closeInfoWindow(_selectedItem);
  _selectedItem = null;
  return oldSelectedItem;
}

function _mapUpdateZoomLevel(czoom, ozoom) {
  let ids = [];
  if(czoom > ozoom) {
    if(typeof _zoomLevels.max[ozoom] !== "undefined") {
      _zoomLevels.max[ozoom]
                 .forEach((id) => _state[id].$zoom = -1);
    }
    ids = ids.concat(_zoomLevels.max[ozoom]);
    if(typeof _zoomLevels.min[czoom] !== "undefined") {
      _zoomLevels.min[czoom]
                 .forEach((id) => _state[id].$zoom = 0);
    }
    ids = ids.concat(_zoomLevels.min[czoom]);
  } else {
    if(typeof _zoomLevels.max[czoom] !== "undefined") {
      _zoomLevels.max[czoom]
                 .forEach((id) => _state[id].$zoom = 0);
    }
    ids = ids.concat(_zoomLevels.max[czoom]);
    if(typeof _zoomLevels.min[ozoom] !== "undefined") {
      _zoomLevels.min[ozoom]
                 .forEach((id) => _state[id].$zoom = 1);
    }
    ids = ids.concat(_zoomLevels.min[ozoom]);
  }

  return ids;
}

function mapUpdateZoom() {
  const czoom = GMapsStore.getZoom(),
        ozoom = GMapsStore.getOldZoom(),
        inc = czoom > ozoom ? 1 : -1;

  let ids = [];
  for(var i = ozoom; i !== czoom; i += inc) {
    ids = ids.concat(_mapUpdateZoomLevel(i + inc, i));
  }

  // Expensive-ish, but this is fairly small so it doesn't matter
  return Array.from(new Set(ids));
}

function resetSearch() {
  let ids = _searched;

  _searched.forEach((id) => {
    _state[id].search.$active = false;
    _state[id].search.terms = [];
  });

  return ids;
}

function search(w) {
  let ids = resetSearch();

  if(w.length <= 0) return;

  let newIds = [];
  _itemTrie.search(w).forEach((item) => {
    var key = null, term = null;
    if(item instanceof Array) {
      key = item[0];
      term = item[1];
    } else {
      key = item;
      term = null;
    }
    newIds.push(key);
    _state[key].search.$active = true;
    if(term && _state[key].search.terms.indexOf(term) < 0) {
      _state[key].search.terms.push(term);
    }
  });

  ids = Array.from(new Set(ids.concat(newIds)));
  _searched = Array.from(new Set(newIds));
  return ids;
}

function addCategory(category) {
  _activeCats.add(category);

  let ids = _cats[category];
  ids.forEach((id) => _state[id].filter.$active = true);
  return ids;
}

function remCategory(category) {
  _activeCats.delete(category);

  let ids = _cats[category];
  ids.forEach((id) => _state[id].filter.$active = false);
  return ids;
}

function resetCategories() {
  let ids = [];
  _activeCats.forEach((cat) => ids = ids.concat(remCategory(cat)));
  addCategory("TU MAIN CAMPUS");
}

var ItemStore = assign({}, EventEmitter.prototype, {

  load() {
    loadCategories(categoryData);
    placeData.forEach((item) => create(item));
    routeData.forEach((item) => create(item));
    parkingData.forEach((item) => create(item));
    markerData.forEach((item) => create(item));
    this.emitChange();
  },

  /****************************************************************
   * GETTERS
   ****************************************************************/

  getAll() {
    return Object.keys(_items).map((id) => _items[id]);
  },

  getItem(id) {
    return _items[id];
  },

  getItemState(id) {
    return _state[id];
  },

  hasItem(id) {
    return typeof _items[id] !== "undefined";
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

  getCategories() {
    return Object.keys(_cats);
  },

  getItemsByCategory() {
    return _cats;
  },

  getActiveCategories() {
    return Array.from(_activeCats);
  },

  getNumSearchItems() {
    return _searched.length;
  },

  getSearched() {
    return _searched;
  },

  /****************************************************************
   * EMITTERS
   ****************************************************************/

  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  emitCategoryChange() {
    this.emit(CATEGORY_CHANGE_EVENT);
  },

  emitStateChange(id) {
    id = id || null;
    this.emit(STATE_CHANGE_EVENT);
    if(id !== null)
      this.emit([STATE_CHANGE_EVENT, id]);
  },

  emitSelect(id) {
    this.emit([SELECT_EVENT, id]);
  },

  /****************************************************************
   * LISTENERS
   ****************************************************************/

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  addCategoryChangeListener(callback) {
    this.on(CATEGORY_CHANGE_EVENT, callback);
  },

  addStateChangeListener(callback, id) {
    id = id || null;
    if(id === null)
      this.on(STATE_CHANGE_EVENT, callback);
    else
      this.on([STATE_CHANGE_EVENT, id], callback);
  },

  addSelectListener(id, callback) {
    this.on([SELECT_EVENT, id], callback);
  },

  /****************************************************************
   * DISPATCHER
   ****************************************************************/

  dispatcherIndex: AppDispatcher.register((action) => {
    let ids = [];

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
        if(oldSelect !== null && oldSelect !== action.id) {
          ids.push(oldSelect);
        }
        ids.push(action.id);
        break;

      case ItemConstants.ITEM_DESELECT:
        let oldSelectedItem = deselect();
        ids.push(oldSelectedItem);
        break;

      case ItemConstants.ITEM_OPEN_INFOWINDOW:
        openInfoWindow(action.id);
        ids.push(action.id);
        break;

      case ItemConstants.ITEM_CLOSE_INFOWINDOW:
        let oldInfoWindow = closeInfoWindow();
        ids.push(oldInfoWindow);
        break;

      case ItemConstants.ITEM_SEARCH:
        ids = search(action.word);
        break;

      case ItemConstants.ITEM_RESET_SEARCH:
        ids = resetSearch();
        _searched = Object.keys(_items);
        break;

      case ItemConstants.ADD_CATEGORY:
        ids = addCategory(action.category);
        ItemStore.emitCategoryChange();
        break;

      case ItemConstants.REM_CATEGORY:
        ids = remCategory(action.category);
        ItemStore.emitCategoryChange();
        break;

      case ItemConstants.RESET_CATEGORIES:
        ids = resetCategories();
        ItemStore.emitCategoryChange();
        break;

      case GMapsConstants.MAP_ZOOM:
        AppDispatcher.waitFor([
          GMapsStore.dispatcherIndex,
        ]);
        ids = mapUpdateZoom();
        break;
    }

    ids.forEach((id) => {
      ItemStore.emitStateChange(id);
    });

    return true;
  })
});

// We may need to create hundreds to thousands of events, so make this limit unbounded.
ItemStore.setMaxListeners(0);

module.exports = ItemStore
