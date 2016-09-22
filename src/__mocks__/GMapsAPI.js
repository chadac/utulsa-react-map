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

class Marker extends MockListener {
  constructor() {
    super();
  }
}

class InfoWindow extends MockListener {
  constructor() {
    super();

    this.__isOpen = false;
    this.__open = {map: null, marker: null};
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

class Route extends MockListener {
  constructor() {
    super();
  }
}

gmaps.Map = Map;

module.exports = gmaps;
