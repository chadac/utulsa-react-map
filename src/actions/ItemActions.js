/**
 * From https://facebook.github.io/flux/docs/todo-list.html
 * @module ItemActions
 **/
import AppDispatcher from '../dispatcher/AppDispatcher';
import ItemStore from '../stores/ItemStore';
import ItemConstants from '../constants/ItemConstants';
import GMapsActions from './GMapsActions';

/**
 * Array of all actions that can be performed. Actions interface with the store,
 * allowing changes to the state of the web app.
 */
const ItemActions = {
  /**
   * Creates an item.
   * @param {Object} data Information data about the object.
   */
  create: function(data) {
    AppDispatcher.dispatch({
      actionType: ItemConstants.ITEM_CREATE,
      data: data
    });
  },

  /**
   * Destroys an item.
   * @param {*} id The item ID.
   */
  destroy: function(id) {
    AppDispatcher.dispatch({
      actionType: ItemConstants.ITEM_DESTROY,
      id: id
    });
  },

  /**
   * Selects the item.
   * @param {*} id The item ID.
   */
  select: function(id) {
    AppDispatcher.dispatch({
      actionType: ItemConstants.ITEM_SELECT,
      id: id,
    });
  },

  /**
   * Deselects the item.
   * @param {*} id The item ID.
   */
  deselect: function() {
    AppDispatcher.dispatch({
      actionType: ItemConstants.ITEM_DESELECT
    });
  },

  /**
   * Focuses on the item. This means selecting the item and centering the map
   * on it.
   * @param {*} id The item ID.
   */
  focus: function(id) {
    const item = ItemStore.getItem(id);
    GMapsActions.center(item.focus.center.lat, item.focus.center.lng);
    GMapsActions.zoom(item.focus.zoom);
    ItemActions.select(id);
  },

  /**
   * Search items to match a word -- marks them as active if so.
   * @param {string} word The word to match against.
   */
  search: function(word) {
    // If the word is empty, reset search: Otherwise, dispatch a search action.
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

  /**
   * If there is one search result, select that result.
   * @returns {boolean} result True if an item was selected
   */
  selectSearched() {
    let searched = ItemStore.getSearched();
    if(searched.length === 1) {
      ItemActions.focus(searched[0]);
      return true;
    }
    return false;
  },

  /**
   * Resets the search, marking all items as not active in search.
   */
  resetSearch: function() {
    AppDispatcher.dispatch({
      actionType: ItemConstants.ITEM_RESET_SEARCH,
    });
  },

  /**
   * Marks category as active.
   * @param {string} category The category to mark as active.
   */
  addCategory: function(category) {
    AppDispatcher.dispatch({
      actionType: ItemConstants.ADD_CATEGORY,
      category: category
    });
  },

  /**
   * Marks category as inactive.
   * @param {string} category The category to mark as inactive.
   */
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


export default ItemActions;
