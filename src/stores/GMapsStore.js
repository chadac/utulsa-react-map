const AppDispatcher = require('../dispatcher/AppDispatcher');
const EventEmitter = require('events').EventEmitter;
const GMapsConstants = require('../constants/GMapsConstants');
const assign = require('object-assign');

const CENTER_EVENT = 'center';
const ZOOM_EVENT = 'zoom';

var _center = {lat: 36.15159935580428, lng: -95.94644401639404};

var _oldZoom = null;
var _zoom = 16;

function center(lat, lng) {
  _center = {lat: lat, lng: lng};
}

function zoom(zoom) {
  _oldZoom = _zoom;
  _zoom = zoom;
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

  emitZoom(zoomLevel) {
    this.emit(ZOOM_EVENT, zoomLevel);
  },

  emitCenter(lat, lng) {
    this.emit(CENTER_EVENT, lat, lng);
  },

  addZoomListener(callback) {
    this.on(ZOOM_EVENT, callback);
  },

  addCenterListener(callback) {
    this.on(CENTER_EVENT, callback);
  },

  dispatcherIndex: AppDispatcher.register((payload) => {
    var action = payload.action;
    var data;

    switch(action.actionType) {
      case GMapsConstants.MAP_ZOOM:
        zoom(action.zoom);
        break;

      case GMapsConstants.MAP_CENTER:
        center(action.lat, action.lng);
        break;

      case GMapsConstants.MAP_SET_ZOOM:
        GMapsStore.emitZoom(action.zoom);
        break;

      case GMapsConstants.MAP_SET_CENTER:
        GMapsStore.emitCenter(action.lat, action.lng);
        break;
    };

    return true;
  }),

});

module.exports = GMapsStore;
