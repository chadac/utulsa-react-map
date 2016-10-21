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

  focus: function(id) {
    AppDispatcher.handleViewAction({
      actionType: ItemConstants.ITEM_FOCUS,
      id: id,
    });
  },

  unfocus: function() {
    AppDispatcher.handleViewAction({
      actionType: ItemConstants.ITEM_UNFOCUS,
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

  search: function(word) {
    if(word.length <= 0) {
      ItemActions.resetSearch();
    }
    else {
      AppDispatcher.handleViewAction({
        actionType: ItemConstants.ITEM_SEARCH,
        word: word
      });
    }
  },

  resetSearch: function() {
    AppDispatcher.handleViewAction({
      actionType: ItemConstants.ITEM_RESET_SEARCH,
    });
  },

  addCategory: function(category) {
    AppDispatcher.handleViewAction({
      actionType: ItemConstants.ADD_CATEGORY,
      category: category
    });
  },

  remCategory: function(category) {
    AppDispatcher.handleViewAction({
      actionType: ItemConstants.REM_CATEGORY,
      category: category
    });
  },

  resetCategories: function() {
    AppDispatcher.handleViewAction({
      actionType: ItemConstants.RESET_CATEGORIES,
    });
  }
};

module.exports = ItemActions;
