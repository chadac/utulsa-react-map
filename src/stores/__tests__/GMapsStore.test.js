import ItemConstants from '../../constants/ItemConstants';
import GMapsConstants from '../../constants/GMapsConstants';
import AppConstants from '../../constants/AppConstants';
import AppState from '../../constants/AppState';
jest.mock('../../GMapsAPI')
jest.mock('../../dispatcher/AppDispatcher');

describe('GMapsStore', () => {
  var GMapsStore;
  var gmaps;
  var div;
  var map;

  const dispatch = (actionType, args) => {
    let action = Object.assign({actionType: actionType}, args);
    GMapsStore.dispatch(action);
  }

  const center = (lat, lng) => dispatch(GMapsConstants.MAP_CENTER, {lat: lat, lng: lng, update: false});
  const zoom = (z) => dispatch(GMapsConstants.MAP_ZOOM, {zoom: z, update: false});
  const setUserPosition = (lat, lng) => dispatch(GMapsConstants.SET_USER_POSITION, {lat: lat, lng: lng});
  const createMap = (div) => dispatch(GMapsConstants.CREATE_MAP, {div: div});

  beforeEach(function() {
    GMapsStore = require('../GMapsStore').default;
    gmaps = require('../../GMapsAPI').default;
    let div = jest.fn();
    createMap(div);
  });

  describe("#dispatch", () => {
    it("creates the map", () => {
      let map = GMapsStore.getMap();
      expect(map).not.toBeNull();
      expect(map.__mockListeners.center_changed.length).toBe(1);
      expect(map.__mockListeners.zoom_changed.length).toBe(1);
    });

    it("centers on the map", () => {
      center(1.7, 2.8);

      expect(GMapsStore.getCenter()).toEqual({lat: 1.7, lng: 2.8});
    });

    it("zooms on the map", () => {
      zoom(20);

      expect(GMapsStore.getZoom()).toBe(20);
    });

    it("sets user position", () => {
      setUserPosition(5,10);

      expect(GMapsStore.getUserPosition()).toEqual({lat: 5, lng: 10});
    });
  });

  describe("#emitZoom", () => {
    it("emits on zoom", () => {
      var mockListener = jest.fn();
      GMapsStore.addZoomListener(mockListener);

      zoom(10);
      expect(mockListener.mock.calls.length).toBe(1);
    });
  });

  describe("#emitCenter", () => {
    it("emits on center", () => {
      var mockListener = jest.fn();
      GMapsStore.addCenterListener(mockListener);

      center(10, 10);
      expect(mockListener.mock.calls.length).toBe(1);
    });
  });

  describe("#emitUserPosition", () => {
    it("emits on user position set", () => {
      var mockListener = jest.fn();
      GMapsStore.addUserPositionListener(mockListener);

      setUserPosition(10, 10);
      expect(mockListener.mock.calls.length).toBe(1);
    });
  });

  describe("#emitMapCreated", () => {
    it("emits on map created", () => {
      var mockListener = jest.fn();
      GMapsStore.addMapListener(mockListener);

      createMap(jest.fn());
      expect(mockListener.mock.calls.length).toBe(1);
    });
  });
});
