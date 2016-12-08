import AppDispatcher from '../dispatcher/AppDispatcher';
const EventEmitter = require('events').EventEmitter;
const GMapsConstants = require('../constants/GMapsConstants');
const assign = require('object-assign');

import gmaps from '../GMapsAPI';

const CENTER_EVENT = 'center';
const ZOOM_EVENT = 'zoom';
const USER_POSITION_EVENT = 'user';
const MAP_SET_EVENT = 'map';

var _map = null;
var _center = {lat: 36.15159935580428, lng: -95.94644401639404};
var _oldZoom = null;
var _zoom = 16;
var _userPosition = null;

function _updateCenter() {
  let ncenter = _map.getCenter();
  _center = {lat: ncenter.lat, lng: ncenter.lng};
}

function _updateZoom() {
  _oldZoom = _zoom;
  _zoom = _map.getZoom();
}

function _onMapCenter(lat, lng) {
  AppDispatcher.dispatch({
    actionType: GMapsConstants.MAP_CENTER,
    update: true,
    lat: lat,
    lng: lng,
  });
}

function _onMapZoom(newZoom) {
  AppDispatcher.dispatch({
    actionType: GMapsConstants.MAP_ZOOM,
    update: true,
    zoom: newZoom,
  });
}

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

  // Listeners
  _map.addListener("center_changed", _onMapCenter);
  _map.addListener("zoom_changed", _onMapZoom);
}

function setUserPosition(lat, lng) {
  _userPosition = {lat: lat, lng: lng};
}

function center(lat, lng) {
  _map.setCenter(new gmaps.LatLng(lat, lng));
}

function zoom(newZoom) {
  _map.setZoom(newZoom);
}

const GMapsStore = assign({}, EventEmitter.prototype, {

  getZoom() {
    return _zoom;
  },

  getOldZoom() {
    return _oldZoom;
  },

  getCenter() {
    return _center;
  },

  getUserPosition() {
    return _userPosition;
  },

  getMap() {
    return _map;
  },

  emitZoom() {
    this.emit(ZOOM_EVENT, _zoom);
  },

  emitCenter() {
    this.emit(CENTER_EVENT, center.lat, center.lng);
  },

  emitUserPosition(lat, lng) {
    this.emit(USER_POSITION_EVENT, lat, lng);
  },

  emitMapCreated() {
    this.emit(MAP_SET_EVENT, _map);
  },

  addZoomListener(callback) {
    this.on(ZOOM_EVENT, callback);
  },

  addCenterListener(callback) {
    this.on(CENTER_EVENT, callback);
  },

  addUserPositionListener(callback) {
    this.on(USER_POSITION_EVENT, callback);
  },

  addMapListener(callback) {
    this.on(MAP_SET_EVENT, callback);
  },

  dispatcherIndex: AppDispatcher.register((action) => {
    switch(action.actionType) {
      case GMapsConstants.MAP_CENTER:
        if(!action.update)
          center(action.lat, action.lng);
        _updateCenter();
        GMapsStore.emitCenter();
        break;

      case GMapsConstants.MAP_ZOOM:
        if(!action.update)
          zoom(action.zoom);
        _updateZoom();
        GMapsStore.emitZoom();
        break;

      case GMapsConstants.SET_USER_POSITION:
        setUserPosition(action.lat, action.lng);
        GMapsStore.emitUserPosition(action.lat, action.lng);
        break;

      case GMapsConstants.CREATE_MAP:
        createMap(action.div);
        GMapsStore.emitMapCreated();
        break;
    }

    return true;
  }),

});

module.exports = GMapsStore;
