const AppDispatcher = require('../dispatcher/AppDispatcher');
const GMapsConstants = require('../constants/GMapsConstants');

const GMapsActions = {

  zoom: (zoomLevel) => {
    AppDispatcher.handleViewAction({
      actionType: GMapsConstants.MAP_ZOOM,
      zoom: zoomLevel,
    });
  },

  center: (lat, lng) => {
    AppDispatcher.handleViewAction({
      actionType: GMapsConstants.MAP_CENTER,
      lat: lat,
      lng: lng
    });
  },

  setZoom: (zoomLevel) => {
    AppDispatcher.handleViewAction({
      actionType: GMapsConstants.MAP_SET_ZOOM,
      zoom: zoomLevel,
    });
  },

  setCenter: (lat, lng) => {
    AppDispatcher.handleViewAction({
      actionType: GMapsConstants.MAP_SET_CENTER,
      lat: lat,
      lng: lng
    });
  },

  setUserPosition: (lat, lng) => {
    AppDispatcher.handleViewAction({
      actionType: GMapsConstants.SET_USER_POSITION,
      lat: lat,
      lng: lng,
    });
    GMapsActions.setCenter(lat, lng);
    GMapsActions.setZoom(19);
  },
};

module.exports = GMapsActions;
