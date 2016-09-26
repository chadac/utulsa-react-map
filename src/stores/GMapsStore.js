const AppDispatcher = require('../dispatcher/AppDispatcher');
const EventEmitter = require('events').EventEmitter;
const GMapsConstants = require('../constants/GMapsConstants');
const assign = require('object-assign');

const CENTER_EVENT = 'change';
const ZOOM_EVENT = 'zoom';

var _center = {lat: null, lng: null};

var _oldZoom = null;
var _zoom = null;

function center(lat, lng) {
  _center = {lat: lat, lng: lng};
}

function zoom(zoom) {
  _oldZoom = _zoom;
  _zoom = zoom;
}

const GMapsStore = assign({}, EventEmitter.prototype, {

  getZoom: () => {
    return _zoom;
  },

  getOldZoom: () => {
    return _oldZoom;
  },

  getCenter: () => {
    return _center;
  },

  emitZoom: () => {
    this.emit(ZOOM_EVENT);
  },

  emitCenter: () => {
    this.emit(CENTER_EVENT);
  },

  addZoomListener: (callback) => {
    this.on(ZOOM_EVENT, callback);
  },

  addCenterListener: (callback) => {
    this.on(CENTER_EVENT, callback);
  },

  dispatcherIndex: AppDispatcher.register(function(payload) {
    var action = payload.action;
    var data;

    switch(action.actionType) {
      case GMapsConstants.MAP_ZOOM:
        zoom(action.zoom);
        break;

      case GMapsConstants.MAP_CENTER:
        center(action.lat, action.lng);
        break;
    };

    return true;
  }),

});
