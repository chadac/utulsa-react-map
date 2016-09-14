var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var RouteConstants = require('../constants/RouteConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _routes = {};

function parseKMLCoords(msg) {
  var msgSplit = msg.split(' ');
  return msgSplit.map((coordStr) => {
    var coords = coordStr.split(',')
    return { lng: coords[0], lat: coords[1] };
  });
}

function create(data) {
  var key = data.id
  _routes[key] = {
    key: data.id,
    id: data.id,
    name: data.name,
    coordinates: parseKMLCoords(data.coordinates),
    strokeColor: data.strokeColor,
    strokeOpacity: data.strokeOpacity,
    strokeWeight: data.strokeWeight,
  };
  _routes[key].$active = true;
}

function destroy(id) {
  delete _routes[key];
}

var RouteStore = assign({}, EventEmitter.prototype, {
  getAll: function() {
    return _routes;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  dispatcherIndex: AppDispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.actionType) {
      case RouteConstants.ROUTE_CREATE:
        create(action.data);
        RouteStore.emitChange();
        break;
      case RouteConstants.ROUTE_DESTROY:
        destroy(action.data);
        RouteStore.emitChange();
        break;
      default:
        return false;
    };

    return true;
  })
});

module.exports = RouteStore
