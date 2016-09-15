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
  }

};

module.exports = ItemActions;
