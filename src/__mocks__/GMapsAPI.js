var gmaps = jest.fn();

class MockListener {
  constructor() {
    this.__mockListeners = {};
  }

  addListener(event, callback) {
    if(this.__mockListeners[event] == undefined) {
      this.__mockListeners[event] = [];
    }
    this.__mockListeners[event].push(callback);
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
  constructor() {
    super();
  }
}
gmaps.Route = Route;

class LatLng {
  constructor() {
  }
}
gmaps.LatLng = LatLng;

class Polyline {
}
gmaps.Polyline = Polyline;

module.exports = gmaps;
