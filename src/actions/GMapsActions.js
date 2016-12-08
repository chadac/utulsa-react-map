const AppDispatcher = require('../dispatcher/AppDispatcher');
const GMapsConstants = require('../constants/GMapsConstants');

const GMapsActions = {

  zoom: (zoomLevel) => {
    AppDispatcher.dispatch({
      actionType: GMapsConstants.MAP_SET_ZOOM,
      update: false,
      zoom: zoomLevel,
    });
  },

  center: (lat, lng) => {
    AppDispatcher.dispatch({
      actionType: GMapsConstants.MAP_SET_CENTER,
      update: false,
      lat: lat,
      lng: lng
    });
  },

  setUserPosition: (lat, lng) => {
    AppDispatcher.dispatch({
      actionType: GMapsConstants.SET_USER_POSITION,
      lat: lat,
      lng: lng,
    });
    GMapsActions.center(lat, lng);
    GMapsActions.zoom(19);
  },

  createMap: (div) => {
    AppDispatcher.dispatch({
      actionType: GMapsConstants.CREATE_MAP,
      div: div,
    });
  },
};

module.exports = GMapsActions;
