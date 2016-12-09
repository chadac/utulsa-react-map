/**
 * From https://facebook.github.io/flux/docs/todo-list.html
 **/
import AppDispatcher from '../dispatcher/AppDispatcher';
import ItemStore from '../stores/ItemStore';
import ItemConstants from '../constants/ItemConstants';
import GMapsActions from './GMapsActions';

var ItemActions = {

  create: function(data) {
    AppDispatcher.dispatch({
      actionType: ItemConstants.ITEM_CREATE,
      data: data
    });
  },

  destroy: function(id) {
    AppDispatcher.dispatch({
      actionType: ItemConstants.ITEM_DESTROY,
      id: id
    });
  },

  select: function(id) {
    AppDispatcher.dispatch({
      actionType: ItemConstants.ITEM_SELECT,
      id: id,
    });
  },

  deselect: function() {
    AppDispatcher.dispatch({
      actionType: ItemConstants.ITEM_DESELECT
    });
  },

  focus: function(id) {
    const item = ItemStore.getItem(id);
    ItemActions.select(id);
    console.log(item.focus);
    GMapsActions.center(item.focus.center.lat, item.focus.center.lng);
    GMapsActions.zoom(item.focus.zoom);
  },

  unfocus: function() {
    AppDispatcher.dispatch({
      actionType: ItemConstants.ITEM_UNFOCUS,
    });
  },

  openInfoWindow: function(id) {
    AppDispatcher.dispatch({
      actionType: ItemConstants.ITEM_OPEN_INFOWINDOW,
      id: id,
    });
  },

  closeInfoWindow: function() {
    AppDispatcher.dispatch({
      actionType: ItemConstants.ITEM_CLOSE_INFOWINDOW,
    });
  },

  search: function(word) {
    if(word.length <= 0) {
      ItemActions.resetSearch();
    }
    else {
      AppDispatcher.dispatch({
        actionType: ItemConstants.ITEM_SEARCH,
        word: word
      });
    }
  },

  resetSearch: function() {
    AppDispatcher.dispatch({
      actionType: ItemConstants.ITEM_RESET_SEARCH,
    });
  },

  addCategory: function(category) {
    AppDispatcher.dispatch({
      actionType: ItemConstants.ADD_CATEGORY,
      category: category
    });
  },

  remCategory: function(category) {
    AppDispatcher.dispatch({
      actionType: ItemConstants.REM_CATEGORY,
      category: category
    });
  },

  resetCategories: function() {
    AppDispatcher.dispatch({
      actionType: ItemConstants.RESET_CATEGORIES,
    });
  }
};

module.exports = ItemActions;
