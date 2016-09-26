/**
 * From https://facebook.github.io/flux/docs/todo-list.html
 **/
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ItemConstants = require('../constants/ItemConstants');

var ItemActions = {

  create: function(data) {
    AppDispatcher.handleViewAction({
      actionType: ItemConstants.ITEM_CREATE,
      data: data
    });
  },

  destroy: function(id) {
    AppDispatcher.handleViewAction({
      actionType: ItemConstants.ITEM_DESTROY,
      id: id
    });
  },

  marksActive: function(ids) {
    AppDispatcher.handleViewAction({
      actionType: ItemConstants.ITEMS_MARK_ACTIVE,
      ids: ids
    });
  },

  select: function(id) {
    AppDispatcher.handleViewAction({
      actionType: ItemConstants.ITEM_SELECT,
      id: id
    });
  },

  deselect: function() {
    AppDispatcher.handleViewAction({
      actionType: ItemConstants.ITEM_DESELECT
    });
  },

  openInfoWindow: function(id) {
    AppDispatcher.handleViewAction({
      actionType: ItemConstants.ITEM_OPEN_INFOWINDOW,
      id: id,
    });
  },

  closeInfoWindow: function() {
    AppDispatcher.handleViewAction({
      actionType: ItemConstants.ITEM_CLOSE_INFOWINDOW,
    });
  },
};

module.exports = ItemActions;
