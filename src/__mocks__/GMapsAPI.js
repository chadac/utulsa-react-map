var gmaps = jest.fn();

class MockListener {
  constructor() {
    this.__mockListeners = {};
    this.__map = null;
  }

  addListener(event, callback) {
    if(this.__mockListeners[event] == undefined) {
      this.__mockListeners[event] = [];
    }
    this.__mockListeners[event].push(callback);
  }

  setMap(map) {
    this.__map = map;
  }
}

class Map extends MockListener {
  constructor() {
    super();
  }
}
gmaps.Map = Map;

class Marker extends MockListener {
  constructor() {
    super();
  }
}
gmaps.Marker = Marker;

class InfoWindow extends MockListener {
  constructor() {
    super();

    this.__isOpen = false;
    this.__open = {map: null, marker: null};
  }

  getMap() {
    return this.__open.map;
  }

  open(map, marker) {
    this.__isOpen = true;
    this.__open = {map: map, marker: marker};
  }

  close() {
    this.__isOpen = false;
    this.__open = {map: null, marker: null};
  }
}
gmaps.InfoWindow = InfoWindow;

class Route extends MockListener {
}
gmaps.Route = Route;

class LatLng extends MockListener {
}
gmaps.LatLng = LatLng;

class Polyline extends MockListener{
}
gmaps.Polyline = Polyline;

class OverlayView extends MockListener {
}
gmaps.OverlayView = OverlayView;

module.exports = gmaps;
