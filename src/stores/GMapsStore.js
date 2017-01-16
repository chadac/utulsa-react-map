/**
 * @module GMapsStore
 */
import AppDispatcher from '../dispatcher/AppDispatcher';
import {EventEmitter} from 'events';
import GMapsConstants from '../constants/GMapsConstants';

import gmaps from '../GMapsAPI';

const CENTER_EVENT = 'center';
const ZOOM_EVENT = 'zoom';
const USER_POSITION_EVENT = 'user';
const MAP_SET_EVENT = 'map';

/****************************************************************
 * INTERNAL STATE VARIABLES
 ****************************************************************/
// The gmaps.Map object
var _map = null;
// The current center of the map
var _center = {lat: 36.15159935580428, lng: -95.94644401639404};
// The old zoom (used for tracking current zoom objects in the Item Store)
var _oldZoom = null;
// The current zoom
var _zoom = 16;
// The user's position
var _userPosition = null;


/****************************************************************
 * PRIVATE FUNCTIONS
 ****************************************************************/

/**
 * Updates the internal center state.
 */
function _updateCenter() {
  let ncenter = _map.getCenter();
  _center = {lat: ncenter.lat, lng: ncenter.lng};
}

/**
 * Updates the internal zoom state.
 */
function _updateZoom() {
  _oldZoom = _zoom;
  _zoom = _map.getZoom();
}

/**
 * Callback for when the map changes center, so that it may be tracked
 * through our flux store.
 * @param {number} lat - The latitude.
 * @param {number} lng - The longitude.
 */
function _onMapCenter(lat, lng) {
  if( AppDispatcher._isDispatching ) return;
  AppDispatcher.dispatch({
    actionType: GMapsConstants.MAP_CENTER,
    update: true,
    lat: lat,
    lng: lng,
  });
}

/**
 * Callback for when the map changes zoom, so that it can be tracked in
 * our store.
 * @param {int} newZoom - The new zoom level of the map.
 */
function _onMapZoom(newZoom) {
  if( AppDispatcher._isDispatching ) return;
  AppDispatcher.dispatch({
    actionType: GMapsConstants.MAP_ZOOM,
    update: true,
    zoom: newZoom,
  });
}

/**
 * Creates a new gmaps.Map object, inside the given div.
 * @param {DOMObject} div - The div object to populate the map inside.
 */
function createMap(div) {
  let mapOptions = {
    center: _center,
    zoom: _zoom,
    mapTypeControl: true,
    mapTypeControlOptions: {
      position: gmaps.ControlPosition.LEFT_BOTTOM,
    },
    styles: [{
      featureType: 'poi',
      stylers: [{visibility: "off"}],
    }],
  }

  _map = new gmaps.Map(div, mapOptions);

  // Internal state listeners
  _map.addListener("center_changed", _onMapCenter);
  _map.addListener("zoom_changed", _onMapZoom);
}

/**
 * Sets the user position to the given coordinates.
 * @param {number} lat - The latitude.
 * @param {number} lng - The longitude.
 */
function setUserPosition(lat, lng) {
  _userPosition = {lat: lat, lng: lng};
}

/**
 * Sets internal `_map` to center on the new coordinates.
 * @param {number} lat - The latitude.
 * @param {number} lng - The longitude.
 */
function center(lat, lng) {
  _map.setCenter(new gmaps.LatLng(lat, lng));
}

/**
 * Sets internal `_map` to zoom at new level.
 * @param {int} newZoom - The new zoom level.
 */
function zoom(newZoom) {
  _map.setZoom(newZoom);
}

/****************************************************************
 * GOOGLE MAPS STORE
 ****************************************************************/

/**
 * The main store to interface with the rest of the app.
 * @class
 */
class GMapsStoreProto extends EventEmitter {
  constructor() {
    super();

    // Register our dispatch method with the AppDispatcher.
    // Need the dispatcherIndex for synchronizing on certain actions.
    this.dispatcherIndex = AppDispatcher.register(this.dispatch.bind(this));
  }

  /****************************************************************
   * GETTERS
   ****************************************************************/

  /**
   * @returns {int} zoom - The current zoom level.
   */
  getZoom() {
    return _zoom;
  }

  /**
   * @returns {int} oldZoom - The old zoom level.
   */
  getOldZoom() {
    return _oldZoom;
  }

  /**
   * @returns {Object} center - The coordinates of the current center.
   */
  getCenter() {
    return _center;
  }

  /**
   * @returns {Object} userPosition - The coordinates of the user.
   */
  getUserPosition() {
    return _userPosition;
  }

  /**
   * @returns {gmaps.Map} map - The internal Google Maps object.
   */
  getMap() {
    return _map;
  }

  /****************************************************************
   * EMITTERS
   ****************************************************************/
  /** NOTE: Do not invoke emit methods outside of the store **/

  /**
   * Emits a zoom event.
   */
  emitZoom() {
    this.emit(ZOOM_EVENT, _zoom);
  }

  /**
   * Emits a center event.
   */
  emitCenter() {
    this.emit(CENTER_EVENT, center.lat, center.lng);
  }

  /**
   * Emits a user position set/change event.
   * @param {number} lat - The user latitude.
   * @param {number} lng - The user longitude.
   */
  emitUserPosition(lat, lng) {
    this.emit(USER_POSITION_EVENT, lat, lng);
  }

  /**
   * Emits a map created event.
   */
  emitMapCreated() {
    this.emit(MAP_SET_EVENT, _map);
  }

  /****************************************************************
   * LISTENERS
   ****************************************************************/

  /**
   * Listens to changes in zoom.
   * @param {requestCallback} callback - The function callback.
   */
  addZoomListener(callback) {
    this.on(ZOOM_EVENT, callback);
  }

  /**
   * Listens on changes in the map center.
   * @param {requestCallback} callback - The function callback.
   */
  addCenterListener(callback) {
    this.on(CENTER_EVENT, callback);
  }

  /**
   * Listens on changes in user position
   * @param {requestCallback} callback - The function callback.
   */
  addUserPositionListener(callback) {
    this.on(USER_POSITION_EVENT, callback);
  }

  /**
   * Listens on creation of the map.
   * @param {requestCallback} callback - The function callback.
   */
  addMapListener(callback) {
    this.on(MAP_SET_EVENT, callback);
  }

  /****************************************************************
   * DISPATCHER
   ****************************************************************/

  /**
   * Updates the store based on actions received from the AppDispatcher.
   * @param {Object} action - The action object.
   * @returns {boolean} success
   */
  dispatch(action) {
    switch(action.actionType) {
      case GMapsConstants.CREATE_MAP:
        createMap(action.div);
        this.emitMapCreated();
        break;

      case GMapsConstants.MAP_CENTER:
        if(!action.update)
          center(action.lat, action.lng);
        _updateCenter();
        this.emitCenter();
        break;

      case GMapsConstants.MAP_ZOOM:
        if(!action.update)
          zoom(action.zoom);
        _updateZoom();
        this.emitZoom();
        break;

      case GMapsConstants.SET_USER_POSITION:
        setUserPosition(action.lat, action.lng);
        this.emitUserPosition(action.lat, action.lng);
        break;
    }

    return true;
  }
}

var GMapsStore = new GMapsStoreProto();


export default GMapsStore;
