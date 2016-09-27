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

};

module.exports = GMapsActions;
