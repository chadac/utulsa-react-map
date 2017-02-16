/**
 * From https://facebook.github.io/flux/docs/todo-list.html
 *
 * Stores state information for all items on the map. The bulk of the
 * logic will happen through this script.
 *
 * @module ItemStore
 **/
import AppDispatcher from '../dispatcher/AppDispatcher';
import {EventEmitter} from 'events';

import ItemConstants from '../constants/ItemConstants';

import GMapsStore from './GMapsStore';
import GMapsConstants from '../constants/GMapsConstants';

import Trie from '../util/Trie';

// All JSON data.
const placeData = require('../data/places.json');
const routeData = require('../data/routes.json');
const parkingData = require('../data/parking_lots.json');
const parkingPolyData = require('../data/parking_polygons.json');
const markerData = require('../data/markers.json');
const categoryData = require('../data/categories.json');
const photosData = require('../data/photos.json');
const descriptionsData = require('../data/descriptions.json');

// Event constants, used with EventEmitter to emit change events.
const CHANGE_EVENT = 'c';
const CATEGORY_CHANGE_EVENT = 'cat';
const STATE_CHANGE_EVENT = 's';
const SELECT_EVENT = 'e';

/****************************************************************
 * INTERNAL STATE VARIABLES
 ***************************************************************/

/********************
 * ITEM INFORMATION
 ********************/
/**
 * Dictionary of item metadata. This contains content that will likely not be
 * changed during the course of the app.
 */
var _items = {};
/**
 * Dictionary of item states. The item state are a set of variables that are
 * being actively changed by the user while running the application.
 *
 * Breaking the item into metadata/state components allows selectively updating
 * a smaller array when state changes happen in the app, and allows a clear
 * specification of what will be changed during the course of the app vs. what
 * will remain static.
 */
var _state = {};

/********************
 * SEARCH
 ********************/
/**
 * Used for searching. See [[src/util/Trie.js]] for more information.
 */
var _itemTrie = new Trie();
/**
 * Array of all items that are currently searched.
 *
 * This is tracked for performance reasons.
 */
var _searched = [];

/********************
 * ITEM TYPES
 ********************/
// Marker IDs
var _markers = [];
// Route IDs
var _routes = [];
// Parking Lot IDs
var _parking_lots = [];

/********************
 * CATEGORIES
 ********************/
// Dictionary of items associated with each category
var _cats = {};
// Corresponding dictionary of category data.
var _cats_data = {};
// Set of all currently active categories.
var _activeCats = new Set([]);

/********************
 * ITEM SELECTION
 ********************/
// Current selected item
var _selectedItem = null;

/********************
 * MAP INFORMATION
 ********************/
/**
 * Used for quickly updating whether items are inside or outside a
 * zoom level. The sub-items `max` and `min` will contain arrays of items
 * for each zoom level at which an item falls inside or outside of a zoom level.
 */
var _zoomLevels = {max: {}, min: {}}


/****************************************************************
 * PRIVATE FUNCTIONS
 ****************************************************************/

/**
 * Parses coordinates in a KML format into an array of objects.
 * @param {string} msg The KML formatted coordinate list string.
 * @param {number} offset The amount to move each coordinate.
 * @returns {Array.<Object>} The list of coordinates.
 */
function parseKMLCoords(msg, offset) {
  if(offset === null) offset = 0;
  var msgSplit = msg.split(' ');
  return msgSplit.map((coordStr) => {
    var coords = coordStr.split(',');
    return { lng: Number(coords[0]) + offset, lat: Number(coords[1]) + offset };
  });
}

/**
 * @param {*} id The item ID
 * @returns {boolean} isMarker If the item displays as a marker on the map.
 */
function isMarker(id) {
  return _items[id].type === 'place' || _items[id].type === 'simple_marker';
}

/**
 * @param {*} id The item ID
 * @returns {boolean} isRoute If the item displays as a polyline on the map.
 */
function isRoute(id) {
  return _items[id].type === 'route';
}

/**
 * @param {*} id The item ID
 * @returns {boolean} isParkingLot If the item displays as a polygon on the map.
 */
function isParkingLot(id) {
  return _items[id].type === 'parking_lot';
}

/**
 * Updates `_zoomLevels` to track this item when zoom levels change.
 * @param {*} id The item ID.
 * @param {int|undefined} min_zoom The minimum zoom level.
 * @param {int|undefined} max_zoom The maximum zoom level.
 */
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

/**
 * Adds the term (and any sub-words that appear) to the search trie, and associates
 * that term with the given item ID.
 * @param {string} term The search term.
 * @param {*} id The item ID.
 */
function _addSearchTerm(term, id) {
  _itemTrie.add(term, id);
  for(var i = 1; i < term.length; i++) {
    if(term[i] === ' ') {
      _itemTrie.add(term.slice(i + 1), id);
    }
  }
}

/**
 * Adds an item to the category.
 * @param {string} category The category name.
 * @param {*} id The item ID.
 */
function _addCategory(category, id) {
  _cats[category].push(id);
  // _activeCats.add(category);
}

/**
 * Loads all categories from the data.
 * @param {object} data The list of category metadata.
 */
function loadCategories(data) {
  data.forEach((category) => {
    _cats[category.name] = [];
    _cats_data[category.name] = {
      name: category.name,
      group: category.group,
    };
    if(category.active === 1) {
      _activeCats.add(category.name);
    }
  });
}

/**
 * Saves an item to the store.
 * @param {Object} data The item information.
 */
function create(data) {
  var id = data.id;
  _items[id] = data;

  // State information
  _state[id] = {
    $selected: false,

    filter: {
      $active: _activeCats.has(data.category),
    },

    search: {
      $active: false,
      terms: [],
    }
  };

  // AWS data
  _items[id].photos = photosData[id];
  if(id in descriptionsData)
    _items[id].description = descriptionsData[id];

  // Search terms
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

  // Associates item with the category
  if(typeof data.category !== "undefined") {
    _addCategory(data.category, data.id);
  }

  // Update zoom information.
  const currentZoom = GMapsStore.getZoom();
  _state[id].$zoom =
    (typeof data.gmaps.min_zoom !== "undefined" && currentZoom < data.gmaps.min_zoom) ? 1 :
    (typeof data.gmaps.max_zoom !== "undefined" && currentZoom > data.gmaps.max_zoom) ? -1 : 0;
  _addZoom(data.id, data.gmaps.min_zoom, data.gmaps.max_zoom);

  // Add google maps-specific information.
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

/**
 * Destroys the item.
 * @param {*} id The item ID.
 */
function destroy(id) {
  console.warn("The ItemStore.destroy() method is not completely implemented.");
  delete _items[id];
  //TODO: Delete all traces of the item from all store information.
}

/**
 * Selects an item.
 * @param {*} id The item ID.
 * @returns {Array} ids The list of item IDs to emit state changes for.
 */
function select(id) {
  var oldSelect = _selectedItem;
  if(_selectedItem !== null) {
    _state[_selectedItem].$selected = false;
  }
  _selectedItem = id;
  _state[id].$selected = true;
  return oldSelect;
}

/**
 * Deselects the currently selected item.
 * @returns {Array} ids The list of item IDs to emit state changes for.
 */
function deselect() {
  var oldSelectedItem = _selectedItem;
  _state[_selectedItem].$selected = false;
  _selectedItem = null;
  return oldSelectedItem;
}

/**
 * This is a performance-optimized method to mark items that fall within
 * the current zoom level. It works by removing items that were only
 * within the old zoom and adding items in the new zoom level.
 * @param {int} czoom The current (new) zoom level.
 * @param {int} ozoom The old zoom level.
 * @returns {Array} ids The list of item IDs to emit state changes for.
 */
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

/**
 * Incrementally updates the zoom level.
 * @returns {Array} ids The list of item IDs to emit state changes for.
 */
function mapUpdateZoom() {
  const czoom = GMapsStore.getZoom(), // Current zoom
        ozoom = GMapsStore.getOldZoom(), // Old zoom
        inc = czoom > ozoom ? 1 : -1; // Zoom direction: -1 if zooming out, +1 if zooming in.

  let ids = [];
  // Increment over each of the zoom level changes; generally this is only going
  // to be one level change, but there are cases where the zoom can immediately
  // change by more than one level.
  for(var i = ozoom; i !== czoom; i += inc) {
    ids = ids.concat(_mapUpdateZoomLevel(i + inc, i));
  }

  // Expensive-ish, but this is fairly small so it doesn't matter
  // Makes the set of IDs unique. Items may be non-unique if the item zooms in
  // and out on the same iteration.
  return Array.from(new Set(ids));
}

/**
 * Resets the search query, and unsets any search-active items.
 * @returns {Array} ids The list of item IDs to emit state changes for.
 */
function resetSearch() {
  let ids = _searched;

  _searched.forEach((id) => {
    _state[id].search.$active = false;
    _state[id].search.terms = [];
  });

  return ids;
}

/**
 * Marks items as active in search.
 * @param {string} w The word to search for.
 * @returns {Array} ids The list of item IDs to emit state changes for.
 */
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

/**
 * Marks a category as active.
 * @param {string} category The category name.
 * @returns {Array} ids The list of item IDs to emit state changes for.
 */
function addCategory(category) {
  _activeCats.add(category);

  let ids = _cats[category];
  ids.forEach((id) => _state[id].filter.$active = true);
  return ids;
}

/**
 * Marks a category as inactive.
 * @param {string} category The category name.
 * @returns {Array} ids The list of item IDs to emit state changes for.
 */
function remCategory(category) {
  _activeCats.delete(category);

  let ids = _cats[category];
  ids.forEach((id) => _state[id].filter.$active = false);
  return ids;
}

/**
 * Resets all active categories.
 * @returns {Array} ids The list of item IDs to emit state changes for.
 */
function resetCategories() {
  let ids = [];
  _activeCats.forEach((cat) => ids = ids.concat(remCategory(cat)));
  addCategory("TU MAIN CAMPUS");
  return ids;
}


/****************************************************************
 * ITEM STORE
 ****************************************************************/
/**
 * The main Item Store class. Acts as an interface between actions and internal
 * state. Contains methods for accessing internal state information, listening
 * on event changes, and dispatching based on action objects.
 */
class ItemStoreProto extends EventEmitter {
  constructor() {
    super();
    this.dispatcherIndex = AppDispatcher.register(this.dispatch.bind(this));
  }

  /**
   * Loads all items from existing JSON data. This doesn't trigger a change for
   * each item since that would add overhead.
   */
  load() {
    loadCategories(categoryData);
    placeData.forEach((item) => create(item));
    routeData.forEach((item) => create(item));
    parkingData.forEach((item) => create(item));
    markerData.forEach((item) => create(item));
    this.emitChange();
  }

  /****************************************************************
   * GETTERS
   ****************************************************************/

  /**
   * @returns {Array.<Item>} items All item metadata.
   */
  getAll() {
    return Object.keys(_items).map((id) => _items[id]);
  }

  /**
   * @param {*} id The item ID to retrieve metadata for.
   * @returns {Item} item The item metadata.
   */
  getItem(id) {
    return _items[id];
  }

  /**
   * @param {*} id The item ID to retrieve state information for.
   * @returns {Object} state The item state.
   */
  getItemState(id) {
    return _state[id];
  }

  /**
   * @param {*} id The item ID.
   * @returns {boolean} hasItem If the store contains the given item ID.
   */
  hasItem(id) {
    return typeof _items[id] !== "undefined";
  }

  /**
   * @returns {Array.<Marker>} Item metadata for all markers.
   */
  getMarkers() {
    return _markers.map((id) => _items[id]);
  }

  /**
   * @returns {Array.<Route>} Item metadata for all routes.
   */
  getRoutes() {
    return _routes.map((id) => _items[id]);
  }

  /**
   * @returns {*} id The id of the current selected item.
   */
  getSelected() {
    return _selectedItem;
  }

  /**
   * @returns {Object} categories The metadata for all categories.
   */
  getCategories() {
    return _cats_data;
  }

  /**
   * @returns {Object} categories Mapping of category names to arrays of items.
   */
  getItemsByCategory() {
    return _cats;
  }

  /**
   * @returns {Set} activeCategories The set of active categories.
   */
  getActiveCategories() {
    return _activeCats;
  }

  /**
   * @returns {int} numSearchItems the number of search items.
   */
  getNumSearchItems() {
    return _searched.length;
  }

  /**
   * @returns {Array} searched The list of all item IDs that have been searched.
   */
  getSearched() {
    return _searched;
  }

  /****************************************************************
   * EMITTERS
   ****************************************************************/

  /**
   * Emits when items are added or destroyed.
   */
  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  /**
   * Emits when categories are marked as active/inactive.
   */
  emitCategoryChange() {
    this.emit(CATEGORY_CHANGE_EVENT);
  }

  /**
   * Emits a state change for the given item. If empty, emits a general state change.
   * @param {*|undefined} id (optional) The item ID.
   */
  emitStateChange(id) {
    id = id || null;
    if(id !== null)
      this.emit([STATE_CHANGE_EVENT, id]);
    else
      this.emit(STATE_CHANGE_EVENT);
  }

  /**
   * Emits a select event. Currently not used in the app, but is tested.
   * @param {*} id - The item ID.
   */
  emitSelect(id) {
    this.emit([SELECT_EVENT, id]);
    this.emit(SELECT_EVENT);
  }

  /****************************************************************
   * LISTENERS
   ****************************************************************/

  /**
   * Adds a listener on item metadata changes.
   * @param {requestCallback} callback - The function callback.
   */
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  /**
   * Adds a listener on category state changes.
   * @param {requestCallback} callback - The function callback.
   */
  addCategoryChangeListener(callback) {
    this.on(CATEGORY_CHANGE_EVENT, callback);
  }
  remCategoryChangeListener(callback) {
    this.removeListener(CATEGORY_CHANGE_EVENT, callback);
  }

  /**
   * Adds a listener on item state changes.
   * @param {requestCallback} callback - The function callback.
   * @param {*} id - The item ID.
   */
  addStateChangeListener(callback, id) {
    id = id || null;
    if(id === null)
      this.on(STATE_CHANGE_EVENT, callback);
    else
      this.on([STATE_CHANGE_EVENT, id], callback);
  }

  /**
   * Adds a listener on select event changes.
   * @param {requestCallback} callback - The function callback.
   * @param {*} id - The item ID.
   */
  addSelectListener(callback, id) {
    if(id)
      this.on([SELECT_EVENT, id], callback);
    else
      this.on(SELECT_EVENT, callback);
  }
  remSelectListener(callback, id) {
    if(id)
      this.removeListener([SELECT_EVENT, id], callback);
    else
      this.removeListener(SELECT_EVENT, callback);
  }

  /****************************************************************
   * DISPATCHER
   ****************************************************************/

  /**
   * Dispatches changes to the app based on action information.
   * @param {Object} action - The action object.
   * @returns {boolean} success
   */
  dispatch(action) {
    let ids = [];

    switch(action.actionType) {
      case ItemConstants.ITEM_CREATE:
        create(action.data, false);
        this.emitChange();
        break;

      case ItemConstants.ITEM_DESTROY:
        destroy(action.id);
        this.emitChange();
        break;

      case ItemConstants.ITEM_SELECT:
        var oldSelect = select(action.id);
        if(oldSelect !== null && oldSelect !== action.id) {
          ids.push(oldSelect);
        }
        ids.push(action.id);
        ids.forEach((id) => this.emitSelect(id));
        break;

      case ItemConstants.ITEM_DESELECT:
        let oldSelectedItem = deselect();
        ids.push(oldSelectedItem);
        ids.forEach((id) => this.emitSelect(id));
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
        this.emitCategoryChange();
        break;

      case ItemConstants.REM_CATEGORY:
        ids = remCategory(action.category);
        this.emitCategoryChange();
        break;

      case ItemConstants.RESET_CATEGORIES:
        ids = resetCategories();
        this.emitCategoryChange();
        break;

      case GMapsConstants.MAP_ZOOM:
        AppDispatcher.waitFor([
          GMapsStore.dispatcherIndex,
        ]);
        ids = mapUpdateZoom();
        break;
    }

    ids.forEach((id) => this.emitStateChange(id));
    if(ids.length > 0) this.emitStateChange();

    return true;
  }
}

var ItemStore = new ItemStoreProto();
// We may need to create hundreds to thousands of events, so make this limit unbounded.
ItemStore.setMaxListeners(0);


export default ItemStore;
