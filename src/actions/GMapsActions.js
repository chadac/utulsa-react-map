/**
 * @module GMapsActions
 */
import AppDispatcher from '../dispatcher/AppDispatcher';
import GMapsConstants from '../constants/GMapsConstants';

/**
 * Array of all actions that can be performed on the GMapsStore.
 */
const GMapsActions = {
  /**
   * Zooms the map to a certain zoom level.
   * @param {int} zoomLevel The new zoom level.
   */
  zoom: (zoomLevel) => {
    AppDispatcher.dispatch({
      actionType: GMapsConstants.MAP_ZOOM,
      update: false,
      zoom: zoomLevel,
    });
  },

  /**
   * Centers the map on a given position.
   * @param {number} lat The new latitude.
   * @param {number} lng The new longitude.
   */
  center: (lat, lng) => {
    AppDispatcher.dispatch({
      actionType: GMapsConstants.MAP_CENTER,
      update: false,
      lat: lat,
      lng: lng
    });
  },

  /**
   * Creates a marker indicating the current user's position, and
   * centers the map on that location.
   * @param {number} lat The user's latitude.
   * @param {number} lng The user's longitude.
   */
  setUserPosition: (lat, lng) => {
    AppDispatcher.dispatch({
      actionType: GMapsConstants.SET_USER_POSITION,
      lat: lat,
      lng: lng,
    });

    // May want to remove this part, and add an action centerOnUser
    GMapsActions.center(lat, lng);
    GMapsActions.zoom(19);
  },

  /**
   * Creates the map object.
   * @param {DOMObject} div The element to create the Google Maps object inside.
   */
  createMap: (div) => {
    AppDispatcher.dispatch({
      actionType: GMapsConstants.CREATE_MAP,
      div: div,
    });
  },
};


export default GMapsActions;
